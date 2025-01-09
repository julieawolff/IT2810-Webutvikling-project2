import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/project2/',
  plugins: [react()],
  server: {
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['@testing-library/jest-dom'],
    include: ['src/{components,pages}/**/*.test.tsx'], // Locate test files in component folders
    coverage: {
      provider: 'istanbul',
      reporter: ['text'], // Could add 'html' to generate HTML coverage reports in the coverage folder
      reportsDirectory: 'coverage',
    },
  },
});
