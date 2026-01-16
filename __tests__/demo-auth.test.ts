/**
 * Demo Mode Authentication Tests
 * Verifies that demo mode authentication works without a database
 */

import { isDemoMode, getDemoUserByEmail, demoUsers } from '../lib/demo-data';

describe('Demo Mode', () => {
  beforeAll(() => {
    // Ensure no database environment variables are set for testing
    delete process.env.POSTGRES_URL;
    delete process.env.DATABASE_PATH;
  });

  test('isDemoMode should return true when no database is configured', () => {
    expect(isDemoMode()).toBe(true);
  });

  test('isDemoMode should return false when POSTGRES_URL is set', () => {
    process.env.POSTGRES_URL = 'postgresql://test';
    expect(isDemoMode()).toBe(false);
    delete process.env.POSTGRES_URL;
  });

  test('should have exactly 3 demo users', () => {
    expect(demoUsers).toHaveLength(3);
  });

  test('should find demo user by email (case insensitive)', () => {
    const user1 = getDemoUserByEmail('john.smith@company.com');
    expect(user1).toBeDefined();
    expect(user1?.name).toBe('John Smith');
    expect(user1?.role).toBe('employee');

    const user2 = getDemoUserByEmail('JOHN.SMITH@COMPANY.COM');
    expect(user2).toBeDefined();
    expect(user2?.email).toBe('john.smith@company.com');
  });

  test('should find all demo users by their email addresses', () => {
    const emails = [
      'john.smith@company.com',
      'manager@company.com',
      'admin@company.com'
    ];

    emails.forEach(email => {
      const user = getDemoUserByEmail(email);
      expect(user).toBeDefined();
      expect(user?.email).toBe(email);
    });
  });

  test('should return undefined for non-existent email', () => {
    const user = getDemoUserByEmail('nonexistent@company.com');
    expect(user).toBeUndefined();
  });

  test('demo users should have required fields', () => {
    demoUsers.forEach(user => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('department');
      expect(user).toHaveProperty('title');
      
      // Validate data types
      expect(typeof user.id).toBe('number');
      expect(typeof user.email).toBe('string');
      expect(typeof user.name).toBe('string');
      expect(['employee', 'manager', 'hr']).toContain(user.role);
    });
  });

  test('demo user roles should be valid', () => {
    const roles = demoUsers.map(u => u.role);
    expect(roles).toContain('employee');
    expect(roles).toContain('manager');
    expect(roles).toContain('hr');
  });
});
