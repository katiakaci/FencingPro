# Commandes
adb pair 192.168.1.163:

nvm use 20.17.0
npx expo run:android (rebuild complètement)
npx expo start (expiré)
npx expo start --dev-client (si on touche pas au natif)

Verifier packages inutilisé:
npm install -g npm-check
npm-check

# Pour Vincent
## Supprimer tous les caches Gradle
rm -rf ~/.gradle/caches
rm -rf ~/.gradle/wrapper
rm -rf /home/vincent-steamovap/fencing_pro/FencingPro/android/.gradle

## Nettoyer le projet
cd /home/vincent-steamovap/fencing_pro/FencingPro
rm -rf node_modules
rm -rf android/build
rm -rf android/app/build

## Réinstaller les dépendances Node
npm install

## Nettoyer le cache npm
npm cache clean --force

## Supprimer les dossiers Android/iOS existants
rm -rf android ios

## Régénérer les fichiers natifs
npx expo prebuild --clean --platform android

# Palette de couleurs :
#ffe270 jaune

# TODO
1. historique ✅
2. statistiques ❗
5. ui
6. traduire eng ✅
7. afficher charge de la batterie ❗
8. connexion firebase ❗
9. enlever menu hamburger ✅
11. si microcontroleur déconnecté, afficher modale d'erreur (à tester)❗
12. donner possibilité au user dajouter nouvel appareil ❗
15. mettre sur le store ❗
16. logo app ❗
18. améliorer ui des modales ❗
