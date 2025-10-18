# 🚀 MERN Authentication API – Backend sécurisé avec Email & JWT

Une **API d’authentification complète** construite avec **Express.js**, **MongoDB**, **JWT**, et **Mailtrap** (ou Nodemailer) pour la vérification d’email.  
Projet prêt pour un frontend **React/Vite** connecté à `http://localhost:5173`.

---

## 🧠 Sommaire

1️⃣ [Aperçu du projet](#-aperçu-du-projet)  
2️⃣ [Fonctionnalités](#-fonctionnalités)  
3️⃣ [Structure du projet](#-structure-du-projet)  
4️⃣ [Installation](#-installation)  
5️⃣ [Variables d’environnement](#-variables-denvironnement)  
6️⃣ [Endpoints principaux](#-endpoints-principaux)  
7️⃣ [Technologies utilisées](#-technologies-utilisées)  
8️⃣ [Dépendances à installer](#-dépendances-à-installer)  
9️⃣ [Auteur](#-auteur)  

---

## ✨ Aperçu du projet

Ce backend fournit toutes les fonctionnalités d’authentification nécessaires à une application MERN complète :
- Inscription utilisateur avec vérification par e-mail (Mailtrap / Nodemailer)
- Connexion avec JWT
- Déconnexion et suppression des cookies
- Récupération et réinitialisation du mot de passe
- Middleware d’authentification JWT
- Connexion sécurisée à MongoDB via Mongoose

---

## 🔐 Fonctionnalités

✅ **Register** avec e-mail unique  
✅ **Login** sécurisé avec bcrypt + JWT  
✅ **Vérification d’e-mail** via Mailtrap  
✅ **Réinitialisation du mot de passe** par lien e-mail  
✅ **Route protégée / Profil utilisateur**  
✅ **Gestion d’erreurs centralisée**  
✅ **Validation des entrées (express-validator)**  
✅ **Connexion MongoDB via Mongoose**  
✅ **Support CORS pour le frontend Vite**  
✅ **Utilisation de cookies HTTP-only**

---

## 🧱 Structure du projet

Backend/
│
├── config/
│   └── connDB.js
│
├── controllers/
│   └── auth.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│
│
├── models/
│   └── user.model.js
│
├── routes/
│   └── auth.route.js
│
├── utils/
│   ├── generateTokenAndSetCookie.js
│   ├── mailtrap.config.js
│   ├── emails.js
│   └── emailTemplates.js
│
├── .env
├── server.js
└── package.json

2️⃣ Installer les dépendances
npm install

3️⃣ Lancer le serveur

En mode développement :
npm run dev

En mode production :
npm start

🔐 Variables d’environnement

Crée un fichier .env à la racine du dossier Backend :
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mern-auth
JWT_SECRET=tonsecretjwt
JWT_EXPIRE=1d
CLIENT_URL=http://localhost:5173

# Config Mailtrap
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=ton_utilisateur_mailtrap
SMTP_PASS=ton_motdepasse_mailtrap

📡 Endpoints principaux
🔸 Auth Routes → /api/auth

| Méthode | Endpoint                 | Description                                                  |
| ------- | ------------------------ | ------------------------------------------------------------ |
| `POST`  | `/register`              | Inscription d’un utilisateur + envoi d’email de vérification |
| `GET`   | `/verify/:token`         | Vérification du compte via e-mail                            |
| `POST`  | `/login`                 | Connexion de l’utilisateur et génération de JWT              |
| `POST`  | `/logout`                | Déconnexion et suppression du cookie                         |
| `POST`  | `/forgot-password`       | Envoi d’un lien de réinitialisation                          |
| `PUT`   | `/reset-password/:token` | Réinitialisation du mot de passe                             |
| `GET`   | `/me`                    | Récupérer le profil (JWT requis)                             |

🧠 Technologies utilisées
| Technologie               | Rôle                                    |
| ------------------------- | --------------------------------------- |
| **Express.js**            | Framework backend                       |
| **MongoDB + Mongoose**    | Base de données NoSQL                   |
| **JWT (jsonwebtoken)**    | Authentification sécurisée              |
| **bcryptjs**              | Hachage des mots de passe               |
| **Nodemailer / Mailtrap** | Envoi d’e-mails                         |
| **cookie-parser**         | Gestion des cookies                     |
| **cors**                  | Communication entre frontend et backend |
| **dotenv**                | Variables d’environnement               |
| **nodemon**               | Redémarrage automatique en dev          |

🧩 Dépendances à installer
Dépendances principales :
npm install express mongoose dotenv cookie-parser cors bcryptjs jsonwebtoken nodemailer 

Dépendances de dev :
npm install --save-dev nodemon

🚀 Exemple de lancement

> npm run dev

✅ MongoDB Connected
🚀 Server running on port 5000

🧑‍💻 Auteur

👩‍💻 Nourhene Ben Othmen
🛠️ MERN Stack Developer
📧 Contact : benothmennourhen8@gmail.com
🌐 GitHub : [github.com/nourhene](https://github.com/Nourhenebenothmen22)





