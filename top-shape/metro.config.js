const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Adiciona a extensão 'bin' para que o TensorFlow possa carregar os pesos dos modelos
config.resolver.assetExts.push('bin');

module.exports = config;