// Learn more https://docs.expo.io/guides/customizing-metro
const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

config.resolver.sourceExts.push('mjs');

module.exports = withNativeWind(config, { input: './global.css' });
