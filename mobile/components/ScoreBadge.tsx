import React from 'react';
import { View, Text } from 'react-native';
import { AmanScore } from '@shared/types';
import { cn } from '../lib/utils';

interface ScoreBadgeProps {
    score: AmanScore;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, className, size = 'md' }) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    let label = 'غير معروف';

    switch (score) {
        case 'HIGH':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            label = 'مرتفع';
            break;
        case 'MEDIUM':
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            label = 'متوسط';
            break;
        case 'LOW':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            label = 'منخفض';
            break;
    }

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base',
    };

    return (
        <View className={`rounded-full items-center justify-center ${bgColor} ${sizeClasses[size]} ${className || ''}`}>
            <Text className={`font-medium ${textColor}`}>
                {label}
            </Text>
        </View>
    );
};
