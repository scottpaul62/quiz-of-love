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

    this.setupListener(this.roomCode);

    if (this.isHost) {
      const gs = this.initState(this.type);
      await db.ref('games/' + this.roomCode).set({
        host: roomData.host || 'scott',
        guest: roomData.guest || 'nolwen',
        type: this.type,
        status: 'playing',
        sessionId: this.sessionId,
        gameState: gs,
        leftBy: '_',
        createdAt: Date.now(),
      });
    }
  },

  setupListener(code) {
    if (!isFirebaseReady()) return;
    if (this.roomRef) this.roomRef.off();
    this.roomRef = db.ref('games/' + code);
    if (this._leftRef) { this._leftRef.onDisconnect().cancel(); }
    this._leftRef = db.ref('games/' + code + '/leftBy');
    this._leftRef.onDisconnect().set(this.player);

    this.roomRef.on('value', snap => {
      if (!snap.exists()) return;
      const data = snap.val();

      if (data.sessionId && this.sessionId && data.sessionId !== this.sessionId) return;

      if (data.leftBy && data.leftBy !== '_' && data.leftBy !== GameHub.player) {
        const name = data.leftBy === 'scott' ? 'Scott' : 'Nolwen';
        GameHub.cleanup();
        App.showScreen('screen-lobby');
        App.toast(`${name} a quitte le mini-jeu`);
        return;
      }

      if (data.host)  setGameDot(data.host, true);
      if (data.guest) setGameDot(data.guest, true);

      if (data.status === 'playing' || data.status === 'setup') {
        const dispatch = { morpion: Morpion, p4: P4, pfc: PFC, vod: VOD, uno: Uno, bataille: BN };
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
      case 'vod':      return { turn: 'scott', pick: '_', questionIdx: -1, status: 'choosing' };
      case 'uno':      return Uno.buildInitialState();
      case 'bataille': return { statusPhase: 'setup', shipsScott: 'none', shipsNolwen: 'none', shotsScott: 'none', shotsNolwen: 'none', turn: 'scott' };
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
    this.active = false;
    this.sessionId = 0;
    this.type = null;
    setGameDot('scott', false);
    setGameDot('nolwen', false);
  },

  exitLobby() {
    App.showScreen('screen-lobby');
  },

  async exitGame() {
    if (this.roomRef) {
      this.roomRef.update({ leftBy: this.player }).catch(() => {});
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
        if (GameHub.isHost) {
          setTimeout(async () => {
            await GameHub.roomRef.update({ 'gameState/choices': { scott: '_', nolwen: '_' } });
            this._myChoice = null;
          }, 2500);
        } else {
          this._myChoice = null;
        }
      }
    }
  },

  async choose(choice) {
    if (this._myChoice) return;
    this._myChoice = choice;
    const sc = parseInt(document.getElementById('pfc-score-scott').textContent)||0;
    const sn = parseInt(document.getElementById('pfc-score-nolwen').textContent)||0;

    await GameHub.roomRef.update({ [`gameState/choices/${GameHub.player}`]: choice });

    // Si les deux ont choisi, calculer scores (hôte)
    if (GameHub.isHost) {
      const snap = await GameHub.roomRef.get();
      const d    = snap.val();
      const gc   = d.gameState.choices;
      if (gc.scott && gc.scott !== '_' && gc.nolwen && gc.nolwen !== '_') {
        const w = this.getWinner(gc.scott, gc.nolwen);
        const newScores = { scott: sc, nolwen: sn };
        if (w !== 'draw') newScores[w]++;
        await GameHub.roomRef.update({ 'gameState/scores': newScores });
      }
    }
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
    "Le message un peu chaud que tu n'as jamais ose envoyer ?",
    "Ton mood ideal pour une nuit a deux ?",
    "Tu preferes quoi: teasing soft, tendresse ou full passion ?",
    "Ton plus gros red flag en date romantique ?",
    "Le compliment intime qui te fait fondre direct ?",
    "Tu assumes plus les mots doux en vocal ou en face ?",
    "Le fantasme soft que tu peux avouer ici ?",
    "Ton type de baiser prefere quand ca devient intense ?",
    "Si on coupe les telephones ce soir, on fait quoi en premier ?",
    "Ton endroit prefere pour un calin long sans parler ?",
  ],
  defi: [
    "Envoie un message à quelqu'un que t'as pas contacté depuis 6 mois 📱",
    "Fais 10 pompes maintenant 💪",
    "Chante le refrain d'une chanson à voix haute 🎤",
    "Envoie-moi un selfie dans une position bizarre 📸",
    "Dis 3 choses que t'aimes chez moi sans réfléchir ❤️",
    "Fais une imitation de moi (envoie une vidéo) 😂",
    "Envoie le dernier mème que t'as sauvegardé 📲",
    "Dis-moi ton mdp Netflix (si t'en as un) 👀",
    "Montre la 5ème photo de ta galerie 📷",
    "Écris-moi un poème de 4 lignes en 60 secondes ✍️",
    "Fais un TikTok de 10 secondes et montre-le moi 🎵",
    "Appelle quelqu'un et dis 'je t'aime' avant de raccrocher 😂",
    "Mange un truc bizarre qui traîne dans ta cuisine 🍴",
    "Montre ta recherche Google la plus récente 🔍",
    "Poste un selfie sans filtre dans ta story 📸",
    "Fais un vocal de 10 secondes ultra mignon et envoie-le.",
    "Envoie un message: 'Soiree date soon ?' a ton/ta partenaire.",
    "Dis trois choses tres attirantes chez l'autre, sans pause.",
    "Fais une danse de 15 secondes en mode seduction fun.",
    "Ecris une mini scene romantique de 2 lignes et lis-la.",
    "Envoie une photo de ton 'look date ideale' du moment.",
    "Fais une declaration dramatique style cinema pendant 20 secondes.",
    "Lance un compliment improvise en rime.",
    "Envoie un emoji qui resume ton niveau de desir actuel.",
    "Defi duo: chacun dit une chose qu'il veut tester en couple ce mois-ci.",
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
    const text = pool[Math.floor(Math.random() * pool.length)];
    await GameHub.roomRef.update({
      'gameState/pick':         type,
      'gameState/questionText': text,
      'gameState/status':       'question',
    });
    SFX.play('select');
  },

  async next() {
    const cur = GameHub.player === 'scott' ? 'nolwen' : 'scott';
    const snap = await GameHub.roomRef.get();
    const gs = snap.val().gameState;
    await GameHub.roomRef.update({
      'gameState/turn':   gs.turn === 'scott' ? 'nolwen' : 'scott',
      'gameState/status': 'choosing',
      'gameState/pick':   '_',
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

    // Vérifier si les deux sont prêts (hôte)
    if (GameHub.isHost) {
      const snap = await GameHub.roomRef.get();
      const gs   = snap.val().gameState;
      if (this._ships(gs, 'scott') && this._ships(gs, 'nolwen')) {
        await GameHub.roomRef.update({ 'gameState/statusPhase': 'playing' });
      }
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
