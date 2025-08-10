import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { usePlayerData } from '../../hooks/useChartData';
import i18n from '../../languages/i18n';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(53, 122, 183, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    barPercentage: 0.6,
    decimalPlaces: 1,
    propsForLabels: {
        fontSize: 11,
    },
};

const PlayerChart = ({ matchHistory, style }) => {
    const playerData = usePlayerData(matchHistory);

    return (
        <View style={[{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 15,
            width: '100%',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            marginBottom: 20,
            overflow: 'hidden',
        }, style]}>
            <Text style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#333',
                marginBottom: 15,
                textAlign: 'center',
            }}>
                {i18n.t('stats.matchesPerPlayer')}
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <BarChart
                    data={playerData}
                    width={Math.max(screenWidth * 0.85, playerData.labels.length * 80)}
                    height={180}
                    chartConfig={chartConfig}
                    fromZero
                    showValuesOnTopOfBars
                    style={{ borderRadius: 8 }}
                />
            </ScrollView>
        </View>
    );
};

export default PlayerChart;