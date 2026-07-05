module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Reanimated 4 uses the react-native-worklets babel plugin.
    // It MUST be the last plugin in the list.
    plugins: ['react-native-worklets/plugin'],
  };
};
