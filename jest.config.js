/* global __dirname */
const path = require("path");

const expoDir = path.dirname(require.resolve("expo/package.json"));
const expoModulesCoreDir = path.dirname(
  require.resolve("expo-modules-core/package.json", {
    paths: [__dirname, expoDir],
  })
);
const relExpoModulesCoreDir = path
  .relative(__dirname, expoModulesCoreDir)
  .replace(/\\/g, "/");

module.exports = {
  preset: "jest-expo",
  moduleNameMapper: {
    "^expo-modules-core$": `<rootDir>/${relExpoModulesCoreDir}`,
    "^expo-modules-core/(.*)$": `<rootDir>/${relExpoModulesCoreDir}/$1`,
  },
};
