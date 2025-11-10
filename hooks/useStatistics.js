/**
 * @fileoverview Hook personnalisé pour le calcul des statistiques de jeu
 * 
 * Ce hook gère :
 * - L'analyse complète de l'historique des matchs
 * - Le calcul des statistiques de performance
 * - L'analyse temporelle et les tendances
 * - Les métriques d'efficacité par arme
 * - Les patterns d'activité quotidienne/hebdomadaire
 * 
 * Statistiques calculées :
 * - Nombre de matchs, durées moyennes/totales
 * - Armes préférées et efficacité
 * - Heures de pointe et jours favoris
 * - Progression mensuelle et jours consécutifs
 * - Records personnels et productivité
 * 
 * @param {Array} matchHistory - Historique des matchs
 * @returns {Object} Objet contenant toutes les statistiques calculées
 */
import { useMemo } from 'react';

export const useStatistics = (matchHistory) => {
    return useMemo(() => {
        if (!matchHistory || matchHistory.length === 0) {
            return {
                matchesPlayed: 0,
                averageDuration: '0:00',
                totalDuration: '0:00',
                longestMatch: '0:00',
                shortestMatch: '0:00',
                mostUsedWeapon: 'Aucune',
                touchesPerMinute: 0,
                touchesEpee: 0,
                touchesFleuret: 0,
                peakHour: 'N/A',
                favoriteDay: 'N/A',
                sessionsPerWeek: 0,
                averageTimeBetweenMatches: '0:00',
                consecutiveDays: 0,
                activeDays: 0,
                personalRecord: 0
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
                        const weapon = match.weapon.trim();

                        // Si c'est un match multi (Arme1 vs Arme2)
                        if (weapon.includes(' vs ')) {
                            const weapons = weapon.split(' vs ');
                            // En mode multi, diviser le score entre les deux armes
                            const scorePerWeapon = score / 2;
                            weapons.forEach(w => {
                                const cleanWeapon = w.trim();
                                if (!weaponScores[cleanWeapon]) {
                                    weaponScores[cleanWeapon] = { total: 0, count: 0 };
                                }
                                weaponScores[cleanWeapon].total += scorePerWeapon;
                                weaponScores[cleanWeapon].count++;
                            });
                        } else {
                            // Match solo, une seule arme
                            if (!weaponScores[weapon]) {
                                weaponScores[weapon] = { total: 0, count: 0 };
                            }
                            weaponScores[weapon].total += score;
                            weaponScores[weapon].count++;
                        }
                    }
                }

                // Nouvelles analyses
                if (match.date) {
                    // Format attendu: "DD/MM/YYYY, HH:MM"
                    const datePart = match.date.split(', ')[0];
                    const [day, month, year] = datePart.split('/');
                    const date = new Date(year, month - 1, day); // mois commence à 0

                    if (!isNaN(date.getTime())) {
                        dates.push(date);

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
                        const dateKey = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                        if (!dailyActivity[dateKey]) {
                            dailyActivity[dateKey] = { matches: 0, duration: 0, date: date };
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
                const weapon = match.weapon.trim();

                // Si c'est un match multi (Arme1 vs Arme2)
                if (weapon.includes(' vs ')) {
                    const weapons = weapon.split(' vs ');
                    weapons.forEach(w => {
                        const cleanWeapon = w.trim();
                        weaponCount[cleanWeapon] = (weaponCount[cleanWeapon] || 0) + 1;
                    });
                } else {
                    // Match solo, une seule arme
                    weaponCount[weapon] = (weaponCount[weapon] || 0) + 1;
                }
            }
        });
        const mostUsedWeapon = Object.entries(weaponCount).length > 0
            ? Object.entries(weaponCount).sort(([, a], [, b]) => b - a)[0][0]
            : 'Aucune';

        const totalDurationMinutes = totalDurationSeconds / 60;
        const touchesPerMinute = totalDurationMinutes > 0 ? Math.round((totalScore / totalDurationMinutes) * 10) / 10 : 0;

        // Touches par arme
        const touchesEpee = weaponScores['Épée'] ? Math.round(weaponScores['Épée'].total) : 0;
        const touchesFleuret = weaponScores['Fleuret'] ? Math.round(weaponScores['Fleuret'].total) : 0;

        // 2. Heure de pointe
        const peakHour = Object.entries(hourCounts).length > 0
            ? Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0][0] + 'h'
            : 'N/A';

        // 3. Jour favori
        const favoriteDay = Object.entries(dayCounts).length > 0
            ? Object.entries(dayCounts).sort(([, a], [, b]) => b - a)[0][0]
            : 'N/A';

        // 4. Sessions par semaine
        const sortedDates = dates.sort((a, b) => a - b);
        const weeksBetween = sortedDates.length > 1
            ? Math.max(1, Math.ceil((sortedDates[sortedDates.length - 1] - sortedDates[0]) / (1000 * 60 * 60 * 24 * 7)))
            : 1;
        const sessionsPerWeek = Math.round((totalMatches / weeksBetween) * 10) / 10;

        // 5. Temps moyen entre matchs
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

        // 6. Jours consécutifs
        const uniqueDateKeys = [...new Set(Object.keys(dailyActivity))].sort();
        let consecutiveDays = 0;
        let currentStreak = 1;
        for (let i = 1; i < uniqueDateKeys.length; i++) {
            const prev = new Date(uniqueDateKeys[i - 1]);
            const curr = new Date(uniqueDateKeys[i]);
            const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                currentStreak++;
            } else {
                consecutiveDays = Math.max(consecutiveDays, currentStreak);
                currentStreak = 1;
            }
        }
        consecutiveDays = Math.max(consecutiveDays, currentStreak);

        // 8. Jours actifs
        const activeDays = Object.keys(dailyActivity).length;

        return {
            matchesPlayed: totalMatches,
            averageDuration,
            totalDuration,
            longestMatch,
            shortestMatch,
            mostUsedWeapon,
            touchesPerMinute,
            touchesEpee,
            touchesFleuret,
            peakHour,
            favoriteDay,
            sessionsPerWeek,
            averageTimeBetweenMatches,
            consecutiveDays,
            activeDays,
            personalRecord: maxScore
        };
    }, [matchHistory]);
};