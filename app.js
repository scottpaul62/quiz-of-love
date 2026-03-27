// ═══════════════════════════════════════════════════════════
//  QUIZ OF LOVE — Logique principale
//  Scott & Nolwen Edition 💕
// ═══════════════════════════════════════════════════════════

// ─── CONFIG FIREBASE ────────────────────────────────────────
// ⚠️ REMPLACE CES VALEURS par celles de ton projet Firebase
// (voir README.md pour les instructions étape par étape)
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
// ────────────────────────────────────────────────────────────

let db = null;
const isFirebaseReady = () => db !== null && FIREBASE_CONFIG.apiKey !== "REMPLACE_ICI";

try {
  if (FIREBASE_CONFIG.apiKey !== "REMPLACE_ICI") {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.database();
  }
} catch (e) {
  console.warn("Firebase non configuré :", e.message);
}

// ─── ÉTAT GLOBAL ────────────────────────────────────────────
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
  lastRoomLeftAt: 0,
  lastLiveMessageId: '_',
  joinedAt: 0,
  _leftRef: null,
};

const MODE_META = {
  connaissance: { emoji: "🧠", label: "Connaissance" },
  hot:          { emoji: "🔥", label: "Hot & Spicy"  },
  couple:       { emoji: "💕", label: "Couple Goals"  },
  defi:         { emoji: "🎭", label: "Défi Fou"      },
};

const AvatarVoices = {
  cooldownMs: 5000,
  lastPlayedAt: { scott: 0, nolwen: 0 },
  players: {},
  decodedBuffers: {},
  _audioCtx: null,
  _unlockHooked: false,
  sources: {
    scott: 'Scott.m4a',
    nolwen: 'Nono.m4a',
  },

  get ctx() {
    if (!this._audioCtx) {
      try {
        this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (_) {
        this._audioCtx = null;
      }
    }
    return this._audioCtx;
  },

  initUnlockHooks() {
    if (this._unlockHooked) return;
    this._unlockHooked = true;
    const unlock = () => this.unlock();
    ['pointerdown', 'touchstart', 'keydown', 'click'].forEach(evt => {
      window.addEventListener(evt, unlock, { passive: true });
    });
  },

  unlock() {
    const ctx = this.ctx;
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  },

  async _loadDecodedBuffer(key) {
    if (this.decodedBuffers[key]) return this.decodedBuffers[key];
    const ctx = this.ctx;
    if (!ctx) return null;
    const res = await fetch(this.sources[key], { cache: 'force-cache' });
    const arr = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(arr.slice(0));
    this.decodedBuffers[key] = buf;
    return buf;
  },

  async _playViaWebAudio(key) {
    const ctx = this.ctx;
    if (!ctx) return false;
    const buf = await this._loadDecodedBuffer(key);
    if (!buf) return false;
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = 1.0;
    src.buffer = buf;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start(0);
    return true;
  },

  _pulseCard(key) {
    const card = document.getElementById('card-' + key);
    if (!card) return;
    card.classList.remove('voice-pulse');
    // Force reflow pour rejouer l'anim à chaque clic
    void card.offsetWidth;
    card.classList.add('voice-pulse');
    setTimeout(() => card.classList.remove('voice-pulse'), 460);
  },

  play(player) {
    const key = player === 'scott' ? 'scott' : (player === 'nolwen' ? 'nolwen' : null);
    if (!key) return;

    const now = Date.now();
    const elapsed = now - (this.lastPlayedAt[key] || 0);
    if (elapsed < this.cooldownMs) return;
    this.lastPlayedAt[key] = now;
    this.unlock();
    this._pulseCard(key);
    if (navigator.vibrate) navigator.vibrate(24);

    let audio = this.players[key];
    if (!audio) {
      audio = new Audio(this.sources[key]);
      audio.preload = 'auto';
      audio.playsInline = true;
      audio.volume = 0.95;
      this.players[key] = audio;
    }

    try { audio.currentTime = 0; } catch (_) {}
    const htmlPlay = new Promise((resolve, reject) => {
      try {
        const p = audio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => resolve(true)).catch(reject);
        } else {
          resolve(true);
        }
      } catch (e) {
        reject(e);
      }
    });

    Promise.allSettled([htmlPlay, this._playViaWebAudio(key)])
      .then(results => {
        const ok = results.some(r => r.status === 'fulfilled' && r.value === true);
        if (!ok) {
          App.toast("Audio limité pendant l'appel 📵");
        }
      });
  },
};

// ═══════════════════════════════════════════════════════════
//  APP — Actions principales
// ═══════════════════════════════════════════════════════════
const App = {

  // ─── Navigation ─────────────────────────────────────────
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (typeof App.updateChatDockVisibility === 'function') {
      App.updateChatDockVisibility();
    }
  },

  // ─── Choix du joueur ────────────────────────────────────
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
    AvatarVoices.play(name);
    App.updateChatDockVisibility();
  },

  // ─── Créer une salle ────────────────────────────────────
  async createRoom() {
    if (!State.player) { App.toast("Choisis d'abord ton nom ! 😊"); return; }

    const code = generateCode();
    State.roomCode = code;
    State.isHost   = true;
    State.lastMiniLeftAt = 0;
    State.lastRoomLeftAt = 0;
    State.lastLiveMessageId = '_';
    State.joinedAt = Date.now();
    App.clearLiveMessages();

    const roomData = {
      host:          State.player,
      guest:         null,
      leftBy:        '_',
      leftAt:        0,
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
      liveMessage:   { id: '_', from: '_', text: '', at: 0 },
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
        App.toast("Erreur Firebase 😕 Vérifie ta configuration.");
      }
    }
  },

  // ─── Rejoindre une salle ────────────────────────────────
  async joinRoom() {
    if (!State.player) { App.toast("Choisis d'abord ton nom ! 😊"); return; }

    const input = document.getElementById('join-code-input');
    const code  = input.value.trim().toUpperCase();
    if (code.length !== 6) { App.toast("Code à 6 caractères requis !"); return; }

    State.roomCode = code;
    State.isHost   = false;
    State.lastMiniLeftAt = 0;
    State.lastRoomLeftAt = 0;
    State.joinedAt = Date.now();
    App.clearLiveMessages();

    if (isFirebaseReady()) {
      try {
        const snap = await db.ref('rooms/' + code).get();
        if (!snap.exists()) { App.toast("Code introuvable 🔍 Vérifie le code !"); return; }
        const data = snap.val();
        State.lastLiveMessageId = data.liveMessage?.id || '_';
        if (data.guest && data.guest !== State.player) {
          App.toast("Cette salle est déjà complète !"); return;
        }
        await db.ref('rooms/' + code).update({
          guest:  State.player,
          leftBy: '_',
          leftAt: 0,
        });
        App.showScreen('screen-lobby');
        UI.setPlayerDot(State.player, true);
        App.setupListener(code);
        SFX.play('join');
      } catch (e) {
        App.toast("Erreur Firebase 😕 Vérifie ta configuration.");
      }
    }
  },

  // ─── Listener Firebase central ──────────────────────────
  setupListener(code) {
    if (!isFirebaseReady()) return;
    if (State.roomRef) State.roomRef.off();
    if (State._msgRef) { State._msgRef.off(); State._msgRef = null; }
    State.roomRef = db.ref('rooms/' + code);

    // Déconnexion brutale (fermeture onglet) → signaler aux autres
    if (State._leftRef) { State._leftRef.onDisconnect().cancel(); }
    State._leftRef = db.ref('rooms/' + code);
    State._leftRef.onDisconnect().update({
      leftBy: State.player,
      leftAt: firebase.database.ServerValue.TIMESTAMP,
    });

    // Listener principal (état du salon)
    State.roomRef.on('value', snap => {
      if (!snap.exists()) return;
      App.handleRoomUpdate(snap.val());
    });

    // Listener chat séparé — child_added pour ne jamais écraser les messages simultanés
    const chatStart = State.joinedAt || Date.now();
    State._msgRef = db.ref('rooms/' + code + '/messages')
      .orderByChild('at')
      .startAt(chatStart)
      .limitToLast(30);
    State._msgRef.on('child_added', snap => {
      if (!snap.exists()) return;
      App.handleLiveMessage(snap.val());
    });
  },

  // ─── Quitter proprement ──────────────────────────────────
  leaveRoom() {
    App.stopTimer();
    App.clearLiveMessages();
    if (typeof GameHub !== 'undefined' && typeof GameHub.cleanup === 'function') {
      GameHub.cleanup();
    }
    if (State._msgRef) { State._msgRef.off(); State._msgRef = null; }
    if (State._leftRef) {
      State._leftRef.onDisconnect().cancel();
      State._leftRef = null;
    }
    if (State.roomRef) {
      State.roomRef.update({
        leftBy: State.player,
        leftAt: Date.now(),
      }).catch(() => {});
    }
    if (State.roomRef) { State.roomRef.off(); State.roomRef = null; }
    State.roomCode = null;
    State.isHost = false;
    State.selectedMode = null;
    State.mode = null;
    State.myAnswer = null;
    State.computing = false;
    State.lastStatus = null;
    State.lastRoomLeftAt = 0;
    State.lastLiveMessageId = '_';
    State.joinedAt = 0;
    const chatInput = document.getElementById('chat-live-input');
    if (chatInput) chatInput.value = '';
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
      leftBy:      '_',
      leftAt:      0,
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
    // Le chat est géré par le listener child_added séparé dans setupListener

    const roomLeftAt = Number(data.leftAt || 0);
    const isFreshLeave = !!roomLeftAt && roomLeftAt !== State.lastRoomLeftAt && roomLeftAt >= (State.joinedAt || 0);
    if (isFreshLeave) State.lastRoomLeftAt = roomLeftAt;

    if (isFreshLeave && data.leftBy && data.leftBy !== '_' && data.leftBy !== State.player && data.activeFlow !== 'mini') {
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
      App.updateChatDockVisibility();
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
          if (data.leftBy && data.leftBy !== '_') {
            State.roomRef.update({ leftBy: '_', leftAt: 0 }).catch(() => {});
          }
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
    App.updateChatDockVisibility();
  },

  // ─── Sélection du mode ──────────────────────────────────
  selectMode(mode) {
    State.selectedMode = mode;
    document.querySelectorAll('.mode-card').forEach(c =>
      c.classList.toggle('selected', c.dataset.mode === mode)
    );
    document.getElementById('start-game-btn').classList.remove('hidden');
    SFX.play('select');
  },

  // ─── Lancer le jeu ──────────────────────────────────────
  async startGame() {
    if (!State.selectedMode) { App.toast("Choisis un mode d'abord !"); return; }
    if (!isFirebaseReady())  { App.toast("Firebase non configuré — voir README.md"); return; }

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

  // ─── Soumettre une réponse ──────────────────────────────
  async submitAnswer(index) {
    if (State.myAnswer !== null) return; // déjà répondu
    State.myAnswer = index;

    // Feedback visuel immédiat
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
      // Le listener global détectera que les deux ont répondu et appellera computeResult
    }
  },

  // ─── Calculer le résultat (hôte seulement) ──────────────
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

  // ─── Question suivante ───────────────────────────────────
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

  // ─── Timer ───────────────────────────────────────────────
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

  // ─── Copier le code ──────────────────────────────────────
  copyCode() {
    if (!State.roomCode) return;
    navigator.clipboard.writeText(State.roomCode)
      .then(() => App.toast("Code copié ! 📋"))
      .catch(() => App.toast("Code : " + State.roomCode));
  },

  updateChatDockVisibility() {
    const dock = document.getElementById('chat-dock');
    if (!dock) return;
    const activeId = document.querySelector('.screen.active')?.id || '';
    const shouldShow = !!State.roomCode && !!State.player && activeId !== 'screen-welcome' && activeId !== 'screen-setup';
    dock.classList.toggle('hidden', !shouldShow);
    document.body.classList.toggle('with-chat', shouldShow);
    if (!shouldShow) {
      const input = document.getElementById('chat-live-input');
      if (input) input.blur();
    }
  },

  clearLiveMessages() {
    const layer = document.getElementById('live-msg-layer');
    if (layer) layer.innerHTML = '';
  },

  insertChatEmoji(emoji) {
    const input = document.getElementById('chat-live-input');
    if (!input) return;
    const base = (input.value || '').trim();
    input.value = base ? `${base} ${emoji}` : emoji;
    input.focus();
    input.selectionStart = input.selectionEnd = input.value.length;
  },

  async sendLiveMessage() {
    if (!State.roomRef || !State.roomCode || !State.player || !isFirebaseReady()) return;
    const input = document.getElementById('chat-live-input');
    if (!input) return;
    const text = (input.value || '').trim().replace(/\s+/g, ' ');
    if (!text) return;

    const payload = {
      from: State.player,
      text: text.slice(0, 140),
      at: Date.now(),
    };

    input.value = '';
    try {
      // push() crée un nœud unique → pas d'écrasement si les deux écrivent en même temps
      await db.ref('rooms/' + State.roomCode + '/messages').push(payload);
      SFX.play('chat');
    } catch (_) {
      App.toast("Message non envoyé 😕");
    }
  },

  handleLiveMessage(msg) {
    if (!msg || !msg.text) return;
    // Déduplication par timestamp+auteur (au cas où le listener se déclenche deux fois)
    const key = `${msg.from}:${msg.at}`;
    if (key === State._lastMsgKey) return;
    State._lastMsgKey = key;
    App.showLiveMessageBubble(msg);
    if (msg.from && msg.from !== State.player) {
      SFX.play('chat');
    }
  },

  showLiveMessageBubble(msg) {
    const layer = document.getElementById('live-msg-layer');
    if (!layer) return;

    const bubble = document.createElement('div');
    const isMine = msg.from === State.player;
    bubble.className = 'live-msg-bubble' + (isMine ? ' mine' : '');

    const stackIndex = layer.children.length % 5;
    bubble.style.setProperty('--top', `calc(12% + ${stackIndex * 56}px)`);

    const fromLabel = document.createElement('span');
    fromLabel.className = 'live-msg-name';
    fromLabel.textContent = msg.from === 'scott' ? 'Scott' : msg.from === 'nolwen' ? 'Nolwen' : 'Salon';

    const msgText = document.createElement('span');
    msgText.className = 'live-msg-text';
    msgText.textContent = msg.text;

    bubble.appendChild(fromLabel);
    bubble.appendChild(msgText);
    layer.appendChild(bubble);

    setTimeout(() => bubble.remove(), 4200);
  },

  // ─── Toast ───────────────────────────────────────────────
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

  // ─── Recommencer ─────────────────────────────────────────
  restart() {
    App.stopTimer();
    if (State._msgRef) { State._msgRef.off(); State._msgRef = null; }
    if (State.roomRef) State.roomRef.off();
    if (typeof GameHub !== 'undefined' && typeof GameHub.cleanup === 'function') {
      GameHub.cleanup();
    }

    Object.assign(State, {
      player: null, roomCode: null, isHost: false, mode: null,
      selectedMode: null, roomRef: null, lastStatus: null,
      myAnswer: null, computing: false, _lastQ: undefined,
      lastMiniLeftAt: 0, lastRoomLeftAt: 0, lastLiveMessageId: '_', _lastMsgKey: '', joinedAt: 0,
    });

    document.querySelectorAll('.player-card').forEach(c => {
      c.classList.remove('selected');
      c.querySelector('.player-check').classList.add('hidden');
    });
    document.getElementById('room-options').classList.add('hidden');
    document.getElementById('join-code-input').value = '';
    const chatInput = document.getElementById('chat-live-input');
    if (chatInput) chatInput.value = '';
    document.getElementById('mode-select').classList.add('hidden');
    const salonGames = document.getElementById('salon-games');
    if (salonGames) salonGames.classList.add('hidden');
    document.getElementById('room-code-display').classList.add('hidden');
    document.getElementById('lobby-waiting').classList.remove('hidden');
    document.getElementById('lobby-waiting-msg').textContent = "En attente de l'autre joueur…";
    document.getElementById('start-game-btn').classList.add('hidden');
    document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
    ['scott', 'nolwen'].forEach(p => {
      UI.setPlayerDot(p, false);
      document.getElementById('pstatus-' + p)?.classList.remove('connected');
    });

    // Annuler le handler de déconnexion proprement
    if (State._leftRef) { State._leftRef.onDisconnect().cancel(); State._leftRef = null; }
    if (State.roomRef)  { State.roomRef.off(); State.roomRef = null; }

    App.clearLiveMessages();
    App.showScreen('screen-welcome');
    App.updateChatDockVisibility();
    SFX.play('select');
  },
};

// ═══════════════════════════════════════════════════════════
//  UI — Rendu de l'interface
// ═══════════════════════════════════════════════════════════
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

    // Étiquette de ronde
    const label = document.getElementById('round-label');
    if (question.type === 'match') {
      label.textContent = "Choisissez votre préférence ! 💕";
    } else {
      const isHostQ   = data.currentQ % 2 === 0;
      const owner     = isHostQ ? data.host : data.guest;
      const ownerName = owner.charAt(0).toUpperCase() + owner.slice(1);
      label.textContent = State.player === owner
        ? `C'est ta question, ${ownerName} ! Réponds honnêtement 🎯`
        : `Qu'est-ce que ${ownerName} va répondre ? Devine ! 🤔`;
    }

    // Question
    document.getElementById('question-text').textContent = question.q;

    // Réponses
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

    const fmt = (a) => (a !== null && a >= 0) ? question.a[a] : "⏱️ Temps écoulé";
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
      // Owner: toujours "match" (il répond sur lui-même)
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
      anim.textContent  = '💞';
      title.textContent = 'Vous êtes synchronisés !';
      msg.textContent   = question.type === 'match'
        ? 'Même réponse — vous vous connaissez parfaitement !'
        : 'Bonne devinette — connexion extraordinaire ! 🔮';
      SFX.play('correct');
    } else {
      anim.textContent  = '😂';
      title.textContent = 'Réponses différentes !';
      msg.textContent   = randomFrom(TROLL_MESSAGES);
      SFX.play('wrong');
    }

    document.getElementById('result-score-scott').textContent  = data.scores.scott  || 0;
    document.getElementById('result-score-nolwen').textContent = data.scores.nolwen || 0;

    // Bouton suivant : hôte seulement
    const nextBtn  = document.getElementById('next-btn');
    const nextWait = document.getElementById('next-waiting-msg');
    const isLast   = (data.currentQ + 1) >= QUESTIONS_PER_GAME;

    if (State.isHost) {
      nextBtn.classList.remove('hidden');
      nextWait.classList.add('hidden');
      nextBtn.textContent = isLast ? 'Voir les résultats 🏆' : 'Question suivante ➔';
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
      winnerBlock.textContent = '👨 Scott remporte la partie !';
      loveMsg.textContent     = randomFrom(LOSER_MESSAGES_NOLWEN);
    } else if (nScore > sScore) {
      winnerBlock.textContent = '👩 Nolwen remporte la partie !';
      loveMsg.textContent     = randomFrom(LOSER_MESSAGES_SCOTT);
    } else {
      winnerBlock.textContent = '🤝 Égalité parfaite !';
      loveMsg.textContent     = randomFrom(DRAW_MESSAGES);
    }

    SFX.play('win');
  },
};

// ═══════════════════════════════════════════════════════════
//  SFX — Sons (Web Audio API)
// ═══════════════════════════════════════════════════════════
const SFX = {
  _ctx: null,
  _meowPool: [],
  _meowPoolSize: 4,
  _meowSrc: 'miaule.mp3',
  get ctx() {
    if (!this._ctx) {
      try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
    }
    return this._ctx;
  },

  _ensureMeowPool() {
    if (this._meowPool.length) return;
    for (let i = 0; i < this._meowPoolSize; i++) {
      const a = new Audio(this._meowSrc);
      a.preload = 'auto';
      a.volume = 0.85;
      this._meowPool.push(a);
    }
  },

  _playMeowFile() {
    this._ensureMeowPool();
    let slot = this._meowPool.find(a => a.paused || a.ended);
    if (!slot) slot = this._meowPool[0];
    if (!slot) return Promise.reject(new Error('no-audio-slot'));
    slot.currentTime = 0;
    return slot.play();
  },

  _playMeowSynth() {
    if (!this.ctx) return;
    const t   = this.ctx.currentTime;
    const ctx = this.ctx;

    // Oscillateur principal (voix)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    // Filtre passe-bande pour sonorité nasale de chaton
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 1.5;

    osc.type = 'sawtooth';
    // Glissement de fréquence : miii-aou
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
      case 'chat':
        this._tone(880, 'triangle', 0.08, 0.08, 0);
        this._tone(1175, 'triangle', 0.11, 0.07, 0.08);
        break;
      case 'meow':
        this._playMeowFile().catch(() => this._playMeowSynth());
        break;
    }
  },
};

// ═══════════════════════════════════════════════════════════
//  CONFETTI
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
//  CŒURS FLOTTANTS (fond)
// ═══════════════════════════════════════════════════════════
function initHearts() {
  const container = document.getElementById('hearts-bg');
  // Use unicode escapes to avoid mojibake on some cached/encoded versions.
  const hearts = [
    '\u2764\uFE0F', // ❤️
    '\u{1F495}',    // 💕
    '\u{1F497}',    // 💗
    '\u{1F493}',    // 💓
    '\u{1F496}',    // 💖
    '\u2728',       // ✨
    '\u{1F338}',    // 🌸
    '\u{1F49D}',    // 💝
    '\u{1F339}',    // 🌹
    '\u{1F929}',    // 🤩
    '\u{1F970}',    // 🥰
    '\u{1F60F}',    // 😏
    '\u{1F525}',    // 🔥
  ];
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

function initShootingStars() {
  const container = document.getElementById('shooting-stars-bg');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    const sx = 50 + Math.random() * 45;
    const sy = 4 + Math.random() * 54;
    const len = 90 + Math.random() * 120;
    const dur = 2.4 + Math.random() * 2.8;
    const delay = Math.random() * 6;
    const angle = -18 - Math.random() * 24;
    star.style.cssText = `
      --sx: ${sx}%;
      --sy: ${sy}%;
      --len: ${len}px;
      --dur: ${dur}s;
      --delay: ${delay}s;
      --angle: ${angle}deg;
    `;
    container.appendChild(star);
  }
}

// ═══════════════════════════════════════════════════════════
//  UTILITAIRES
// ═══════════════════════════════════════════════════════════
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ═══════════════════════════════════════════════════════════
//  CHAT REBONDISSANT (écran accueil)
// ═══════════════════════════════════════════════════════════
const CatBounce = {
  el: null,
  x: 0, y: 0,
  vx: 2.8, vy: 2.2,
  size: 90,
  raf: null,
  active: false,
  lastMeow: 0,

  init() {
    this.el = document.getElementById('cat-bounce');
    if (!this.el) return;
    if (this.active) return;
    this.x = Math.random() * (window.innerWidth  - this.size);
    this.y = Math.random() * (window.innerHeight - this.size);
    this.el.style.display = 'block';
    this.active = true;
    this.loop();
  },

  stop() {
    this.active = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    if (this.el) this.el.style.display = 'none';
  },

  loop() {
    if (!this.active || !this.el) return;
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

// ═══════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initHearts();
  initShootingStars();
  CatBounce.init();
  AvatarVoices.initUnlockHooks();
  App.updateChatDockVisibility();

  // Stopper le chat quand on quitte l'accueil
  const origShowScreen = App.showScreen.bind(App);
  App.showScreen = function(id) {
    origShowScreen(id);
    if (id === 'screen-welcome') {
      CatBounce.init();
    } else {
      CatBounce.stop();
    }
    App.updateChatDockVisibility();
  };
});
