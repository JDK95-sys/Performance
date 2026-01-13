/**
 * SAP SuccessFactors API Integration
 * Syncs employee data, roles, and organizational structure
 */

import { db } from '../db';

export interface SFConfig {
  apiUrl: string;
  companyId: string;
  username: string;
  password: string;
  oauthUrl?: string;
  clientId?: string;
  clientSecret?: string;
}

export interface SFEmployee {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  division?: string;
  location?: string;
  managerId?: string;
  hireDate: string;
  employmentType?: string;
  jobLevel?: string;
  customRole?: string; // For marketplace role mapping
}

export interface SFPermissions {
  userId: string;
  canPostJobs: boolean;
  canApproveTransfers: boolean;
  canViewAllCandidates: boolean;
  isRecruiter: boolean;
  isManager: boolean;
}

export class SuccessFactorsIntegration {
  private config: SFConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: SFConfig) {
    this.config = config;
  }

  /**
   * Authenticate with SAP SuccessFactors using OAuth2
   */
  async authenticate(): Promise<void> {
    try {
      if (this.config.oauthUrl && this.config.clientId && this.config.clientSecret) {
        // OAuth2 authentication
        const response = await fetch(`${this.config.oauthUrl}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            company_id: this.config.companyId,
          }),
        });

        if (!response.ok) {
          throw new Error(`OAuth authentication failed: ${response.statusText}`);
        }

        const data = await response.json();
        this.accessToken = data.access_token;
        this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000);
      } else {
        // Basic authentication (fallback)
        const credentials = Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64');
        this.accessToken = `Basic ${credentials}`;
      }
    } catch (error) {
      console.error('SuccessFactors authentication error:', error);
      throw error;
    }
  }

  /**
   * Check if token is valid and refresh if needed
   */
  private async ensureAuthenticated(): Promise<void> {
    if (!this.accessToken || (this.tokenExpiry && this.tokenExpiry < new Date())) {
      await this.authenticate();
    }
  }

  /**
   * Fetch employee data from SuccessFactors using OData API
   */
  async fetchEmployees(): Promise<SFEmployee[]> {
    await this.ensureAuthenticated();

    try {
      const url = `${this.config.apiUrl}/odata/v2/User?$select=userId,email,firstName,lastName,jobTitle,department,division,location,manager,hireDate,empInfo/employmentType,empInfo/jobLevel&$expand=empInfo&$format=json`;

      const response = await fetch(url, {
        headers: {
          Authorization: this.accessToken!,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.statusText}`);
      }

      const data = await response.json();
      return data.d.results.map((user: any) => ({
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        jobTitle: user.jobTitle,
        department: user.department,
        division: user.division,
        location: user.location,
        managerId: user.manager,
        hireDate: user.hireDate,
        employmentType: user.empInfo?.employmentType,
        jobLevel: user.empInfo?.jobLevel,
      }));
    } catch (error) {
      console.error('Error fetching employees from SuccessFactors:', error);
      throw error;
    }
  }

  /**
   * Fetch role-based permissions from SuccessFactors
   */
  async fetchPermissions(userId: string): Promise<SFPermissions> {
    await this.ensureAuthenticated();

    try {
      // Fetch user's role assignments
      const url = `${this.config.apiUrl}/odata/v2/RoleEntity?$filter=userId eq '${userId}'&$format=json`;

      const response = await fetch(url, {
        headers: {
          Authorization: this.accessToken!,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch permissions: ${response.statusText}`);
      }

      const data = await response.json();
      const roles = data.d.results;

      // Map SuccessFactors roles to internal job marketplace roles
      const permissions: SFPermissions = {
        userId,
        canPostJobs: false,
        canApproveTransfers: false,
        canViewAllCandidates: false,
        isRecruiter: false,
        isManager: false,
      };

      roles.forEach((role: any) => {
        const roleName = role.roleName?.toLowerCase() || '';

        // Check for recruiter roles
        if (roleName.includes('recruiter') || roleName.includes('talent acquisition')) {
          permissions.isRecruiter = true;
          permissions.canPostJobs = true;
          permissions.canViewAllCandidates = true;
        }

        // Check for manager roles
        if (roleName.includes('manager') || roleName.includes('supervisor')) {
          permissions.isManager = true;
          permissions.canApproveTransfers = true;
        }

        // Check for HR admin roles
        if (roleName.includes('hr admin') || roleName.includes('talent management')) {
          permissions.canPostJobs = true;
          permissions.canApproveTransfers = true;
          permissions.canViewAllCandidates = true;
        }
      });

      return permissions;
    } catch (error) {
      console.error('Error fetching permissions from SuccessFactors:', error);
      throw error;
    }
  }

  /**
   * Sync employee data to local database
   */
  async syncEmployees(): Promise<{ synced: number; errors: number }> {
    try {
      const employees = await this.fetchEmployees();
      let synced = 0;
      let errors = 0;

      for (const employee of employees) {
        try {
          // Fetch permissions for this user
          const permissions = await this.fetchPermissions(employee.userId);

          // Determine role based on permissions
          let role: 'candidate' | 'manager' | 'recruiter' = 'candidate';
          if (permissions.isRecruiter) {
            role = 'recruiter';
          } else if (permissions.isManager) {
            role = 'manager';
          }

          // Calculate years of experience from hire date
          const hireDate = new Date(employee.hireDate);
          const yearsExperience = Math.floor(
            (Date.now() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
          );

          // Upsert user
          const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(employee.email) as { id: number } | undefined;

          if (existing) {
            // Update existing user
            db.prepare(`
              UPDATE users
              SET name = ?, role = ?, department = ?, job_title = ?,
                  years_experience = ?, sso_id = ?, updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `).run(
              `${employee.firstName} ${employee.lastName}`,
              role,
              employee.department,
              employee.jobTitle,
              yearsExperience,
              employee.userId,
              existing.id
            );

            // Update manager relationship if needed
            if (employee.managerId) {
              const manager = db.prepare('SELECT id FROM users WHERE sso_id = ?').get(employee.managerId) as { id: number } | undefined;
              if (manager) {
                db.prepare('UPDATE users SET manager_id = ? WHERE id = ?').run(manager.id, existing.id);
              }
            }
          } else {
            // Insert new user
            const result = db.prepare(`
              INSERT INTO users (email, name, role, department, job_title, years_experience, sso_id)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(
              employee.email,
              `${employee.firstName} ${employee.lastName}`,
              role,
              employee.department,
              employee.jobTitle,
              yearsExperience,
              employee.userId
            );

            // Set manager relationship in second pass
            // (need to ensure all users are created first)
          }

          synced++;
        } catch (error) {
          console.error(`Error syncing employee ${employee.userId}:`, error);
          errors++;
        }
      }

      // Second pass: update manager relationships
      for (const employee of employees) {
        if (employee.managerId) {
          try {
            const user = db.prepare('SELECT id FROM users WHERE sso_id = ?').get(employee.userId) as { id: number } | undefined;
            const manager = db.prepare('SELECT id FROM users WHERE sso_id = ?').get(employee.managerId) as { id: number } | undefined;

            if (user && manager) {
              db.prepare('UPDATE users SET manager_id = ? WHERE id = ?').run(manager.id, user.id);
            }
          } catch (error) {
            console.error(`Error updating manager for ${employee.userId}:`, error);
          }
        }
      }

      return { synced, errors };
    } catch (error) {
      console.error('Error syncing employees:', error);
      throw error;
    }
  }

  /**
   * Fetch single user by email (for SSO login)
   */
  async getUserByEmail(email: string): Promise<SFEmployee | null> {
    await this.ensureAuthenticated();

    try {
      const url = `${this.config.apiUrl}/odata/v2/User?$filter=email eq '${email}'&$select=userId,email,firstName,lastName,jobTitle,department,manager&$format=json`;

      const response = await fetch(url, {
        headers: {
          Authorization: this.accessToken!,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const users = data.d.results;

      if (users.length === 0) {
        return null;
      }

      const user = users[0];
      return {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        jobTitle: user.jobTitle,
        department: user.department,
        managerId: user.manager,
        hireDate: user.hireDate || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching user from SuccessFactors:', error);
      return null;
    }
  }
}

/**
 * Get SuccessFactors integration instance
 */
export function getSuccessFactorsIntegration(): SuccessFactorsIntegration | null {
  const config: SFConfig = {
    apiUrl: process.env.SF_API_URL || '',
    companyId: process.env.SF_COMPANY_ID || '',
    username: process.env.SF_USERNAME || '',
    password: process.env.SF_PASSWORD || '',
    oauthUrl: process.env.SF_OAUTH_URL,
    clientId: process.env.SF_CLIENT_ID,
    clientSecret: process.env.SF_CLIENT_SECRET,
  };

  if (!config.apiUrl || !config.companyId) {
    console.warn('SuccessFactors integration not configured');
    return null;
  }

  return new SuccessFactorsIntegration(config);
}

export default SuccessFactorsIntegration;
