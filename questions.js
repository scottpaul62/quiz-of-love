// ═══════════════════════════════════════════════════════════
//  QUIZ OF LOVE — Banque de questions (18-25 ans, vibe fr)
//  type "guess"  → l'un répond sur lui-même, l'autre devine
//  type "match"  → les deux répondent, points si identique
// ═══════════════════════════════════════════════════════════

const QUESTIONS_DB = {

  connaissance: [
    { q: "Ton réseau social le plus utilisé ?",              a: ["TikTok 🎵", "Instagram 📸", "Snapchat 👻", "Twitter/X 🐦"],              type: "guess" },
    { q: "Tu te lèves à quelle heure le week-end ?",         a: ["Avant 9h 🐓", "Entre 9h et 11h ☕", "Entre 11h et 13h 😴", "Après 13h 💀"], type: "guess" },
    { q: "Ton genre de musique préféré ?",                   a: ["Rap FR 🎤", "Pop/R&B 🎵", "Drill/Trap 🔥", "Variété/Autre 🎶"],          type: "guess" },
    { q: "Ta destination de voyage de rêve ?",               a: ["New York 🗽", "Dubaï 🏙️", "Bali 🌴", "Tokyo 🗾"],                       type: "guess" },
    { q: "Tu passes combien de temps sur ton téléphone ?",   a: ["Moins de 2h 😇", "2 à 4h 📱", "4 à 6h 😅", "Plus de 6h 💀"],            type: "guess" },
    { q: "Ta soirée idéale ?",                               a: ["Sortie en boîte 🕺", "Soirée chez des amis 🍕", "Film à la maison 🎬", "Restau sympa 🍜"], type: "guess" },
    { q: "Ton mood quand t'as pas de 4G ?",                  a: ["Je survis 😇", "Je stresse un peu 😬", "C'est la catastrophe 😱", "Je fais semblant d'aller bien 🙂"], type: "guess" },
    { q: "Que ferais-tu avec 10 000€ inattendus ?",          a: ["Voyage immédiatement ✈️", "J'économise sagement 🏦", "Je m'offre des trucs 🛍️", "Je fais la fête 🎉"], type: "guess" },
    { q: "Ton animal préféré ?",                             a: ["Chien 🐕", "Chat 🐈", "Aucun 🚫", "Autre 🦎"],                           type: "guess" },
    { q: "Ta saison préférée ?",                             a: ["Été ☀️", "Automne 🍂", "Printemps 🌸", "Hiver ❄️"],                     type: "guess" },
    { q: "Ton petit-déj idéal ?",                            a: ["Croissant & café ☕", "Pancakes 🥞", "Rien, j'mange pas le matin 😴", "Smoothie healthy 🥤"], type: "guess" },
    { q: "Comment tu réponds aux textos ?",                  a: ["Tout de suite 📲", "Dans l'heure ⏰", "Dans la journée 📅", "Quand j'y pense... 👀"], type: "guess" },
    { q: "Ton superpouvoirs de rêve ?",                      a: ["Voyager dans le temps ⏰", "Lire dans les pensées 🧠", "Invisibilité 👻", "Avoir infiniment d'argent 💸"], type: "guess" },
    { q: "Ce que tu fais en premier le matin ?",             a: ["Je check mon téléphone 📱", "Je me lève direct 💪", "Je reste au lit 30min 😴", "Je mange 🍳"],  type: "guess" },
    { q: "Ton film/série préféré en ce moment ?",            a: ["Une série Netflix 📺", "Un film d'action 💥", "Une comédie romantique 💕", "Un anime 🎌"],    type: "guess" },
    { q: "Ton plus grand défaut ?",                          a: ["Je suis trop flemme 😴", "Je suis trop dans ma tête 🧠", "Je procrastine tout 📅", "Je m'énerve vite 😤"], type: "guess" },
    { q: "Ton type de sortie préféré ?",                     a: ["Soirée clubbing 🕺", "Ciné entre potes 🎬", "Bowling/laser game 🎳", "Restau/bar 🍹"],       type: "guess" },
    { q: "Si t'étais un plat ?",                             a: ["Pizza 🍕 (classique & apprécié)", "Sushi 🍣 (raffiné & discret)", "Burger 🍔 (direct & assumé)", "Tacos 🌮 (original & inattendu)"], type: "guess" },
  ],

  hot: [
    { q: "Ce qui te fait craquer instantanément chez l'autre ?",  a: ["Un beau sourire 😊", "Les yeux 👀", "Une bonne odeur 😮‍💨", "L'humour 😂"],              type: "match" },
    { q: "Ton endroit préféré pour un bisou ?",                   a: ["Les lèvres 💋", "Le cou 😘", "Le front 🥰", "La joue 😳"],                              type: "match" },
    { q: "Le mot doux que tu préfères recevoir ?",                a: ["Chéri(e) 💕", "Mon amour ❤️", "Bébé 🍼", "Mon cœur 💓"],                               type: "match" },
    { q: "Ce que tu ferais si on était seuls ce soir ?",         a: ["Film & câlins sur le canapé 🎬", "Cuisiner ensemble 👨‍🍳", "Danser dans le salon 💃", "Parler toute la nuit 🌙"], type: "match" },
    { q: "Notre prochain rendez-vous idéal ?",                   a: ["Resto romantique 🍽️", "Ciné & pop-corn 🎬", "Bowling ou karting 🎳", "Escape Game 🔐"],   type: "match" },
    { q: "Le geste romantique qui te touche le plus ?",          a: ["Un message inattendu 💌", "Des fleurs 🌹", "Une surprise 🎁", "Un long câlin 🤗"],        type: "match" },
    { q: "La chose la plus folle que t'aurais fait pour quelqu'un ?", a: ["Traverser une ville la nuit 🌃", "Sécher les cours pour lui/elle 📚", "Cuisiner à minuit 🍳", "Écrire une lettre 📝"], type: "match" },
    { q: "Ton mood quand l'autre répond pas depuis 2h ?",        a: ["Je m'en fous 😌", "Léger malaise 😬", "Je check son actif Instagram 👀", "Je commence à écrire un roman dans ma tête 📖"], type: "match" },
    { q: "Ce que t'aimes le plus dans notre connexion ?",        a: ["La complicité 🔗", "Les fous rires 😂", "La tendresse 🤗", "La confiance totale 💎"],     type: "match" },
    { q: "Un endroit de rêve pour passer une nuit ensemble ?",   a: ["Hôtel de luxe 🏨", "Chalet à la montagne 🏔️", "Bungalow sur l'eau 🌊", "Camping sous les étoiles ⛺"], type: "match" },
    { q: "Ton style de câlin préféré ?",                         a: ["Câlin cuillère 🥄", "Face à face serré ❤️", "Sur le canapé devant la télé 📺", "Câlin surprise par derrière 🫂"], type: "match" },
    { q: "Ce que tu aimes le plus chez l'autre physiquement ?",  a: ["Le sourire 😁", "Les yeux 👁️", "La silhouette 🔥", "Les mains 🤲"],                     type: "match" },
    { q: "Ta définition d'une soirée parfaite à deux ?",         a: ["On sort en ville 🌆", "On reste chez nous 🏠", "On fait une surprise à l'autre 🎁", "On part en mini-aventure 🗺️"], type: "match" },
    { q: "Ce qui te donne des papillons chez l'autre ?",         a: ["Quand il/elle rit vraiment 😂", "Quand il/elle te regarde intensément 👀", "Quand il/elle te prend la main 🤝", "Ses messages du matin ☀️"], type: "match" },
    { q: "Si on devait mettre une chanson sur notre relation ?",  a: ["Quelque chose de doux 🎵", "Quelque chose de passionné 🔥", "Quelque chose de drôle 😂", "Quelque chose de nostalgique 🌙"], type: "match" },
    { q: "Ce que t'apprécies le plus dans nos moments ensemble ?", a: ["Quand on délire 😂", "Quand on parle de tout 🗣️", "Les silences confortables 🌸", "Quand on se fait des câlins 🫂"], type: "match" },
  ],

  couple: [
    { q: "Combien d'enfants tu voudrais ?",                      a: ["0 enfant 🚫", "1 ou 2 👶", "3 ou 4 🏡", "Une grande famille 👨‍👩‍👧‍👦"],                   type: "match" },
    { q: "Où voudrais-tu qu'on vive ensemble ?",                 a: ["Grande ville animée 🌆", "Banlieue tranquille 🏘️", "Campagne 🌾", "Bord de mer 🌊"],      type: "match" },
    { q: "Notre style de maison de rêve ?",                      a: ["Appart moderne en ville 🏛️", "Maison avec jardin 🌿", "Loft industriel 🏭", "Maison bohème colorée 🌈"], type: "match" },
    { q: "Animal de compagnie ensemble ?",                       a: ["Un chien 🐕", "Un chat 🐈", "Les deux 🐾", "Aucun 🚫"],                                   type: "match" },
    { q: "Notre premier grand voyage ensemble ?",                a: ["Asie 🗾", "Caraïbes 🏝️", "Amérique 🗽", "Afrique 🌍"],                                   type: "match" },
    { q: "Votre date idéale avec seulement 50€ ?",               a: ["Pique-nique romantique 🧺", "Ciné + McDo après 🍟", "Balade + café 🌿", "Marché + cuisine ensemble 🛒"], type: "match" },
    { q: "Dans combien de temps se marier ?",                    a: ["Moins de 2 ans 💍", "Dans 2 à 5 ans 📅", "Plus de 5 ans ⏳", "On verra 🤷"],              type: "match" },
    { q: "Notre tradition de couple idéale ?",                   a: ["Soirée film du vendredi 🎬", "Weekend escapade 🏕️", "Dîner romantique hebdo 🍷", "Journée rien que nous 💑"], type: "match" },
    { q: "Le premier truc que tu ferais si on habitait ensemble ?", a: ["Décorer ensemble 🛋️", "Cuisiner un gros repas 🍳", "Faire une soirée pyjama 🎉", "Mettre la musique à fond 🎵"], type: "match" },
    { q: "Dans 10 ans, on fait quoi ?",                          a: ["On voyage partout ✈️", "On est installés avec enfants 👨‍👩‍👧", "On réalise nos projets 🌟", "On est encore en train de rigoler 😂"], type: "match" },
    { q: "Comment on gère nos disputes ?",                       a: ["On en parle tout de suite 🗣️", "On laisse passer la nuit 🌙", "Câlin = paix 🤗", "Message d'excuse 💬"],  type: "match" },
    { q: "Notre activité couple parfaite le week-end ?",         a: ["Brunch du dimanche 🥐", "Séance sport ensemble 💪", "Marché + cuisine 🛍️", "Grasse mat' & Netflix 📺"], type: "match" },
    { q: "Votre film/série couple à regarder ensemble ?",        a: ["Comédie romantique 💕", "Thriller haletant 😱", "Série longue durée 📺", "Documentaire intéressant 🌍"], type: "match" },
    { q: "Ce que tu veux absolument partager avec l'autre ?",    a: ["Mes passions 🎨", "Mes potes 👥", "Ma famille 👨‍👩‍👧", "Mes voyages ✈️"],                     type: "match" },
    { q: "Notre valeur la plus importante en tant que couple ?", a: ["La confiance 🔒", "La communication 🗣️", "Le respect 🌸", "Le fun & les rires 😂"],        type: "match" },
    { q: "Votre couple de célébrités préféré ?",                 a: ["Beyoncé & Jay-Z 👑", "Ryan Reynolds & Blake 😍", "Zendaya & Tom Holland 🕷️", "Un couple inconnu mais heureux 💝"], type: "match" },
  ],

  defi: [
    { q: "Le truc le plus gênant que j'aurais dit à quelqu'un ?",    a: ["Rien, je suis un saint 😇", "J'ai dragué en mode catastrophe 😬", "J'ai dit 'je t'aime' trop tôt 💀", "J'ai appelé mon prof par le prénom de ma mère 😭"], type: "match" },
    { q: "Notre plus grosse dispute porterait sur ?",                 a: ["Quel resto choisir 🍽️", "La température de la chambre 🌡️", "Netflix — quoi regarder 📺", "Qui répond pas assez vite 📱"], type: "match" },
    { q: "Si tu devais me décrire en 1 emoji ?",                     a: ["😊 (Solaire)", "🥰 (Trop mignon)", "😏 (Mystérieux·se)", "🔥 (Chaud·e)"],             type: "match" },
    { q: "Si on était un duo de rappeurs, on s'appellerait ?",       a: ["Scott & Nolwen Forever 💕", "Les Inséparables 🔗", "Bonnie & Clyde 2.0 🌹", "Le Duo du Siècle 👑"], type: "match" },
    { q: "Si on était un film, ce serait ?",                         a: ["Comédie romantique 😂❤️", "Film d'action épique 💥", "Drame passionnel 🎭", "Comédie délirante 😂"],  type: "match" },
    { q: "Notre pire date disaster imaginaire ?",                     a: ["Resto qui ferme à notre arrivée 😅", "Pluie torrentielle en balade 🌧️", "Voiture en panne 🚗", "Croiser un(e) ex 😱"],     type: "match" },
    { q: "Que trouverais-tu sur mon téléphone ?",                    a: ["Des photos de nous 📸", "Des mèmes trop drôles 😂", "Nos vieux messages relus 💌", "Des vidéos TikTok sauvegardées 📱"], type: "match" },
    { q: "T'offrir quelque chose sans argent, ce serait ?",          a: ["Une lettre d'amour ✍️", "Une playlist rien que pour toi 🎵", "Une soirée étoiles 🌟", "Un bon massage 💆"],            type: "match" },
    { q: "Si on devait faire un road trip, destination ?",           a: ["Côte d'Azur 🌊", "Bretagne sauvage 🌿", "Espagne soleil 🇪🇸", "Tour de l'Europe 🗺️"],  type: "match" },
    { q: "Mon pire trait de caractère selon toi ?",                  a: ["Trop têtu(e) 🐂", "Trop dans la lune 🌙", "Trop intense parfois 🔥", "Trop flemmard(e) 😴"],             type: "match" },
    { q: "Ce qu'on ferait si on avait une semaine libre et 5000€ ?", a: ["Road trip 🚗", "Hôtel luxe & spa 🏨", "Festival de musique 🎵", "Partir à l'imprévu 🎲"],              type: "match" },
    { q: "Si je devais te décrire à mes potes en un mot ?",          a: ["Adorable 🥰", "Drôle 😂", "Intense 🔥", "Mystérieux·se 🌙"],                           type: "match" },
    { q: "Ce que tu ferais si j'avais une très mauvaise journée ?",  a: ["Ton plat préféré commandé 🍔", "Te faire rire avec des mèmes 😄", "T'appeler juste pour écouter 📞", "Tout lâcher pour te rejoindre 🏃"], type: "match" },
    { q: "Notre meilleure qualité commune ?",                        a: ["On se fait rire 😂", "On se comprend sans parler 🔗", "On s'accepte tels qu'on est 🌟", "On est loyaux 💪"],              type: "match" },
    { q: "Si on devait créer un business ensemble ?",                a: ["Un restau / bar 🍹", "Une boutique en ligne 💻", "Une agence de voyage ✈️", "Un truc complètement random 🎲"],         type: "match" },
    { q: "Le truc que je ferais jamais mais toi oui ?",              a: ["Sauter en parachute 🪂", "Parler en public sans stresser 🎤", "Manger un truc bizarre 🐛", "Voyager seul(e) à l'autre bout du monde 🌏"], type: "match" },
  ],
};

// Nombre de questions par partie
const QUESTIONS_PER_GAME = 15;

// Messages troll quand les réponses ne matchent pas
const TROLL_MESSAGES = [
  "T'es vraiment nul(le) là 💀",
  "Espèce de Tana du quiz 😭",
  "T'as répondu quoi là sérieux ?? 😂",
  "Tout pour la thune, rien pour le cœur 🤑",
  "Que par intérêt... 🙄",
  "Ma grand-mère jouerait mieux 👵",
  "T'as réfléchi avec tes pieds ? 🦶",
  "C'est pas grave... mais si quand même 😅",
  "Raté ! Révise avant la prochaine 🎯",
  "On peut plus rien faire de toi 😔",
  "Retente ta chance pitié 🙏",
  "T'as googlelé une mauvaise réponse ou quoi 😭",
];

// Messages troll pour le perdant (fin de partie)
const LOSER_MESSAGES_SCOTT = [
  "De toute façon je te bats la bagarre 💪 — Nolwen",
  "Vu que t'as perdu, on fera des enfants Scott 👶😂",
  "Tes pieds à la el mordjene Scott 💅",
  "T'as perdu donc c'est toi qui fais la vaisselle 🍽️",
  "Même en triche t'aurais perdu Scott 😭",
  "Entraîne-toi, je te donne une revanche dans 10 ans ⏳",
  "C'est pas grave, t'es beau au moins 😘 — Nolwen",
  "Scott tu crains dans ce jeu mais je t'aime quand même 💕",
];

const LOSER_MESSAGES_NOLWEN = [
  "De toute façon je te bats la bagarre 💪 — Scott",
  "Vu que t'as perdu, on fera des enfants Nolwen 👶😂",
  "Tes pieds à la el mordjene Nolwen 💅",
  "T'as perdu donc c'est toi qui fais la vaisselle 🍽️",
  "Même en triche t'aurais perdu 😭",
  "Entraîne-toi, je te donne une revanche dans 10 ans ⏳",
  "C'est pas grave, t'es belle au moins 😘 — Scott",
  "Nolwen tu crains dans ce jeu mais je t'aime quand même 💕",
];

// Messages pour le gagnant
const WINNER_MESSAGES = [
  "Champion(ne) absolu(e) 👑",
  "T'as tout déchiré, respect 🔥",
  "Trop fort(e), logique c'était toi 😎",
  "Victoire totale, aucune discussion possible 🏆",
  "Le/La meilleur(e) tout simplement 💅",
];

// Messages égalité
const DRAW_MESSAGES = [
  "Vous êtes vraiment faits l'un pour l'autre 💕",
  "Même score = même âme, c'est beau 🌸",
  "Égalité parfaite — on remet ça ? 🤝",
  "Personne perd, personne gagne... et si c'était ça l'amour ? 🥰",
];

// Mélangeur Fisher-Yates
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getQuestionOrder(mode) {
  const pool = QUESTIONS_DB[mode];
  const indices = pool.map((_, i) => i);
  return shuffleArray(indices).slice(0, QUESTIONS_PER_GAME);
}

function getQuestion(mode, index) {
  return QUESTIONS_DB[mode][index];
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
