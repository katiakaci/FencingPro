import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const winsData = {
  labels: ['Alice', 'Bob', 'Charlie'],
  datasets: [{ data: [2, 4, 3] }],
};

const weaponData = [
  { name: 'Foil', population: 3, color: '#7bb6dd', legendFontColor: '#333', legendFontSize: 13 },
  { name: 'Épée', population: 2, color: '#4a90e2', legendFontColor: '#333', legendFontSize: 13 },
  { name: 'Sabre', population: 2, color: '#357ab7', legendFontColor: '#333', legendFontSize: 13 },
];

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(53, 122, 183, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
  barPercentage: 0.6,
  decimalPlaces: 0,
};

export default function StatistiquesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrapper}>
      <Text style={styles.title}>STATISTIQUES</Text>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  contentWrapper: {
    padding: 18,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
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
});