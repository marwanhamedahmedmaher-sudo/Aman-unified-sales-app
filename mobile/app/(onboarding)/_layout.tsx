import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{
            headerShown: true,
            headerTitleStyle: { fontFamily: 'System' },
            headerBackTitle: 'رجوع'
        }}>
            <Stack.Screen name="step1" options={{ title: 'بيانات التاجر (1/3)' }} />
            <Stack.Screen name="step2" options={{ title: 'اختيار المنتج (2/3)' }} />
            <Stack.Screen name="step3" options={{ title: 'مراجعة وإرسال (3/3)' }} />
        </Stack>
    );
}
