import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, I18nManager } from 'react-native';
import { Search as SearchIcon, X, Phone, User as UserIcon, Store } from 'lucide-react-native';
import { merchants } from '@shared/mockData';
import { Merchant } from '@shared/types';
import { ScoreBadge } from '../../components/ScoreBadge';
import { ProductStatus } from '../../components/ProductStatus';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Merchant[]>([]);
    const [loading, setLoading] = useState(false);

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length > 0) {
                performSearch(query);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const performSearch = (text: string) => {
        setLoading(true);
        // Mock search delay
        setTimeout(() => {
            const lowerText = text.toLowerCase();
            const filtered = merchants.filter(m =>
                m.businessName.toLowerCase().includes(lowerText) ||
                m.personalName.toLowerCase().includes(lowerText) ||
                m.mobile.includes(lowerText) ||
                m.nid.includes(lowerText)
            );
            setResults(filtered);
            setLoading(false);
        }, 500);
    };

    const renderItem = ({ item }: { item: Merchant }) => (
        <TouchableOpacity
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
            onPress={() => router.push({ pathname: '/(merchant)/[id]', params: { id: item.id } })} // Placeholder route
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900 text-right">{item.businessName}</Text>
                    <View className="flex-row items-center justify-end mt-1">
                        <Text className="text-gray-500 text-right mr-1">{item.personalName}</Text>
                        <UserIcon size={14} color="#6B7280" />
                    </View>
                    <View className="flex-row items-center justify-end mt-1">
                        <Text className="text-gray-500 text-right mr-1">{item.mobile}</Text>
                        <Phone size={14} color="#6B7280" />
                    </View>
                </View>
                <ScoreBadge score={item.amanScore} size="sm" />
            </View>

            <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <ProductStatus products={item.products} />
                <Text className="text-xs text-gray-400">{item.territory}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="p-4">
                <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-4 h-12 focus:border-blue-500 mb-4">
                    <SearchIcon color="#9CA3AF" size={20} className="mr-3" />
                    <TextInput
                        className="flex-1 text-right text-lg text-gray-900"
                        placeholder="بحث بالاسم، الرقم القومي، أو الموبايل"
                        placeholderTextColor="#9CA3AF"
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <X color="#9CA3AF" size={20} />
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#1E40AF" className="mt-10" />
                ) : (
                    <FlatList
                        data={results}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={
                            query.length > 0 ? (
                                <View className="items-center mt-10">
                                    <Store size={48} color="#D1D5DB" />
                                    <Text className="text-gray-500 mt-4 text-lg">لم يتم العثور على نتائج</Text>
                                    <TouchableOpacity className="mt-4 bg-blue-100 px-6 py-2 rounded-full">
                                        <Text className="text-blue-700 font-bold">+ إضافة عميل جديد</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View className="items-center mt-10">
                                    <Text className="text-gray-400">ابدأ البحث...</Text>
                                </View>
                            )
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
