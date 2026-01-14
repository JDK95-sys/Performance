import { initDatabase, seedDatabase } from './db';

/**
 * Initialize database on server startup
 * This runs only on the server side and NOT during build
 */
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  try {
    initDatabase();
    seedDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// For production, we'll initialize on first API request
export function ensureDbInitialized() {
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    try {
      initDatabase();
      // Don't seed in production - data should come from actual database
      console.log('Production database initialized');
    } catch (error) {
      console.error('Failed to initialize production database:', error);
    }
  }
}
