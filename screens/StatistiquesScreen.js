import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import i18n from '../languages/i18n';

const screenWidth = Dimensions.get('window').width;

// Données des victoires par joueur
const winsData = {
    labels: ['Alice', 'Bob', 'Charlie'],
    datasets: [{ data: [15, 8, 12] }],
};

// Distribution des armes utilisées
const weaponData = [
    { name: 'Fleuret', population: 30, color: '#7bb6dd', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Épée', population: 25, color: '#357ab7', legendFontColor: '#333', legendFontSize: 12 },
];

// Évolution des scores moyens par session
const scoreEvolutionData = {
    labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
    datasets: [{
        data: [8, 12, 15, 18, 22, 25],
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
        strokeWidth: 3
    }]
};

// Durée moyenne des matchs par arme
const matchDurationData = {
    labels: ['Épée', 'Fleuret'],
    datasets: [{
        data: [8.5, 6.2],
        colors: [
            (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
            (opacity = 1) => `rgba(123, 182, 221, ${opacity})`,
            (opacity = 1) => `rgba(53, 122, 183, ${opacity})`
        ]
    }],
};

// Répartition des victoires par heure de la journée
const hourlyWinsData = {
    labels: ['9h', '12h', '15h', '18h', '21h'],
    datasets: [{ data: [3, 8, 12, 15, 7] }],
};

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

export default function StatistiquesScreen() {
    const [showScore, setShowScore] = useState(true);
    const [showDuration, setShowDuration] = useState(true);

    // Données de base pour le graphique daily performance
    const baseScoreData = [18, 22, 15, 25, 20, 28, 24, 19, 30, 26, 23, 27];
    const baseDurationData = [8.5, 12.2, 6.8, 15.1, 9.7, 18.5, 14.2, 7.9, 20.3, 16.8, 11.4, 17.6];
    const labels = ['15/07', '16/07', '17/07', '18/07', '19/07', '20/07', '21/07', '22/07', '23/07', '24/07', '25/07', '26/07'];

    // Construire les datasets selon les sélections
    const getDailyPerformanceData = () => {
        const datasets = [];
        const legend = [];

        if (showScore) {
            datasets.push({
                data: baseScoreData,
                color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
                strokeWidth: 3
            });
            legend.push(i18n.t('stats.bestScore'));
        }

        if (showDuration) {
            datasets.push({
                data: baseDurationData,
                color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
                strokeWidth: 3
            });
            legend.push(i18n.t('stats.longestDuration'));
        }

        return {
            labels,
            datasets,
            legend
        };
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentWrapper}>
            {/* Graphique des victoires par joueur */}
            <View style={styles.statsBox}>
                <Text style={styles.statsLabel}>{i18n.t('stats.winsPerPlayer')}</Text>
                <BarChart
                    data={winsData}
                    width={screenWidth * 0.85}
                    height={180}
                    chartConfig={chartConfig}
                    fromZero
                    showValuesOnTopOfBars
                    style={{ borderRadius: 8 }}
                />
            </View>

            {/* Meilleur score et plus longue durée par jour */}
            <View style={styles.statsBox}>
                <Text style={styles.statsLabel}>{i18n.t('stats.bestScoreAndDuration')}</Text>

                {/* Légendes interactives */}
                <View style={styles.legendContainer}>
                    <TouchableOpacity
                        style={styles.legendItem}
                        onPress={() => setShowScore(!showScore)}
                    >
                        <View style={[styles.legendColor, {
                            backgroundColor: showScore ? 'rgba(46, 204, 113, 1)' : 'rgba(46, 204, 113, 0.3)'
                        }]} />
                        <Text style={[styles.legendText, {
                            opacity: showScore ? 1 : 0.5
                        }]}>{i18n.t('stats.bestScore')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.legendItem}
                        onPress={() => setShowDuration(!showDuration)}
                    >
                        <View style={[styles.legendColor, {
                            backgroundColor: showDuration ? 'rgba(231, 76, 60, 1)' : 'rgba(231, 76, 60, 0.3)'
                        }]} />
                        <Text style={[styles.legendText, {
                            opacity: showDuration ? 1 : 0.5
                        }]}>{i18n.t('stats.longestDuration')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Graphique */}
                {(showScore || showDuration) && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <LineChart
                            data={getDailyPerformanceData()}
                            width={screenWidth * 1.5}
                            height={200}
                            chartConfig={chartConfig}
                            bezier
                            style={{ borderRadius: 8 }}
                        />
                    </ScrollView>
                )}
            </View>

            {/* Répartition des armes */}
            <View style={styles.statsBox}>
                <Text style={styles.statsLabel}>{i18n.t('stats.weaponsUsed')}</Text>
                <PieChart
                    data={weaponData}
                    width={screenWidth * 0.85}
                    height={180}
                    chartConfig={chartConfig}
                    accessor={'population'}
                    backgroundColor={'transparent'}
                    paddingLeft={15}
                    center={[10, 0]}
                    style={{ borderRadius: 8 }}
                />
            </View>

            {/* Statistiques numériques enrichies */}
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>35</Text>
                    <Text style={styles.statText}>{i18n.t('stats.matchesPlayed')}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>7:32</Text>
                    <Text style={styles.statText}>{i18n.t('stats.averageDuration')}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>18.5</Text>
                    <Text style={styles.statText}>{i18n.t('stats.averageScore')}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>68%</Text>
                    <Text style={styles.statText}>{i18n.t('stats.winRate')}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>142</Text>
                    <Text style={styles.statText}>{i18n.t('stats.successfulTouches')}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>2.4</Text>
                    <Text style={styles.statText}>{i18n.t('stats.touchesPerMinute')}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f8fa',
    },
    contentWrapper: {
        padding: 18,
        paddingBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 20,
        textAlign: 'center',
    },
    statsBox: {
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
    },
    statsLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
        width: '100%',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginHorizontal: 4,
        marginVertical: 2,
        flex: 0,
        minWidth: 100,
        maxWidth: 140,
    },
    legendColor: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    legendText: {
        fontSize: 11,
        color: '#333',
        fontWeight: '500',
        flex: 1,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    statCard: {
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
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4a90e2',
        marginBottom: 3,
    },
    statText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 13,
        paddingHorizontal: 4,
        paddingVertical: 2,
        flex: 1,
        flexWrap: 'wrap',
    },
});