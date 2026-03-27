// ═══════════════════════════════════════════════════════════
//  QUIZ OF LOVE — Mini-jeux
//  Morpion · Puissance 4 · PFC · Vérité/Défi · Uno · Bataille
// ═══════════════════════════════════════════════════════════

// ─── HUB ────────────────────────────────────────────────────
const GameHub = {
  type: null,
  player: null,
  roomCode: null,
  isHost: false,
  roomRef: null,
  _leftRef: null,
  sessionId: 0,
  active: false,
  joinedAt: 0,
  lastLeftAt: 0,

  select(type) {
    if (!State.roomCode) { App.toast("Rejoins d'abord le salon avec le code."); return; }
    App.launchMiniGame(type);
  },

  createRoom() {
    if (!this.type) { App.toast("Choisis d'abord un mini-jeu."); return; }
    App.launchMiniGame(this.type);
  },

  joinRoom() {
    App.toast("Le code du mini-jeu est maintenant le meme que le salon.");
  },

  async attachSharedMini(roomData) {
    if (!isFirebaseReady() || !State.roomCode || !State.player) return;

    const nextType = roomData.miniType;
    const nextSession = roomData.miniSession || Date.now();

    if (this.active && this.sessionId === nextSession && this.type === nextType) {
      return;
    }

    this.cleanup();
    this.type = nextType;
    this.player = State.player;
    this.roomCode = State.roomCode;
    this.isHost = !!State.isHost;
    this.sessionId = nextSession;
    this.active = true;
    this.joinedAt = Date.now();
    this.lastLeftAt = 0;

    this.setupListener(this.roomCode);

    if (this.isHost) {
      // Vérifie si une partie avec la même session existe déjà
      // (reconnexion après coupure) → ne pas remettre à zéro
      const existSnap = await db.ref('games/' + this.roomCode).get();
      const exist = existSnap.val();
      if (exist && exist.sessionId === this.sessionId) {
        // Reprendre la partie : effacer le flag de déconnexion stale
        await db.ref('games/' + this.roomCode).update({ leftBy: '_', leftAt: 0 });
      } else {
        // Nouvelle partie
        const gs = this.initState(this.type);
        await db.ref('games/' + this.roomCode).set({
          host: roomData.host || 'scott',
          guest: roomData.guest || 'nolwen',
          type: this.type,
          status: 'playing',
          sessionId: this.sessionId,
          gameState: gs,
          leftBy: '_',
          leftAt: 0,
          createdAt: Date.now(),
        });
      }
    } else {
      // Invité qui se reconnecte : effacer son propre flag de déconnexion
      const existSnap = await db.ref('games/' + this.roomCode).get();
      const exist = existSnap.val();
      if (exist && exist.leftBy === this.player) {
        await db.ref('games/' + this.roomCode).update({ leftBy: '_', leftAt: 0 });
      }
    }
  },

  setupListener(code) {
    if (!isFirebaseReady()) return;
    if (this.roomRef) this.roomRef.off();
    this.roomRef = db.ref('games/' + code);
    if (this._leftRef) { this._leftRef.onDisconnect().cancel(); }
    this._leftRef = db.ref('games/' + code);
    this._leftRef.onDisconnect().update({
      leftBy: this.player,
      leftAt: firebase.database.ServerValue.TIMESTAMP,
    });

    this.roomRef.on('value', snap => {
      if (!snap.exists()) return;
      const data = snap.val();

      if (data.sessionId && this.sessionId && data.sessionId !== this.sessionId) return;

      const leftAt = Number(data.leftAt || 0);
      const freshLeft = !!leftAt && leftAt !== GameHub.lastLeftAt && leftAt >= (GameHub.joinedAt || 0);
      if (freshLeft) GameHub.lastLeftAt = leftAt;

      if (freshLeft && data.leftBy && data.leftBy !== '_' && data.leftBy !== GameHub.player) {
        const name = data.leftBy === 'scott' ? 'Scott' : 'Nolwen';
        GameHub.cleanup();
        App.showScreen('screen-lobby');
        App.toast(`${name} a quitte le mini-jeu`);
        return;
      }

      if (data.host)  setGameDot(data.host, true);
      if (data.guest) setGameDot(data.guest, true);

      if (data.status === 'playing' || data.status === 'setup') {
        const dispatch = { morpion: Morpion, p4: P4, pfc: PFC, vod: VOD, uno: Uno, bataille: BN, dessin: DrawGame };
        const game = dispatch[data.type];
        if (game) game.handleUpdate(data);
      }
    });
  },

  initState(type) {
    switch(type) {
      case 'morpion':  return { board: Array(9).fill('_'),  turn: 'scott', winner: '_', scores: {scott:0, nolwen:0} };
      case 'p4':       return { board: Array(42).fill('_'), turn: 'scott', winner: '_', scores: {scott:0, nolwen:0} };
      case 'pfc':      return { choices: {scott:'_', nolwen:'_'}, scores: {scott:0, nolwen:0}, round: 0 };
      case 'vod':      return { turn: 'scott', pick: '_', questionIdx: -1, questionText: '_', status: 'choosing', usedVerite: [], usedDefi: [], lastQuestion: '_' };
      case 'uno':      return Uno.buildInitialState();
      case 'bataille': return { statusPhase: 'setup', shipsScott: 'none', shipsNolwen: 'none', shotsScott: 'none', shotsNolwen: 'none', turn: 'scott' };
      case 'dessin':   return DrawGame.buildInitialState();
      default:         return {};
    }
  },

  copyCode() {
    if (State.roomCode) navigator.clipboard.writeText(State.roomCode)
      .then(() => App.toast('Code copie'))
      .catch(() => App.toast('Code : ' + State.roomCode));
  },

  cleanup() {
    if (this.roomRef) { this.roomRef.off(); this.roomRef = null; }
    if (this._leftRef) { this._leftRef.onDisconnect().cancel(); this._leftRef = null; }
    if (typeof DrawGame !== 'undefined' && typeof DrawGame.cleanupLocal === 'function') {
      DrawGame.cleanupLocal();
    }
    this.active = false;
    this.sessionId = 0;
    this.joinedAt = 0;
    this.lastLeftAt = 0;
    this.type = null;
    setGameDot('scott', false);
    setGameDot('nolwen', false);
  },

  exitLobby() {
    App.showScreen('screen-lobby');
  },

  async exitGame() {
    if (this.roomRef) {
      this.roomRef.update({ leftBy: this.player, leftAt: Date.now() }).catch(() => {});
    }

    if (State.roomCode && isFirebaseReady()) {
      await db.ref('rooms/' + State.roomCode).update({
        status: 'lobby',
        activeFlow: 'lobby',
        miniType: '_',
        miniSession: 0,
        miniLeftBy: this.player || State.player || '_',
        miniLeftAt: Date.now(),
      }).catch(() => {});
    }

    this.cleanup();
    App.showScreen('screen-lobby');
    SFX.play('select');
  },
};

// helper (utilise directement l'élément DOM, pas besoin de UI)
function setGameDot(player, on) {
  const d = document.getElementById('gdot-' + player);
  const c = document.getElementById('gpstatus-' + player);
  if (d) d.classList.toggle('online', on);
  if (c) c.classList.toggle('connected', on);
}

function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort((a, b) => Number(a) - Number(b))
      .map(k => value[k]);
  }
  return [];
}

// ═══════════════════════════════════════════════════════════
//  MORPION LOVE
// ═══════════════════════════════════════════════════════════
const Morpion = {
  _lastBoard: null,

  handleUpdate(data) {
    const gs = data.gameState;
    if (!gs) return;
    App.showScreen('screen-morpion');
    this.render(gs, data);
  },

  render(gs, data) {
    document.getElementById('m-score-scott').textContent  = gs.scores?.scott  || 0;
    document.getElementById('m-score-nolwen').textContent = gs.scores?.nolwen || 0;

    const isMyTurn = gs.turn === GameHub.player;
    const status = document.getElementById('morpion-status');
    const turnName = gs.turn === 'scott' ? 'Scott' : 'Nolwen';
    const hasWin = gs.winner && gs.winner !== '_';
    status.textContent = hasWin
      ? (gs.winner === 'draw' ? 'Match nul !' : `${gs.winner === 'scott' ? 'Scott' : 'Nolwen'} gagne ! 🎉`)
      : (isMyTurn ? 'À toi de jouer ! 🎯' : `Tour de ${turnName}…`);

    const board = document.getElementById('morpion-board');
    board.innerHTML = '';
    const symbols = { scott: '💙', nolwen: '🩷' };
    // Firebase retourne parfois un objet {0:x,1:x,...} au lieu d'un array
    const boardArr = Array.isArray(gs.board) ? gs.board : Object.values(gs.board || {});
    boardArr.forEach((cell, i) => {
      const empty = !cell || cell === '_';
      const btn = document.createElement('button');
      btn.className = 'morpion-cell' + (!empty ? ' taken' : '') + (isMyTurn && empty && !hasWin ? ' playable' : '');
      btn.textContent = empty ? '' : (symbols[cell] || cell);
      if (empty && isMyTurn && !hasWin) btn.onclick = () => this.play(i, gs, data);
      board.appendChild(btn);
    });

    const resultDiv = document.getElementById('morpion-result');
    if (hasWin) {
      resultDiv.classList.remove('hidden');
      const msg = document.getElementById('morpion-result-msg');
      msg.textContent = gs.winner === 'draw' ? '🤝 Match nul !' :
        gs.winner === GameHub.player ? '🏆 Tu as gagné !' : '😅 Tu as perdu !';
      document.getElementById('morpion-replay-btn').classList.toggle('hidden', !GameHub.isHost);
      document.getElementById('morpion-replay-wait').classList.toggle('hidden', GameHub.isHost);
    } else {
      resultDiv.classList.add('hidden');
    }

  },

  async play(i, gs, data) {
    const boardArr = Array.isArray(gs.board) ? gs.board : Object.values(gs.board || {});
    const newBoard = [...boardArr];
    newBoard[i] = GameHub.player;
    const full      = newBoard.every(c => c && c !== '_');
    const winResult = this.checkWinner(newBoard);
    const winner    = winResult || (full ? 'draw' : '_');
    const realWin   = winner !== '_';
    const newScores = { ...gs.scores };
    if (realWin && winner !== 'draw') newScores[winner] = (newScores[winner] || 0) + 1;
    const nextTurn = GameHub.player === 'scott' ? 'nolwen' : 'scott';
    await GameHub.roomRef.update({
      'gameState/board':  newBoard,
      'gameState/turn':   realWin ? gs.turn : nextTurn,
      'gameState/winner': winner,
      'gameState/scores': newScores,
    });
    SFX.play(realWin && winner !== 'draw' ? 'correct' : 'answer');
  },

  checkWinner(b) {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,bb,c] of lines) {
      if (b[a] && b[a] !== '_' && b[a] === b[bb] && b[a] === b[c]) return b[a];
    }
    return null;
  },

  async restart() {
    await GameHub.roomRef.update({
      gameState: { board: Array(9).fill('_'), turn: 'scott', winner: '_', scores: { scott: parseInt(document.getElementById('m-score-scott').textContent)||0, nolwen: parseInt(document.getElementById('m-score-nolwen').textContent)||0 } }
    });
  },
};

// ═══════════════════════════════════════════════════════════
//  PUISSANCE 4
// ═══════════════════════════════════════════════════════════
const P4 = {
  ROWS: 6, COLS: 7,

  handleUpdate(data) {
    const gs = data.gameState;
    if (!gs) return;
    App.showScreen('screen-p4');
    this.render(gs);
  },

  render(gs) {
    document.getElementById('p4-score-scott').textContent  = gs.scores?.scott  || 0;
    document.getElementById('p4-score-nolwen').textContent = gs.scores?.nolwen || 0;

    const isMyTurn = gs.turn === GameHub.player;
    const turnName = gs.turn === 'scott' ? 'Scott' : 'Nolwen';
    const status = document.getElementById('p4-status');
    const p4HasWin = gs.winner && gs.winner !== '_';
    status.textContent = p4HasWin
      ? (gs.winner === 'draw' ? 'Grille pleine — match nul !' : `${gs.winner === 'scott' ? 'Scott' : 'Nolwen'} gagne ! 🎉`)
      : (isMyTurn ? 'À toi de jouer ! 🎯' : `Tour de ${turnName}…`);

    // Colonnes
    const colBtns = document.getElementById('p4-col-btns');
    colBtns.innerHTML = '';
    for (let c = 0; c < this.COLS; c++) {
      const btn = document.createElement('button');
      btn.className = 'p4-col-btn' + (isMyTurn && !p4HasWin ? ' active' : '');
      btn.textContent = '▼';
      btn.disabled = !isMyTurn || p4HasWin;
      const col = c;
      btn.onclick = () => this.drop(col, gs);
      colBtns.appendChild(btn);
    }

    // Grille
    const boardArr4 = Array.isArray(gs.board) ? gs.board : Object.values(gs.board || {});
    const board4 = document.getElementById('p4-board');
    board4.innerHTML = '';
    const colors = { scott: '💙', nolwen: '🩷' };
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        const cell = document.createElement('div');
        const val  = boardArr4[r * this.COLS + c];
        const empty = !val || val === '_';
        cell.className = 'p4-cell' + (!empty ? ` p4-${val}` : '');
        cell.textContent = empty ? '' : (colors[val] || val);
        board4.appendChild(cell);
      }
    }

    const res = document.getElementById('p4-result');
    if (p4HasWin) {
      res.classList.remove('hidden');
      document.getElementById('p4-result-msg').textContent = gs.winner === 'draw' ? '🤝 Match nul !' :
        gs.winner === GameHub.player ? '🏆 Tu as gagné !' : '😅 Tu as perdu !';
      document.getElementById('p4-replay-btn').classList.toggle('hidden', !GameHub.isHost);
      document.getElementById('p4-replay-wait').classList.toggle('hidden', GameHub.isHost);
    } else {
      res.classList.add('hidden');
    }
  },

  async drop(col, gs) {
    const boardArr = Array.isArray(gs.board) ? gs.board : Object.values(gs.board || {});
    const newBoard = [...boardArr];
    let row = -1;
    for (let r = this.ROWS - 1; r >= 0; r--) {
      const v = newBoard[r * this.COLS + col];
      if (!v || v === '_') { row = r; break; }
    }
    if (row === -1) return;
    newBoard[row * this.COLS + col] = GameHub.player;
    const full4     = newBoard.every(c => c && c !== '_');
    const winResult = this.checkWinner(newBoard);
    const winner    = winResult || (full4 ? 'draw' : '_');
    const realWin   = winner !== '_';
    const newScores = { ...gs.scores };
    if (realWin && winner !== 'draw') newScores[winner] = (newScores[winner] || 0) + 1;
    const nextTurn = GameHub.player === 'scott' ? 'nolwen' : 'scott';
    await GameHub.roomRef.update({
      'gameState/board':  newBoard,
      'gameState/turn':   realWin ? gs.turn : nextTurn,
      'gameState/winner': winner,
      'gameState/scores': newScores,
    });
    SFX.play(realWin && winner !== 'draw' ? 'correct' : 'answer');
  },

  checkWinner(b) {
    const R = this.ROWS, C = this.COLS;
    const check = (r, c, dr, dc) => {
      const v = b[r*C+c];
      if (!v || v === '_') return null;
      for (let i = 1; i < 4; i++) {
        const nr = r+dr*i, nc = c+dc*i;
        if (nr<0||nr>=R||nc<0||nc>=C||b[nr*C+nc]!==v) return null;
      }
      return v;
    };
    for (let r=0;r<R;r++) for(let c=0;c<C;c++) {
      const w = check(r,c,0,1)||check(r,c,1,0)||check(r,c,1,1)||check(r,c,1,-1);
      if (w) return w;
    }
    return null;
  },

  async restart() {
    await GameHub.roomRef.update({
      gameState: { board: Array(42).fill('_'), turn: 'scott', winner: '_', scores: { scott: parseInt(document.getElementById('p4-score-scott').textContent)||0, nolwen: parseInt(document.getElementById('p4-score-nolwen').textContent)||0 } }
    });
  },
};

// ═══════════════════════════════════════════════════════════
//  PIERRE FEUILLE CISEAUX
// ═══════════════════════════════════════════════════════════
const PFC = {
  _myChoice: null,
  _lastAutoResetRound: -1,

  handleUpdate(data) {
    const gs = data.gameState;
    if (!gs) return;
    App.showScreen('screen-pfc');
    this.render(gs);
  },

  render(gs) {
    document.getElementById('pfc-score-scott').textContent  = gs.scores?.scott  || 0;
    document.getElementById('pfc-score-nolwen').textContent = gs.scores?.nolwen || 0;

    const myChoice    = gs.choices[GameHub.player];
    const enemyPlayer = GameHub.player === 'scott' ? 'nolwen' : 'scott';
    const enemyChoice = gs.choices[enemyPlayer];
    const emojis = { pierre: '✊', feuille: '🖐️', ciseaux: '✌️' };

    const choicesEl  = document.getElementById('pfc-choices');
    const revealEl   = document.getElementById('pfc-reveal');
    const waitingEl  = document.getElementById('pfc-waiting');

    if (!myChoice || myChoice === '_') {
      // Pas encore choisi
      choicesEl.classList.remove('hidden');
      revealEl.classList.add('hidden');
      waitingEl.classList.add('hidden');
      document.getElementById('pfc-status').textContent = 'Choisis ton arme !';
      document.querySelectorAll('.pfc-btn').forEach(b => b.disabled = false);
    } else if (!enemyChoice || enemyChoice === '_') {
      // J'ai choisi, en attente de l'autre
      choicesEl.classList.add('hidden');
      revealEl.classList.add('hidden');
      waitingEl.classList.remove('hidden');
      document.getElementById('pfc-status').textContent = `T'as choisi ${emojis[myChoice]} — en attente…`;
    } else {
      // Les deux ont choisi → révélation
      choicesEl.classList.add('hidden');
      waitingEl.classList.add('hidden');
      revealEl.classList.remove('hidden');
      document.getElementById('pfc-reveal-scott').textContent  = emojis[gs.choices.scott]  || '?';
      document.getElementById('pfc-reveal-nolwen').textContent = emojis[gs.choices.nolwen] || '?';

      const winner = this.getWinner(gs.choices.scott, gs.choices.nolwen);
      const resultEl = document.getElementById('pfc-round-result');
      if (winner === 'draw') {
        resultEl.textContent = '🤝 Égalité !';
        document.getElementById('pfc-status').textContent = 'Match nul !';
      } else {
        const wName = winner === 'scott' ? 'Scott' : 'Nolwen';
        resultEl.textContent = winner === GameHub.player ? '🏆 Tu gagnes ce round !' : '😅 Tu perds ce round !';
        document.getElementById('pfc-status').textContent = `${wName} remporte ce round !`;
      }

      // Check victoire générale (5 points)
      const sc = gs.scores.scott || 0, sn = gs.scores.nolwen || 0;
      if (sc >= 5 || sn >= 5) {
        document.getElementById('pfc-status').textContent = `${sc>=5?'Scott':'Nolwen'} remporte la partie ! 🏆`;
        choicesEl.classList.add('hidden');
      } else {
        // Rejouer après 2.5s (hôte reset les choix)
        const roundNo = Number(gs.round || 0);
        if (GameHub.isHost && this._lastAutoResetRound !== roundNo) {
          this._lastAutoResetRound = roundNo;
          setTimeout(async () => {
            await GameHub.roomRef.update({ 'gameState/choices': { scott: '_', nolwen: '_' } });
            this._myChoice = null;
          }, 2500);
        } else if (!GameHub.isHost) {
          this._myChoice = null;
        }
      }
    }
  },

  async choose(choice) {
    if (this._myChoice) return;
    this._myChoice = choice;
    await GameHub.roomRef.child('gameState').transaction((state) => {
      if (!state) return state;
      state.choices = state.choices || { scott: '_', nolwen: '_' };
      if (state.choices[GameHub.player] && state.choices[GameHub.player] !== '_') return state;
      state.choices[GameHub.player] = choice;

      const sc = state.choices.scott;
      const nn = state.choices.nolwen;
      if (sc && sc !== '_' && nn && nn !== '_') {
        const w = this.getWinner(sc, nn);
        state.scores = state.scores || { scott: 0, nolwen: 0 };
        if (w !== 'draw') state.scores[w] = (state.scores[w] || 0) + 1;
        state.round = Number(state.round || 0) + 1;
      }
      return state;
    });
    SFX.play('answer');
  },

  getWinner(a, b) {
    if (a === b) return 'draw';
    if ((a==='pierre'&&b==='ciseaux')||(a==='ciseaux'&&b==='feuille')||(a==='feuille'&&b==='pierre')) return 'scott';
    return 'nolwen';
  },
};

// ═══════════════════════════════════════════════════════════
//  VÉRITÉ OU DÉFI
// ═══════════════════════════════════════════════════════════
const VOD_DATA = {
  verite: [
    // ── Perso / Fun ──
    "Quel est ton souvenir le plus gênant avec quelqu'un ?",
    "Qu'est-ce que tu n'oserais jamais faire devant moi ?",
    "C'est quoi ton pire mensonge que t'as dit à quelqu'un ?",
    "T'as déjà stalké quelqu'un sur les réseaux ? Qui ?",
    "Quelle est la chose la plus folle que t'as faite par amour ?",
    "Ton plus grand complexe ?",
    "T'as déjà eu un crush sur un(e) ami(e) ? C'était qui ?",
    "Quel est le truc le plus nul que t'as fait pour impressionner quelqu'un ?",
    "Si tu pouvais changer une chose chez toi, ça serait quoi ?",
    "Quel est ton pire souvenir de soirée ?",
    "T'as déjà menti à tes parents sur quelque chose de grave ?",
    "Qu'est-ce que tu m'aurais caché si on se connaissait moins ?",
    "Ton ex te recontacte ce soir — tu réponds quoi ?",
    "Qu'est-ce que tes amis ne savent pas sur toi ?",
    "Le truc qui t'énerve le plus chez moi ? Sois honnête 😬",
    "T'as déjà eu des sentiments pour quelqu'un que tu ne devais pas ? Sans nommer...",
    "Ton pire comportement dans une relation passée ?",
    "La dernière fois que tu as pleuré — c'était pour quoi ?",
    "T'as déjà feinté d'être occupé(e) pour pas répondre à quelqu'un ?",
    "Le truc le plus embarrassant dans ton historique de navigation ?",
    "T'as déjà jealousé quelqu'un de ton cercle ? Pour quoi ?",
    "Si tu pouvais effacer une décision de ta vie, laquelle ?",
    "La chose que tu voudrais qu'on fasse différemment en couple ?",
    "T'as déjà envoyé un message au mauvais destinataire ? C'était quoi ?",
    "Ton fantasme de vie dans 5 ans — le vrai, pas le propre ?",
    // ── Hot / Intime ──
    "Le message un peu chaud que tu n'as jamais osé envoyer — tu le dis maintenant.",
    "Ton mood idéal pour une nuit à deux ?",
    "Tu préfères quoi : teasing soft, tendresse profonde ou full passion ?",
    "Ton plus gros red flag en date romantique ?",
    "Le compliment intime qui te fait fondre direct ?",
    "Tu assumes plus les mots doux en vocal ou en face à face ?",
    "Le fantasme soft que tu peux avouer ici ?",
    "Ton type de baiser préféré quand ça devient intense ?",
    "Si on coupe les téléphones ce soir, on fait quoi en premier ?",
    "Ton endroit préféré pour un câlin long sans parler ?",
    "La partie de mon corps que tu trouves la plus attirante — dis-le vraiment.",
    "Ce qui te fait craquer physiquement chez moi — sois précis(e).",
    "T'as déjà eu une pensée un peu chaude pendant qu'on était ensemble en public ?",
    "Qu'est-ce que j'aurais pu faire différemment pour te faire vibrer plus fort ?",
    "Décris la nuit parfaite avec moi — version honnête, pas de filtre.",
    "Le truc que t'oses pas me demander mais que t'aimerais qu'on essaie ?",
    "À quel moment t'as réalisé que tu me trouvais vraiment attirant(e) ?",
    "T'as une zone sur ton corps que t'aimes pas trop qu'on touche ? Laquelle ?",
    "Le moment où t'as eu le plus envie de moi sans le dire ?",
    "Dis-moi une chose que tu ferais ce soir si tu n'avais aucune limite.",
    "T'as déjà simulé quelque chose pour faire plaisir ? (Honnêteté totale svp 😏)",
    "Qu'est-ce qui te met dans l'ambiance plus vite que tout ?",
    "Ce que t'as toujours voulu qu'on fasse mais t'as jamais osé proposer.",
    "Ton fantasme le plus intense que t'as eu — en mode PG-13 minimum.",
    "Si je te donnais carte blanche ce soir — tu commences par quoi ?",
  ],
  defi: [
    // ── Fun / Sociale ──
    "Envoie un message à quelqu'un que t'as pas contacté depuis 6 mois 📱",
    "Fais 10 pompes maintenant 💪",
    "Chante le refrain d'une chanson à voix haute 🎤",
    "Envoie-moi un selfie dans une position bizarre 📸",
    "Dis 3 choses que t'aimes chez moi sans réfléchir ❤️",
    "Fais une imitation de moi (envoie une vidéo) 😂",
    "Envoie le dernier mème que t'as sauvegardé 📲",
    "Montre la 5ème photo de ta galerie 📷",
    "Écris-moi un poème de 4 lignes en 60 secondes ✍️",
    "Appelle quelqu'un et dis 'je t'aime' avant de raccrocher 😂",
    "Montre ta recherche Google la plus récente 🔍",
    "Poste un selfie sans filtre dans ta story 📸",
    "Écris une phrase qui décrit notre relation en mode honnête — tu lis à voix haute.",
    "Imite le bruit que je fais quand je suis surpris(e). Tu as 10 secondes.",
    "Écris 5 mots qui me décrivent parfaitement — tu as 30 secondes chrono.",
    "Envoie un vocal de 15 secondes en mode 'je te parle comme si c'était la dernière fois'.",
    "Prends une pose de magazine de mode — tu as 3 secondes pour la tenir.",
    "Dis une blague nulle et assume-la jusqu'au bout 😂",
    "Fais un câlin imaginaire à la caméra pendant 10 secondes.",
    "Chante les 3 premières notes de notre chanson préférée de couple.",
    // ── Séduction / Intime ──
    "Envoie un message qui dit juste 'j'ai envie de toi' sans contexte 😏",
    "Dis trois choses très attirantes chez l'autre, sans pause, les yeux dans les yeux.",
    "Fais une danse de 15 secondes en mode séduction — j'enregistre rien, promis.",
    "Lis une mini scène romantique hot de 2 lignes que tu inventes maintenant.",
    "Envoie un emoji qui résume ton niveau de désir actuel (et explique ton choix).",
    "Défi duo : chacun dit une chose qu'il veut tester en couple ce mois-ci.",
    "Fais une déclaration dramatique style cinéma pendant 20 secondes — improvise.",
    "Lance-moi un compliment improvisé en rime.",
    "Décris en 30 secondes ce que tu ferais si on était seuls là maintenant.",
    "Envoie un message vocal de 10 secondes en mode 'voix du soir' 🌙",
    "Dis-moi ce que tu feras quand on sera vraiment ensemble ce soir — en détail.",
    "Invente un surnom intime pour moi et explique pourquoi.",
    "Fais semblant d'être dans un film romantique — tu as la réplique principale.",
    "Dis la chose la plus directe que tu n'aies jamais osé me dire.",
    "Envoie le GIF qui représente le mieux tes envies du moment 👀",
  ],
};

const VOD = {
  handleUpdate(data) {
    const gs = data.gameState;
    if (!gs) return;
    App.showScreen('screen-vod');
    this.render(gs);
  },

  render(gs) {
    const isMyTurn = gs.turn === GameHub.player;
    const turnName = gs.turn === 'scott' ? 'Scott' : 'Nolwen';
    document.getElementById('vod-turn-label').textContent = isMyTurn ? 'C\'est ton tour !' : `Tour de ${turnName}`;

    const chooseEl   = document.getElementById('vod-choose');
    const questionEl = document.getElementById('vod-question');
    const waitingEl  = document.getElementById('vod-waiting');

    document.querySelectorAll('.vod-btn').forEach(b => b.disabled = !isMyTurn);

    if (gs.status === 'choosing') {
      chooseEl.classList.remove('hidden');
      questionEl.classList.add('hidden');
      waitingEl.classList.toggle('hidden', isMyTurn);
      if (!isMyTurn) document.getElementById('vod-waiting-msg').textContent = `${turnName} choisit…`;
    } else if (gs.status === 'question') {
      chooseEl.classList.add('hidden');
      waitingEl.classList.add('hidden');
      questionEl.classList.remove('hidden');
      const label = document.getElementById('vod-type-label');
      label.textContent = gs.pick === 'verite' ? '🕊️ VÉRITÉ' : '🔥 DÉFI';
      label.style.color = gs.pick === 'verite' ? '#60a5fa' : '#ff6b9d';
      document.getElementById('vod-question-text').textContent = gs.questionText || '...';
      const nextBtn = questionEl.querySelector('button');
      nextBtn.classList.toggle('hidden', !isMyTurn);
    }
  },

  async pick(type) {
    const pool = VOD_DATA[type];
    if (!pool || pool.length === 0) return;

    const snap = await GameHub.roomRef.get();
    const gs = snap.val()?.gameState || {};

    const usedKey = type === 'verite' ? 'usedVerite' : 'usedDefi';
    const used = normalizeList(gs[usedKey])
      .map(v => Number(v))
      .filter(v => Number.isInteger(v) && v >= 0 && v < pool.length);
    const usedSet = new Set(used);
    const lastText = typeof gs.lastQuestion === 'string' ? gs.lastQuestion : '';

    let available = pool.map((_, i) => i).filter(i => !usedSet.has(i));
    if (available.length === 0) {
      // Pool exhausted: reset cycle, but still avoid immediate repeat if possible.
      available = pool.map((_, i) => i);
    }

    if (available.length > 1 && lastText) {
      const withoutLastText = available.filter(i => pool[i] !== lastText);
      if (withoutLastText.length > 0) {
        available = withoutLastText;
      }
    }

    let idx = available[Math.floor(Math.random() * available.length)];
    if (available.length > 1 && idx === gs.questionIdx) {
      const withoutLast = available.filter(i => i !== gs.questionIdx);
      idx = withoutLast[Math.floor(Math.random() * withoutLast.length)];
    }

    const text = pool[idx];
    const nextUsed = usedSet.has(idx) ? used : [...used, idx];

    const payload = {
      'gameState/pick':         type,
      'gameState/questionIdx':  idx,
      'gameState/questionText': text,
      'gameState/lastQuestion': text,
      'gameState/status':       'question',
    };
    payload[`gameState/${usedKey}`] = nextUsed;

    await GameHub.roomRef.update(payload);
    SFX.play('select');
  },

  async next() {
    const snap = await GameHub.roomRef.get();
    const gs = snap.val().gameState;
    await GameHub.roomRef.update({
      'gameState/turn':   gs.turn === 'scott' ? 'nolwen' : 'scott',
      'gameState/status': 'choosing',
      'gameState/pick':   '_',
      'gameState/questionText': '_',
    });
  },
};

// ═══════════════════════════════════════════════════════════
//  UNO LOVE (simplifié)
// ═══════════════════════════════════════════════════════════
const UNO_COLORS  = ['rouge','violet','jaune','vert'];
const UNO_VALUES  = ['0','1','2','3','4','5','6','7','8','9','Skip','+2'];
const UNO_EMOJIS  = { rouge:'❤️', violet:'💜', jaune:'💛', vert:'💚' };
const UNO_WILDS   = ['Wild','Wild+4'];

const Uno = {
  buildInitialState() {
    const deck = [];
    UNO_COLORS.forEach(c => UNO_VALUES.forEach(v => { deck.push({c,v}); deck.push({c,v}); }));
    UNO_WILDS.forEach(w => { for(let i=0;i<2;i++) deck.push({c:'wild',v:w}); });
    const shuffled = shuffleArray(deck);
    const handS  = shuffled.splice(0, 7);
    const handN  = shuffled.splice(0, 7);
    let   top    = shuffled.splice(0, 1)[0];
    while (top.c === 'wild') { shuffled.push(top); top = shuffled.splice(0,1)[0]; }
    return {
      deck:     shuffled,
      handScott: handS,
      handNolwen: handN,
      pile:     [top],
      turn:     'scott',
      color:    top.c,
      status:   'playing',
      winner:   null,
    };
  },

  handleUpdate(data) {
    const gs = data.gameState;
    if (!gs) return;
    App.showScreen('screen-uno');
    this.render(gs);
  },

  render(gs) {
    const isMyTurn = gs.turn === GameHub.player;
    const hand     = GameHub.player === 'scott' ? gs.handScott : gs.handNolwen;
    const enemy    = GameHub.player === 'scott' ? gs.handNolwen : gs.handScott;
    const top      = gs.pile[gs.pile.length - 1];

    document.getElementById('uno-status').textContent = gs.winner
      ? (gs.winner === GameHub.player ? '🏆 Tu as gagné !' : '😅 Tu as perdu !')
      : (isMyTurn ? '🎯 À toi de jouer !' : '⏳ Tour de l\'autre…');

    document.getElementById('uno-cards-enemy').textContent = `${(enemy||[]).length} cartes`;
    document.getElementById('uno-card-value').textContent  = top ? `${UNO_EMOJIS[top.c]||'🃏'} ${top.v}` : '?';

    const ci = document.getElementById('uno-color-indicator');
    ci.textContent = UNO_EMOJIS[gs.color] || '';
    ci.style.background = gs.color === 'rouge' ? 'rgba(255,60,60,0.3)'
      : gs.color === 'violet' ? 'rgba(180,60,255,0.3)'
      : gs.color === 'jaune'  ? 'rgba(255,200,0,0.3)'
      : 'rgba(60,200,60,0.3)';

    // Main
    const handEl = document.getElementById('uno-hand');
    handEl.innerHTML = '';
    (hand || []).forEach((card, i) => {
      const btn = document.createElement('button');
      btn.className  = 'uno-card';
      btn.textContent = `${UNO_EMOJIS[card.c] || '🃏'} ${card.v}`;
      btn.style.background = this.cardBg(card.c);
      const canPlay = isMyTurn && !gs.winner && this.canPlay(card, top, gs.color);
      btn.disabled = !canPlay;
      if (canPlay) btn.onclick = () => this.play(i, gs);
      handEl.appendChild(btn);
    });

    const waitEl = document.getElementById('uno-waiting');
    waitEl.classList.toggle('hidden', isMyTurn || !!gs.winner);

    document.querySelector('.uno-draw-pile').style.opacity = isMyTurn && !gs.winner ? '1' : '0.4';
    document.querySelector('.uno-draw-pile').style.pointerEvents = isMyTurn && !gs.winner ? 'auto' : 'none';
  },

  cardBg(c) {
    return c==='rouge' ? 'rgba(255,60,60,0.25)' : c==='violet' ? 'rgba(180,60,255,0.25)'
      : c==='jaune' ? 'rgba(255,200,0,0.25)' : c==='vert' ? 'rgba(60,200,60,0.25)' : 'rgba(100,100,100,0.25)';
  },

  canPlay(card, top, currentColor) {
    if (card.c === 'wild') return true;
    if (card.c === currentColor) return true;
    if (card.v === top.v) return true;
    return false;
  },

  async play(idx, gs) {
    const handKey  = GameHub.player === 'scott' ? 'handScott' : 'handNolwen';
    const newHand  = [...(GameHub.player === 'scott' ? gs.handScott : gs.handNolwen)];
    const [card]   = newHand.splice(idx, 1);
    const newPile  = [...gs.pile, card];
    let newTurn    = GameHub.player === 'scott' ? 'nolwen' : 'scott';
    let newColor   = card.c === 'wild' ? UNO_COLORS[Math.floor(Math.random()*4)] : card.c;
    let newDeck    = [...gs.deck];
    let enemyHand  = [...(GameHub.player === 'scott' ? gs.handNolwen : gs.handScott)];
    const enemyKey = GameHub.player === 'scott' ? 'handNolwen' : 'handScott';

    // Effets spéciaux
    if (card.v === 'Skip') newTurn = GameHub.player;
    if (card.v === '+2' || card.v === 'Wild+4') {
      const count = card.v === '+2' ? 2 : 4;
      for (let i = 0; i < count; i++) {
        if (!newDeck.length) { newDeck = shuffleArray(newPile.slice(0,-1)); }
        enemyHand.push(newDeck.pop());
      }
      newTurn = GameHub.player;
    }

    const winner = newHand.length === 0 ? GameHub.player : null;
    if (winner) SFX.play('win'); else SFX.play('answer');

    await GameHub.roomRef.update({
      [`gameState/${handKey}`]:  newHand,
      [`gameState/${enemyKey}`]: enemyHand,
      'gameState/pile':          newPile,
      'gameState/deck':          newDeck,
      'gameState/turn':          winner ? gs.turn : newTurn,
      'gameState/color':         newColor,
      'gameState/winner':        winner,
    });
  },

  async draw() {
    const snap = await GameHub.roomRef.get();
    const gs   = snap.val().gameState;
    if (gs.turn !== GameHub.player || gs.winner) return;
    const handKey = GameHub.player === 'scott' ? 'handScott' : 'handNolwen';
    const newHand = [...(GameHub.player === 'scott' ? gs.handScott : gs.handNolwen)];
    const newDeck = [...gs.deck];
    if (!newDeck.length) return;
    newHand.push(newDeck.pop());
    await GameHub.roomRef.update({
      [`gameState/${handKey}`]: newHand,
      'gameState/deck':         newDeck,
      'gameState/turn':         GameHub.player === 'scott' ? 'nolwen' : 'scott',
    });
    SFX.play('select');
  },
};

// ═══════════════════════════════════════════════════════════
//  BATAILLE NAVALE (6×6)
// ═══════════════════════════════════════════════════════════
const BN = {
  SIZE:      6,
  SHIPS:     [3, 2, 1],  // tailles des bateaux
  myShips:   [],          // {cells: [[r,c],...]}
  placing:   0,           // index du bateau en cours
  dir:       'h',
  startCell: null,
  readyLocal: false,

  // Firebase stocke 'none' pour les valeurs vides (null est supprimé)
  _shots(gs, player) {
    const v = player === 'scott' ? gs.shotsScott : gs.shotsNolwen;
    return Array.isArray(v) ? v : [];
  },
  _ships(gs, player) {
    const v = player === 'scott' ? gs.shipsScott : gs.shipsNolwen;
    return Array.isArray(v) ? v : null;
  },

  handleUpdate(data) {
    const gs = data.gameState;
    if (!gs) return;

    if (gs.statusPhase === 'setup') {
      App.showScreen('screen-bataille');
      this.renderSetup(gs);
    } else if (gs.statusPhase === 'playing') {
      App.showScreen('screen-bataille');
      this.renderPlay(gs);
    } else if (gs.statusPhase === 'finished') {
      App.showScreen('screen-bataille');
      document.getElementById('bn-result').classList.remove('hidden');
      document.getElementById('bn-play').classList.add('hidden');
      document.getElementById('bn-result-msg').textContent =
        gs.winner === GameHub.player ? '🏆 Tu as coulé toute la flotte !' : '💥 Ta flotte a été coulée !';
    }
  },

  renderSetup(gs) {
    document.getElementById('bn-setup').classList.remove('hidden');
    document.getElementById('bn-play').classList.add('hidden');
    document.getElementById('bn-result').classList.add('hidden');

    const myReady = !!this._ships(gs, GameHub.player);
    const hint    = document.getElementById('bn-setup-hint');

    if (myReady) {
      hint.textContent = '✅ Prêt ! En attente de l\'autre joueur…';
      document.getElementById('bn-ready-btn').style.display = 'none';
    } else {
      const ship = this.SHIPS[this.placing];
      hint.textContent = ship ? `Place ton bateau de taille ${ship} (${this.placing+1}/${this.SHIPS.length})` : 'Tous les bateaux placés !';
    }

    this.renderMyGrid(null, true);
    document.getElementById('bn-ready-btn').style.display = (this.myShips.length === this.SHIPS.length && !myReady) ? 'block' : 'none';
  },

  renderMyGrid(gs, setup) {
    const grid = document.getElementById(setup ? 'bn-my-grid' : 'bn-my-grid-play');
    if (!grid) return;
    grid.innerHTML = '';
    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        const cell = document.createElement('button');
        cell.className = 'bn-cell';
        const hasShip = this.myShips.some(s => s.cells.some(([sr,sc]) => sr===r && sc===c));
        if (hasShip) cell.classList.add('bn-ship');

        if (gs) {
          const opponent = GameHub.player === 'scott' ? 'nolwen' : 'scott';
          const shots = this._shots(gs, opponent);
          const hit   = shots.some(([sr,sc]) => sr===r && sc===c);
          if (hit && hasShip) cell.classList.add('bn-hit');
          if (hit && !hasShip) cell.classList.add('bn-miss');
        }

        if (setup) {
          const r2 = r, c2 = c;
          cell.onclick = () => this.placeShip(r2, c2);
        }
        grid.appendChild(cell);
      }
    }
  },

  renderPlay(gs) {
    document.getElementById('bn-setup').classList.add('hidden');
    document.getElementById('bn-play').classList.remove('hidden');
    document.getElementById('bn-result').classList.add('hidden');

    const isMyTurn = gs.turn === GameHub.player;
    const turnName = gs.turn === 'scott' ? 'Scott' : 'Nolwen';
    document.getElementById('bn-status').textContent = isMyTurn ? '🎯 À toi d\'attaquer !' : `${turnName} attaque…`;

    this.renderMyGrid(gs, false);

    const enemyGrid = document.getElementById('bn-enemy-grid');
    enemyGrid.innerHTML = '';
    const myShipsData = this._ships(gs, GameHub.player);
    const myShots     = this._shots(gs, GameHub.player);
    const opponent    = GameHub.player === 'scott' ? 'nolwen' : 'scott';

    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        const cell = document.createElement('button');
        cell.className = 'bn-cell';
        const shot = myShots.some(([sr,sc]) => sr===r && sc===c);
        if (shot) {
          const enemyShips = this._ships(gs, opponent);
          const hit = enemyShips && enemyShips.some(s => s.cells.some(([sr,sc]) => sr===r && sc===c));
          cell.classList.add(hit ? 'bn-hit' : 'bn-miss');
          cell.disabled = true;
        } else if (isMyTurn) {
          const r2 = r, c2 = c;
          cell.onclick = () => this.shoot(r2, c2, gs);
        } else {
          cell.disabled = true;
        }
        enemyGrid.appendChild(cell);
      }
    }
  },

  setDir(d) {
    this.dir = d;
    document.getElementById('bn-ship-btn-h').classList.toggle('active', d==='h');
    document.getElementById('bn-ship-btn-v').classList.toggle('active', d==='v');
  },

  placeShip(r, c) {
    if (this.myShips.length >= this.SHIPS.length) return;
    const size  = this.SHIPS[this.placing];
    const cells = [];
    for (let i = 0; i < size; i++) {
      const nr = this.dir === 'v' ? r+i : r;
      const nc = this.dir === 'h' ? c+i : c;
      if (nr>=this.SIZE || nc>=this.SIZE) { App.toast("Hors de la grille !"); return; }
      if (this.myShips.some(s => s.cells.some(([sr,sc]) => sr===nr && sc===nc))) {
        App.toast("Cellule déjà occupée !"); return;
      }
      cells.push([nr, nc]);
    }
    this.myShips.push({ cells });
    this.placing++;
    const snap = { statusPhase: 'setup', shipsScott: 'none', shipsNolwen: 'none', shotsScott: 'none', shotsNolwen: 'none', turn: 'scott' };
    this.renderSetup(snap);
    SFX.play('select');
  },

  async ready() {
    const key = `gameState/ships${GameHub.player.charAt(0).toUpperCase()+GameHub.player.slice(1)}`;
    await GameHub.roomRef.update({ [key]: this.myShips });
    this.readyLocal = true;

    // Les deux joueurs vérifient — le dernier à confirmer lance la partie
    const snap = await GameHub.roomRef.get();
    const gs   = snap.val()?.gameState;
    if (gs && this._ships(gs, 'scott') && this._ships(gs, 'nolwen')) {
      await GameHub.roomRef.update({ 'gameState/statusPhase': 'playing' });
    }
  },

  async shoot(r, c, gs) {
    const key      = `gameState/shots${GameHub.player.charAt(0).toUpperCase()+GameHub.player.slice(1)}`;
    const myShots  = [...this._shots(gs, GameHub.player), [r,c]];
    const opponent = GameHub.player === 'scott' ? 'nolwen' : 'scott';
    const enemy    = this._ships(gs, opponent);
    const nextTurn = GameHub.player === 'scott' ? 'nolwen' : 'scott';

    // Vérifier victoire
    const allSunk = enemy.every(ship => ship.cells.every(([sr,sc]) => myShots.some(([mr,mc]) => mr===sr && mc===sc)));
    await GameHub.roomRef.update({
      [key]: myShots,
      'gameState/turn': nextTurn,
      ...(allSunk ? { 'gameState/statusPhase': 'finished', 'gameState/winner': GameHub.player } : {}),
    });
    SFX.play(allSunk ? 'win' : 'answer');
  },
};

// ═══════════════════════════════════════════════════════════
//  DESSIN DUEL
// ═══════════════════════════════════════════════════════════
const DRAW_MODE_META = {
  rapide: { label: 'Rapide', time: 60,  hint1At: 20, hint2At: 40 },
  moyen:  { label: 'Moyen',  time: 90,  hint1At: 30, hint2At: 60 },
  hard:   { label: 'Hard',   time: 120, hint1At: 40, hint2At: 80 },
};

const DRAW_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const DRAW_WORD_BANK = {
  rapide: [
    'chat', 'chien', 'coeur', 'rose', 'pizza', 'burger', 'soleil', 'lune', 'nuage', 'pluie',
    'velo', 'moto', 'bus', 'taxi', 'casque', 'montre', 'bague', 'gateau', 'fraise', 'banane',
    'panda', 'koala', 'lion', 'tigre', 'zebre', 'lapin', 'sushi', 'frites', 'cafe', 'the',
    'livre', 'stylo', 'cle', 'porte', 'fenetre', 'table', 'chaise', 'basket', 'ballon', 'drapeau',
    'arc', 'fleche', 'etoile', 'diamant', 'kiss', 'bisou', 'selfie', 'emoji', 'tiktok', 'snap',
    'wifi', 'clavier', 'souris', 'ecran', 'manette', 'poulet', 'donut', 'cocktail', 'parfum', 'lunettes',
  ],
  moyen: [
    'licorne', 'pingouin', 'crocodile', 'salamandre', 'trottinette', 'skateboard', 'telephone', 'appareil photo',
    'boite mail', 'salle de sport', 'popcorn', 'cheesecake', 'croissant', 'chocolat chaud', 'carte cadeau', 'playlist',
    'microphone', 'casquette', 'sweat a capuche', 'chaussure', 'maillot', 'parasol', 'serviette', 'valise',
    'drone', 'ordinateur', 'chaise gaming', 'lampe neon', 'manette retro', 'jeu video', 'karaoke', 'cinema',
    'parc aquatique', 'montagne', 'plage', 'cabane', 'feu de camp', 'sac a dos', 'bijou', 'collier',
    'maquillage', 'parapluie', 'trottinette electrique', 'trois bougies', 'ourson geant', 'boite a musique',
    'message vocal', 'story insta', 'crush secret', 'coeur brise', 'date parfait', 'petit dejeuner', 'oreiller',
    'pyjama', 'bataille d eau', 'soir e jeux', 'kiss cam', 'fleur geante', 'dessert', 'milkshake', 'love room',
  ],
  hard: [
    'montagne russe', 'appareil photo vintage', 'telephone casse', 'chat sur un skateboard', 'pizza en forme de coeur',
    'licorne qui danse', 'pingouin avec lunettes', 'drone au dessus de la plage', 'manette geante', 'studio karaoke',
    'sac a dos ouvert', 'basket en feu', 'fleur dans un vase', 'coeur brise en deux', 'selfie dans un miroir',
    'soiree cinema maison', 'orage sur la ville', 'cabane dans les arbres', 'salle de sport vide', 'boite de chocolats',
    'gateau d anniversaire', 'drapeau au vent', 'parapluie retourne', 'chat qui miaule', 'chien sous la pluie',
    'rose avec epines', 'valise pleine', 'lunettes de soleil', 'boite a bijoux', 'pluie d etoiles',
    'carte au tresor', 'message dans une bouteille', 'bougie parfumee', 'clavier rgb', 'ecran casse',
    'histoire d amour', 'scene de jalousie', 'bisou au ralenti', 'couple goals', 'date surprise',
    'coeur en flammes', 'parfum de luxe', 'bague en diamant', 'pull oversize', 'love emoji geant',
    'ourson en peluche', 'coeur et eclair', 'soir de tempete', 'coucher de soleil', 'pique nique romantique',
    'tiktok viral', 'meme drole', 'vide grenier', 'chasse au tresor', 'salle de classe', 'metro bondé',
    'code secret', 'boite mystere', 'message cache', 'jeu de dessin',
  ],
};

function normalizeDrawWord(word) {
  return String(word || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 \-']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function drawMaskFromRevealed(normalizedWord, revealedSet) {
  return [...(normalizedWord || '')].map(ch => {
    if (/[A-Z0-9]/.test(ch)) return revealedSet.has(ch) ? ch : '_';
    return ch;
  }).join('');
}

function otherPlayer(player) {
  return player === 'scott' ? 'nolwen' : 'scott';
}

const DrawGame = {
  canvas: null,
  ctx: null,
  latestState: null,
  drawing: false,
  currentStroke: null,
  brushColor: '#ffffff',
  brushSize: 6,
  eraser: false,
  ticker: null,
  _hostBusy: false,

  cleanupLocal() {
    if (this.ticker) {
      clearInterval(this.ticker);
      this.ticker = null;
    }
    this.drawing = false;
    this.currentStroke = null;
    this.latestState = null;
    this._hostBusy = false;
  },

  buildInitialState() {
    const mode = 'moyen';
    const meta = DRAW_MODE_META[mode];
    return {
      mode,
      phase: 'mode',              // mode | choose | draw | roundResult | finished
      targetScore: 5,
      round: 1,
      drawer: 'scott',
      choices: [],
      word: '_',
      normalizedWord: '_',
      displayedWord: '_',
      guessedLetters: [],
      revealedLetters: [],
      strokes: [],
      timeLimit: meta.time,
      hint1At: meta.hint1At,
      hint2At: meta.hint2At,
      hint1Done: false,
      hint2Done: false,
      startedAt: 0,
      scores: { scott: 0, nolwen: 0 },
      roundResolved: false,
      roundWinner: '_',
      roundPoints: 0,
      lastRoundSummary: '_',
      winner: '_',
      lastWords: [],
      updatedAt: Date.now(),
    };
  },

  handleUpdate(data) {
    const gs = data.gameState || {};
    this.latestState = gs;
    App.showScreen('screen-dessin');
    this.ensureCanvas();
    this.render(gs);
  },

  ensureCanvas() {
    const canvas = document.getElementById('draw-canvas');
    if (!canvas) return;
    if (this.canvas === canvas && this.ctx) return;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.bindCanvasEvents();
    this.renderCanvas(this.latestState || this.buildInitialState());
  },

  bindCanvasEvents() {
    if (!this.canvas) return;

    const onDown = (e) => this.startDraw(e);
    const onMove = (e) => this.moveDraw(e);
    const onUp = (e) => this.endDraw(e);

    this.canvas.addEventListener('pointerdown', onDown);
    this.canvas.addEventListener('pointermove', onMove);
    this.canvas.addEventListener('pointerup', onUp);
    this.canvas.addEventListener('pointercancel', onUp);
    this.canvas.addEventListener('pointerleave', onUp);
  },

  render(gs) {
    const me = GameHub.player;
    const drawer = gs.drawer || 'scott';
    const guesser = otherPlayer(drawer);
    const phase = gs.phase || 'mode';

    // Scores
    document.getElementById('draw-score-scott').textContent = gs.scores?.scott || 0;
    document.getElementById('draw-score-nolwen').textContent = gs.scores?.nolwen || 0;

    // Mode buttons
    document.querySelectorAll('.draw-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === (gs.mode || 'moyen'));
      btn.disabled = !GameHub.isHost || phase !== 'mode';
    });
    const startBtn = document.getElementById('draw-start-btn');
    if (startBtn) startBtn.disabled = !GameHub.isHost || phase !== 'mode';

    const modePanel = document.getElementById('draw-mode-panel');
    const wordChoice = document.getElementById('draw-word-choice');
    const tools = document.getElementById('draw-tools');
    const guessPanel = document.getElementById('draw-guess-panel');
    const resultPanel = document.getElementById('draw-round-result');
    const finalPanel = document.getElementById('draw-final');
    const statusEl = document.getElementById('draw-status');
    const hintEl = document.getElementById('draw-hint-msg');

    modePanel.classList.toggle('hidden', !(phase === 'mode'));
    wordChoice.classList.toggle('hidden', !(phase === 'choose' && me === drawer));
    tools.classList.toggle('hidden', !(phase === 'draw' && me === drawer && !gs.roundResolved));
    guessPanel.classList.toggle('hidden', !(phase === 'draw' && me === guesser && !gs.roundResolved));
    resultPanel.classList.toggle('hidden', phase !== 'roundResult');
    finalPanel.classList.toggle('hidden', phase !== 'finished');

    if (phase === 'mode') {
      statusEl.textContent = GameHub.isHost
        ? `Choisis le mode puis lance la manche (${gs.targetScore || 5} points pour gagner)`
        : "L'hôte prépare la partie dessin…";
      hintEl.textContent = "Objectif: deviner vite pour gagner plus de points.";
    } else if (phase === 'choose') {
      statusEl.textContent = me === drawer
        ? "Choisis 1 mot parmi les 5 propositions"
        : `${drawer === 'scott' ? 'Scott' : 'Nolwen'} choisit un mot…`;
      hintEl.textContent = "Le mot reste secret jusqu'au chrono.";
    } else if (phase === 'draw') {
      statusEl.textContent = me === drawer
        ? "Dessine proprement: fais deviner ton mot !"
        : "Devine vite le mot avec les lettres 👇";
      hintEl.textContent = this.hintText(gs, me === drawer);
    } else if (phase === 'roundResult') {
      statusEl.textContent = "Résultat de la manche";
      hintEl.textContent = `Mot: ${gs.word || '-'}`;
    } else if (phase === 'finished') {
      statusEl.textContent = "Partie terminée";
      hintEl.textContent = "Bravo à vous deux 💕";
    }

    // Choix de mots
    this.renderWordChoices(gs, drawer);
    this.renderWordBoxes(gs, drawer);
    this.renderLetters(gs, guesser);
    this.renderRoundResult(gs);
    this.renderFinal(gs);
    this.renderCanvas(gs);
    this.updateToolUi();
    this.updateTimer(gs);
    this.manageTicker(gs);
  },

  updateToolUi() {
    document.querySelectorAll('.draw-color-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === this.brushColor && !this.eraser);
    });
    const eraserBtn = document.getElementById('draw-eraser-btn');
    if (eraserBtn) eraserBtn.classList.toggle('active', this.eraser);
    const sizeLabel = document.getElementById('draw-size-label');
    if (sizeLabel) sizeLabel.textContent = String(this.brushSize);
  },

  hintText(gs, isDrawer) {
    if (isDrawer) return `Mot à faire deviner: ${gs.word || '-'}`;
    const elapsed = this.elapsedSeconds(gs);
    const h1 = Number(gs.hint1At || 30);
    const h2 = Number(gs.hint2At || 60);
    if (elapsed < h1) return `Indice 1 dans ${Math.max(0, h1 - elapsed)}s`;
    if (elapsed < h2) return `Indice 2 dans ${Math.max(0, h2 - elapsed)}s`;
    return "Tous les indices ont été envoyés !";
  },

  renderWordChoices(gs, drawer) {
    const wrap = document.getElementById('draw-word-options');
    if (!wrap) return;
    wrap.innerHTML = '';
    if (gs.phase !== 'choose' || GameHub.player !== drawer) return;
    normalizeList(gs.choices).forEach(word => {
      const btn = document.createElement('button');
      btn.className = 'draw-word-btn';
      btn.textContent = word;
      btn.onclick = () => this.pickWord(word);
      wrap.appendChild(btn);
    });
  },

  renderWordBoxes(gs, drawer) {
    const wrap = document.getElementById('draw-word-boxes');
    if (!wrap) return;
    wrap.innerHTML = '';

    let text = '';
    const normalized = gs.normalizedWord && gs.normalizedWord !== '_' ? gs.normalizedWord : normalizeDrawWord(gs.word || '');
    if (gs.phase === 'draw') {
      text = GameHub.player === drawer ? normalized : (gs.displayedWord || '');
    } else if (gs.phase === 'roundResult' || gs.phase === 'finished') {
      text = normalized || gs.displayedWord || '';
    } else {
      text = '';
    }

    if (!text) return;
    [...text].forEach(ch => {
      const box = document.createElement('div');
      box.className = 'draw-char-box';
      if (ch === ' ' || ch === '-') {
        box.classList.add('space');
        box.textContent = ch;
      } else if (ch === '_') {
        box.textContent = '';
      } else {
        box.classList.add('revealed');
        box.textContent = ch;
      }
      wrap.appendChild(box);
    });
  },

  renderLetters(gs, guesser) {
    const grid = document.getElementById('draw-letter-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (gs.phase !== 'draw') return;

    const guessed = new Set(normalizeList(gs.guessedLetters));
    const normalizedWord = gs.normalizedWord || '';
    const canGuessNow = (GameHub.player === guesser) && !gs.roundResolved;

    DRAW_ALPHABET.forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'draw-letter-btn';
      btn.textContent = letter;
      const already = guessed.has(letter);
      const hit = already && normalizedWord.includes(letter);
      const miss = already && !normalizedWord.includes(letter);
      if (hit) btn.classList.add('hit');
      if (miss) btn.classList.add('miss');
      btn.disabled = already || !canGuessNow;
      if (canGuessNow && !already) {
        btn.onclick = () => this.guessLetter(letter);
      }
      grid.appendChild(btn);
    });
  },

  renderRoundResult(gs) {
    if (gs.phase !== 'roundResult') return;
    const msg = document.getElementById('draw-result-msg');
    const nextBtn = document.getElementById('draw-next-btn');
    const wait = document.getElementById('draw-next-wait');
    if (msg) msg.textContent = gs.lastRoundSummary || 'Manche terminée.';
    if (nextBtn && wait) {
      nextBtn.classList.toggle('hidden', !GameHub.isHost);
      wait.classList.toggle('hidden', GameHub.isHost);
    }
  },

  renderFinal(gs) {
    if (gs.phase !== 'finished') return;
    const msg = document.getElementById('draw-final-msg');
    if (!msg) return;
    const winner = gs.winner;
    if (winner === 'scott') {
      msg.textContent = 'Nolwen a perdu 😈 Tu dois dire: "Je t\'aime mon amour Scott" 💕';
    } else if (winner === 'nolwen') {
      msg.textContent = 'Scott a perdu 😈 Tu dois dire: "Je t\'aime mon amour Nolwen" 💕';
    } else {
      msg.textContent = 'Égalité ! Vous devez vous dire je t\'aime tous les deux 💖';
    }
  },

  updateTimer(gs) {
    const timerEl = document.getElementById('draw-timer');
    if (!timerEl) return;

    let remaining = Number(gs.timeLimit || 90);
    if (gs.phase === 'draw') {
      remaining = Math.max(0, Number(gs.timeLimit || 90) - this.elapsedSeconds(gs));
    }
    timerEl.textContent = this.formatTime(remaining);
    timerEl.style.color = remaining <= 10 && gs.phase === 'draw' ? '#f87171' : 'var(--gold)';
  },

  manageTicker(gs) {
    const needsTicker = gs.phase === 'draw' && !gs.roundResolved;
    if (needsTicker && !this.ticker) {
      this.ticker = setInterval(() => this.onTick(), 500);
    } else if (!needsTicker && this.ticker) {
      clearInterval(this.ticker);
      this.ticker = null;
      this._hostBusy = false;
    }
  },

  onTick() {
    if (!this.latestState) return;
    const gs = this.latestState;
    this.updateTimer(gs);

    if (!GameHub.isHost || this._hostBusy) return;
    if (gs.phase !== 'draw' || gs.roundResolved) return;

    const elapsed = this.elapsedSeconds(gs);
    const tLimit = Number(gs.timeLimit || 90);
    if (!gs.hint1Done && elapsed >= Number(gs.hint1At || 30)) {
      this._hostBusy = true;
      this.applyHint(1).finally(() => { this._hostBusy = false; });
      return;
    }
    if (!gs.hint2Done && elapsed >= Number(gs.hint2At || 60)) {
      this._hostBusy = true;
      this.applyHint(2).finally(() => { this._hostBusy = false; });
      return;
    }
    if (elapsed >= tLimit) {
      this._hostBusy = true;
      this.resolveTimeout().finally(() => { this._hostBusy = false; });
    }
  },

  elapsedSeconds(gs) {
    if (!gs.startedAt) return 0;
    return Math.max(0, Math.floor((Date.now() - Number(gs.startedAt)) / 1000));
  },

  formatTime(totalSec) {
    const s = Math.max(0, Number(totalSec) || 0);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  },

  async setMode(mode) {
    if (!GameHub.isHost || !DRAW_MODE_META[mode]) return;
    const meta = DRAW_MODE_META[mode];
    await GameHub.roomRef.update({
      'gameState/mode': mode,
      'gameState/phase': 'mode',
      'gameState/timeLimit': meta.time,
      'gameState/hint1At': meta.hint1At,
      'gameState/hint2At': meta.hint2At,
      'gameState/updatedAt': Date.now(),
    });
    SFX.play('select');
  },

  async startRound() {
    if (!GameHub.isHost) return;
    const snap = await GameHub.roomRef.get();
    const gs = snap.val()?.gameState;
    if (!gs) return;

    const mode = DRAW_MODE_META[gs.mode] ? gs.mode : 'moyen';
    const meta = DRAW_MODE_META[mode];
    const choices = this.pickChoices(mode, normalizeList(gs.lastWords));

    await GameHub.roomRef.update({
      'gameState/phase': 'choose',
      'gameState/mode': mode,
      'gameState/timeLimit': meta.time,
      'gameState/hint1At': meta.hint1At,
      'gameState/hint2At': meta.hint2At,
      'gameState/choices': choices,
      'gameState/word': '_',
      'gameState/normalizedWord': '_',
      'gameState/displayedWord': '_',
      'gameState/guessedLetters': [],
      'gameState/revealedLetters': [],
      'gameState/strokes': [],
      'gameState/startedAt': 0,
      'gameState/hint1Done': false,
      'gameState/hint2Done': false,
      'gameState/roundResolved': false,
      'gameState/roundWinner': '_',
      'gameState/roundPoints': 0,
      'gameState/lastRoundSummary': '_',
      'gameState/winner': '_',
      'gameState/lastWords': choices,
      'gameState/updatedAt': Date.now(),
    });
    SFX.play('start');
  },

  pickChoices(mode, lastWords = []) {
    const pool = DRAW_WORD_BANK[mode] || DRAW_WORD_BANK.moyen;
    const lastSet = new Set(lastWords);
    let candidates = pool.filter(w => !lastSet.has(w));
    if (candidates.length < 5) candidates = [...pool];
    return this.shuffle(candidates).slice(0, 5);
  },

  shuffle(arr) {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  },

  async pickWord(word) {
    const snap = await GameHub.roomRef.get();
    const gs = snap.val()?.gameState || {};
    if (gs.phase !== 'choose' || gs.drawer !== GameHub.player) return;

    const normalized = normalizeDrawWord(word);
    const displayed = drawMaskFromRevealed(normalized, new Set());

    await GameHub.roomRef.update({
      'gameState/phase': 'draw',
      'gameState/word': word,
      'gameState/normalizedWord': normalized,
      'gameState/displayedWord': displayed,
      'gameState/guessedLetters': [],
      'gameState/revealedLetters': [],
      'gameState/strokes': [],
      'gameState/startedAt': Date.now(),
      'gameState/hint1Done': false,
      'gameState/hint2Done': false,
      'gameState/roundResolved': false,
      'gameState/roundWinner': '_',
      'gameState/roundPoints': 0,
      'gameState/lastRoundSummary': '_',
      'gameState/updatedAt': Date.now(),
    });
    SFX.play('start');
  },

  async guessLetter(letter) {
    const gs = this.latestState;
    if (!gs) return;
    const drawer = gs.drawer || 'scott';
    const guesser = otherPlayer(drawer);
    if (GameHub.player !== guesser || gs.phase !== 'draw' || gs.roundResolved) return;

    const now = Date.now();
    await GameHub.roomRef.child('gameState').transaction((state) => {
      if (!state || state.phase !== 'draw' || state.roundResolved) return state;

      const stateDrawer = state.drawer || 'scott';
      const stateGuesser = otherPlayer(stateDrawer);
      if (stateGuesser !== GameHub.player) return state;

      const normalized = state.normalizedWord || normalizeDrawWord(state.word || '');
      const guessedSet = new Set(normalizeList(state.guessedLetters));
      if (guessedSet.has(letter)) return state;
      guessedSet.add(letter);

      const revealedSet = new Set(normalizeList(state.revealedLetters));
      if (normalized.includes(letter)) revealedSet.add(letter);

      state.guessedLetters = Array.from(guessedSet);
      state.revealedLetters = Array.from(revealedSet);
      state.displayedWord = drawMaskFromRevealed(normalized, revealedSet);
      state.updatedAt = now;

      if (!state.displayedWord.includes('_')) {
        const elapsed = Math.max(0, Math.floor((now - Number(state.startedAt || now)) / 1000));
        const remaining = Math.max(0, Number(state.timeLimit || 90) - elapsed);
        const points = DrawGame.computePoints(state.mode, remaining, Number(state.timeLimit || 90));
        state.scores = state.scores || { scott: 0, nolwen: 0 };
        state.scores[stateGuesser] = (state.scores[stateGuesser] || 0) + points;
        state.roundResolved = true;
        state.roundWinner = stateGuesser;
        state.roundPoints = points;
        state.displayedWord = normalized;
        state.lastRoundSummary = `${stateGuesser === 'scott' ? 'Scott' : 'Nolwen'} a trouvé "${state.word}" (+${points})`;

        const target = Number(state.targetScore || 5);
        if ((state.scores[stateGuesser] || 0) >= target) {
          state.phase = 'finished';
          state.winner = stateGuesser;
        } else {
          state.phase = 'roundResult';
          state.winner = '_';
        }
      }
      return state;
    });
    SFX.play('answer');
  },

  computePoints(mode, remaining, total) {
    const ratio = total > 0 ? (remaining / total) : 0;
    if (ratio >= 0.66) return 3;
    if (ratio >= 0.33) return 2;
    return 1;
  },

  async applyHint(index) {
    const key = index === 1 ? 'hint1Done' : 'hint2Done';
    const now = Date.now();
    await GameHub.roomRef.child('gameState').transaction((state) => {
      if (!state || state.phase !== 'draw' || state.roundResolved) return state;
      if (state[key]) return state;

      const normalized = state.normalizedWord || normalizeDrawWord(state.word || '');
      const alphas = [...normalized].filter(ch => /[A-Z0-9]/.test(ch));
      if (!alphas.length) return state;
      const target = index === 1 ? alphas[0] : (alphas[1] || alphas[0]);

      const revealedSet = new Set(normalizeList(state.revealedLetters));
      revealedSet.add(target);
      state.revealedLetters = Array.from(revealedSet);
      state.displayedWord = drawMaskFromRevealed(normalized, revealedSet);
      state[key] = true;
      state.updatedAt = now;

      if (!state.displayedWord.includes('_')) {
        state.roundResolved = true;
        state.roundWinner = '_';
        state.roundPoints = 0;
        state.phase = 'roundResult';
        state.lastRoundSummary = `Indices complets ! Le mot était "${state.word}".`;
        state.displayedWord = normalized;
      }
      return state;
    });
  },

  async resolveTimeout() {
    const now = Date.now();
    await GameHub.roomRef.child('gameState').transaction((state) => {
      if (!state || state.phase !== 'draw' || state.roundResolved) return state;
      const normalized = state.normalizedWord || normalizeDrawWord(state.word || '');
      state.roundResolved = true;
      state.roundWinner = '_';
      state.roundPoints = 0;
      state.phase = 'roundResult';
      state.displayedWord = normalized;
      state.lastRoundSummary = `Temps écoulé ! Le mot était "${state.word}".`;
      state.updatedAt = now;
      return state;
    });
    SFX.play('wrong');
  },

  async nextRound() {
    if (!GameHub.isHost) return;
    const snap = await GameHub.roomRef.get();
    const gs = snap.val()?.gameState;
    if (!gs || gs.phase !== 'roundResult') return;

    const mode = DRAW_MODE_META[gs.mode] ? gs.mode : 'moyen';
    const meta = DRAW_MODE_META[mode];
    const nextDrawer = otherPlayer(gs.drawer || 'scott');
    const choices = this.pickChoices(mode, normalizeList(gs.lastWords));

    await GameHub.roomRef.update({
      'gameState/round': Number(gs.round || 1) + 1,
      'gameState/drawer': nextDrawer,
      'gameState/phase': 'choose',
      'gameState/timeLimit': meta.time,
      'gameState/hint1At': meta.hint1At,
      'gameState/hint2At': meta.hint2At,
      'gameState/choices': choices,
      'gameState/word': '_',
      'gameState/normalizedWord': '_',
      'gameState/displayedWord': '_',
      'gameState/guessedLetters': [],
      'gameState/revealedLetters': [],
      'gameState/strokes': [],
      'gameState/startedAt': 0,
      'gameState/hint1Done': false,
      'gameState/hint2Done': false,
      'gameState/roundResolved': false,
      'gameState/roundWinner': '_',
      'gameState/roundPoints': 0,
      'gameState/lastRoundSummary': '_',
      'gameState/lastWords': choices,
      'gameState/updatedAt': Date.now(),
    });
    SFX.play('next');
  },

  renderCanvas(gs) {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const canvas = this.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // fond sombre interne
    ctx.save();
    ctx.fillStyle = '#110b23';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    const strokes = normalizeList(gs?.strokes);
    strokes.forEach(st => this.drawStroke(st));
  },

  drawStroke(stroke) {
    if (!this.ctx || !this.canvas || !stroke) return;
    const points = normalizeList(stroke.points).map(p => Array.isArray(p) ? p : [p?.x, p?.y]).filter(p => p.length >= 2);
    if (!points.length) return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.save();
    ctx.globalCompositeOperation = stroke.erase ? 'destination-out' : 'source-over';
    ctx.strokeStyle = stroke.erase ? 'rgba(0,0,0,1)' : (stroke.color || '#ffffff');
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = Math.max(1, Number(stroke.size) || 4);
    ctx.beginPath();
    ctx.moveTo(points[0][0] * w, points[0][1] * h);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0] * w, points[i][1] * h);
    }
    ctx.stroke();

    if (points.length === 1) {
      ctx.beginPath();
      ctx.arc(points[0][0] * w, points[0][1] * h, Math.max(1, (Number(stroke.size) || 4) / 2), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },

  normPointFromEvent(e) {
    if (!this.canvas) return null;
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return [Math.min(1, Math.max(0, x)), Math.min(1, Math.max(0, y))];
  },

  startDraw(e) {
    const gs = this.latestState;
    if (!gs || !this.canDraw(gs)) return;
    e.preventDefault();
    this.drawing = true;
    const p = this.normPointFromEvent(e);
    if (!p) return;
    this.currentStroke = {
      by: GameHub.player,
      color: this.brushColor,
      size: this.brushSize,
      erase: this.eraser,
      points: [p],
    };
    this.drawStroke(this.currentStroke);
  },

  moveDraw(e) {
    if (!this.drawing || !this.currentStroke || !this.ctx || !this.canvas) return;
    e.preventDefault();
    const p = this.normPointFromEvent(e);
    if (!p) return;
    const pts = this.currentStroke.points;
    pts.push(p);

    // segment instantané (aperçu fluide)
    const prev = pts[pts.length - 2];
    const curr = pts[pts.length - 1];
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = this.currentStroke.erase ? 'destination-out' : 'source-over';
    ctx.strokeStyle = this.currentStroke.erase ? 'rgba(0,0,0,1)' : this.currentStroke.color;
    ctx.lineWidth = this.currentStroke.size;
    ctx.beginPath();
    ctx.moveTo(prev[0] * this.canvas.width, prev[1] * this.canvas.height);
    ctx.lineTo(curr[0] * this.canvas.width, curr[1] * this.canvas.height);
    ctx.stroke();
    ctx.restore();
  },

  endDraw(e) {
    if (!this.drawing) return;
    e.preventDefault();
    this.drawing = false;
    const stroke = this.currentStroke;
    this.currentStroke = null;
    if (!stroke || !stroke.points?.length) return;
    this.pushStroke(stroke);
  },

  canDraw(gs) {
    return gs.phase === 'draw' && !gs.roundResolved && gs.drawer === GameHub.player;
  },

  async pushStroke(stroke) {
    const gs = this.latestState;
    if (!gs || !GameHub.roomRef) return;
    const strokes = [...normalizeList(gs.strokes), stroke];
    await GameHub.roomRef.update({
      'gameState/strokes': strokes,
      'gameState/updatedAt': Date.now(),
    });
  },

  async undo() {
    const gs = this.latestState;
    if (!gs || !this.canDraw(gs)) return;
    const strokes = normalizeList(gs.strokes);
    const idx = [...strokes].map((s, i) => ({ s, i })).reverse().find(x => x.s?.by === GameHub.player)?.i;
    if (idx === undefined) return;
    const next = [...strokes];
    next.splice(idx, 1);
    await GameHub.roomRef.update({ 'gameState/strokes': next, 'gameState/updatedAt': Date.now() });
  },

  async clearCanvas() {
    const gs = this.latestState;
    if (!gs || !this.canDraw(gs)) return;
    await GameHub.roomRef.update({ 'gameState/strokes': [], 'gameState/updatedAt': Date.now() });
  },

  setColor(color) {
    this.eraser = false;
    this.brushColor = color;
    this.updateToolUi();
  },

  setSize(size) {
    const n = Number(size);
    this.brushSize = Number.isFinite(n) ? Math.max(2, Math.min(20, n)) : 6;
    this.updateToolUi();
  },

  toggleEraser() {
    this.eraser = !this.eraser;
    this.updateToolUi();
  },
};
