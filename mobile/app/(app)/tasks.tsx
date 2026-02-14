import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { tasks, merchants } from '@shared/mockData';
import { Task } from '@shared/types';
import { useAuthStore } from '../../store/authStore';
import { ScoreBadge } from '../../components/ScoreBadge';
import { CheckCircle, Clock, AlertTriangle, Briefcase, ChevronDown, Check } from 'lucide-react-native';

export default function TasksScreen() {
    const { user } = useAuthStore();
    const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'OPEN' | 'COMPLETED'>('OPEN');

    // Filter tasks for current user (or all for proto if user not found logic is simple)
    // In mock data, tasks have `assignedToId`. Let's assume we show all for now or filter by user.id if we had consistent IDs.
    // For prototype, let's just show all tasks to ensure data visibility.
    const filteredTasks = tasks.filter(t => {
        if (filter === 'ALL') return true;
        if (filter === 'HIGH') return t.priority === 'HIGH';
        if (filter === 'COMPLETED') return t.status === 'COMPLETED';
        if (filter === 'OPEN') return t.status === 'OPEN';
        return true;
    });

    const getMerchant = (id: string) => merchants.find(m => m.id === id);

    const handleComplete = (taskId: string) => {
        Alert.alert('إتمام المهمة', 'هل قمت بإنهاء هذه المهمة بالفعل؟', [
            { text: 'إلغاء', style: 'cancel' },
            { text: 'نعم، تم الإنجاز', onPress: () => Alert.alert('تم', 'تم تحديث حالة المهمة بنجاح') }
        ]);
    };

    const renderTask = ({ item }: { item: Task }) => {
        const merchant = getMerchant(item.merchantId);
        return (
            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
                <View className="flex-row justify-between items-start mb-2">
                    <View className={`px-2 py-1 rounded-full ${item.priority === 'HIGH' ? 'bg-red-100' : 'bg-blue-50'}`}>
                        <Text className={`text-xs font-bold ${item.priority === 'HIGH' ? 'text-red-700' : 'text-blue-700'}`}>
                            {item.priority === 'HIGH' ? 'عاجل' : item.priority === 'MEDIUM' ? 'متوسط' : 'عادي'}
                        </Text>
                    </View>
                    <Text className="text-gray-400 text-xs">
                        {new Date(item.dueDate).toLocaleDateString('ar-EG')}
                    </Text>
                </View>

                <Text className="text-lg font-bold text-gray-900 text-right mb-1">{item.type === 'CROSS_SELL_BP' ? 'عرض منتج أمان للدفع' : item.type === 'CROSS_SELL_ACC' ? 'عرض كارت التقسيط' : 'متابعة دورية'}</Text>

                {merchant && (
                    <View className="flex-row justify-end items-center mb-3 bg-gray-50 p-2 rounded-lg">
                        <View>
                            <Text className="text-right font-bold text-gray-800">{merchant.businessName}</Text>
                            <Text className="text-right text-gray-500 text-xs">{merchant.personalName}</Text>
                        </View>
                        <View className="w-10 h-10 bg-white rounded-full items-center justify-center ml-3 border border-gray-200">
                            <Briefcase size={18} color="#4B5563" />
                        </View>
                    </View>
                )}

                <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
                    {item.status === 'OPEN' ? (
                        <TouchableOpacity onPress={() => handleComplete(item.id)} className="flex-row items-center">
                            <View className="w-5 h-5 rounded-full border border-gray-400 mr-2" />
                            <Text className="text-gray-600">تحديد كمكتملة</Text>
                        </TouchableOpacity>
                    ) : (
                        <View className="flex-row items-center">
                            <CheckCircle size={18} color="#166534" className="mr-1" />
                            <Text className="text-green-700 font-bold">مكتملة</Text>
                        </View>
                    )}
                    {merchant && <ScoreBadge score={merchant.amanScore} size="sm" />}
                </View>
            </View>
        );
    };

    const FilterTab = ({ title, active, onPress }: any) => (
        <TouchableOpacity
            onPress={onPress}
            className={`px-4 py-2 rounded-full mr-2 ${active ? 'bg-blue-600' : 'bg-white border border-gray-200'}`}
        >
            <Text className={`font-bold ${active ? 'text-white' : 'text-gray-600'}`}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="p-4 flex-1">
                <View className="mb-4">
                    <Text className="text-2xl font-bold text-gray-900 text-right mb-4">قائمة المهام</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row" contentContainerStyle={{ flexDirection: 'row-reverse' }}>
                        <FilterTab title="الكل" active={filter === 'ALL'} onPress={() => setFilter('ALL')} />
                        <FilterTab title="مفتوحة" active={filter === 'OPEN'} onPress={() => setFilter('OPEN')} />
                        <FilterTab title="عاجلة" active={filter === 'HIGH'} onPress={() => setFilter('HIGH')} />
                        <FilterTab title="مكتملة" active={filter === 'COMPLETED'} onPress={() => setFilter('COMPLETED')} />
                    </ScrollView>
                </View>

                <FlatList
                    data={filteredTasks}
                    renderItem={renderTask}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View className="items-center mt-20">
                            <CheckCircle size={48} color="#D1D5DB" />
                            <Text className="text-gray-500 mt-4">لا توجد مهام بهذا التصنيف</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}
