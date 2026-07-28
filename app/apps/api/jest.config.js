/** @type {import('jest').Config} */
module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts"],
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  testRegex: "(src|test)/.*\\.(spec|e2e-spec)\\.ts$",
  setupFiles: ["dotenv/config"],
  // npm workspaces hoists most deps to the monorepo root's node_modules, but
  // leaves a few (class-validator, class-transformer) nested under this
  // package's own node_modules. A plain `require()` from a file physically
  // located in the root's node_modules (e.g. @nestjs/common) never looks
  // here on its own; modulePaths adds it as an extra lookup location so
  // Jest's resolver finds it regardless of which package is requiring it.
  modulePaths: ["<rootDir>/node_modules"],
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "coverage",
  testTimeout: 15000,
};
