import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { useHistory } from '../context/HistoryContext';
import i18n from '../languages/i18n';

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

export default function StatistiquesScreen() {
    const { matchHistory, loadHistory } = useHistory();
    const [showScore, setShowScore] = useState(true);
    const [showDuration, setShowDuration] = useState(true);

    // Recharger les données quand l'écran devient actif
    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [loadHistory])
    );

    // Calcul des matchs par joueur (au lieu des victoires pour les matchs solo)
    const playerData = useMemo(() => {
        console.log('=== DEBUG PLAYER DATA ===');
        console.log('matchHistory:', matchHistory);

        if (!matchHistory || matchHistory.length === 0) {
            console.log('Pas de matchHistory');
            return { labels: ['Aucune donnée'], datasets: [{ data: [0] }] };
        }

        const playerStats = {};

        matchHistory.forEach((match, index) => {
            console.log(`Match ${index}:`, match);

            try {
                // Gérer les matchs solo ET multijoueur
                if (match.players.includes(' vs ')) {
                    // Mode multijoueur
                    const players = match.players.split(' vs ');
                    players.forEach(player => {
                        const cleanPlayer = player.trim();
                        if (cleanPlayer) {
                            playerStats[cleanPlayer] = (playerStats[cleanPlayer] || 0) + 1;
                        }
                    });
                } else {
                    // Mode solo
                    const player = match.players.trim();
                    if (player) {
                        playerStats[player] = (playerStats[player] || 0) + 1;
                    }
                }
            } catch (error) {
                console.log('Erreur parsing match:', error);
            }
        });

        console.log('Final playerStats:', playerStats);

        const sortedPlayers = Object.entries(playerStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6); // Top 6 joueurs

        console.log('Sorted players:', sortedPlayers);

        if (sortedPlayers.length === 0) {
            return { labels: ['Aucune donnée'], datasets: [{ data: [0] }] };
        }

        const result = {
            labels: sortedPlayers.map(([player]) => player.length > 8 ? player.substring(0, 8) + '...' : player),
            datasets: [{ data: sortedPlayers.map(([, matches]) => matches || 0) }]
        };

        console.log('Final result:', result);
        console.log('=== END DEBUG ===');

        return result;
    }, [matchHistory]);

    // Calcul de la répartition des armes depuis l'historique
    const weaponData = useMemo(() => {
        if (!matchHistory || matchHistory.length === 0) {
            return [{ name: 'Aucune donnée', population: 1, color: '#ccc', legendFontColor: '#333', legendFontSize: 12 }];
        }

        const weaponCount = {};

        matchHistory.forEach(match => {
            if (match.weapon) {
                const weapon = match.weapon.trim();
                weaponCount[weapon] = (weaponCount[weapon] || 0) + 1;
            }
        });

        const colors = ['#7bb6dd', '#357ab7', '#2c3e50', '#e74c3c'];

        const weaponEntries = Object.entries(weaponCount);
        if (weaponEntries.length === 0) {
            return [{ name: 'Aucune donnée', population: 1, color: '#ccc', legendFontColor: '#333', legendFontSize: 12 }];
        }

        return weaponEntries.map(([weapon, count], index) => ({
            name: weapon,
            population: count || 1,
            color: colors[index % colors.length],
            legendFontColor: '#333',
            legendFontSize: 12
        }));
    }, [matchHistory]);

    // Calcul des performances quotidiennes depuis l'historique
    const getDailyPerformanceData = () => {
        if (!matchHistory || matchHistory.length === 0) {
            return { labels: ['Aucune donnée'], datasets: [{ data: [0] }] };
        }

        // Grouper les matchs par date
        const dailyStats = {};

        matchHistory.forEach(match => {
            try {
                let dateKey;
                if (match.date && match.date.includes(', ')) {
                    const [datePart] = match.date.split(', ');
                    dateKey = datePart;
                } else if (match.date) {
                    const date = new Date(match.date);
                    if (!isNaN(date.getTime())) {
                        dateKey = date.toLocaleDateString('fr-FR');
                    }
                }

                if (dateKey) {
                    if (!dailyStats[dateKey]) {
                        dailyStats[dateKey] = {
                            matchCount: 0,
                            totalDuration: 0
                        };
                    }

                    // Compter le nombre de matchs
                    dailyStats[dateKey].matchCount++;

                    // Calculer la durée en minutes
                    if (match.duration) {
                        const timeParts = match.duration.split(':');
                        if (timeParts.length === 2) {
                            const min = parseInt(timeParts[0]) || 0;
                            const sec = parseInt(timeParts[1]) || 0;
                            const durationInMinutes = min + (sec / 60);
                            if (!isNaN(durationInMinutes)) {
                                dailyStats[dateKey].totalDuration += durationInMinutes;
                            }
                        }
                    }
                }
            } catch (error) {
                console.log('Erreur parsing date:', error);
            }
        });

        // Trier par date et prendre les 12 derniers jours
        const sortedDays = Object.entries(dailyStats)
            .filter(([date]) => date && date.length > 0)
            .sort(([a], [b]) => {
                try {
                    const dateA = new Date(a.split('/').reverse().join('-'));
                    const dateB = new Date(b.split('/').reverse().join('-'));
                    return dateA - dateB;
                } catch {
                    return 0;
                }
            })
            .slice(-12);

        if (sortedDays.length === 0) {
            return { labels: ['Aucune donnée'], datasets: [{ data: [0] }] };
        }

        const labels = sortedDays.map(([date]) => date.substring(0, 5)); // Format DD/MM
        const matchData = sortedDays.map(([, stats]) => stats.matchCount || 0);
        const durationData = sortedDays.map(([, stats]) => {
            const duration = stats.totalDuration || 0;
            return Math.round(duration * 10) / 10;
        });

        const datasets = [];

        if (showScore && matchData.some(val => val > 0)) {
            datasets.push({
                data: matchData,
                color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
                strokeWidth: 3
            });
        }

        if (showDuration && durationData.some(val => val > 0)) {
            datasets.push({
                data: durationData,
                color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
                strokeWidth: 3
            });
        }

        // Si aucun dataset n'est sélectionné ou n'a de données
        if (datasets.length === 0) {
            datasets.push({ data: [0], color: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`, strokeWidth: 2 });
        }

        return { labels, datasets };
    };

    // Calcul des statistiques numériques depuis l'historique
    const numericStats = useMemo(() => {
        if (!matchHistory || matchHistory.length === 0) {
            return {
                matchesPlayed: 0,
                averageDuration: '0:00',
                totalDuration: '0:00',
                longestMatch: '0:00',
                shortestMatch: '0:00',
                mostUsedWeapon: 'Aucune'
            };
        }

        const totalMatches = matchHistory.length;
        let totalDurationSeconds = 0;
        let durations = [];

        matchHistory.forEach(match => {
            try {
                // Calcul de la durée
                if (match.duration) {
                    const timeParts = match.duration.split(':');
                    if (timeParts.length === 2) {
                        const min = parseInt(timeParts[0]) || 0;
                        const sec = parseInt(timeParts[1]) || 0;
                        const durationInSeconds = (min * 60) + sec;
                        totalDurationSeconds += durationInSeconds;
                        durations.push(durationInSeconds);
                    }
                }
            } catch (error) {
                console.log('Erreur parsing stats:', error);
            }
        });

        // Calcul de la durée moyenne
        const avgDurationSeconds = totalDurationSeconds > 0 ? totalDurationSeconds / totalMatches : 0;
        const avgMinutes = Math.floor(avgDurationSeconds / 60);
        const avgSeconds = Math.floor(avgDurationSeconds % 60);
        const averageDuration = `${avgMinutes}:${avgSeconds.toString().padStart(2, '0')}`;

        // Calcul de la durée totale
        const totalMinutes = Math.floor(totalDurationSeconds / 60);
        const totalSeconds = totalDurationSeconds % 60;
        const totalDuration = `${totalMinutes}:${Math.floor(totalSeconds).toString().padStart(2, '0')}`;

        // Plus long et plus court match
        const longestSeconds = durations.length > 0 ? Math.max(...durations) : 0;
        const shortestSeconds = durations.length > 0 ? Math.min(...durations) : 0;

        const longestMinutes = Math.floor(longestSeconds / 60);
        const longestSecs = longestSeconds % 60;
        const longestMatch = `${longestMinutes}:${Math.floor(longestSecs).toString().padStart(2, '0')}`;

        const shortestMinutes = Math.floor(shortestSeconds / 60);
        const shortestSecs = shortestSeconds % 60;
        const shortestMatch = `${shortestMinutes}:${Math.floor(shortestSecs).toString().padStart(2, '0')}`;

        // Arme la plus utilisée
        const weaponCount = {};
        matchHistory.forEach(match => {
            if (match.weapon) {
                weaponCount[match.weapon] = (weaponCount[match.weapon] || 0) + 1;
            }
        });
        const mostUsedWeapon = Object.entries(weaponCount).length > 0
            ? Object.entries(weaponCount).sort(([, a], [, b]) => b - a)[0][0]
            : 'Aucune';

        return {
            matchesPlayed: totalMatches,
            averageDuration,
            totalDuration,
            longestMatch,
            shortestMatch,
            mostUsedWeapon
        };
    }, [matchHistory]);

    // Gestion du cas où il n'y a pas de données
    if (!matchHistory || matchHistory.length === 0) {
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentWrapper}>
                <View style={styles.statsBox}>
                    <Text style={styles.statsLabel}>Aucune donnée disponible</Text>
                    <Text style={styles.noDataText}>Jouez quelques matchs pour voir vos statistiques ici</Text>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentWrapper}>
            {/* Graphique des matchs par joueur */}
            <View style={styles.statsBox}>
                <Text style={styles.statsLabel}>🏆 Matchs par joueur</Text>
                <BarChart
                    data={playerData}
                    width={screenWidth * 0.85}
                    height={180}
                    chartConfig={chartConfig}
                    fromZero
                    showValuesOnTopOfBars
                    style={{ borderRadius: 8 }}
                />
            </View>

            {/* Nombre de matchs et temps total par jour */}
            <View style={styles.statsBox}>
                <Text style={styles.statsLabel}>📊 Activité quotidienne</Text>

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
                        }]}>Nb matchs</Text>
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
                        }]}>Temps total (min)</Text>
                    </TouchableOpacity>
                </View>

                {/* Graphique */}
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
            </View>

            {/* Répartition des armes */}
            <View style={styles.statsBox}>
                <Text style={styles.statsLabel}>🗡️ Armes utilisées</Text>
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

            {/* Statistiques numériques */}
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{numericStats.matchesPlayed}</Text>
                    <Text style={styles.statText}>Matchs joués</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{numericStats.averageDuration}</Text>
                    <Text style={styles.statText}>Durée moyenne</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{numericStats.totalDuration}</Text>
                    <Text style={styles.statText}>Temps total</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{numericStats.longestMatch}</Text>
                    <Text style={styles.statText}>Plus long match</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{numericStats.shortestMatch}</Text>
                    <Text style={styles.statText}>Plus court match</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{numericStats.mostUsedWeapon}</Text>
                    <Text style={styles.statText}>Arme favorite</Text>
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
    noDataText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
        padding: 20,
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