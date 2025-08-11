/**
 * @fileoverview Hook personnalisé pour la génération de données de graphiques
 * 
 * Ce hook gère :
 * - La transformation de l'historique en données de graphiques
 * - La génération de graphiques pour les statistiques
 * - Le formatage des données pour Chart.js et Victory Charts
 * - La gestion des cas d'erreur et données vides
 * 
 * Graphiques supportés :
 * - Graphique en barres des matchs par joueur
 * - Graphique circulaire des armes utilisées
 * - Graphique linéaire des performances quotidiennes
 * - Support des données multiples (matchs + durée)
 * 
 * Fonctionnalités :
 * - Tri automatique des données
 * - Troncature des labels trop longs
 * - Couleurs automatiques pour les graphiques
 * - Gestion responsive de la largeur d'écran
 * 
 * @param {Array} matchHistory - Historique des matchs
 * @param {boolean} showScore - Afficher les données de score (optionnel)
 * @param {boolean} showDuration - Afficher les données de durée (optionnel)
 * @returns {Object} Données formatées pour les graphiques
 */
import { useMemo } from 'react';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const usePlayerData = (matchHistory) => {
    return useMemo(() => {
        if (!matchHistory || matchHistory.length === 0) {
            return { labels: ['Aucune donnée'], datasets: [{ data: [0] }] };
        }

        const playerStats = {};

        matchHistory.forEach((match) => {
            try {
                if (match.players.includes(' vs ')) {
                    const players = match.players.split(' vs ');
                    players.forEach(player => {
                        const cleanPlayer = player.trim();
                        if (cleanPlayer) {
                            playerStats[cleanPlayer] = (playerStats[cleanPlayer] || 0) + 1;
                        }
                    });
                } else {
                    const player = match.players.trim();
                    if (player) {
                        playerStats[player] = (playerStats[player] || 0) + 1;
                    }
                }
            } catch (error) {
                console.log('Erreur parsing match:', error);
            }
        });

        const sortedPlayers = Object.entries(playerStats)
            .sort(([, a], [, b]) => b - a);

        if (sortedPlayers.length === 0) {
            return { labels: ['Aucune donnée'], datasets: [{ data: [0] }] };
        }

        return {
            labels: sortedPlayers.map(([player]) => player.length > 10 ? player.substring(0, 10) + '...' : player),
            datasets: [{ data: sortedPlayers.map(([, matches]) => matches || 0) }]
        };
    }, [matchHistory]);
};

export const useWeaponData = (matchHistory) => {
    return useMemo(() => {
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
};

export const useDailyPerformanceData = (matchHistory, showScore, showDuration) => {
    return useMemo(() => {
        if (!matchHistory || matchHistory.length === 0) {
            return { labels: ['Aucune donnée'], datasets: [{ data: [0] }] };
        }

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
                        dailyStats[dateKey] = { matchCount: 0, totalDuration: 0 };
                    }

                    dailyStats[dateKey].matchCount++;

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

        const labels = sortedDays.map(([date]) => date.substring(0, 5));
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

        if (datasets.length === 0) {
            datasets.push({ data: [0], color: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`, strokeWidth: 2 });
        }

        return { labels, datasets };
    }, [matchHistory, showScore, showDuration]);
};