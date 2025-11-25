/**
 * @fileoverview Modal pour ajouter manuellement un match à l'historique
 * 
 * Ce composant permet :
 * - D'ajouter un match passé manuellement
 * - De saisir tous les détails du match (date, joueurs, arme, score, durée)
 * - De valider les entrées avant l'ajout
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import i18n from '../../languages/i18n';
import { GameModal } from '../Game/Modal';

export const AddMatchModal = ({ visible, onClose, onAddMatch }) => {
  const [mode, setMode] = useState('solo');
  const [playerName, setPlayerName] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [weapon, setWeapon] = useState('Épée');
  const [weapon2, setWeapon2] = useState('Épée');
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [durationSeconds, setDurationSeconds] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });

  const weaponOptions = [
    { key: 'Épée', label: i18n.t('weapons.epee') },
    { key: 'Fleuret', label: i18n.t('weapons.foil') }
  ];

  const resetForm = () => {
    setMode('solo');
    setPlayerName('');
    setPlayer2Name('');
    setWeapon('Épée');
    setWeapon2('Épée');
    setScore1('');
    setScore2('');
    setDurationMinutes('');
    setDurationSeconds('');
    setDate(new Date());
  };

  const handleSubmit = () => {
    if (mode === 'solo' && !playerName.trim()) {
      setErrorModal({ visible: true, message: i18n.t('addMatch.errorPlayerName') });
      return;
    }

    if (mode === 'multi' && !playerName.trim()) {
      setErrorModal({ visible: true, message: i18n.t('addMatch.errorPlayer1Name') });
      return;
    }

    if (mode === 'multi' && !player2Name.trim()) {
      setErrorModal({ visible: true, message: i18n.t('addMatch.errorPlayer2Name') });
      return;
    }

    if (!score1 || (mode === 'multi' && !score2)) {
      setErrorModal({ visible: true, message: i18n.t('addMatch.errorScore') });
      return;
    }

    const minutes = parseInt(durationMinutes) || 0;
    const seconds = parseInt(durationSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds === 0) {
      setErrorModal({ visible: true, message: i18n.t('addMatch.errorDuration') });
      return;
    }

    // Formater la date
    const formattedDate = date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Formater la durée
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Formater les joueurs et le score
    const players = mode === 'solo'
      ? playerName.trim()
      : `${playerName.trim()} vs ${player2Name.trim()}`;

    const score = mode === 'solo'
      ? score1
      : `${score1}–${score2}`;

    const finalWeapon = mode === 'solo' ? weapon : `${weapon} vs ${weapon2}`;

    const matchData = {
      date: formattedDate,
      players,
      weapon: finalWeapon,
      score,
      duration: formattedDuration,
    };

    onAddMatch(matchData);
    resetForm();
    onClose();
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{i18n.t('addMatch.title')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Mode de jeu */}
            <Text style={[styles.sectionTitle, { marginTop: 0 }]}>{i18n.t('addMatch.gameMode')}</Text>
            <View style={styles.modeContainer}>
              <TouchableOpacity
                style={[styles.modeButton, mode === 'solo' && styles.modeButtonActive]}
                onPress={() => setMode('solo')}
              >
                <Text style={[styles.modeText, mode === 'solo' && styles.modeTextActive]}>
                  {i18n.t('addMatch.solo')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, mode === 'multi' && styles.modeButtonActive]}
                onPress={() => setMode('multi')}
              >
                <Text style={[styles.modeText, mode === 'multi' && styles.modeTextActive]}>
                  {i18n.t('addMatch.multi')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Joueurs */}
            <Text style={styles.sectionTitle}>{mode === 'solo' ? i18n.t('addMatch.player') : i18n.t('addMatch.players')}</Text>
            <TextInput
              style={styles.input}
              placeholder={mode === 'solo' ? i18n.t('setup.playerName') : i18n.t('addMatch.player1Placeholder')}
              value={playerName}
              onChangeText={setPlayerName}
            />
            {mode === 'multi' && (
              <TextInput
                style={styles.input}
                placeholder={i18n.t('addMatch.player2Placeholder')}
                value={player2Name}
                onChangeText={setPlayer2Name}
              />
            )}

            {/* Arme */}
            <Text style={styles.sectionTitle}>{mode === 'solo' ? i18n.t('addMatch.weapon') : i18n.t('addMatch.weaponPlayer1')}</Text>
            <View style={styles.weaponContainer}>
              {weaponOptions.map((w) => (
                <TouchableOpacity
                  key={w.key}
                  style={[styles.weaponButton, weapon === w.key && styles.weaponButtonActive]}
                  onPress={() => setWeapon(w.key)}
                >
                  <Text style={[styles.weaponText, weapon === w.key && styles.weaponTextActive]}>
                    {w.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Arme Joueur 2 (seulement en mode multi) */}
            {mode === 'multi' && (
              <>
                <Text style={styles.sectionTitle}>{i18n.t('addMatch.weaponPlayer2')}</Text>
                <View style={styles.weaponContainer}>
                  {weaponOptions.map((w) => (
                    <TouchableOpacity
                      key={w.key}
                      style={[styles.weaponButton, weapon2 === w.key && styles.weaponButtonActive]}
                      onPress={() => setWeapon2(w.key)}
                    >
                      <Text style={[styles.weaponText, weapon2 === w.key && styles.weaponTextActive]}>
                        {w.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Score */}
            <Text style={styles.sectionTitle}>{i18n.t('addMatch.score')}</Text>
            <View style={styles.scoreContainer}>
              <TextInput
                style={styles.scoreInput}
                placeholder={mode === 'solo' ? i18n.t('addMatch.scorePlaceholder') : i18n.t('addMatch.scorePlayer1Placeholder')}
                value={score1}
                onChangeText={setScore1}
                keyboardType="numeric"
              />
              {mode === 'multi' && (
                <>
                  <Text style={styles.scoreSeparator}>–</Text>
                  <TextInput
                    style={styles.scoreInput}
                    placeholder={i18n.t('addMatch.scorePlayer2Placeholder')}
                    value={score2}
                    onChangeText={setScore2}
                    keyboardType="numeric"
                  />
                </>
              )}
            </View>

            {/* Durée */}
            <Text style={styles.sectionTitle}>{i18n.t('addMatch.duration')}</Text>
            <View style={styles.durationContainer}>
              <TextInput
                style={styles.durationInput}
                placeholder={i18n.t('addMatch.minutes')}
                value={durationMinutes}
                onChangeText={setDurationMinutes}
                keyboardType="numeric"
              />
              <Text style={styles.durationSeparator}>:</Text>
              <TextInput
                style={styles.durationInput}
                placeholder={i18n.t('addMatch.seconds')}
                value={durationSeconds}
                onChangeText={(text) => {
                  const seconds = parseInt(text) || 0;
                  if (seconds < 60 || text === '') {
                    setDurationSeconds(text);
                  }
                }}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>

            {/* Date et Heure */}
            <Text style={styles.sectionTitle}>{i18n.t('addMatch.dateAndTime')}</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#357ab7" />
                <Text style={styles.dateTimeText}>
                  {date.toLocaleDateString('fr-FR')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color="#357ab7" />
                <Text style={styles.dateTimeText}>
                  {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onTimeChange}
              />
            )}

            {/* Boutons d'action */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  resetForm();
                  onClose();
                }}
              >
                <Text style={styles.cancelButtonText}>{i18n.t('addMatch.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>{i18n.t('addMatch.add')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      <GameModal
        visible={errorModal.visible}
        title={i18n.t('common.error')}
        subtitle={errorModal.message}
        titleStyle={{ color: '#e74c3c' }}
        buttons={[
          {
            text: 'OK',
            icon: 'checkmark-circle',
            textColor: '#fff',
            style: { backgroundColor: '#357ab7' },
            onPress: () => setErrorModal({ visible: false, message: '' })
          }
        ]}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#357ab7',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#357ab7',
  },
  modeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#357ab7',
  },
  modeTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  weaponContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  weaponButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7bb6dd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  weaponButtonActive: {
    backgroundColor: '#7bb6dd',
  },
  weaponText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7bb6dd',
  },
  weaponTextActive: {
    color: '#fff',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scoreInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  scoreSeparator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  durationInput: {
    width: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  durationSeparator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#357ab7',
    backgroundColor: '#f0f7ff',
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#357ab7',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 25,
    marginBottom: 50,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e74c3c',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#27ae60',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
