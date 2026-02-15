import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { merchants } from '@shared/mockData';
import { ScoreBadge } from '../../components/ScoreBadge';
import { ProductStatus } from '../../components/ProductStatus';
import { Phone, MapPin, ClipboardList, ArrowLeft, ArrowRight, Store, Plus, FileText, Edit } from 'lucide-react-native';
import { I18nManager } from 'react-native';

export default function MerchantProfile() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const merchant = merchants.find(m => m.id === id);
    const [expandLocations, setExpandLocations] = useState(false);

    if (!merchant) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <Text>التاجر غير موجود</Text>
            </SafeAreaView>
        );
    }

    const handleCall = () => {
        Linking.openURL(`tel:${merchant.mobile}`);
    };

    const handleOnboard = () => {
        Alert.alert('بدء التفعيل', 'سيتم تحويلك لصفحة التفعيل (قريباً)');
        // In real app: router.push('/(onboarding)/step1', { merchantId: merchant.id });
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                {/* Header */}
                <View className="bg-white p-6 shadow-sm border-b border-gray-100">
                    <View className="flex-row justify-between items-start mb-4">
                        <TouchableOpacity onPress={() => router.back()} className="p-2 -mr-2">
                            {I18nManager.isRTL ? <ArrowRight size={24} color="#374151" /> : <ArrowLeft size={24} color="#374151" />}
                        </TouchableOpacity>
                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={() => router.push({ pathname: '/(merchant)/edit-request', params: { merchantId: merchant.id } })}
                                className="bg-gray-100 p-2 rounded-full flex-row items-center"
                            >
                                <Edit size={16} color="#4B5563" />
                                <Text className="text-gray-700 text-xs font-bold ml-1">تعديل</Text>
                            </TouchableOpacity>
                            <ScoreBadge score={merchant.amanScore} size="lg" />
                        </View>
                    </View>

                    <View className="items-center mb-4">
                        <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-2">
                            <Store size={40} color="#1E40AF" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 text-center">{merchant.businessName}</Text>
                        <Text className="text-gray-500 text-center mt-1">{merchant.personalName}</Text>
                    </View>

                    <View className="flex-row justify-center space-x-4 mb-4">
                        <TouchableOpacity onPress={handleCall} className="flex-row items-center bg-green-50 px-4 py-2 rounded-full mx-2">
                            <Phone size={16} color="#166534" className="ml-2" />
                            <Text className="text-green-700 font-bold ml-1">{merchant.mobile}</Text>
                        </TouchableOpacity>
                        <View className="flex-row items-center bg-gray-50 px-4 py-2 rounded-full mx-2">
                            <Text className="text-gray-600 font-bold">{merchant.nid}</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-center">
                        <ProductStatus products={merchant.products} />
                    </View>
                </View>

                {/* Sections */}
                <View className="p-4 space-y-4">

                    {/* Products Section */}
                    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                        <Text className="text-lg font-bold text-gray-900 text-right mb-3">المنتجات</Text>
                        {merchant.products.map((prod, idx) => (
                            <View key={idx} className="flex-row justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                <View className="px-2 py-1 bg-gray-100 rounded">
                                    <Text className="text-xs font-bold text-gray-600">{prod.status}</Text>
                                </View>
                                <Text className="font-bold text-gray-800">{prod.type === 'MF' ? 'تمويل متناهي الصغر' : prod.type === 'BP' ? 'بايمنتس (BP)' : 'بطاقة مشتريات (ACC)'}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Locations Section */}
                    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                        <TouchableOpacity onPress={() => setExpandLocations(!expandLocations)} className="flex-row justify-between items-center mb-2">
                            {expandLocations ? <ArrowLeft size={20} color="#9CA3AF" rotation={90} /> : <ArrowLeft size={20} color="#9CA3AF" rotation={-90} />}
                            <View className="flex-row items-center">
                                <Text className="text-lg font-bold text-gray-900 text-right mr-2">العناوين</Text>
                                <MapPin size={20} color="#374151" />
                            </View>
                        </TouchableOpacity>

                        {expandLocations && (
                            <View className="mt-2 pl-4 border-l-2 border-gray-200">
                                <Text className="text-right text-gray-700 font-bold">الفرع الرئيسي</Text>
                                <Text className="text-right text-gray-500">{merchant.address}</Text>
                                <Text className="text-right text-gray-400 text-xs mt-1">{merchant.territory}</Text>
                            </View>
                        )}
                        {!expandLocations && (
                            <Text className="text-right text-gray-500 text-sm">{merchant.address}...</Text>
                        )}
                    </View>

                    {/* Notes Section */}
                    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                        <View className="flex-row justify-end items-center mb-3">
                            <Text className="text-lg font-bold text-gray-900 text-right mr-2">ملاحظات</Text>
                            <FileText size={20} color="#374151" />
                        </View>
                        {merchant.notes.length === 0 ? (
                            <Text className="text-center text-gray-400 py-4">لا توجد ملاحظات</Text>
                        ) : (
                            merchant.notes.map(note => (
                                <View key={note.id} className="bg-gray-50 p-3 rounded-lg mb-2">
                                    <Text className="text-right text-gray-800">{note.content}</Text>
                                    <Text className="text-left text-gray-400 text-xs mt-1">{new Date(note.timestamp).toLocaleDateString('ar-EG')}</Text>
                                </View>
                            ))
                        )}
                        <TouchableOpacity className="mt-2 flex-row justify-center items-center py-2 border-t border-gray-100">
                            <Plus size={16} color="#1E40AF" />
                            <Text className="text-blue-700 font-bold ml-1">إضافة ملاحظة</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>

            {/* Floating Action Bar */}
            <View className="p-4 bg-white border-t border-gray-100 flex-row justify-between">
                <TouchableOpacity
                    onPress={handleOnboard}
                    className="flex-1 bg-blue-700 py-3 rounded-xl items-center mr-2 shadow-sm"
                >
                    <Text className="text-white font-bold text-lg">تفعيل منتج جديد</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="w-14 bg-gray-100 rounded-xl items-center justify-center border border-gray-200"
                    onPress={() => router.push('/(app)/tasks')}
                >
                    <ClipboardList size={24} color="#374151" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
