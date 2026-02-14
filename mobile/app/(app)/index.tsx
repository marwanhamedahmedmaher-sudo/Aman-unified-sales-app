import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import { Search, Plus, ListTodo, TrendingUp, Users, CheckCircle } from 'lucide-react-native';

export default function Dashboard() {
    const { user } = useAuthStore();
    const router = useRouter();

    const isLO = user?.role === 'LO';

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4 pt-6">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-2xl font-bold text-gray-900 text-right">مرحباً، {user?.name}</Text>
                        <Text className="text-gray-500 text-right">{user?.territory}</Text>
                    </View>
                    <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                        <Text className="text-blue-700 font-bold text-lg">{user?.name.charAt(0)}</Text>
                    </View>
                </View>

                {/* Metrics Grid */}
                <View className="flex-row flex-wrap justify-between gap-y-4 mb-8">
                    {/* Card 1 */}
                    <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <View className="flex-row justify-between items-start mb-2">
                            <View className={`p-2 rounded-lg ${isLO ? 'bg-green-100' : 'bg-blue-100'}`}>
                                {isLO ? <TrendingUp size={20} className="text-green-600" color="#166534" /> : <TrendingUp size={20} className="text-blue-600" color="#1E40AF" />}
                            </View>
                            <Text className="text-2xl font-bold text-gray-900">{isLO ? '12' : '23'}</Text>
                        </View>
                        <Text className="text-gray-500 text-right text-xs">
                            {isLO ? 'قروض تم صرفها' : 'فرص كروس سيل'}
                        </Text>
                        {isLO && <Text className="text-xs text-green-600 mt-1 text-right">الهدف: 15</Text>}
                    </View>

                    {/* Card 2 */}
                    <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="p-2 rounded-lg bg-purple-100">
                                <Users size={20} color="#7E22CE" />
                            </View>
                            <Text className="text-2xl font-bold text-gray-900">{isLO ? '45' : '18'}</Text>
                        </View>
                        <Text className="text-gray-500 text-right text-xs">
                            {isLO ? 'التجار التابعين لي' : 'عملاء (Leads) مقبولين'}
                        </Text>
                    </View>

                    {/* Card 3 */}
                    <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="p-2 rounded-lg bg-orange-100">
                                <CheckCircle size={20} color="#C2410C" />
                            </View>
                            <Text className="text-2xl font-bold text-gray-900">{isLO ? '78%' : '65%'}</Text>
                        </View>
                        <Text className="text-gray-500 text-right text-xs">
                            معدل الإنجاز
                        </Text>
                    </View>

                    {/* Card 4 */}
                    <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="p-2 rounded-lg bg-red-100">
                                <ListTodo size={20} color="#B91C1C" />
                            </View>
                            <Text className="text-2xl font-bold text-gray-900">5</Text>
                        </View>
                        <Text className="text-gray-500 text-right text-xs">
                            مهام مفتوحة
                        </Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <Text className="text-xl font-bold text-gray-900 text-right mb-4">إجراءات سريعة</Text>

                <TouchableOpacity
                    onPress={() => router.push('/(app)/search')}
                    className="flex-row items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
                >
                    <View className="bg-gray-100 p-2 rounded-lg ml-3">
                        <Search size={20} color="#374151" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-right font-bold text-gray-800">بحث شامل</Text>
                        <Text className="text-right text-gray-500 text-xs">ابحث بالاسم، الرقم القومي، أو الموبايل</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
                >
                    <View className="bg-blue-100 p-2 rounded-lg ml-3">
                        <Plus size={20} color="#1E40AF" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-right font-bold text-gray-800">إضافة عميل جديد</Text>
                        <Text className="text-right text-gray-500 text-xs">بدء عملية Onboarding جديدة</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/(app)/tasks')}
                    className="flex-row items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
                >
                    <View className="bg-purple-100 p-2 rounded-lg ml-3">
                        <ListTodo size={20} color="#7E22CE" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-right font-bold text-gray-800">مهامي</Text>
                        <Text className="text-right text-gray-500 text-xs">عرض ومتابعة المهام الموكلة إليك</Text>
                    </View>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
