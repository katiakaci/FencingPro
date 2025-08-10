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
                mostUsedWeapon: 'Aucune',
                averageScore: 0,
                totalTouches: 0,
                touchesPerMinute: 0,
                monthlyProgression: 0,
                weaponEfficiency: 'Aucune',
                peakHour: 'N/A',
                favoriteDay: 'N/A',
                sessionsPerWeek: 0,
                averageTimeBetweenMatches: '0:00',
                consecutiveDays: 0,
                monthComparison: 0,
                activeDays: 0,
                personalRecord: 0,
                mostProductiveDay: 'N/A'
            };
        }

        const totalMatches = matchHistory.length;
        let totalDurationSeconds = 0;
        let durations = [];
        let totalScore = 0;
        let validScoreMatches = 0;

        const monthlyScores = {};
        const weaponScores = {};
        const hourCounts = {};
        const dayCounts = {};
        const dailyActivity = {};
        const dates = [];
        let maxScore = 0;

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

                if (match.score) {
                    const score = parseInt(match.score) || 0;
                    if (score > 0) {
                        totalScore += score;
                        validScoreMatches++;
                        maxScore = Math.max(maxScore, score);
                    }

                    // Score par arme
                    if (match.weapon) {
                        if (!weaponScores[match.weapon]) {
                            weaponScores[match.weapon] = { total: 0, count: 0 };
                        }
                        weaponScores[match.weapon].total += score;
                        weaponScores[match.weapon].count++;
                    }
                }

                // Nouvelles analyses
                if (match.date) {
                    const date = new Date(match.date.split(', ')[0].split('/').reverse().join('-'));
                    if (!isNaN(date.getTime())) {
                        dates.push(date);

                        // Progression mensuelle
                        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        if (!monthlyScores[monthKey]) {
                            monthlyScores[monthKey] = { total: 0, count: 0 };
                        }
                        const score = parseInt(match.score) || 0;
                        monthlyScores[monthKey].total += score;
                        monthlyScores[monthKey].count++;

                        // Heure de pointe
                        if (match.date.includes(', ')) {
                            const timePart = match.date.split(', ')[1];
                            if (timePart) {
                                const hour = parseInt(timePart.split(':')[0]) || 0;
                                hourCounts[hour] = (hourCounts[hour] || 0) + 1;
                            }
                        }

                        // Jour de la semaine favori
                        const dayOfWeek = date.getDay();
                        const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                        const dayName = dayNames[dayOfWeek];
                        dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;

                        // Activité quotidienne
                        const dateKey = date.toDateString();
                        if (!dailyActivity[dateKey]) {
                            dailyActivity[dateKey] = { matches: 0, duration: 0 };
                        }
                        dailyActivity[dateKey].matches++;

                        if (match.duration) {
                            const timeParts = match.duration.split(':');
                            if (timeParts.length === 2) {
                                const min = parseInt(timeParts[0]) || 0;
                                const sec = parseInt(timeParts[1]) || 0;
                                dailyActivity[dateKey].duration += (min * 60) + sec;
                            }
                        }
                    }
                }
            } catch (error) {
                console.log('Erreur parsing stats:', error);
            }
        });

        // Calculs existants
        const avgDurationSeconds = totalDurationSeconds > 0 ? totalDurationSeconds / totalMatches : 0;
        const avgMinutes = Math.floor(avgDurationSeconds / 60);
        const avgSeconds = Math.floor(avgDurationSeconds % 60);
        const averageDuration = `${avgMinutes}:${avgSeconds.toString().padStart(2, '0')}`;

        const totalMinutes = Math.floor(totalDurationSeconds / 60);
        const totalSeconds = totalDurationSeconds % 60;
        const totalDuration = `${totalMinutes}:${Math.floor(totalSeconds).toString().padStart(2, '0')}`;

        const longestSeconds = durations.length > 0 ? Math.max(...durations) : 0;
        const shortestSeconds = durations.length > 0 ? Math.min(...durations) : 0;

        const longestMinutes = Math.floor(longestSeconds / 60);
        const longestSecs = longestSeconds % 60;
        const longestMatch = `${longestMinutes}:${Math.floor(longestSecs).toString().padStart(2, '0')}`;

        const shortestMinutes = Math.floor(shortestSeconds / 60);
        const shortestSecs = shortestSeconds % 60;
        const shortestMatch = `${shortestMinutes}:${Math.floor(shortestSecs).toString().padStart(2, '0')}`;

        const weaponCount = {};
        matchHistory.forEach(match => {
            if (match.weapon) {
                weaponCount[match.weapon] = (weaponCount[match.weapon] || 0) + 1;
            }
        });
        const mostUsedWeapon = Object.entries(weaponCount).length > 0
            ? Object.entries(weaponCount).sort(([, a], [, b]) => b - a)[0][0]
            : 'Aucune';

        const averageScore = validScoreMatches > 0 ? Math.round((totalScore / validScoreMatches) * 10) / 10 : 0;
        const totalDurationMinutes = totalDurationSeconds / 60;
        const touchesPerMinute = totalDurationMinutes > 0 ? Math.round((totalScore / totalDurationMinutes) * 10) / 10 : 0;

        // Nouvelles statistiques

        // 1. Progression mensuelle
        const monthlyEntries = Object.entries(monthlyScores);
        let monthlyProgression = 0;
        if (monthlyEntries.length >= 2) {
            monthlyEntries.sort(([a], [b]) => a.localeCompare(b));
            const lastMonth = monthlyEntries[monthlyEntries.length - 1][1];
            const secondLastMonth = monthlyEntries[monthlyEntries.length - 2][1];
            const lastAvg = lastMonth.total / lastMonth.count;
            const secondLastAvg = secondLastMonth.total / secondLastMonth.count;
            monthlyProgression = Math.round(((lastAvg - secondLastAvg) / secondLastAvg) * 100) || 0;
        }

        // 2. Efficacité par arme
        let bestWeaponEfficiency = 'Aucune';
        let bestAverage = 0;
        Object.entries(weaponScores).forEach(([weapon, data]) => {
            const avg = data.total / data.count;
            if (avg > bestAverage) {
                bestAverage = avg;
                bestWeaponEfficiency = `${weapon} (${Math.round(avg * 10) / 10})`;
            }
        });

        // 3. Heure de pointe
        const peakHour = Object.entries(hourCounts).length > 0
            ? Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0][0] + 'h'
            : 'N/A';

        // 4. Jour favori
        const favoriteDay = Object.entries(dayCounts).length > 0
            ? Object.entries(dayCounts).sort(([, a], [, b]) => b - a)[0][0]
            : 'N/A';

        // 5. Sessions par semaine
        const sortedDates = dates.sort((a, b) => a - b);
        const weeksBetween = sortedDates.length > 1
            ? Math.max(1, Math.ceil((sortedDates[sortedDates.length - 1] - sortedDates[0]) / (1000 * 60 * 60 * 24 * 7)))
            : 1;
        const sessionsPerWeek = Math.round((totalMatches / weeksBetween) * 10) / 10;

        // 6. Temps moyen entre matchs
        let averageTimeBetweenMatches = '0:00';
        if (sortedDates.length > 1) {
            const totalTimeBetween = sortedDates[sortedDates.length - 1] - sortedDates[0];
            const avgTimeBetweenMs = totalTimeBetween / (sortedDates.length - 1);
            const avgDays = Math.floor(avgTimeBetweenMs / (1000 * 60 * 60 * 24));
            const avgHours = Math.floor((avgTimeBetweenMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (avgDays > 0) {
                averageTimeBetweenMatches = `${avgDays}j ${avgHours}h`;
            } else {
                averageTimeBetweenMatches = `${avgHours}h`;
            }
        }

        // 7. Jours consécutifs
        const uniqueDates = [...new Set(dates.map(d => d.toDateString()))].sort();
        let consecutiveDays = 0;
        let currentStreak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
            const prev = new Date(uniqueDates[i - 1]);
            const curr = new Date(uniqueDates[i]);
            const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
                currentStreak++;
            } else {
                consecutiveDays = Math.max(consecutiveDays, currentStreak);
                currentStreak = 1;
            }
        }
        consecutiveDays = Math.max(consecutiveDays, currentStreak);

        // 8. Comparaison mensuelle
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const lastMonth = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`;
        const currentMonthMatches = monthlyScores[currentMonth]?.count || 0;
        const lastMonthMatches = monthlyScores[lastMonth]?.count || 0;
        const monthComparison = lastMonthMatches > 0
            ? Math.round(((currentMonthMatches - lastMonthMatches) / lastMonthMatches) * 100)
            : 0;

        // 9. Jours actifs
        const activeDays = Object.keys(dailyActivity).length;

        // 10. Jour le plus productif
        let mostProductiveDay = 'N/A';
        let maxActivity = 0;
        Object.entries(dailyActivity).forEach(([date, activity]) => {
            const score = activity.matches * 2 + activity.duration / 60; // Score basé sur matchs + temps
            if (score > maxActivity) {
                maxActivity = score;
                const dateObj = new Date(date);
                mostProductiveDay = dateObj.toLocaleDateString('fr-FR');
            }
        });

        return {
            matchesPlayed: totalMatches,
            averageDuration,
            totalDuration,
            longestMatch,
            shortestMatch,
            mostUsedWeapon,
            averageScore,
            totalTouches: totalScore,
            touchesPerMinute,
            // Nouvelles stats
            monthlyProgression,
            weaponEfficiency: bestWeaponEfficiency,
            peakHour,
            favoriteDay,
            sessionsPerWeek,
            averageTimeBetweenMatches,
            consecutiveDays,
            monthComparison,
            activeDays,
            personalRecord: maxScore,
            mostProductiveDay
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
                <Text style={styles.statsLabel}>{i18n.t('stats.matchesPerPlayer')}</Text>
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
                <Text style={styles.statsLabel}>{i18n.t('stats.dailyActivity')}</Text>

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
                        }]}>{i18n.t('stats.numberOfMatches')}</Text>
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
                        }]}>{i18n.t('stats.totalTimeMin')}</Text>
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

            {/* Statistiques numériques */}
            <View style={styles.section}>
                {/* 📊 Statistiques de base */}
                <Text style={styles.sectionTitle}>📊 Statistiques de base</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.matchesPlayed}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.matchesPlayed')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.averageDuration}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.averageDuration')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.totalDuration}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.totalDuration')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.longestMatch}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.longestMatch')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.shortestMatch}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.shortestMatch')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.mostUsedWeapon}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.favoriteWeapon')}</Text>
                    </View>
                </View>
            </View>

            {/* 🏆 Statistiques de performance */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🏆 Statistiques de performance</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.averageScore}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.averageScore')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.totalTouches}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.totalTouches')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.touchesPerMinute}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.touchesPerMinute')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: numericStats.monthlyProgression >= 0 ? '#27ae60' : '#e74c3c' }]}>
                            {numericStats.monthlyProgression > 0 ? '+' : ''}{numericStats.monthlyProgression}%
                        </Text>
                        <Text style={styles.statText}>{i18n.t('stats.monthlyProgression')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.weaponEfficiency}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.weaponEfficiency')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.personalRecord}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.personalRecord')}</Text>
                    </View>
                </View>
            </View>

            {/* ⏰ Statistiques temporelles */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>⏰ Statistiques temporelles</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.peakHour}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.peakHour')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.favoriteDay}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.favoriteDay')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.sessionsPerWeek}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.sessionsPerWeek')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.averageTimeBetweenMatches}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.averageTimeBetweenMatches')}</Text>
                    </View>
                </View>
            </View>

            {/* 🎯 Statistiques d'activité */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎯 Statistiques d'activité</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.consecutiveDays}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.consecutiveDays')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: numericStats.monthComparison >= 0 ? '#27ae60' : '#e74c3c' }]}>
                            {numericStats.monthComparison > 0 ? '+' : ''}{numericStats.monthComparison}%
                        </Text>
                        <Text style={styles.statText}>{i18n.t('stats.monthComparison')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.activeDays}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.activeDays')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{numericStats.mostProductiveDay}</Text>
                        <Text style={styles.statText}>{i18n.t('stats.mostProductiveDay')}</Text>
                    </View>
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
    // Nouveau style pour les sections
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
        textAlign: 'left',
        paddingLeft: 5,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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