import React from 'react';
import { View, Text } from 'react-native';
import { ProductHolding } from '@shared/types';
import { cn } from '../lib/utils';

interface ProductStatusProps {
    products: ProductHolding[];
}

export const ProductStatus: React.FC<ProductStatusProps> = ({ products }) => {
    const getStatusIcon = (type: string, status: string) => {
        switch (status) {
            case 'ACTIVE': return '🟢';
            case 'PENDING': return '⏳';
            case 'REJECTED': return '🔴';
            default: return '❌';
        }
    };

    const renderProduct = (type: 'MF' | 'BP' | 'ACC') => {
        const product = products.find(p => p.type === type);
        const status = product ? product.status : 'NOT_ONBOARDED';
        return (
            <View key={type} className="flex-row items-center ml-2">
                <Text className="text-xs font-bold text-gray-700 ml-1">{type}</Text>
                <Text className="text-xs">{getStatusIcon(type, status)}</Text>
            </View>
        );
    };

    return (
        <View className="flex-row">
            {renderProduct('MF')}
            {renderProduct('BP')}
            {renderProduct('ACC')}
        </View>
    );
};
