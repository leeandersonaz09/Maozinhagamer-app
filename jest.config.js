module.exports = {
  preset: "jest-expo",
  moduleNameMapper: {
    "^expo-modules-core$":
      "<rootDir>/node_modules/expo/node_modules/expo-modules-core",
    "^expo-modules-core/(.*)$":
      "<rootDir>/node_modules/expo/node_modules/expo-modules-core/$1",
  },
};
