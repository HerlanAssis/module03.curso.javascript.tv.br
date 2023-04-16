// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/components/**/*.(js|ts|tsx|jsx)',
    '<rootDir>/pages/**/*.(js|ts|tsx|jsx)',
    '<rootDir>/hooks/**/*.(js|ts|tsx|jsx)',
  ],
  moduleNameMapper: {
    // see: https://github.com/kulshekhar/ts-jest/issues/414#issuecomment-517944368
    '^@/(.*)$': '<rootDir>/$1',
  },
};
