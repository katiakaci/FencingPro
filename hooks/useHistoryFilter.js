import { useMemo } from 'react';

export const useHistoryFilter = (matchHistory, filterBy, filterValue) => {
    return useMemo(() => {
        if (!matchHistory || filterBy === 'all' || !filterValue) {
            return matchHistory || [];
        }

        return matchHistory.filter(match => {
            switch (filterBy) {
                case 'weapon':
                    return match.weapon === filterValue;
                case 'player':
                    return match.players.toLowerCase().includes(filterValue.toLowerCase());
                case 'mode':
                    // Détecter le mode basé sur les joueurs
                    const isSolo = !match.players.includes(' vs ');
                    const mode = isSolo ? 'Solo' : 'Multi';
                    return mode === filterValue;
                default:
                    return true;
            }
        });
    }, [matchHistory, filterBy, filterValue]);
};

export const useAvailableFilters = (matchHistory) => {
    return useMemo(() => {
        if (!matchHistory) return { weapon: [], player: [], mode: [] };

        const weapons = [...new Set(matchHistory.map(match => match.weapon))];
        const players = [...new Set(
            matchHistory.flatMap(match => 
                match.players.includes(' vs ') 
                    ? match.players.split(' vs ')
                    : [match.players]
            )
        )];
        const modes = ['Solo', 'Multi'];

        return {
            weapon: weapons,
            player: players,
            mode: modes
        };
    }, [matchHistory]);
};