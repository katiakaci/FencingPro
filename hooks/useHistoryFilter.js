/**
 * @fileoverview Hook personnalisé pour le filtrage de l'historique
 * 
 * Ce hook gère :
 * - Le filtrage multiple de l'historique des matchs
 * - La logique ET entre différents types de filtres
 * - L'extraction des valeurs de filtres disponibles
 * - Le support des filtres par arme, joueur et mode
 * 
 * Fonctionnalités :
 * - Filtrage par arme (Épée, Fleuret, Sabre)
 * - Filtrage par joueur (recherche partielle)
 * - Filtrage par mode (Solo/Multi)
 * - Combinaison multiple de filtres
 * - Génération automatique des options disponibles
 * 
 * @param {Array} matchHistory - Historique des matchs à filtrer
 * @param {Object} activeFilters - Filtres actifs par catégorie
 * @returns {Array} Historique filtré selon les critères sélectionnés
 */
import { useMemo } from 'react';

export const useHistoryFilter = (matchHistory, activeFilters) => {
    return useMemo(() => {
        if (!matchHistory || !activeFilters || Object.keys(activeFilters).length === 0) {
            return matchHistory || [];
        }

        return matchHistory.filter(match => {
            // Vérifier chaque type de filtre actif
            for (const [filterType, filterValues] of Object.entries(activeFilters)) {
                if (!filterValues || filterValues.length === 0) continue;

                let matchesFilter = false;

                switch (filterType) {
                    case 'weapon':
                        matchesFilter = filterValues.includes(match.weapon);
                        break;
                    case 'player':
                        const playerNames = match.players.includes(' vs ')
                            ? match.players.split(' vs ')
                            : [match.players];
                        matchesFilter = filterValues.some(filterPlayer =>
                            playerNames.some(playerName =>
                                playerName.toLowerCase().includes(filterPlayer.toLowerCase())
                            )
                        );
                        break;
                    case 'mode':
                        const isSolo = !match.players.includes(' vs ');
                        const mode = isSolo ? 'Solo' : 'Multi';
                        matchesFilter = filterValues.includes(mode);
                        break;
                }

                if (!matchesFilter) {
                    return false;
                }
            }

            return true;
        });
    }, [matchHistory, activeFilters]);
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