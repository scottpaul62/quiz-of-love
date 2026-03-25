// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  QUIZ OF LOVE â€” Logique principale
//  Scott & Nolwen Edition ðŸ’•
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// â”€â”€â”€ CONFIG FIREBASE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// âš ï¸ REMPLACE CES VALEURS par celles de ton projet Firebase
// (voir README.md pour les instructions Ã©tape par Ã©tape)
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyC6AlMxLlTGu43L7A4BC33AG4TfmRe2VFQ",
  authDomain:        "scott-et-nolwen.firebaseapp.com",
  databaseURL:       "https://scott-et-nolwen-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "scott-et-nolwen",
  storageBucket:     "scott-et-nolwen.firebasestorage.app",
  messagingSenderId: "611805730130",
  appId:             "1:611805730130:web:0cac759f5c75ecd105968b",
  measurementId:     "G-9FERWG1TWP"
};
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

let db = null;
const isFirebaseReady = () => db !== null && FIREBASE_CONFIG.apiKey !== "REMPLACE_ICI";

try {
  if (FIREBASE_CONFIG.apiKey !== "REMPLACE_ICI") {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.database();
  }
} catch (e) {
  console.warn("Firebase non configurÃ© :", e.message);
}

// â”€â”€â”€ Ã‰TAT GLOBAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const State = {
  player:        null,   // 'scott' | 'nolwen'
  roomCode:      null,
  isHost:        false,
  mode:          null,
  selectedMode:  null,
  roomRef:       null,
  lastStatus:    null,
  timerInterval: null,
  myAnswer:      null,
  computing:     false,  // garde anti-doublon pour computeResult
  lastMiniLeftAt: 0,
};

const MODE_META = {
  connaissance: { emoji: "ðŸ§ ", label: "Connaissance" },
  hot:          { emoji: "ðŸ”¥", label: "Hot & Spicy"  },
  couple:       { emoji: "ðŸ’•", label: "Couple Goals"  },
  defi:         { emoji: "ðŸŽ­", label: "DÃ©fi Fou"      },
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  APP â€” Actions principales
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const App = {

  // â”€â”€â”€ Navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },

  // â”€â”€â”€ Choix du joueur â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  selectPlayer(name) {
    State.player = name;
    document.querySelectorAll('.player-card').forEach(c => {
      c.classList.remove('selected');
      c.querySelector('.player-check').classList.add('hidden');
    });
    const card = document.getElementById('card-' + name);
    card.classList.add('selected');
    card.querySelector('.player-check').classList.remove('hidden');
    document.getElementById('room-options').classList.remove('hidden');
    SFX.play('select');
  },

  // â”€â”€â”€ CrÃ©er une salle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async createRoom() {
    if (!State.player) { App.toast("Choisis d'abord ton nom ! ðŸ˜Š"); return; }

    const code = generateCode();
    State.roomCode = code;
    State.isHost   = true;
    State.lastMiniLeftAt = 0;

    const roomData = {
      host:          State.player,
      guest:         null,
      status:        "lobby",
      activeFlow:    "lobby",
      mode:          null,
      miniType:      "_",
      miniSession:   0,
      miniLeftBy:    "_",
      miniLeftAt:    0,
      currentQ:      0,
      questionOrder: [],
      scores:        { scott: 0, nolwen: 0 },
      answers:       { scott: null, nolwen: null },
      questionStart: 0,
      createdAt:     Date.now(),
    };

    if (isFirebaseReady()) {
      try {
        await db.ref('rooms/' + code).set(roomData);
        App.showScreen('screen-lobby');
        UI.showRoomCode(code);
        UI.setPlayerDot(State.player, true);
        App.setupListener(code);
        SFX.play('create');
      } catch (e) {
        App.toast("Erreur Firebase ðŸ˜• VÃ©rifie ta configuration.");
      }
    }
  },

  // â”€â”€â”€ Rejoindre une salle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async joinRoom() {
    if (!State.player) { App.toast("Choisis d'abord ton nom ! ðŸ˜Š"); return; }

    const input = document.getElementById('join-code-input');
    const code  = input.value.trim().toUpperCase();
    if (code.length !== 6) { App.toast("Code Ã  6 caractÃ¨res requis !"); return; }

    State.roomCode = code;
    State.isHost   = false;
    State.lastMiniLeftAt = 0;

    if (isFirebaseReady()) {
      try {
        const snap = await db.ref('rooms/' + code).get();
        if (!snap.exists()) { App.toast("Code introuvable ðŸ” VÃ©rifie le code !"); return; }
        const data = snap.val();
        if (data.guest && data.guest !== State.player) {
          App.toast("Cette salle est dÃ©jÃ  complÃ¨te !"); return;
        }
        await db.ref('rooms/' + code).update({ guest: State.player });
        App.showScreen('screen-lobby');
        UI.setPlayerDot(State.player, true);
        App.setupListener(code);
        SFX.play('join');
      } catch (e) {
        App.toast("Erreur Firebase ðŸ˜• VÃ©rifie ta configuration.");
      }
    }
  },

  // â”€â”€â”€ Listener Firebase central â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  setupListener(code) {
    if (!isFirebaseReady()) return;
    if (State.roomRef) State.roomRef.off();
    State.roomRef = db.ref('rooms/' + code);

    // DÃ©connexion brutale (fermeture onglet) â†’ signaler aux autres
    State._leftRef = db.ref('rooms/' + code + '/leftBy');
    State._leftRef.onDisconnect().set(State.player);

    State.roomRef.on('value', snap => {
      if (!snap.exists()) return;
      App.handleRoomUpdate(snap.val());
    });
  },

  // â”€â”€â”€ Quitter proprement â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  leaveRoom() {
    App.stopTimer();
    if (typeof GameHub !== 'undefined' && typeof GameHub.cleanup === 'function') {
      GameHub.cleanup();
    }
    if (State._leftRef) {
      State._leftRef.onDisconnect().cancel();
      State._leftRef.set(State.player).catch(() => {});
      State._leftRef = null;
    }
    if (State.roomRef) { State.roomRef.off(); State.roomRef = null; }
    State.roomCode = null;
    State.isHost = false;
    State.selectedMode = null;
    State.mode = null;
    State.myAnswer = null;
    State.computing = false;
    State.lastStatus = null;
    App.showScreen('screen-setup');
  },

  async launchMiniGame(type) {
    if (!State.roomRef || !State.roomCode) {
      App.toast("Rejoins d'abord le salon avec un code.");
      return;
    }
    if (!isFirebaseReady()) {
      App.toast("Firebase non configure.");
      return;
    }
    const roomSnap = await State.roomRef.get();
    const roomData = roomSnap.val() || {};
    if (!roomData.host || !roomData.guest) {
      App.toast("Attends que les 2 joueurs soient connectes.");
      return;
    }
    await State.roomRef.update({
      status:      'lobby',
      activeFlow:  'mini',
      miniType:    type,
      miniSession: Date.now(),
      miniLeftBy:  '_',
      miniLeftAt:  0,
    });
    SFX.play('start');
  },

  async backToLobby() {
    App.stopTimer();
    State.myAnswer = null;
    State.computing = false;
    State.lastStatus = 'lobby';
    if (typeof GameHub !== 'undefined' && typeof GameHub.cleanup === 'function') {
      GameHub.cleanup();
    }
    if (State.roomRef) {
      await State.roomRef.update({
        status:      'lobby',
        activeFlow:  'lobby',
        miniType:    '_',
        miniSession: 0,
        miniLeftBy:  '_',
        miniLeftAt:  0,
        answers:     { scott: null, nolwen: null },
      });
    }
    App.showScreen('screen-lobby');
  },

  handleRoomUpdate(data) {
    const status = data.status || 'lobby';

    if (data.leftBy && data.leftBy !== State.player) {
      const name = data.leftBy === 'scott' ? 'Scott' : 'Nolwen';
      if (State._leftRef) { State._leftRef.onDisconnect().cancel(); State._leftRef = null; }
      if (State.roomRef) { State.roomRef.off(); State.roomRef = null; }
      if (typeof GameHub !== 'undefined' && typeof GameHub.cleanup === 'function') {
        GameHub.cleanup();
      }
      App.showScreen('screen-setup');
      setTimeout(() => App.toast(`${name} a quitte la partie`), 200);
      return;
    }

    if (data.host) UI.setPlayerDot(data.host, true);
    if (data.guest) UI.setPlayerDot(data.guest, true);

    if (data.miniLeftAt && data.miniLeftAt !== State.lastMiniLeftAt) {
      State.lastMiniLeftAt = data.miniLeftAt;
      if (data.miniLeftBy && data.miniLeftBy !== '_' && data.miniLeftBy !== State.player) {
        const miniName = data.miniLeftBy === 'scott' ? 'Scott' : 'Nolwen';
        App.toast(`${miniName} a quitte le mini-jeu`);
      }
    }

    if (data.activeFlow === 'mini' && data.miniType && data.miniType !== '_') {
      if (typeof GameHub !== 'undefined' && typeof GameHub.attachSharedMini === 'function') {
        GameHub.attachSharedMini(data);
      }
      State.lastStatus = status;
      return;
    }
    if (typeof GameHub !== 'undefined' && typeof GameHub.cleanup === 'function' && GameHub.active) {
      GameHub.cleanup();
    }

    if (status === 'lobby') {
      const bothConnected = !!(data.host && data.guest);
      const waiting = document.getElementById('lobby-waiting');
      const modeSel = document.getElementById('mode-select');
      const salonGames = document.getElementById('salon-games');
      const startBtn = document.getElementById('start-game-btn');

      App.showScreen('screen-lobby');
      waiting.classList.toggle('hidden', bothConnected);
      modeSel.classList.toggle('hidden', !bothConnected);
      if (salonGames) salonGames.classList.toggle('hidden', !bothConnected);

      if (bothConnected) {
        if (State.isHost) {
          startBtn.classList.remove('hidden');
          waiting.classList.add('hidden');
        } else {
          startBtn.classList.add('hidden');
          waiting.classList.remove('hidden');
          document.getElementById('lobby-waiting-msg').textContent = "L'hote peut lancer un quiz ou un mini-jeu.";
        }
      } else {
        startBtn.classList.add('hidden');
        if (salonGames) salonGames.classList.add('hidden');
        document.getElementById('lobby-waiting-msg').textContent = "En attente de l'autre joueur...";
      }
    }

    if (status === 'question') {
      if (State.lastStatus !== 'question' || data.currentQ !== State._lastQ) {
        State._lastQ = data.currentQ;
        State.myAnswer = null;
        State.computing = false;
        App.showScreen('screen-game');
        UI.showQuestion(data);
        App.startTimer(data);
      }

      document.getElementById('score-scott').textContent = data.scores?.scott ?? 0;
      document.getElementById('score-nolwen').textContent = data.scores?.nolwen ?? 0;

      if (State.isHost && !State.computing &&
          data.answers?.scott !== null && data.answers?.nolwen !== null &&
          data.answers?.scott !== undefined && data.answers?.nolwen !== undefined) {
        State.computing = true;
        App.computeResult(data);
      }
    }

    if (status === 'result' && State.lastStatus !== 'result') {
      App.stopTimer();
      App.showScreen('screen-result');
      UI.showRoundResult(data);
    }

    if (status === 'finished' && State.lastStatus !== 'finished') {
      App.stopTimer();
      App.showScreen('screen-final');
      UI.showFinalScore(data);
      Confetti.burst();
    }

    State.lastStatus = status;
  },

  // â”€â”€â”€ SÃ©lection du mode â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  selectMode(mode) {
    State.selectedMode = mode;
    document.querySelectorAll('.mode-card').forEach(c =>
      c.classList.toggle('selected', c.dataset.mode === mode)
    );
    document.getElementById('start-game-btn').classList.remove('hidden');
    SFX.play('select');
  },

  // â”€â”€â”€ Lancer le jeu â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async startGame() {
    if (!State.selectedMode) { App.toast("Choisis un mode d'abord !"); return; }
    if (!isFirebaseReady())  { App.toast("Firebase non configurÃ© â€” voir README.md"); return; }

    const order = getQuestionOrder(State.selectedMode);
    await State.roomRef.update({
      status:        'question',
      activeFlow:    'quiz',
      mode:          State.selectedMode,
      miniType:      '_',
      miniSession:   0,
      miniLeftBy:    '_',
      miniLeftAt:    0,
      currentQ:      0,
      questionOrder: order,
      scores:        { scott: 0, nolwen: 0 },
      answers:       { scott: null, nolwen: null },
      questionStart: Date.now(),
    });
    SFX.play('start');
  },

  // â”€â”€â”€ Soumettre une rÃ©ponse â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async submitAnswer(index) {
    if (State.myAnswer !== null) return; // dÃ©jÃ  rÃ©pondu
    State.myAnswer = index;

    // Feedback visuel immÃ©diat
    document.querySelectorAll('.answer-btn').forEach((b, i) => {
      b.disabled = true;
      if (i === index) b.classList.add('selected');
    });
    document.getElementById('answered-waiting').classList.remove('hidden');
    SFX.play('answer');

    if (isFirebaseReady()) {
      await State.roomRef.update({
        [`answers/${State.player}`]: index,
      });
      // Le listener global dÃ©tectera que les deux ont rÃ©pondu et appellera computeResult
    }
  },

  // â”€â”€â”€ Calculer le rÃ©sultat (hÃ´te seulement) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async computeResult(data) {
    const qIndex   = data.questionOrder[data.currentQ];
    const question = getQuestion(data.mode, qIndex);
    const aScott   = data.answers.scott;
    const aNolwen  = data.answers.nolwen;
    const scores   = { scott: data.scores.scott || 0, nolwen: data.scores.nolwen || 0 };

    if (question.type === 'match') {
      if (aScott !== null && aNolwen !== null && aScott >= 0 && aNolwen >= 0 && aScott === aNolwen) {
        scores.scott  += 2;
        scores.nolwen += 2;
      }
    } else {
      // guess : alternance host/guest selon l'index de la question
      const isHostQ     = data.currentQ % 2 === 0;
      const owner       = isHostQ ? data.host  : data.guest;
      const guesser     = isHostQ ? data.guest : data.host;
      const ownerAnswer = owner   === 'scott' ? aScott  : aNolwen;
      const guesserAns  = guesser === 'scott' ? aScott  : aNolwen;

      if (ownerAnswer !== null && ownerAnswer >= 0)   scores[owner]   += 1;
      if (guesserAns  !== null && guesserAns  >= 0 && guesserAns === ownerAnswer) {
        scores[guesser] += 3;
      }
    }

    await State.roomRef.update({ status: 'result', scores });
  },

  // â”€â”€â”€ Question suivante â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async nextQuestion() {
    if (!State.isHost || !isFirebaseReady()) return;
    const snap = await State.roomRef.get();
    const data = snap.val();
    const nextQ = (data.currentQ || 0) + 1;

    if (nextQ >= QUESTIONS_PER_GAME) {
      await State.roomRef.update({ status: 'finished' });
    } else {
      await State.roomRef.update({
        status:        'question',
        currentQ:      nextQ,
        answers:       { scott: null, nolwen: null },
        questionStart: Date.now(),
      });
    }
    SFX.play('next');
  },

  // â”€â”€â”€ Timer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  startTimer(data) {
    App.stopTimer();
    const TOTAL = 15;
    let remaining = TOTAL;

    if (data.questionStart) {
      const elapsed = Math.floor((Date.now() - data.questionStart) / 1000);
      remaining = Math.max(0, TOTAL - elapsed);
    }

    const bar  = document.getElementById('timer-bar-fill');
    const text = document.getElementById('timer-text');
    bar.classList.remove('urgent');

    const tick = () => {
      bar.style.width   = (remaining / TOTAL * 100) + '%';
      text.textContent  = remaining;
      if (remaining <= 5) { bar.classList.add('urgent'); SFX.play('tick'); }
      if (remaining <= 0) {
        App.stopTimer();
        if (State.myAnswer === null) App.submitAnswer(-1);
        return;
      }
      remaining--;
    };

    tick();
    State.timerInterval = setInterval(tick, 1000);
  },

  stopTimer() {
    if (State.timerInterval) { clearInterval(State.timerInterval); State.timerInterval = null; }
  },

  // â”€â”€â”€ Copier le code â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  copyCode() {
    if (!State.roomCode) return;
    navigator.clipboard.writeText(State.roomCode)
      .then(() => App.toast("Code copiÃ© ! ðŸ“‹"))
      .catch(() => App.toast("Code : " + State.roomCode));
  },

  // â”€â”€â”€ Toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  toast(msg, duration = 2800) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    t.classList.add('show');
    clearTimeout(App._toastTimer);
    App._toastTimer = setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.classList.add('hidden'), 300);
    }, duration);
  },

  // â”€â”€â”€ Recommencer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  restart() {
    App.stopTimer();
    if (State.roomRef) State.roomRef.off();
    if (typeof GameHub !== 'undefined' && typeof GameHub.cleanup === 'function') {
      GameHub.cleanup();
    }

    Object.assign(State, {
      player: null, roomCode: null, isHost: false, mode: null,
      selectedMode: null, roomRef: null, lastStatus: null,
      myAnswer: null, computing: false, _lastQ: undefined,
    });

    document.querySelectorAll('.player-card').forEach(c => {
      c.classList.remove('selected');
      c.querySelector('.player-check').classList.add('hidden');
    });
    document.getElementById('room-options').classList.add('hidden');
    document.getElementById('join-code-input').value = '';
    document.getElementById('mode-select').classList.add('hidden');
    const salonGames = document.getElementById('salon-games');
    if (salonGames) salonGames.classList.add('hidden');
    document.getElementById('room-code-display').classList.add('hidden');
    document.getElementById('lobby-waiting').classList.remove('hidden');
    document.getElementById('lobby-waiting-msg').textContent = "En attente de l'autre joueurâ€¦";
    document.getElementById('start-game-btn').classList.add('hidden');
    document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
    ['scott', 'nolwen'].forEach(p => {
      UI.setPlayerDot(p, false);
      document.getElementById('pstatus-' + p)?.classList.remove('connected');
    });

    // Annuler le handler de dÃ©connexion proprement
    if (State._leftRef) { State._leftRef.onDisconnect().cancel(); State._leftRef = null; }
    if (State.roomRef)  { State.roomRef.off(); State.roomRef = null; }

    App.showScreen('screen-welcome');
    SFX.play('select');
  },
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  UI â€” Rendu de l'interface
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const UI = {

  showRoomCode(code) {
    document.getElementById('room-code-text').textContent = code;
    document.getElementById('room-code-display').classList.remove('hidden');
  },

  setPlayerDot(player, online) {
    const dot  = document.getElementById('dot-' + player);
    const card = document.getElementById('pstatus-' + player);
    if (dot)  dot.classList.toggle('online', online);
    if (card) card.classList.toggle('connected', online);
  },

  showQuestion(data) {
    const qIndex   = data.questionOrder[data.currentQ];
    const question = getQuestion(data.mode, qIndex);
    const current  = data.currentQ + 1;

    document.getElementById('question-counter').textContent = `${current} / ${QUESTIONS_PER_GAME}`;
    document.getElementById('mode-badge').textContent       = MODE_META[data.mode]?.emoji || '';
    document.getElementById('score-scott').textContent      = data.scores?.scott  ?? 0;
    document.getElementById('score-nolwen').textContent     = data.scores?.nolwen ?? 0;

    // Ã‰tiquette de ronde
    const label = document.getElementById('round-label');
    if (question.type === 'match') {
      label.textContent = "Choisissez votre prÃ©fÃ©rence ! ðŸ’•";
    } else {
      const isHostQ   = data.currentQ % 2 === 0;
      const owner     = isHostQ ? data.host : data.guest;
      const ownerName = owner.charAt(0).toUpperCase() + owner.slice(1);
      label.textContent = State.player === owner
        ? `C'est ta question, ${ownerName} ! RÃ©ponds honnÃªtement ðŸŽ¯`
        : `Qu'est-ce que ${ownerName} va rÃ©pondre ? Devine ! ðŸ¤”`;
    }

    // Question
    document.getElementById('question-text').textContent = question.q;

    // RÃ©ponses
    const grid = document.getElementById('answers-grid');
    grid.innerHTML = '';
    question.a.forEach((answer, i) => {
      const btn = document.createElement('button');
      btn.className   = 'answer-btn';
      btn.textContent = answer;
      btn.onclick     = () => App.submitAnswer(i);
      grid.appendChild(btn);
    });

    document.getElementById('answered-waiting').classList.add('hidden');
  },

  showRoundResult(data) {
    const qIndex   = data.questionOrder[data.currentQ];
    const question = getQuestion(data.mode, qIndex);
    const aScott   = data.answers.scott;
    const aNolwen  = data.answers.nolwen;

    const fmt = (a) => (a !== null && a >= 0) ? question.a[a] : "â±ï¸ Temps Ã©coulÃ©";
    document.getElementById('reveal-scott-answer').textContent  = fmt(aScott);
    document.getElementById('reveal-nolwen-answer').textContent = fmt(aNolwen);

    // Coloration
    const revealScott  = document.getElementById('reveal-scott');
    const revealNolwen = document.getElementById('reveal-nolwen');
    revealScott.classList.remove('match', 'wrong');
    revealNolwen.classList.remove('match', 'wrong');

    let isMatch = false;

    if (question.type === 'match') {
      isMatch = aScott >= 0 && aNolwen >= 0 && aScott === aNolwen;
      revealScott.classList.add(isMatch ? 'match' : 'wrong');
      revealNolwen.classList.add(isMatch ? 'match' : 'wrong');
    } else {
      const isHostQ   = data.currentQ % 2 === 0;
      const owner     = isHostQ ? data.host  : data.guest;
      const guesser   = isHostQ ? data.guest : data.host;
      const ownerA    = owner   === 'scott' ? aScott  : aNolwen;
      const guesserA  = guesser === 'scott' ? aScott  : aNolwen;
      isMatch = ownerA >= 0 && guesserA >= 0 && ownerA === guesserA;
      // Owner: toujours "match" (il rÃ©pond sur lui-mÃªme)
      const ownerReveal   = document.getElementById('reveal-' + owner);
      const guesserReveal = document.getElementById('reveal-' + guesser);
      ownerReveal.classList.add('match');
      guesserReveal.classList.add(isMatch ? 'match' : 'wrong');
    }

    // Animation & message
    const anim  = document.getElementById('result-anim');
    const title = document.getElementById('result-title');
    const msg   = document.getElementById('result-message');

    if (isMatch) {
      anim.textContent  = 'ðŸ’ž';
      title.textContent = 'Vous Ãªtes synchronisÃ©s !';
      msg.textContent   = question.type === 'match'
        ? 'MÃªme rÃ©ponse â€” vous vous connaissez parfaitement !'
        : 'Bonne devinette â€” connexion extraordinaire ! ðŸ”®';
      SFX.play('correct');
    } else {
      anim.textContent  = 'ðŸ˜‚';
      title.textContent = 'RÃ©ponses diffÃ©rentes !';
      msg.textContent   = randomFrom(TROLL_MESSAGES);
      SFX.play('wrong');
    }

    document.getElementById('result-score-scott').textContent  = data.scores.scott  || 0;
    document.getElementById('result-score-nolwen').textContent = data.scores.nolwen || 0;

    // Bouton suivant : hÃ´te seulement
    const nextBtn  = document.getElementById('next-btn');
    const nextWait = document.getElementById('next-waiting-msg');
    const isLast   = (data.currentQ + 1) >= QUESTIONS_PER_GAME;

    if (State.isHost) {
      nextBtn.classList.remove('hidden');
      nextWait.classList.add('hidden');
      nextBtn.textContent = isLast ? 'Voir les rÃ©sultats ðŸ†' : 'Question suivante âž”';
    } else {
      nextBtn.classList.add('hidden');
      nextWait.classList.remove('hidden');
    }
  },

  showFinalScore(data) {
    const sScore = data.scores.scott  || 0;
    const nScore = data.scores.nolwen || 0;

    document.getElementById('final-score-scott').textContent  = sScore;
    document.getElementById('final-score-nolwen').textContent = nScore;

    const winnerBlock = document.getElementById('winner-block');
    const loveMsg     = document.getElementById('love-msg');

    if (sScore > nScore) {
      winnerBlock.textContent = 'ðŸ‘¨ Scott remporte la partie !';
      loveMsg.textContent     = randomFrom(LOSER_MESSAGES_NOLWEN);
    } else if (nScore > sScore) {
      winnerBlock.textContent = 'ðŸ‘© Nolwen remporte la partie !';
      loveMsg.textContent     = randomFrom(LOSER_MESSAGES_SCOTT);
    } else {
      winnerBlock.textContent = 'ðŸ¤ Ã‰galitÃ© parfaite !';
      loveMsg.textContent     = randomFrom(DRAW_MESSAGES);
    }

    SFX.play('win');
  },
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  SFX â€” Sons (Web Audio API)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const SFX = {
  _ctx: null,
  get ctx() {
    if (!this._ctx) {
      try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
    }
    return this._ctx;
  },

  _tone(freq, type = 'sine', duration = 0.2, volume = 0.15, start = 0) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + start;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(t); o.stop(t + duration + 0.01);
  },

  play(type) {
    switch (type) {
      case 'select': this._tone(520, 'sine', 0.12, 0.12); break;
      case 'create':
      case 'join':
        this._tone(440, 'sine', 0.15, 0.18, 0);
        this._tone(660, 'sine', 0.15, 0.18, 0.15);
        this._tone(880, 'sine', 0.2,  0.18, 0.3);
        break;
      case 'start':
        [523, 659, 784].forEach((f, i) => this._tone(f, 'sine', 0.25, 0.18, i * 0.12));
        break;
      case 'answer': this._tone(660, 'sine', 0.1, 0.1); break;
      case 'correct':
        [523, 659, 784, 1047].forEach((f, i) => this._tone(f, 'sine', 0.25, 0.18, i * 0.09));
        break;
      case 'wrong':
        this._tone(300, 'sawtooth', 0.15, 0.1, 0);
        this._tone(200, 'sawtooth', 0.2,  0.1, 0.15);
        break;
      case 'tick': this._tone(800, 'sine', 0.04, 0.06); break;
      case 'win':
        [523, 659, 784, 1047, 1319].forEach((f, i) => this._tone(f, 'sine', 0.35, 0.2, i * 0.1));
        break;
      case 'next': this._tone(440, 'sine', 0.1, 0.1); break;
      case 'meow':
        // Miaou de chaton synthÃ©tique
        if (!this.ctx) break;
        {
          const t   = this.ctx.currentTime;
          const ctx = this.ctx;

          // Oscillateur principal (voix)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          // Filtre passe-bande pour sonoritÃ© nasale de chaton
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 1200;
          filter.Q.value = 1.5;

          osc.type = 'sawtooth';
          // Glissement de frÃ©quence : miii-aou
          osc.frequency.setValueAtTime(700,  t);
          osc.frequency.linearRampToValueAtTime(950, t + 0.07);
          osc.frequency.linearRampToValueAtTime(600, t + 0.18);
          osc.frequency.linearRampToValueAtTime(480, t + 0.32);

          // Enveloppe : attaque rapide, decay douce
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.18, t + 0.04);
          gain.gain.setValueAtTime(0.18, t + 0.16);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.45);

          // Harmonique secondaire (petite voix de chaton)
          const osc2  = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1400, t);
          osc2.frequency.linearRampToValueAtTime(900, t + 0.32);
          gain2.gain.setValueAtTime(0, t);
          gain2.gain.linearRampToValueAtTime(0.07, t + 0.04);
          gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(t);
          osc2.stop(t + 0.4);
        }
        break;
    }
  },
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CONFETTI
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const Confetti = {
  colors: ['#ff6b9d', '#c77dff', '#ffd700', '#ff4488', '#7b2fff', '#ffb3cc', '#4ade80', '#60a5fa'],

  burst() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    for (let i = 0; i < 90; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${color};
        width: ${5 + Math.random() * 9}px;
        height: ${5 + Math.random() * 9}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
        --dur: ${1.5 + Math.random() * 2.5}s;
        --delay: ${Math.random() * 0.9}s;
      `;
      container.appendChild(p);
    }
    setTimeout(() => { container.innerHTML = ''; }, 5000);
  },
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CÅ’URS FLOTTANTS (fond)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function initHearts() {
  const container = document.getElementById('hearts-bg');
  const hearts = ['â¤ï¸', 'ðŸ’•', 'ðŸ’—', 'ðŸ’“', 'ðŸ’–', 'âœ¨', 'ðŸŒ¸', 'ðŸ’', 'ðŸŒ¹'];
  for (let i = 0; i < 20; i++) {
    const h = document.createElement('div');
    h.className = 'heart-particle';
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.cssText = `
      left: ${Math.random() * 100}%;
      --size: ${13 + Math.random() * 18}px;
      --dur:  ${8 + Math.random() * 12}s;
      --delay: ${-Math.random() * 18}s;
    `;
    container.appendChild(h);
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  UTILITAIRES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CHAT REBONDISSANT (Ã©cran accueil)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const CatBounce = {
  el: null,
  x: 0, y: 0,
  vx: 2.8, vy: 2.2,
  size: 80,
  raf: null,
  active: false,
  lastMeow: 0,

  init() {
    this.el = document.getElementById('cat-bounce');
    if (!this.el) return;
    this.x = Math.random() * (window.innerWidth  - this.size);
    this.y = Math.random() * (window.innerHeight - this.size);
    this.el.style.display = 'block';
    this.active = true;
    this.loop();
  },

  stop() {
    this.active = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.el) this.el.style.display = 'none';
  },

  loop() {
    if (!this.active) return;
    const W = window.innerWidth  - this.size;
    const H = window.innerHeight - this.size;
    const now = Date.now();

    this.x += this.vx;
    this.y += this.vy;

    let bounced = false;
    if (this.x <= 0)  { this.x = 0;  this.vx =  Math.abs(this.vx); bounced = true; }
    if (this.x >= W)  { this.x = W;  this.vx = -Math.abs(this.vx); bounced = true; }
    if (this.y <= 0)  { this.y = 0;  this.vy =  Math.abs(this.vy); bounced = true; }
    if (this.y >= H)  { this.y = H;  this.vy = -Math.abs(this.vy); bounced = true; }

    if (bounced && now - this.lastMeow > 400) {
      this.lastMeow = now;
      SFX.play('meow');
      this.el.style.borderColor = 'rgba(255,215,0,0.95)';
      this.el.style.boxShadow = '0 0 24px rgba(255,215,0,0.8), 0 0 48px rgba(255,107,157,0.5)';
      setTimeout(() => {
        if (this.el) {
          this.el.style.borderColor = 'rgba(255,107,157,0.8)';
          this.el.style.boxShadow = '0 0 18px rgba(255,107,157,0.6), 0 0 36px rgba(199,125,255,0.35)';
        }
      }, 350);
    }

    this.el.style.left = this.x + 'px';
    this.el.style.top  = this.y + 'px';
    this.raf = requestAnimationFrame(() => this.loop());
  },
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  INIT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
document.addEventListener('DOMContentLoaded', () => {
  initHearts();
  CatBounce.init();

  // Stopper le chat quand on quitte l'accueil
  const origShowScreen = App.showScreen.bind(App);
  App.showScreen = function(id) {
    origShowScreen(id);
    if (id === 'screen-welcome') {
      CatBounce.init();
    } else {
      CatBounce.stop();
    }
  };
});
