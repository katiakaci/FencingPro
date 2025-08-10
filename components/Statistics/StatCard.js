import React from 'react';
import { View, Text } from 'react-native';

const StatCard = ({ value, label, color, style }) => {
    return (
        <View style={[{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 12,
            width: '48%',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            marginBottom: 15,
            minHeight: 90,
            justifyContent: 'space-between',
        }, style]}>
            <Text style={[{
                fontSize: 24,
                fontWeight: 'bold',
                color: color || '#4a90e2',
                marginBottom: 3,
            }]}>
                {value}
            </Text>
            <Text style={{
                fontSize: 14,
                color: '#666',
                textAlign: 'center',
                lineHeight: 13,
                paddingHorizontal: 4,
                paddingVertical: 2,
                flex: 1,
                flexWrap: 'wrap',
            }}>
                {label}
            </Text>
        </View>
    );
};

export default StatCard;