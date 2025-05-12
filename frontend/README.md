# Système d'Authentification - Plateforme Moderne d'Authentification et d'Autorisation


## 📋 Aperçu

Le Système d'Authentification est une plateforme complète d'authentification et d'autorisation construite avec une stack technologique moderne. Il propose un contrôle d'accès basé sur les rôles, des méthodes d'authentification sécurisées et une interface utilisateur propre et responsive. Ce projet démontre les meilleures pratiques pour construire des systèmes d'authentification sécurisés avec des composants frontend et backend séparés.

## ✨ Fonctionnalités

- **Authentification Utilisateur** : Connexion et inscription sécurisées
- **Contrôle d'Accès Basé sur les Rôles** : Tableaux de bord et permissions différents pour les utilisateurs et les administrateurs
- **Authentification JWT** : Authentification sécurisée basée sur les tokens
- **Gestion de Session** : Sessions de connexion persistantes
- **Design Responsive** : Interface adaptée aux mobiles construite avec Tailwind CSS
- **Validation de Formulaire** : Validation côté client avec Formik et Yup
- **Notifications Toast** : Notifications conviviales avec React Hot Toast
- **Interface Moderne** : Interface propre et professionnelle avec les icônes Lucide React

## 🛠️ Stack Technologique

### Frontend
- **Framework** : React avec Vite
- **Styling** : Tailwind CSS
- **Gestion de Formulaire** : Formik avec validation Yup
- **Routage** : React Router v6
- **Client HTTP** : Axios
- **Notifications** : React Hot Toast
- **Icônes** : Lucide React

### Backend
- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de Données** : MongoDB avec Mongoose
- **Authentification** : JWT, Session et Auth Basique
- **Hachage de Mot de Passe** : bcrypt
- **Validation** : Express Validator

## 🚀 Démarrage

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (local ou Atlas)
- npm 

### Installation

#### Cloner le dépôt
```bash
git clone https://github.com/votrenomdutilisateur/systeme-authentification.git
cd systeme-authentification

# Naviguer vers le répertoire backend
cd backend

# Installer les dépendances
npm install

# Créer un fichier .env (copier depuis l'exemple)
cp .env.example .env

# Éditer le fichier .env avec votre configuration
# MONGO_URI=mongodb://127.0.0.1:27017/Auth
# JWT_SECRET=votre_secret_jwt
# SESSION_SECRET=votre_secret_session
# PORT=5000

# Démarrer le serveur
npm start

# Naviguer vers le répertoire frontend
cd ../frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

Le frontend sera disponible à l'adresse `http://localhost:5173` et le backend à l'adresse `http://localhost:5000`.

## 🔐 Points d'API

### Points d'Authentification

| Méthode | Point d'Accès | Description | Auth Requise
|-----|-----|-----|-----
| POST | `/api/auth/register` | Inscrire un nouvel utilisateur | Non
| POST | `/api/auth/login` | Connecter un utilisateur | Non
| GET | `/api/auth/logout` | Déconnecter un utilisateur | Non
| GET | `/api/auth/me/basic` | Obtenir les infos utilisateur (Auth Basique) | Oui (Basique)
| GET | `/api/auth/me/jwt` | Obtenir les infos utilisateur (JWT) | Oui (JWT)
| GET | `/api/auth/me/session` | Obtenir les infos utilisateur (Session) | Oui (Session)