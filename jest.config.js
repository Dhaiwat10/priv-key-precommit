/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testTimeout: 30000,
  testEnvironment: 'jest-environment-node',
  preset: 'ts-jest/presets/default-esm',
  transform: {},
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(.*)\\.js$': '$1',
  },
};
