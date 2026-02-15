module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            ['module-resolver', {
                alias: {
                    '@': './app',
                    '@shared': './shared',
                },
            }],
            'nativewind/babel',
            'react-native-reanimated/plugin',
        ],
    };
};
