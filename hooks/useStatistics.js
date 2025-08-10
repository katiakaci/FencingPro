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
            const score = activity.matches * 2 + activity.duration / 60;
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
};