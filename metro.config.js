const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude backend directory from Metro bundler
config.resolver.blockList = [
  /backend\/src\/.*/,
  /backend\/backend-src\/.*/,
  /backend\/.*\.js$/,
  /backend\/.*\.ts$/,
];

// Also exclude specific problematic files
config.resolver.extraNodeModules = {
  'fs': false,
  'path': false,
  'crypto': false,
  'multer': false,
};

module.exports = config;
