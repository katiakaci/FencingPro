import React from 'react';
import { View, Text } from 'react-native';
import StatCard from './StatCard';

const StatSection = ({ title, stats, style }) => {
    return (
        <View style={[{ marginBottom: 25 }, style]}>
            <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#2c3e50',
                marginBottom: 15,
                textAlign: 'left',
                paddingLeft: 5,
            }}>
                {title}
            </Text>
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
            }}>
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        value={stat.value}
                        label={stat.label}
                        color={stat.color}
                    />
                ))}
            </View>
        </View>
    );
};

export default StatSection;