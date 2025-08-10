import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useHistory } from '../context/HistoryContext';
import { useFocusEffect } from '@react-navigation/native';
import { useHistorySort } from '../hooks/useHistorySort';
import { useHistoryFilter, useAvailableFilters } from '../hooks/useHistoryFilter';
import { SortMenu } from '../components/History/SortMenu';
import { FilterMenu } from '../components/History/FilterMenu';
import { MatchCard } from '../components/History/MatchCard';
import { EmptyState } from '../components/History/EmptyState';
import { NoFilterResults } from '../components/History/NoFilterResults';

export default function HistoriqueScreen() {
  const { matchHistory, deleteMatch, loadHistory } = useHistory();

  // États pour le tri
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  // États pour le filtrage
  const [filterBy, setFilterBy] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const swipeRefs = useRef([]);

  // Recharger quand l'écran devient actif
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  // Filtres disponibles
  const availableFilters = useAvailableFilters(matchHistory);

  const filteredMatches = useHistoryFilter(matchHistory, filterBy, filterValue);
  const sortedMatches = useHistorySort(filteredMatches, sortBy, sortOrder);

  const handleDelete = useCallback((sortedIndex, originalIndex) => {
    if (swipeRefs.current[sortedIndex]) {
      swipeRefs.current[sortedIndex].close();
    }
    setTimeout(() => {
      deleteMatch(originalIndex);
    }, 100);
  }, [deleteMatch]);

  const clearFilter = () => {
    setFilterBy('all');
    setFilterValue('');
  };

  // Si l'historique est complètement vide
  if (matchHistory.length === 0) {
    return <EmptyState />;
  }

  // Si on a des matchs mais aucun ne correspond aux filtres
  const hasActiveFilter = filterBy !== 'all' && filterValue;
  const noResultsFromFilter = hasActiveFilter && sortedMatches.length === 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrapper}>
      {/* Barre de contrôles - toujours visible s'il y a des matchs dans l'historique */}
      <View style={styles.controlsBar}>
        <FilterMenu
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          filterMenuVisible={filterMenuVisible}
          setFilterMenuVisible={setFilterMenuVisible}
          availableFilters={availableFilters}
        />

        <SortMenu
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          sortMenuVisible={sortMenuVisible}
          setSortMenuVisible={setSortMenuVisible}
        />
      </View>

      {/* Contenu principal */}
      <View style={styles.matchList}>
        {noResultsFromFilter ? (
          <NoFilterResults
            onClearFilter={clearFilter}
            filterBy={filterBy}
            filterValue={filterValue}
          />
        ) : (
          sortedMatches.map((match, sortedIndex) => {
            // Trouver l'index original du match dans l'historique non trié
            const originalIndex = matchHistory.findIndex(originalMatch =>
              originalMatch.date === match.date &&
              originalMatch.players === match.players &&
              originalMatch.score === match.score &&
              originalMatch.duration === match.duration
            );

            return (
              <MatchCard
                key={`${match.date}-${match.players}-${sortedIndex}`}
                ref={ref => swipeRefs.current[sortedIndex] = ref}
                match={match}
                index={sortedIndex}
                originalIndex={originalIndex}
                onDelete={handleDelete}
              />
            );
          })
        )}
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
  controlsBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 2,
  },
  matchList: {
    marginBottom: 10,
  },
});
