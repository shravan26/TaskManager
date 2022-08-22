/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.{js,ts}'],
    forceExit: true,
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 0,
            lines: 0,
            statements: 0,
        },
    },
    moduleNameMapper: {
        'src/(.*)': '<rootDir>/src/$1', // To allow jest to use absolute imports.
    },
    moduleDirectories: ['node_modules', 'src'], // Specify where the module directories lie.
};
