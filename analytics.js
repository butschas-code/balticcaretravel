/**
 * Vercel Web Analytics initialization for vanilla JavaScript
 * This module imports and initializes Vercel Analytics using the @vercel/analytics package
 */

import { inject } from '@vercel/analytics';

// Initialize Vercel Analytics
inject({
  mode: 'auto', // Automatically detects development vs production
  debug: false,  // Set to true for debugging in development
});
