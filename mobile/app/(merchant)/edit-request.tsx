import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView, KeyboardAvoidingView, Platform, I18nManager } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { merchants } from '@shared/mockData';
import type { EditableField } from '@shared/types';
import { ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react-native';

export default function SuggestEditScreen() {
    const { merchantId } = useLocalSearchParams();
    const router = useRouter();
    const merchant = merchants.find(m => m.id === merchantId);

    const [selectedField, setSelectedField] = useState<EditableField>('MOBILE');
    const [newValue, setNewValue] = useState('');
    const [reason, setReason] = useState('');
    const [errors, setErrors] = useState<{ newValue?: string; reason?: string }>({});

    if (!merchant) return null;

    const fields: { label: string; value: EditableField; current: string }[] = [
        { label: 'رقم الموبايل', value: 'MOBILE', current: merchant.mobile },
        { label: 'اسم العمل', value: 'BUSINESS_NAME', current: merchant.businessName },
        { label: 'العنوان', value: 'ADDRESS', current: merchant.address },
        { label: 'المنطقة', value: 'TERRITORY', current: merchant.territory },
    ];

    const currentFieldData = fields.find(f => f.value === selectedField);

    const validate = () => {
        const newErrors: { newValue?: string; reason?: string } = {};

        if (!newValue.trim()) {
            newErrors.newValue = 'القيمة الجديدة مطلوبة';
        } else if (newValue === currentFieldData?.current) {
            newErrors.newValue = 'يجب أن تكون القيمة مختلفة عن الحالية';
        }

        if (selectedField === 'MOBILE') {
            const mobileRegex = /^(010|011|012|015)\d{8}$/;
            if (!mobileRegex.test(newValue)) {
                newErrors.newValue = 'رقم الموبايل غير صحيح (يجب أن يبدأ بـ 010, 011, 012, 015 ويتكون من 11 رقم)';
            }
        }

        if (!reason.trim()) {
            newErrors.reason = 'سبب التعديل مطلوب';
        } else if (reason.length > 200) {
            newErrors.reason = 'السبب يجب أن لا يتجاوز 200 حرف';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        // Mock Submission
        Alert.alert(
            'تم إرسال الطلب',
            'تم إرسال اقتراح التعديل للمراجعة. سيتم إشعارك عند الموافقة أو الرفض.',
            [{ text: 'حسناً', onPress: () => router.back() }]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="bg-white p-4 shadow-sm border-b border-gray-100 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    {I18nManager.isRTL ? <ArrowRight size={24} color="#374151" /> : <ArrowLeft size={24} color="#374151" />}
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-900">اقترح تعديل</Text>
                <View className="w-10" />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 p-4">

                    {/* Merchant Info */}
                    <View className="bg-blue-50 p-4 rounded-lg mb-6 flex-row items-center">
                        <AlertCircle size={20} color="#1E40AF" />
                        <View className="ml-3 flex-1">
                            <Text className="text-blue-900 font-bold text-right">{merchant.businessName}</Text>
                            <Text className="text-blue-700 text-xs text-right">أنت تقترح تعديل لهذا التاجر</Text>
                        </View>
                    </View>

                    {/* Field Selection */}
                    <Text className="text-base font-bold text-gray-900 mb-2 text-right">ما الذي تريد تعديله؟</Text>
                    <View className="flex-row flex-wrap justify-end mb-6 gap-2">
                        {fields.map((field) => (
                            <TouchableOpacity
                                key={field.value}
                                onPress={() => {
                                    setSelectedField(field.value);
                                    setNewValue('');
                                    setErrors({});
                                }}
                                className={`px-4 py-2 rounded-full border ${selectedField === field.value ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                            >
                                <Text className={`${selectedField === field.value ? 'text-white' : 'text-gray-700'} font-medium`}>{field.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Current Value */}
                    <View className="mb-4 opacity-70">
                        <Text className="text-sm text-gray-500 mb-1 text-right">القيمة الحالية</Text>
                        <View className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                            <Text className="text-gray-700 text-right">{currentFieldData?.current}</Text>
                        </View>
                    </View>

                    {/* New Value */}
                    <View className="mb-4">
                        <Text className="text-sm font-bold text-gray-900 mb-1 text-right">القيمة الجديدة <Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className={`bg-white p-3 rounded-lg border ${errors.newValue ? 'border-red-500' : 'border-gray-300'} text-right`}
                            value={newValue}
                            onChangeText={setNewValue}
                            placeholder={`أدخل ${currentFieldData?.label} الجديد`}
                            keyboardType={selectedField === 'MOBILE' ? 'phone-pad' : 'default'}
                        />
                        {errors.newValue && <Text className="text-red-500 text-xs mt-1 text-right">{errors.newValue}</Text>}
                    </View>

                    {/* Reason */}
                    <View className="mb-8">
                        <Text className="text-sm font-bold text-gray-900 mb-1 text-right">سبب التعديل <Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className={`bg-white p-3 rounded-lg border ${errors.reason ? 'border-red-500' : 'border-gray-300'} text-right h-24`}
                            value={reason}
                            onChangeText={setReason}
                            placeholder="اشرح سبب التعديل (مثال: الرقم القديم مفصول، تغيير النشاط...)"
                            multiline
                            textAlignVertical="top"
                            maxLength={200}
                        />
                        <View className="flex-row justify-between mt-1">
                            {errors.reason ? <Text className="text-red-500 text-xs text-right flex-1">{errors.reason}</Text> : <View className="flex-1" />}
                            <Text className="text-gray-400 text-xs">{reason.length}/200</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-blue-700 py-4 rounded-xl shadow-sm flex-row justify-center items-center mb-10"
                    >
                        <Check size={20} color="white" />
                        <Text className="text-white font-bold text-lg ml-2">إرسال الطلب</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
