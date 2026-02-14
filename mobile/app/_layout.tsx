import { Stack } from 'expo-router';
import { I18nManager, View } from 'react-native';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
    useEffect(() => {
        // Force RTL for Arabic
        if (!I18nManager.isRTL) {
            I18nManager.allowRTL(true);
            I18nManager.forceRTL(true);
        }
    }, []);

    return (
        <View className="flex-1" style={{ direction: 'rtl' }}>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="(app)" />
            </Stack>
        </View>
    );
}
