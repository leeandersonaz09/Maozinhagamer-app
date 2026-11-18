const path = require("path");

const resolveBabelPresetExpo = () => {
  try {
    return require.resolve("babel-preset-expo");
  } catch {
    const expoDir = path.dirname(require.resolve("expo/package.json"));
    return require.resolve("babel-preset-expo", { paths: [expoDir] });
  }
};

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [resolveBabelPresetExpo(), { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin",
    ],
  };
};
