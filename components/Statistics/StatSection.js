/**
 * @fileoverview Composant de section de statistiques groupées
 * 
 * Ce composant gère :
 * - L'organisation des statistiques en sections thématiques
 * - L'affichage d'un titre de section et de cartes statistiques
 * - La mise en page responsive des cartes en grille
 * - La standardisation de l'affichage des groupes de stats
 * 
 * Fonctionnalités :
 * - Titre de section personnalisable
 * - Grille flexible de cartes statistiques
 * - Support de styles personnalisés
 * - Layout automatique en 2 colonnes
 * 
 * @param {string} title - Titre de la section
 * @param {Array} stats - Tableau des statistiques à afficher
 * @param {Object} style - Styles personnalisés (optionnel)
 */
import React from 'react';
import { View, Text } from 'react-native';
import StatCard from './StatCard';

const StatSection = ({ title, stats, style }) => {
    return (
        <View style={[{ marginBottom: 25 }, style]}>
            <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#2c3e50',
                marginBottom: 15,
                textAlign: 'left',
                paddingLeft: 5,
            }}>
                {title}
            </Text>
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
            }}>
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        value={stat.value}
                        label={stat.label}
                        color={stat.color}
                    />
                ))}
            </View>
        </View>
    );
};

export default StatSection;