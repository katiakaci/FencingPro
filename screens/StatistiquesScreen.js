import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useHistory } from '../context/HistoryContext';
import { useStatistics } from '../hooks/useStatistics';
import PlayerChart from '../components/Statistics/PlayerChart';
import DailyActivityChart from '../components/Statistics/DailyActivityChart';
import WeaponChart from '../components/Statistics/WeaponChart';
import StatSection from '../components/Statistics/StatSection';
import i18n from '../languages/i18n';

export default function StatistiquesScreen() {
    const { matchHistory, loadHistory } = useHistory();
    const [showScore, setShowScore] = useState(true);
    const [showDuration, setShowDuration] = useState(true);

    const stats = useStatistics(matchHistory);

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [loadHistory])
    );

    if (!matchHistory || matchHistory.length === 0) {
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentWrapper}>
                <View style={styles.statsBox}>
                    <Text style={styles.statsLabel}>Aucune donnée disponible</Text>
                    <Text style={styles.noDataText}>Jouez quelques matchs pour voir vos statistiques ici</Text>
                </View>
            </ScrollView>
        );
    }

    const basicStats = [
        { value: stats.matchesPlayed, label: i18n.t('stats.matchesPlayed') },
        { value: stats.averageDuration, label: i18n.t('stats.averageDuration') },
        { value: stats.totalDuration, label: i18n.t('stats.totalDuration') },
        { value: stats.longestMatch, label: i18n.t('stats.longestMatch') },
        { value: stats.shortestMatch, label: i18n.t('stats.shortestMatch') },
        { value: stats.mostUsedWeapon, label: i18n.t('stats.favoriteWeapon') },
    ];

    const performanceStats = [
        { value: stats.touchesPerMinute, label: i18n.t('stats.touchesPerMinute') },
        { value: stats.personalRecord, label: i18n.t('stats.personalRecord') },
        { value: stats.touchesEpee, label: 'Touches avec Épée' },
        { value: stats.touchesFleuret, label: 'Touches avec Fleuret' },
    ];

    const temporalStats = [
        { value: stats.peakHour, label: i18n.t('stats.peakHour') },
        { value: stats.favoriteDay, label: i18n.t('stats.favoriteDay') },
        { value: stats.sessionsPerWeek, label: i18n.t('stats.sessionsPerWeek') },
        { value: stats.averageTimeBetweenMatches, label: i18n.t('stats.averageTimeBetweenMatches') },
        { value: stats.consecutiveDays, label: i18n.t('stats.consecutiveDays') },
        { value: stats.activeDays, label: i18n.t('stats.activeDays') },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentWrapper}>
            <PlayerChart matchHistory={matchHistory} />

            <DailyActivityChart
                matchHistory={matchHistory}
                showScore={showScore}
                setShowScore={setShowScore}
                showDuration={showDuration}
                setShowDuration={setShowDuration}
            />

            <WeaponChart matchHistory={matchHistory} />

            <StatSection title={i18n.t('stats.sections.basicStats')} stats={basicStats} />
            <StatSection title={i18n.t('stats.sections.performanceStats')} stats={performanceStats} />
            <StatSection title={i18n.t('stats.sections.temporalStats')} stats={temporalStats} />

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
    statsBox: {
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
    },
    statsLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    noDataText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
        padding: 20,
    },
});