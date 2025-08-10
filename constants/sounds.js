/**
 * @fileoverview Configuration des sons d'alerte pour les touches
 * 
 * Ce fichier contient :
 * - La liste des sons disponibles avec leurs clés de traduction
 * - Les imports des fichiers audio pour React Native
 * - La correspondance entre noms de fichiers et assets
 * 
 * Utilisé par :
 * - AudioSettings : pour la sélection et prévisualisation
 * - SettingsScreen : pour la logique de lecture
 * - GameScreen : pour la lecture des sons de touche
 */

export const SOUNDS = [
  { name: 'sounds.classic', file: 'alert_touch.mp3' },
  { name: 'sounds.shortBeep', file: 'alert_touch2.mp3' },
  { name: 'sounds.signal', file: 'alert_touch3.mp3' },
  { name: 'sounds.bell', file: 'alert_touch4.mp3' },
  { name: 'sounds.sparkles', file: 'alert_touch5.mp3' },
  { name: 'sounds.cling', file: 'alert_touch6.mp3' },
  { name: 'sounds.threePoints', file: 'alert_touch7.mp3' },
  { name: 'sounds.bubbles', file: 'alert_touch8.mp3' },
  { name: 'sounds.doorbell', file: 'alert_touch9.mp3' },
];

export const SOUND_FILES = {
  'alert_touch.mp3': require('../assets/sound/alert_touch.mp3'),
  'alert_touch2.mp3': require('../assets/sound/alert_touch2.mp3'),
  'alert_touch3.mp3': require('../assets/sound/alert_touch3.mp3'),
  'alert_touch4.mp3': require('../assets/sound/alert_touch4.mp3'),
  'alert_touch5.mp3': require('../assets/sound/alert_touch5.mp3'),
  'alert_touch6.mp3': require('../assets/sound/alert_touch6.mp3'),
  'alert_touch7.mp3': require('../assets/sound/alert_touch7.mp3'),
  'alert_touch8.mp3': require('../assets/sound/alert_touch8.mp3'),
  'alert_touch9.mp3': require('../assets/sound/alert_touch9.mp3'),
};