import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, I18nManager } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CreditCard, Banknote, Smartphone, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react-native';

export default function OnboardingStep2() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [selectedProduct, setSelectedProduct] = useState<'MF' | 'BP' | 'ACC' | null>(null);

    const handleNext = () => {
        if (!selectedProduct) {
            Alert.alert('تنبيه', 'يجب اختيار منتج واحد على الأقل');
            return;
        }
        router.push({
            pathname: '/(onboarding)/step3',
            params: { ...params, product: selectedProduct },
        });
    };

    const RenderOption = ({ type, title, subtitle, icon }: { type: 'MF' | 'BP' | 'ACC', title: string, subtitle: string, icon: any }) => (
        <TouchableOpacity
            onPress={() => setSelectedProduct(type)}
            className={`p-4 rounded-xl border-2 mb-4 flex-row items-center ${selectedProduct === type ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
        >
            <View className={`p-3 rounded-full mr-4 ${selectedProduct === type ? 'bg-blue-200' : 'bg-gray-100'}`}>
                {icon}
            </View>
            <View className="flex-1">
                <Text className={`text-lg font-bold text-right ${selectedProduct === type ? 'text-blue-800' : 'text-gray-900'}`}>{title}</Text>
                <Text className="text-gray-500 text-right text-sm">{subtitle}</Text>
            </View>
            {selectedProduct === type && <CheckCircle color="#1E40AF" size={24} className="ml-2" />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-1 p-4">
                <Text className="text-xl font-bold text-gray-900 text-right mb-6">ما هو المنتج المطلوب تفعيله؟</Text>

                <RenderOption
                    type="MF"
                    title="تمويل متناهي الصغر"
                    subtitle="قروض تبدأ من 5,000 حتى 200,000 جم"
                    icon={<Banknote size={24} color={selectedProduct === 'MF' ? '#1E40AF' : '#6B7280'} />}
                />

                <RenderOption
                    type="BP"
                    title="مدفوعات أمان (Aman Pay)"
                    subtitle="ماكينة دفع الكتروني وخدمات التحصيل"
                    icon={<Smartphone size={24} color={selectedProduct === 'BP' ? '#1E40AF' : '#6B7280'} />}
                />

                <RenderOption
                    type="ACC"
                    title="بطاقة مشتريات (Aman Card)"
                    subtitle="تقسيم المشتريات على 6-24 شهر"
                    icon={<CreditCard size={24} color={selectedProduct === 'ACC' ? '#1E40AF' : '#6B7280'} />}
                />

            </View>

            <View className="p-4 bg-white border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleNext}
                    className={`h-14 rounded-xl flex-row items-center justify-center shadow-lg ${selectedProduct ? 'bg-blue-700' : 'bg-gray-300'}`}
                    disabled={!selectedProduct}
                >
                    <Text className="text-white text-lg font-bold mr-2">التالي: مراجعة البيانات</Text>
                    {I18nManager.isRTL ? <ArrowLeft color="white" size={20} /> : <ArrowRight color="white" size={20} />}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
