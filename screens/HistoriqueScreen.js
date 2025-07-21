import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { useHistory } from '../context/HistoryContext';
import { useFocusEffect } from '@react-navigation/native';

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

  const handleDelete = (index) => {
    if (swipeRefs.current[index]) {
      swipeRefs.current[index].close();
    }
    setTimeout(() => {
      deleteMatch(index);
    }, 100);
  };

  // Si l'historique est vide
  if (matchHistory.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>Aucun match sauvegardé</Text>
        <Text style={styles.emptySubtext}>Vos parties terminées apparaîtront ici</Text>
      </View>
    );
  }

  // Tri
  const getSortedMatches = () => {
    let sorted = [...matchHistory];
    if (sortBy === 'date') {
      sorted.sort((a, b) => {
        const da = new Date(a.date.split(', ')[1]);
        const db = new Date(b.date.split(', ')[1]);
        return sortOrder === 'desc' ? db - da : da - db;
      });
    } else if (sortBy === 'duration') {
      const toSeconds = d => {
        const [min, sec] = d.split(':').map(Number);
        return min * 60 + sec;
      };
      sorted.sort((a, b) => sortOrder === 'desc' ? toSeconds(b.duration) - toSeconds(a.duration) : toSeconds(a.duration) - toSeconds(b.duration));
    } else if (sortBy === 'score') {
      const scoreSum = s => s.split('–').map(Number).reduce((a, b) => a + b, 0);
      sorted.sort((a, b) => sortOrder === 'desc' ? scoreSum(b.score) - scoreSum(a.score) : scoreSum(a.score) - scoreSum(b.score));
    }
    return sorted;
  };

  const sortOptions = [
    { key: 'date', label: 'Date' },
    { key: 'duration', label: 'Durée' },
    { key: 'score', label: 'Score' },
  ];

  const renderRightActions = (progress, dragX, index) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.7],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity style={styles.deleteBox} onPress={() => handleDelete(index)}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash" size={28} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const sortedMatches = getSortedMatches();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrapper}>

      {/* Bouton Trier - seulement si il y a des matchs */}
      {sortedMatches.length > 0 && (
        <View style={styles.sortBar}>
          <TouchableOpacity style={styles.sortMenuBtn} onPress={() => setSortMenuVisible(true)}>
            <Ionicons name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} size={18} color="#357ab7" />
            <Text style={styles.sortMenuText}>Trier</Text>
            <Ionicons name="chevron-down" size={16} color="#357ab7" />
          </TouchableOpacity>

          <Modal visible={sortMenuVisible} transparent animationType="fade" onRequestClose={() => setSortMenuVisible(false)}>
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setSortMenuVisible(false)}>
              <View style={styles.sortDropdown}>
                {sortOptions.map(opt => (
                  <TouchableOpacity key={opt.key} style={styles.sortDropdownItem} onPress={() => { setSortBy(opt.key); setSortMenuVisible(false); }}>
                    <Text style={[styles.sortDropdownText, sortBy === opt.key && { color: '#357ab7', fontWeight: 'bold' }]}>{opt.label}</Text>
                  </TouchableOpacity>
                ))}
                <View style={styles.sortOrderRow}>
                  <TouchableOpacity onPress={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')} style={styles.sortOrderBtn}>
                    <Ionicons name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} size={16} color="#357ab7" />
                    <Text style={styles.sortOrderText}>{sortOrder === 'desc' ? 'Décroissant' : 'Croissant'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      )}

      {/* Liste des matchs ou message vide */}
      <View style={styles.matchList}>
        {sortedMatches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Aucun match sauvegardé</Text>
            <Text style={styles.emptySubtext}>Vos parties terminées apparaîtront ici</Text>
          </View>
        ) : (
          sortedMatches.map((match, idx) => (
            <Swipeable key={idx} ref={ref => swipeRefs.current[idx] = ref} renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, idx)}>
              <View style={styles.matchCard}>
                <View style={styles.matchRow}>
                  <View>
                    <Text style={styles.matchPlayers}>{match.players}</Text>
                    <Text style={styles.matchWeapon}>{match.weapon}</Text>
                    <Text style={styles.matchDuration}>{match.duration}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.matchScore}>{match.score}</Text>
                    <Text style={styles.matchDate}>{match.date}</Text>
                  </View>
                </View>
              </View>
            </Swipeable>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 2,
  },
  sortMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ececec',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sortMenuText: {
    color: '#357ab7',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 6,
    marginRight: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortDropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 4,
  },
  sortDropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sortDropdownText: {
    fontSize: 14,
    color: '#333',
  },
  sortOrderRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sortOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortOrderText: {
    color: '#357ab7',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginTop: 18,
    marginBottom: 8,
  },
  matchList: {
    marginBottom: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  matchPlayers: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  matchWeapon: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  matchDuration: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  matchScore: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#357ab7',
  },
  matchDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    textAlign: 'right',
  },
  deleteBox: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '90%',
    borderRadius: 12,
  },
});
