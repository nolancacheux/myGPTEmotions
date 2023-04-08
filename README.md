# NolanGPTEmotions

<img src="/client/photos/explication1.JPG" alt="Explication"/>

## Analyseur d'émotions et générateur de recommandations

Ce projet est une application web qui analyse les émotions des personnes sur les photos et génère des recommandations personnalisées basées sur ces émotions. Les utilisateurs peuvent télécharger des images ou prendre des photos à partir de leur webcam. L'application utilise un modèle d'intelligence artificielle pour détecter les visages et les émotions sur ces visages, puis communique avec l'API de ChatGPT (GPT-3.5-turbo) d'OpenAI pour générer des recommandations telles que des textes d'opinion, des suggestions de musique ou d'autres activités adaptées aux émotions de l'utilisateur.

## Table des matières

- [Technologies](#technologies)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Fonctionnalités](#fonctionnalités)
- [Contribuer](#contribuer)
- [Licence](#licence)

## Technologies

- Client :
  - Vite
  - HTML, CSS, JavaScript
- Serveur :
  - Node.js
  - Express
  - API OpenAI

## Installation

1. Clonez ce dépôt :
- `git clone https://github.com/nolancacheux/NolanGPTEmotions.git`

2. Accédez au dossier du projet :
- `cd NolanGPTEmotions`

3. Installez les dépendances pour le client et le serveur :

- `cd client`
- `npm install`
- `cd ../server`
- `npm install`

4. Créez un fichier .env dans le dossier server avec votre clé API OpenAI :
- `OPEN_API_KEY="votre_clé_api_openai"`


## Utilisation

1. Démarrez le serveur :
- `cd server`
- `npm run server`

2. Démarrez le client dans un autre terminal :
- `cd client`
- `npm run dev`

3. Ouvrez votre navigateur et accédez à `http://localhost:5173`.

Chargez une image ou prenez une photo avec votre webcam pour analyser les émotions et recevoir des recommandations personnalisées.

## Fonctionnalités

- Détection de visage et analyse des émotions à partir d'images ou de la webcam
- Communication avec l'API de ChatGPT pour générer des recommandations personnalisées
- Affichage des statistiques émotionnelles sous forme de barres de progression
- Analyse quotidienne personnalisé basé sur les émotions de l'utilisateur
- Suggestions de musique adaptées aux émotions de l'utilisateur
- Propositions d'activités et d'idées basées sur les émotions de l'utilisateur

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence ISC.