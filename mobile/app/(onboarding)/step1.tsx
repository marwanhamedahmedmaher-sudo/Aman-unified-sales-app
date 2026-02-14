import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, KeyboardAvoidingView, Platform, I18nManager } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Store, MapPin, Phone, ArrowLeft, ArrowRight } from 'lucide-react-native';

export default function OnboardingStep1() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        businessName: '',
        personalName: '',
        nid: '',
        mobile: '',
        address: '',
        territory: 'Cairo - Nasr City', // Default for proto
    });

    const handleNext = () => {
        if (!formData.businessName || !formData.nid || !formData.mobile) {
            Alert.alert('خطأ', 'برجاء إدخال البيانات الأساسية');
            return;
        }
        router.push({
            pathname: '/(onboarding)/step2',
            params: { ...formData },
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 p-4">

                    <View className="mb-6">
                        <Text className="text-right text-gray-700 font-bold mb-2">اسم النشاط التجاري</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-4 h-12">
                            <Store size={20} color="#6B7280" className="mr-3" />
                            <TextInput
                                className="flex-1 text-right text-lg text-gray-900"
                                placeholder="مثال: بقالة الأمانة"
                                value={formData.businessName}
                                onChangeText={(t) => setFormData({ ...formData, businessName: t })}
                            />
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-right text-gray-700 font-bold mb-2">الاسم الشخصي (ثلاثي)</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-4 h-12">
                            <User size={20} color="#6B7280" className="mr-3" />
                            <TextInput
                                className="flex-1 text-right text-lg text-gray-900"
                                placeholder="كما في البطاقة"
                                value={formData.personalName}
                                onChangeText={(t) => setFormData({ ...formData, personalName: t })}
                            />
                        </View>
                    </View>

                    <View className="flex-row space-x-4 mb-6">
                        <View className="flex-1">
                            <Text className="text-right text-gray-700 font-bold mb-2">رقم الموبايل</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-4 h-12">
                                <Phone size={20} color="#6B7280" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-right text-lg text-gray-900"
                                    placeholder="01xxxxxxxxx"
                                    keyboardType="phone-pad"
                                    maxLength={11}
                                    value={formData.mobile}
                                    onChangeText={(t) => setFormData({ ...formData, mobile: t })}
                                />
                            </View>
                        </View>
                        <View className="flex-1 ml-2">
                            <Text className="text-right text-gray-700 font-bold mb-2">الرقم القومي</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-4 h-12">
                                <TextInput
                                    className="flex-1 text-right text-lg text-gray-900"
                                    placeholder="14 رقم"
                                    keyboardType="numeric"
                                    maxLength={14}
                                    value={formData.nid}
                                    onChangeText={(t) => setFormData({ ...formData, nid: t })}
                                />
                            </View>
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-right text-gray-700 font-bold mb-2">العنوان بالتفصيل</Text>
                        <View className="flex-row items-start border border-gray-300 rounded-xl bg-white px-4 py-3 h-24">
                            <MapPin size={20} color="#6B7280" className="mr-3 mt-1" />
                            <TextInput
                                className="flex-1 text-right text-lg text-gray-900"
                                placeholder="الشارع، المنطقة، علامة مميزة"
                                multiline
                                value={formData.address}
                                onChangeText={(t) => setFormData({ ...formData, address: t })}
                            />
                        </View>
                    </View>

                </ScrollView>

                <View className="p-4 bg-white border-t border-gray-100">
                    <TouchableOpacity
                        onPress={handleNext}
                        className="bg-blue-700 h-14 rounded-xl flex-row items-center justify-center shadow-lg"
                    >
                        <Text className="text-white text-lg font-bold mr-2">التالي: اختيار المنتج</Text>
                        {I18nManager.isRTL ? <ArrowLeft color="white" size={20} /> : <ArrowRight color="white" size={20} />}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
