/**
 * @fileoverview Composant de carte statistique individuelle
 * 
 * Ce composant gère :
 * - L'affichage d'une statistique unique (valeur + label)
 * - Le formatage visuel avec ombre et bordures arrondies
 * - La personnalisation des couleurs pour les valeurs
 * - L'adaptation du texte selon la longueur du label
 * 
 * Fonctionnalités :
 * - Design de carte avec ombre portée
 * - Valeur en grand format et label descriptif
 * - Support des couleurs personnalisées
 * - Hauteur minimale pour uniformité
 * - Centrage automatique du contenu
 * 
 * @param {string|number} value - Valeur statistique à afficher
 * @param {string} label - Label descriptif de la statistique
 * @param {string} color - Couleur personnalisée de la valeur (optionnel)
 * @param {Object} style - Styles personnalisés (optionnel)
 */
import React from 'react';
import { View, Text } from 'react-native';

const StatCard = ({ value, label, color, style }) => {
    return (
        <View style={[{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 12,
            width: '48%',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            marginBottom: 15,
            minHeight: 90,
            justifyContent: 'space-between',
        }, style]}>
            <Text style={[{
                fontSize: 24,
                fontWeight: 'bold',
                color: color || '#4a90e2',
                marginBottom: 3,
            }]}>
                {value}
            </Text>
            <Text style={{
                fontSize: 14,
                color: '#666',
                textAlign: 'center',
                lineHeight: 13,
                paddingHorizontal: 4,
                paddingVertical: 2,
                flex: 1,
                flexWrap: 'wrap',
            }}>
                {label}
            </Text>
        </View>
    );
};

export default StatCard;