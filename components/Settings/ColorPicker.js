/**
 * @fileoverview Composant de sélection de couleurs avec un gradient interactif
 * 
 * Ce composant permet :
 * - La sélection de couleurs personnalisées via un gradient coloré
 * - La conversion automatique des couleurs en format utilisable
 * - L'affichage d'un curseur de sélection visuel
 * 
 * Fonctionnalités :
 * - Gradient personnalisable avec array de couleurs
 * - Gestion des événements touch pour la sélection
 * - Callback onColorChanged pour retourner la couleur sélectionnée
 * - Curseur circulaire indiquant la position sélectionnée
 */

import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import { StyleSheet, PanResponder } from 'react-native';
import Animated,
{
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    runOnJS,
} from 'react-native-reanimated';

const CIRCLE_PICKER_SIZE = 45;
const INTERNAL_PICKER_SIZE = CIRCLE_PICKER_SIZE / 2;

export const ColorPicker = ({ colors, start, end, style, maxWidth, onColorChanged }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startX = useSharedValue(0); // Position de départ du geste

    const adjustedTranslateX = useDerivedValue(() => {
        return Math.min(
            Math.max(translateX.value, 0),
            maxWidth - CIRCLE_PICKER_SIZE
        );
    });

    const handleColorChange = useCallback((color) => {
        if (onColorChanged) {
            onColorChanged(color);
        }
    }, [onColorChanged]);

    const currentColor = useDerivedValue(() => {
        const inputRange = colors.map(
            (_, index) => (index / (colors.length - 1)) * (maxWidth - CIRCLE_PICKER_SIZE)
        );

        const color = interpolateColor(
            adjustedTranslateX.value,
            inputRange,
            colors
        );

        runOnJS(handleColorChange)(color);
        return color;
    });

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,

        onPanResponderGrant: (evt) => {
            translateY.value = -20;
            // Sauvegarder la position de départ du geste
            startX.value = evt.nativeEvent.locationX;
        },

        onPanResponderMove: (evt, gestureState) => {
            // Calculer la nouvelle position basée sur le déplacement depuis le début du geste
            const newX = translateX.value + gestureState.dx;
            translateX.value = Math.max(0, Math.min(maxWidth - CIRCLE_PICKER_SIZE, newX));
        },

        onPanResponderRelease: () => {
            translateY.value = 0;
        },
    });

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: adjustedTranslateX.value },
                { translateY: translateY.value },
            ],
        };
    });

    const rInternalPickerStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: currentColor.value,
        };
    });

    return (
        <Animated.View style={{ justifyContent: 'center' }}>
            <LinearGradient
                colors={colors}
                start={start}
                end={end}
                style={style}
            />
            <Animated.View
                style={[styles.picker, rStyle]}
                {...panResponder.panHandlers}
            >
                <Animated.View
                    style={[styles.internalPicker, rInternalPickerStyle]}
                />
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    picker: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: CIRCLE_PICKER_SIZE,
        height: CIRCLE_PICKER_SIZE,
        borderRadius: CIRCLE_PICKER_SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    internalPicker: {
        width: INTERNAL_PICKER_SIZE,
        height: INTERNAL_PICKER_SIZE,
        borderRadius: INTERNAL_PICKER_SIZE / 2,
        borderWidth: 1.0,
        borderColor: 'rgba(0,0,0,0.2)',
    },
});
