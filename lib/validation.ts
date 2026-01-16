/**
 * API Input Validation Utilities
 * Centralized validation functions for API routes
 */

import { User } from './types';
import { db } from './db';
import { sql } from '@vercel/postgres';

/**
 * Validates and parses an ID from query parameter
 * Returns null if invalid
 */
export function validateId(id: string | null | undefined, fieldName: string = 'ID'): number | null {
  if (!id) return null;

  const parsed = parseInt(id, 10);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error(`Invalid ${fieldName}: must be a positive integer`);
  }

  return parsed;
}

/**
 * Validates required fields are present in request body
 * Throws error if any required field is missing
 */
export function validateRequiredFields(
  body: Record<string, any>,
  requiredFields: string[]
): void {
  const missing = requiredFields.filter(field => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

/**
 * Validates that a user is a manager or HR
 * Throws error if not authorized
 */
export function requireManagerOrHR(user: User, action: string = 'perform this action'): void {
  if (!['manager', 'hr'].includes(user.role)) {
    throw new Error(`Only managers and HR can ${action}`);
  }
}

/**
 * Validates that a user is HR
 * Throws error if not authorized
 */
export function requireHR(user: User, action: string = 'perform this action'): void {
  if (user.role !== 'hr') {
    throw new Error(`Only HR can ${action}`);
  }
}

/**
 * Checks if a user is a manager of the specified employee
 * Returns true if manager or HR, false otherwise
 */
export async function isManagerOf(managerId: number, employeeId: number): Promise<boolean> {
  try {
    // Try Vercel Postgres first
    const result = await sql`
      SELECT manager_id, role FROM users WHERE id = ${employeeId}
    `;

    if (result.rows.length === 0) return false;

    const employee = result.rows[0];
    return employee.manager_id === managerId;
  } catch (error) {
    // Fallback to SQLite
    const stmt = db.prepare('SELECT manager_id FROM users WHERE id = ?');
    const employee = stmt.get(employeeId) as any;

    if (!employee) return false;

    return employee.manager_id === managerId;
  }
}

/**
 * Validates that a manager can act on behalf of an employee
 * Checks if user is the employee, their manager, or HR
 */
export async function validateManagerAccess(
  user: User,
  employeeId: number,
  action: string = 'perform this action'
): Promise<void> {
  // User can always act on themselves
  if (user.id === employeeId) return;

  // HR can act on anyone
  if (user.role === 'hr') return;

  // Managers can only act on their team
  if (user.role === 'manager') {
    const isManager = await isManagerOf(user.id, employeeId);
    if (isManager) return;
  }

  throw new Error(`You are not authorized to ${action} for this employee`);
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates date string is in ISO format (YYYY-MM-DD)
 */
export function validateDateString(dateStr: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;

  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Validates that a value is within allowed options
 */
export function validateEnum<T extends string>(
  value: T,
  allowedValues: readonly T[],
  fieldName: string = 'Value'
): void {
  if (!allowedValues.includes(value)) {
    throw new Error(
      `Invalid ${fieldName}: '${value}'. Must be one of: ${allowedValues.join(', ')}`
    );
  }
}

/**
 * Validates numeric range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Value'
): void {
  if (value < min || value > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
}

/**
 * Sanitizes and validates string input
 * Trims whitespace and validates length
 */
export function validateString(
  value: string,
  fieldName: string,
  minLength: number = 1,
  maxLength: number = 1000
): string {
  const trimmed = value.trim();

  if (trimmed.length < minLength) {
    throw new Error(`${fieldName} must be at least ${minLength} characters`);
  }

  if (trimmed.length > maxLength) {
    throw new Error(`${fieldName} must not exceed ${maxLength} characters`);
  }

  return trimmed;
}
