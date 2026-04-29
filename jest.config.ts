import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const jestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/", "<rootDir>/e2e/"],
};

export default createJestConfig(jestConfig);
