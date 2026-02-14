import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, I18nManager } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { KeyRound, Phone, Smartphone, ArrowRight, ArrowLeft } from 'lucide-react-native';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!mobile || !password) {
            Alert.alert('خطأ', 'برجاء إدخال رقم الهاتف وكلمة المرور');
            return;
        }

        // Validate Egyptian mobile number (010/011/012/015)
        if (!/^01[0125][0-9]{8}$/.test(mobile)) {
            Alert.alert('خطأ', 'برجاء إدخال رقم هاتف صحيح (010, 011, 012, 015)');
            return;
        }

        setLoading(true);
        try {
            // Mock login - in real app, verify password
            const success = await login(mobile);
            if (success) {
                if (password === 'Aman1234') {
                    // Force password change scenario (mock)
                    Alert.alert('تغيير كلمة المرور', 'يجب تغيير كلمة المرور في أول تسجيل دخول', [
                        { text: 'موافق', onPress: () => router.replace('/(app)') }
                    ]);
                } else {
                    router.replace('/(app)');
                }
            } else {
                Alert.alert('فشل الدخول', 'رقم الهاتف أو كلمة المرور غير صحيحة');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center px-6"
            >
                <View className="items-center mb-10">
                    <View className="w-20 h-20 bg-blue-600 rounded-2xl items-center justify-center mb-4 shadow-lg">
                        <Smartphone color="white" size={40} />
                    </View>
                    <Text className="text-2xl font-bold text-gray-900 text-center">تطبيق المبيعات الموحد</Text>
                    <Text className="text-gray-500 mt-2 text-center">أمان القابضة - Aman Holdings</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-right text-gray-700 font-medium mb-2">رقم الهاتف</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-4 h-12 focus:border-blue-500">
                            <Phone color="#6B7280" size={20} className="mr-3" />
                            <TextInput
                                className="flex-1 text-right text-lg text-gray-900"
                                placeholder="01xxxxxxxxx"
                                keyboardType="phone-pad"
                                value={mobile}
                                onChangeText={setMobile}
                                placeholderTextColor="#9CA3AF"
                                maxLength={11}
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-right text-gray-700 font-medium mb-2">كلمة المرور</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-4 h-12 focus:border-blue-500">
                            <KeyRound color="#6B7280" size={20} className="mr-3" />
                            <TextInput
                                className="flex-1 text-right text-lg text-gray-900"
                                placeholder="••••••••"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className={`bg-blue-700 h-14 rounded-xl flex-row items-center justify-center mt-6 shadow-md ${loading ? 'opacity-70' : ''}`}
                    >
                        <Text className="text-white text-lg font-bold mr-2">تسجيل الدخول</Text>
                        {I18nManager.isRTL ? <ArrowLeft color="white" size={20} /> : <ArrowRight color="white" size={20} />}
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center mt-4">
                        <Text className="text-blue-600 font-medium">نسيت كلمة المرور؟</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
