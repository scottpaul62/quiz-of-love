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
};

const MODE_META = {
  connaissance: { emoji: "🧠", label: "Connaissance" },
  hot:          { emoji: "🔥", label: "Hot & Spicy"  },
  couple:       { emoji: "💕", label: "Couple Goals"  },
  defi:         { emoji: "🎭", label: "Défi Fou"      },
};

// ═══════════════════════════════════════════════════════════
//  APP — Actions principales
// ═══════════════════════════════════════════════════════════
const App = {

  // ─── Navigation ─────────────────────────────────────────
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
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
    SFX.play('select');
  },

  // ─── Créer une salle ────────────────────────────────────
  async createRoom() {
    if (!State.player) { App.toast("Choisis d'abord ton nom ! 😊"); return; }

    const code = generateCode();
    State.roomCode = code;
    State.isHost   = true;

    const roomData = {
      host:          State.player,
      guest:         null,
      status:        "lobby",
      mode:          null,
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

    if (isFirebaseReady()) {
      try {
        const snap = await db.ref('rooms/' + code).get();
        if (!snap.exists()) { App.toast("Code introuvable 🔍 Vérifie le code !"); return; }
        const data = snap.val();
        if (data.guest && data.guest !== State.player) {
          App.toast("Cette salle est déjà complète !"); return;
        }
        await db.ref('rooms/' + code).update({ guest: State.player });
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
    State.roomRef = db.ref('rooms/' + code);
    State.roomRef.on('value', snap => {
      if (!snap.exists()) return;
      App.handleRoomUpdate(snap.val());
    });
  },

  handleRoomUpdate(data) {
    const status = data.status;

    // Toujours : mise à jour des indicateurs de connexion
    if (data.host)  UI.setPlayerDot(data.host,  true);
    if (data.guest) UI.setPlayerDot(data.guest, true);

    // ── LOBBY ──
    if (status === 'lobby') {
      const bothConnected = !!(data.host && data.guest);
      document.getElementById('lobby-waiting').classList.toggle('hidden', bothConnected);
      if (bothConnected) {
        if (State.isHost) {
          document.getElementById('mode-select').classList.remove('hidden');
        } else {
          document.getElementById('lobby-waiting').classList.remove('hidden');
          document.getElementById('lobby-waiting-msg').textContent =
            "En attente que l'hôte choisisse le mode… 🎮";
        }
      }
    }

    // ── QUESTION ──
    if (status === 'question') {
      // Première fois qu'on voit cette question → afficher l'UI
      if (State.lastStatus !== 'question' || data.currentQ !== State._lastQ) {
        State._lastQ   = data.currentQ;
        State.myAnswer = null;
        State.computing = false;
        App.showScreen('screen-game');
        UI.showQuestion(data);
        App.startTimer(data);
      }

      // Mise à jour des scores en live
      document.getElementById('score-scott').textContent  = data.scores?.scott  ?? 0;
      document.getElementById('score-nolwen').textContent = data.scores?.nolwen ?? 0;

      // L'hôte calcule le résultat quand les deux ont répondu
      if (State.isHost && !State.computing &&
          data.answers?.scott !== null && data.answers?.nolwen !== null &&
          data.answers?.scott !== undefined && data.answers?.nolwen !== undefined) {
        State.computing = true;
        App.computeResult(data);
      }
    }

    // ── RÉSULTAT ──
    if (status === 'result' && State.lastStatus !== 'result') {
      App.stopTimer();
      App.showScreen('screen-result');
      UI.showRoundResult(data);
    }

    // ── TERMINÉ ──
    if (status === 'finished' && State.lastStatus !== 'finished') {
      App.stopTimer();
      App.showScreen('screen-final');
      UI.showFinalScore(data);
      Confetti.burst();
    }

    State.lastStatus = status;
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
      mode:          State.selectedMode,
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
    if (State.roomRef) State.roomRef.off();

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
    document.getElementById('room-code-display').classList.add('hidden');
    document.getElementById('lobby-waiting').classList.remove('hidden');
    document.getElementById('lobby-waiting-msg').textContent = "En attente de l'autre joueur…";
    document.getElementById('start-game-btn').classList.add('hidden');
    document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
    ['scott', 'nolwen'].forEach(p => {
      UI.setPlayerDot(p, false);
      document.getElementById('pstatus-' + p)?.classList.remove('connected');
    });

    App.showScreen('screen-welcome');
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
      anim.textContent  = '😄';
      title.textContent = 'Réponses différentes !';
      msg.textContent   = question.type === 'match'
        ? 'Vous êtes complémentaires après tout… 😉'
        : 'Il reste des secrets à découvrir ! 🕵️';
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
      loveMsg.textContent     = '"Bravo Scott ! Mais Nolwen se rattrapera la prochaine fois… ou pas 😉"';
    } else if (nScore > sScore) {
      winnerBlock.textContent = '👩 Nolwen remporte la partie !';
      loveMsg.textContent     = '"Quelle victoire Nolwen ! Scott, t\'as encore du boulot 😂"';
    } else {
      winnerBlock.textContent = '🤝 Égalité parfaite !';
      loveMsg.textContent     = '"Vous êtes vraiment faits l\'un pour l\'autre — même score, même âme 💕"';
    }

    SFX.play('win');
  },
};

// ═══════════════════════════════════════════════════════════
//  SFX — Sons (Web Audio API)
// ═══════════════════════════════════════════════════════════
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
  const hearts = ['❤️', '💕', '💗', '💓', '💖', '✨', '🌸', '💝', '🌹'];
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

// ═══════════════════════════════════════════════════════════
//  UTILITAIRES
// ═══════════════════════════════════════════════════════════
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ═══════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initHearts();

  // Firebase configuré ✓
});
