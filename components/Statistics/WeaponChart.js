/**
 * @fileoverview Composant de graphique circulaire pour les armes utilisées
 * 
 * Ce composant gère :
 * - L'affichage d'un graphique en secteurs des armes utilisées
 * - La visualisation de la répartition des matchs par arme
 * - L'utilisation de react-native-chart-kit pour le rendu
 * - La configuration des couleurs et du style du graphique
 * 
 * Fonctionnalités :
 * - Graphique PieChart responsive
 * - Données automatiquement calculées depuis l'historique
 * - Style cohérent avec le design de l'app
 * - Support des données vides
 * 
 * @param {Array} matchHistory - Historique des matchs
 * @param {Object} style - Styles personnalisés (optionnel)
 */
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useWeaponData } from '../../hooks/useChartData';
import i18n from '../../languages/i18n';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(53, 122, 183, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    barPercentage: 0.6,
    decimalPlaces: 1,
    propsForLabels: {
        fontSize: 11,
    },
};

const WeaponChart = ({ matchHistory, style }) => {
    const weaponData = useWeaponData(matchHistory);

    return (
        <View style={[{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 15,
            width: '100%',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            marginBottom: 20,
            overflow: 'hidden',
        }, style]}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: 15, textAlign: 'center' }}>
                {i18n.t('stats.weaponsUsed')}
            </Text>
            <PieChart
                data={weaponData}
                width={screenWidth * 0.85}
                height={180}
                chartConfig={chartConfig}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={15}
                center={[10, 0]}
                style={{ borderRadius: 8 }}
            />
        </View>
    );
};

export default WeaponChart;