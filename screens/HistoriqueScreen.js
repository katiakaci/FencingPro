import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useHistory } from '../context/HistoryContext';
import { useFocusEffect } from '@react-navigation/native';
import { useHistorySort } from '../hooks/useHistorySort';
import { SortMenu } from '../components/History/SortMenu';
import { MatchCard } from '../components/History/MatchCard';
import { EmptyState } from '../components/History/EmptyState';

export default function HistoriqueScreen() {
  const { matchHistory, deleteMatch, loadHistory } = useHistory();
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const swipeRefs = useRef([]);

  // Recharger quand l'écran devient actif
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  // Tri des matchs avec le hook personnalisé
  const sortedMatches = useHistorySort(matchHistory, sortBy, sortOrder);

  const handleDelete = useCallback((index) => {
    if (swipeRefs.current[index]) {
      swipeRefs.current[index].close();
    }
    setTimeout(() => {
      deleteMatch(index);
    }, 100);
  }, [deleteMatch]);

  // Si l'historique est vide
  if (matchHistory.length === 0) {
    return <EmptyState />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrapper}>
      {/* Menu de tri - seulement si il y a des matchs */}
      {sortedMatches.length > 0 && (
        <SortMenu
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          sortMenuVisible={sortMenuVisible}
          setSortMenuVisible={setSortMenuVisible}
        />
      )}

      {/* Liste des matchs */}
      <View style={styles.matchList}>
        {sortedMatches.length === 0 ? (
          <EmptyState />
        ) : (
          sortedMatches.map((match, idx) => (
            <MatchCard
              key={idx}
              ref={ref => swipeRefs.current[idx] = ref}
              match={match}
              index={idx}
              onDelete={handleDelete}
            />
          ))
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
  matchList: {
    marginBottom: 10,
  },
});
