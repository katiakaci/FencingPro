/**
 * @fileoverview Composant de graphique linéaire pour l'activité quotidienne
 * 
 * Ce composant gère :
 * - L'affichage d'un graphique linéaire de l'activité par jour
 * - La visualisation de deux métriques : nombre de matchs et durée totale
 * - Les légendes interactives pour activer/désactiver les courbes
 * - Le défilement horizontal pour les longues périodes
 * 
 * Fonctionnalités :
 * - Graphique LineChart avec courbes multiples
 * - Basculement interactif des données (matchs/durée)
 * - Légendes cliquables avec indicateurs visuels
 * - Défilement horizontal pour navigation temporelle
 * - Style Bézier pour des courbes lissées
 * - Responsive design avec calcul automatique de largeur
 * 
 * @param {Array} matchHistory - Historique des matchs
 * @param {boolean} showScore - Afficher la courbe des matchs
 * @param {Function} setShowScore - Basculer l'affichage des matchs
 * @param {boolean} showDuration - Afficher la courbe de durée
 * @param {Function} setShowDuration - Basculer l'affichage de la durée
 * @param {Object} style - Styles personnalisés (optionnel)
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useDailyPerformanceData } from '../../hooks/useChartData';
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

const DailyActivityChart = ({ matchHistory, showScore, setShowScore, showDuration, setShowDuration, style }) => {
    const dailyData = useDailyPerformanceData(matchHistory, showScore, showDuration);

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
            <Text style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#333',
                marginBottom: 15,
                textAlign: 'center',
            }}>
                {i18n.t('stats.dailyActivity')}
            </Text>

            {/* Légendes interactives */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 15,
                width: '100%',
                flexWrap: 'wrap',
                paddingHorizontal: 10,
            }}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        marginHorizontal: 4,
                        marginVertical: 2,
                        flex: 0,
                        minWidth: 100,
                        maxWidth: 140,
                    }}
                    onPress={() => setShowScore(!showScore)}
                >
                    <View style={[{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginRight: 5,
                    }, {
                        backgroundColor: showScore ? 'rgba(46, 204, 113, 1)' : 'rgba(46, 204, 113, 0.3)'
                    }]} />
                    <Text style={[{
                        fontSize: 11,
                        color: '#333',
                        fontWeight: '500',
                        flex: 1,
                        textAlign: 'center',
                    }, {
                        opacity: showScore ? 1 : 0.5
                    }]}>{i18n.t('stats.numberOfMatches')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        marginHorizontal: 4,
                        marginVertical: 2,
                        flex: 0,
                        minWidth: 100,
                        maxWidth: 140,
                    }}
                    onPress={() => setShowDuration(!showDuration)}
                >
                    <View style={[{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginRight: 5,
                    }, {
                        backgroundColor: showDuration ? 'rgba(231, 76, 60, 1)' : 'rgba(231, 76, 60, 0.3)'
                    }]} />
                    <Text style={[{
                        fontSize: 11,
                        color: '#333',
                        fontWeight: '500',
                        flex: 1,
                        textAlign: 'center',
                    }, {
                        opacity: showDuration ? 1 : 0.5
                    }]}>{i18n.t('stats.totalTimeMin')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <LineChart
                    data={dailyData}
                    width={screenWidth * 1.5}
                    height={200}
                    chartConfig={chartConfig}
                    bezier
                    style={{ borderRadius: 8 }}
                />
            </ScrollView>
        </View>
    );
};

export default DailyActivityChart;