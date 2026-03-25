# 💕 Quiz of Love — Les potins de Scott & Nolwen

## Configuration Firebase (OBLIGATOIRE pour jouer en ligne)

### Étape 1 — Créer ton projet Firebase (gratuit)

1. Va sur **https://console.firebase.google.com**
2. Clique sur **"Ajouter un projet"**
3. Donne un nom ex: `quiz-of-love-scott`
4. Désactive Google Analytics (pas nécessaire) → Créer le projet

### Étape 2 — Activer la base de données

1. Dans le menu gauche → **"Realtime Database"**
2. Clique **"Créer une base de données"**
3. Choisis **"Commencer en mode test"** → Activer
4. Garde la page ouverte

### Étape 3 — Récupérer la configuration

1. Clique ⚙️ (roue dentée) → **"Paramètres du projet"**
2. Descends jusqu'à **"Tes applications"** → clique l'icône **`</>`** (Web)
3. Nom de l'app: `quiz-of-love` → Enregistrer
4. **Copie le bloc `firebaseConfig`** qui apparaît

### Étape 4 — Coller la config dans le jeu

Ouvre `app.js` et remplace le bloc `FIREBASE_CONFIG` au début :

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...",        // ← colle ta vraie valeur
  authDomain:        "ton-projet.firebaseapp.com",
  databaseURL:       "https://ton-projet-default-rtdb.firebaseio.com",
  projectId:         "ton-projet",
  storageBucket:     "ton-projet.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

### Étape 5 — Héberger le jeu (pour y jouer depuis le téléphone)

#### Option A — Firebase Hosting (recommandé, gratuit)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # choisir le dossier "jeu"
firebase deploy
```
→ Tu obtiens une URL type `https://ton-projet.web.app` accessible partout !

#### Option B — VS Code Live Server (local, réseau wifi uniquement)
- Installe l'extension **Live Server** dans VS Code
- Clic droit sur `index.html` → **"Open with Live Server"**
- Partage ton IP local ex: `http://192.168.1.XX:5500`

---

## Comment jouer

1. **Scott** ouvre le jeu → choisit son nom → **Créer une partie** → reçoit un code
2. **Nolwen** ouvre le jeu → choisit son nom → **Rejoindre** → entre le code
3. L'hôte (Scott) choisit le mode de jeu
4. **Lancer le jeu** → les questions arrivent !

## Modes disponibles

| Mode | Description | Type |
|------|-------------|------|
| 🧠 Connaissance | Vous connaissez-vous vraiment ? | Devine la réponse de l'autre |
| 🔥 Hot & Spicy | Pour les courageux… | Vos préférences en commun |
| 💕 Couple Goals | Votre futur ensemble | Vos rêves en commun |
| 🎭 Défi Fou | Osez tout ! | Répondez sans filtre |

## Système de points

- **Mode match** (Hot, Couple, Défi) : réponse identique → **+2 pts chacun**
- **Mode devine** (Connaissance) :
  - Répondre sur soi-même → **+1 pt**
  - Deviner la bonne réponse → **+3 pts**
