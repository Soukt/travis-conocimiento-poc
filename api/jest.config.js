module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: { "^.+\\.ts$": ["ts-jest", { tsconfig: { isolatedModules: true, rootDir: "." } }] },
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
};
