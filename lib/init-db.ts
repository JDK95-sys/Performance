import { initDatabase, seedDatabase } from './db';

/**
 * Initialize database on server startup
 * This runs only on the server side
 */
if (typeof window === 'undefined') {
  try {
    initDatabase();
    seedDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}
