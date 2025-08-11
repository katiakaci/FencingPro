/**
 * @fileoverview Hook personnalisé pour la gestion du compte à rebours
 * 
 * Ce hook gère :
 * - Le décompte avant le début d'un match
 * - La logique de démarrage/arrêt du timer
 * - La détection de fin de compte à rebours
 * - L'exécution d'un callback à la fin
 * 
 * Fonctionnalités :
 * - Compte à rebours configurable (par défaut 3 secondes)
 * - États isActive et isCompleted
 * - Fonctions start() et stop() pour contrôler le timer
 * - Callback automatique à la fin du décompte
 * - Reset automatique des valeurs
 * 
 * @param {number} initialCount - Nombre initial du décompte (défaut: 3)
 * @param {Function} onComplete - Callback exécuté à la fin du décompte
 * @returns {Object} État et contrôles du compte à rebours
 */
import { useState, useEffect, useCallback } from 'react';

export const useCountdown = (initialCount = 3, onComplete = null) => {
  const [count, setCount] = useState(initialCount);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isActive && count > 0) {
      const timer = setTimeout(() => {
        setCount(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isActive && count === 0 && !isCompleted) {
      setIsCompleted(true);
      setTimeout(() => {
        setIsActive(false);
        if (onComplete) onComplete();
      }, 1000);
    }
  }, [count, isActive, isCompleted, onComplete]);

  const start = useCallback(() => {
    setCount(initialCount);
    setIsActive(true);
    setIsCompleted(false);
  }, [initialCount]);

  const stop = useCallback(() => {
    setIsActive(false);
    setIsCompleted(false);
    setCount(initialCount);
  }, [initialCount]);

  return {
    count,
    isActive,
    isCompleted,
    start,
    stop,
  };
};