export default {
  moduleFileExtensions: [
    'ts',
    'js'
  ],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        useESM: true,
      },
    ]
  },
  testMatch: [
    '**/*.test.(ts)'
  ],
  testEnvironment: 'node'
};
