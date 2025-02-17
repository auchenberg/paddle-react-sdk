module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/src/**/__tests__/**/*.ts?(x)", "<rootDir>/src/**/?(*.)+(spec|test).ts?(x)"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: "tsconfig.json",
      useESM: true
    }]
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/", "/reference/"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
