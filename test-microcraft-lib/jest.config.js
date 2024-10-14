module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['./src/setupTests.js'],
  moduleNameMapper: {
    "^d3$": "d3", // Keep this mapping to use the installed module
    '\\.(css|less)$': 'identity-obj-proxy', // Correctly mock CSS/LESS files
    '^react-toastify$': '<rootDir>/../microcraft-lib/node_modules/react-toastify/dist/react-toastify.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-toastify|d3)/)', // Allow transformation of specific node_modules
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};