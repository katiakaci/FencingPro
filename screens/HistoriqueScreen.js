import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Swipeable } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;

const initialMatchHistory = [];

const winsData = {
  labels: ['Alice', 'Bob', 'Charlie'],
  datasets: [{ data: [2, 4, 3] }],
};

const weaponData = [
  { name: 'Foil', population: 3, color: '#7bb6dd', legendFontColor: '#333', legendFontSize: 13 },
  { name: 'Épée', population: 2, color: '#4a90e2', legendFontColor: '#333', legendFontSize: 13 },
  { name: 'Sabre', population: 2, color: '#357ab7', legendFontColor: '#333', legendFontSize: 13 },
];

export default function HistoriqueScreen() {
  const [matchHistory, setMatchHistory] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const swipeRefs = useRef([]);

  // Charger les parties sauvegardées
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await AsyncStorage.getItem('matchHistory');
        if (data) setMatchHistory(JSON.parse(data));
      } catch (e) { }
    };
    loadHistory();
  }, []);

  // Sauvegarder après suppression
  useEffect(() => {
    AsyncStorage.setItem('matchHistory', JSON.stringify(matchHistory));
  }, [matchHistory]);

  const handleDelete = (index) => {
    if (swipeRefs.current[index]) {
      swipeRefs.current[index].close();
    }
    setTimeout(() => {
      setMatchHistory(prev => prev.filter((_, i) => i !== index));
    }, 100);
  };

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrapper} showsVerticalScrollIndicator={false}>
      {/* Title & Actions */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>HISTORY & STATISTICS</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="download-outline" size={22} color="#333" />
            <Text style={styles.actionText}>EXPORT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="refresh-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Bouton Trier */}
      <View style={styles.sortBar}>
        <TouchableOpacity style={styles.sortMenuBtn} onPress={() => setSortMenuVisible(true)}>
          <Ionicons name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} size={18} color="#357ab7" />
          <Text style={styles.sortMenuText}>Trier</Text>
          <Ionicons name="chevron-down" size={16} color="#357ab7" style={{ marginLeft: 2 }} />
        </TouchableOpacity>
        <Modal
          visible={sortMenuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSortMenuVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSortMenuVisible(false)}>
            <View style={styles.sortDropdown}>
              {sortOptions.map(opt => (
                <TouchableOpacity
                  key={opt.key}
                  style={styles.sortDropdownItem}
                  onPress={() => {
                    setSortBy(opt.key);
                    setSortMenuVisible(false);
                  }}
                >
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
      {/* Match History */}
      <Text style={styles.sectionTitle}>MATCH HISTORY</Text>
      <View style={styles.matchList}>
        {getSortedMatches().map((match, idx) => (
          <Swipeable
            key={idx}
            ref={ref => swipeRefs.current[idx] = ref}
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, idx)}
            rightThreshold={40}
          >
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
        ))}
      </View>
      {/* Statistiques */}
      <Text style={styles.sectionTitle}>STATISTICS</Text>
      <View style={styles.statsRow}>
        <View style={styles.statsBox}>
          <Text style={styles.statsLabel}>Victoire par joueur</Text>
          <BarChart
            data={winsData}
            width={screenWidth * 0.42}
            height={140}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={{ borderRadius: 12 }}
          />
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsLabel}>Armes utilisées</Text>
          <PieChart
            data={weaponData}
            width={screenWidth * 0.42}
            height={140}
            chartConfig={chartConfig}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={0}
            style={{ borderRadius: 12 }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(53, 122, 183, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
  barPercentage: 0.6,
  decimalPlaces: 0,
};

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
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ececec',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  actionText: {
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
    fontSize: 13,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statsBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    width: screenWidth * 0.44,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  statsLabel: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
  },
  deleteBox: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '90%',
    borderRadius: 12,
    // marginVertical: 5,
  },
});
