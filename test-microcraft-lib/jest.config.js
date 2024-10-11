module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
      '^microcraft-lib/(.*)$': '<rootDir>/../microcraft-lib/src/$1', // Adjust the path as needed
    },
  };
  