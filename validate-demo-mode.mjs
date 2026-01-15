/**
 * Demo Mode Validation Script
 * Run with: node validate-demo-mode.mjs
 */

import { isDemoMode, getDemoUserByEmail, demoUsers } from './lib/demo-data.js';

console.log('🧪 Demo Mode Validation\n');

// Ensure no database env vars are set for this test
delete process.env.POSTGRES_URL;
delete process.env.DATABASE_PATH;

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Run tests
console.log('Testing Demo Mode Detection:');
test('isDemoMode returns true when no database configured', () => {
  assert(isDemoMode() === true, 'Expected demo mode to be active');
});

test('isDemoMode returns false when POSTGRES_URL is set', () => {
  process.env.POSTGRES_URL = 'postgresql://test';
  assert(isDemoMode() === false, 'Expected demo mode to be inactive');
  delete process.env.POSTGRES_URL;
});

console.log('\nTesting Demo Users:');
test('Has exactly 3 demo users', () => {
  assert(demoUsers.length === 3, `Expected 3 users, got ${demoUsers.length}`);
});

test('Can find employee user by email', () => {
  const user = getDemoUserByEmail('john.smith@company.com');
  assert(user !== undefined, 'User not found');
  assert(user.name === 'John Smith', `Expected John Smith, got ${user.name}`);
  assert(user.role === 'employee', `Expected employee role, got ${user.role}`);
});

test('Can find manager user by email', () => {
  const user = getDemoUserByEmail('manager@company.com');
  assert(user !== undefined, 'User not found');
  assert(user.role === 'manager', `Expected manager role, got ${user.role}`);
});

test('Can find HR admin user by email', () => {
  const user = getDemoUserByEmail('admin@company.com');
  assert(user !== undefined, 'User not found');
  assert(user.role === 'hr', `Expected hr role, got ${user.role}`);
});

test('Email lookup is case insensitive', () => {
  const user1 = getDemoUserByEmail('JOHN.SMITH@COMPANY.COM');
  const user2 = getDemoUserByEmail('john.smith@company.com');
  assert(user1 !== undefined, 'User not found with uppercase email');
  assert(user1.email === user2.email, 'Email case sensitivity issue');
});

test('Returns undefined for non-existent email', () => {
  const user = getDemoUserByEmail('nonexistent@company.com');
  assert(user === undefined, 'Expected undefined for non-existent user');
});

test('All demo users have required fields', () => {
  demoUsers.forEach((user, index) => {
    assert(user.id !== undefined, `User ${index} missing id`);
    assert(user.email !== undefined, `User ${index} missing email`);
    assert(user.name !== undefined, `User ${index} missing name`);
    assert(user.role !== undefined, `User ${index} missing role`);
    assert(['employee', 'manager', 'hr'].includes(user.role), 
           `User ${index} has invalid role: ${user.role}`);
  });
});

// Summary
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests Passed: ${passed}`);
console.log(`Tests Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);
console.log(`${'='.repeat(50)}`);

if (failed > 0) {
  console.log('\n❌ Some tests failed!');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
  process.exit(0);
}
