import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Loader2 } from 'lucide-react-native';

export default function OnboardingStep3() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        // Mock API call delay
        setTimeout(() => {
            setSubmitting(false);
            Alert.alert(
                'تم التقديم بنجاح',
                `رقم الطلب: ${params.product}-20260214-001\nتم إرسال العميل للمراجعة.`,
                [
                    { text: 'العودة للرئيسية', onPress: () => router.replace('/(app)') }
                ]
            );
        }, 1500);
    };

    const SummaryRow = ({ label, value }: { label: string, value: string }) => (
        <View className="flex-row justify-between py-3 border-b border-gray-100 last:border-0">
            <Text className="text-gray-900 font-medium text-right flex-1">{value}</Text>
            <Text className="text-gray-500 w-32 text-left">{label}</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 p-4">
                <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <View className="items-center mb-6">
                        <View className="bg-green-100 p-3 rounded-full mb-3">
                            <CheckCircle size={32} color="#166534" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900">مراجعة البيانات</Text>
                        <Text className="text-gray-500 text-center mt-1">يرجى التأكد من صحة البيانات قبل الإرسال</Text>
                    </View>

                    <SummaryRow label="اسم النشاط" value={params.businessName as string} />
                    <SummaryRow label="الاسم الشخصي" value={params.personalName as string} />
                    <SummaryRow label="رقم الموبايل" value={params.mobile as string} />
                    <SummaryRow label="الرقم القومي" value={params.nid as string} />
                    <SummaryRow label="العنوان" value={params.address as string} />
                    <SummaryRow label="المنتج المختار" value={params.product === 'MF' ? 'تمويل متناهي الصغر' : params.product === 'BP' ? 'مدفوعات أمان' : 'بطاقة مشتريات'} />
                </View>
            </ScrollView>

            <View className="p-4 bg-white border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={submitting}
                    className={`h-14 rounded-xl flex-row items-center justify-center shadow-lg ${submitting ? 'bg-green-600 opacity-80' : 'bg-green-700'}`}
                >
                    {submitting ? (
                        <View className="flex-row items-center">
                            <Text className="text-white text-lg font-bold mr-2">جاري الإرسال...</Text>
                        </View>
                    ) : (
                        <Text className="text-white text-lg font-bold">تأكيد وإرسال الطلب</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
