<h1 align="center" style="font-size: 42px; margin-bottom: 10px;">
🤺 FencingPro 🤺
</h1>

**FencingPro** est une application mobile développée avec React Native permettant de gérer des matchs d’escrime en temps réel. Elle intègre un système de détection de touches sans fil grâce à la communication *Bluetooth Low Energy* (BLE) entre l’application et des modules électroniques intégrés à l’équipement.

<div align="center">
   <img src="assets/ReadMe/logo_512x512.png" alt="FencingPro" width="200" style="border-radius: 10px; margin-bottom: 20px;">
</div>

Disponible sur le *Google Play Store* : [Télécharger l’application](https://play.google.com/store/apps/details?id=com.katiakaci.Fencing&hl=fr_CA)

## Aperçu

Une application pensée pour les tireurs et entraîneurs : détection de touches sans fil, chronomètre, comptage automatique, historique et statistiques. 

| 🏠 Accueil | 🎮 Jeu | 📜 Historique |
|:-----------:|:------:|:--------------:|
| <img src="./assets/ReadMe/Menu.png" width="200" style="border-radius: 8px;"> | <img src="./assets/ReadMe/Jeu.png" width="200" style="border-radius: 8px;"> | <img src="./assets/ReadMe/Historique.png" width="200" style="border-radius: 8px;"> |

| ⚙️ Réglages | 📊 Statistiques | 🖥️ Configuration |
|:-----------:|:------:|:--------------:|
| <img src="./assets/ReadMe/Réglages.png" width="200" style="border-radius: 8px;"> | <img src="./assets/ReadMe/Statistiques.png" width="200" style="border-radius: 8px;"> | <img src="./assets/ReadMe/Configuration.png" width="200" style="border-radius: 8px;"> |

## Fonctionnalités principales

- Connexion Bluetooth Low Energy (BLE) à l'équipement *FencingPro*
- Détection de touches en temps réel avec mise à jour instantanée du score
- Chronomètre intégré avec commandes : démarrage, pause et reprise, accompagné d’alertes visuelles et sonores
- Modes solo et multijoueur
- Historique automatique de tous les matchs
- Gestion avancée de l’historique : tri, filtres, ajout manuel et suppression (swipe-to-delete)
- Statistiques visuelles : activité, progression, performance par arme, etc.
- Contrôle de l’équipement depuis les paramètres de l’application :
   - Activation/désactivation de la vibration du moteur
  - Changement de la couleur des LEDs
- Personnalisation de la sonnerie lors d’une touche détectée
- Application disponible en 10 langues : anglais, français, espagnol, italien, allemand, chinois simplifié, arabe, turc, japonais et portugais

## Architecture électronique
Le système repose sur deux modules électroniques sans fil :
- Module de l’arme (détection de touches)
- Module central (réception, traitement et envoi des données à l’application)

Les deux modules utilisent un Seeeduino XIAO nRF52840, choisi pour sa prise en charge native du Bluetooth Low Energy (BLE), sa faible consommation énergétique et son format très compact, permettant une intégration dans une poignée et un boîtier d’escrime.

### Alimentation
Chaque module est alimenté par :
- une batterie Li-Po 3.7V,
- un module de gestion de charge intégré dans le XIAO, permettant la recharge via USB-C.

## Améliorations futures
- Système d'authentification / sauvegarde cloud : Intégrer Firebase pour synchroniser l'historique et les statistiques
- Export CSV / partage des statistiques

  
## Démonstration

Voici une courte vidéo montrant le fonctionnement réel du système FencingPro :  

https://github.com/user-attachments/assets/cf1a7072-cc4e-4943-9f64-2356af189aff

Lorsqu’une touche est détectée, la lumière s’allume et le moteur vibre.


## Crédits
Ce projet a été réalisé dans le cadre d’un projet de fin d’études en génie logiciel à l’ÉTS. Contributeurs :
- Vincent Martins Dos Santos (Conception électronique et mécanique)
- Jacob Curiel-Garfias (Conception électronique et mécanique)
- Katia Kaci (Programmation et développement mobile)
