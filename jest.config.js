module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transformIgnorePatterns: ['/node_modules/(?!@replay/).+\\.js$'],
  testTimeout: 30000,
};
