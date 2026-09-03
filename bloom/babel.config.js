module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Reanimated 4 runs its animation callbacks through worklets; this plugin must stay last.
    plugins: ['react-native-worklets/plugin'],
  };
};
