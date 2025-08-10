/**
 * @fileoverview Hook personnalisé pour le tri de l'historique
 * 
 * Ce hook gère :
 * - La logique de tri par date, durée et score
 * - L'ordre croissant/décroissant
 * - Le parsing des dates dans différents formats
 * - La conversion des durées et scores pour le tri
 */
import { useMemo } from 'react';

export const useHistorySort = (matchHistory, sortBy, sortOrder) => {
    const sortedMatches = useMemo(() => {
        if (!matchHistory || matchHistory.length === 0) return [];

        let sorted = [...matchHistory];

        if (sortBy === 'date') {
            sorted.sort((a, b) => {
                const parseDate = (dateStr) => {
                    if (dateStr.includes(', ')) {
                        const [datePart, timePart] = dateStr.split(', ');
                        const [day, month, year] = datePart.split('/');
                        const [hour, minute] = timePart.split(':');
                        return new Date(year, month - 1, day, hour, minute);
                    }

                    if (dateStr.includes(' PM') || dateStr.includes(' AM')) {
                        return new Date(dateStr);
                    }

                    return new Date(dateStr);
                };

                const dateA = parseDate(a.date);
                const dateB = parseDate(b.date);

                if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                    console.log('Date invalide:', a.date, b.date);
                    return 0;
                }

                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            });
        } else if (sortBy === 'duration') {
            const toSeconds = d => {
                const [min, sec] = d.split(':').map(Number);
                return min * 60 + sec;
            };
            sorted.sort((a, b) =>
                sortOrder === 'desc'
                    ? toSeconds(b.duration) - toSeconds(a.duration)
                    : toSeconds(a.duration) - toSeconds(b.duration)
            );
        } else if (sortBy === 'score') {
            const scoreSum = s => s.split('–').map(Number).reduce((a, b) => a + b, 0);
            sorted.sort((a, b) =>
                sortOrder === 'desc'
                    ? scoreSum(b.score) - scoreSum(a.score)
                    : scoreSum(a.score) - scoreSum(b.score)
            );
        }

        return sorted;
    }, [matchHistory, sortBy, sortOrder]);

    return sortedMatches;
};