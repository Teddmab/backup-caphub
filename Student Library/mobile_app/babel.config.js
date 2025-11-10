module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./lib'],
        alias: {
          '@': ['./lib'],
          '@/presentation': ['./lib/presentation'],
          '@/application': ['./lib/application'],
          '@/domain': ['./lib/domain'],
          '@/infrastructure': ['./lib/infrastructure'],
        },
      },
    ],
  ],
};
