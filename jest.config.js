export default {
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    'fetch-html-standalone-test.js'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
}; 