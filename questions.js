// ═══════════════════════════════════════════════════════════
//  QUIZ OF LOVE — Banque de questions
//  type "guess"  → l'un répond sur lui-même, l'autre devine
//  type "match"  → les deux répondent, points si identique
// ═══════════════════════════════════════════════════════════

const QUESTIONS_DB = {

  connaissance: [
    { q: "Quel est ton dessert préféré ?",              a: ["Chocolat 🍫", "Tiramisu 🍮", "Glace 🍦", "Gâteau maison 🎂"],                    type: "guess" },
    { q: "Ton genre de musique préféré ?",              a: ["Pop 🎵", "R&B / Soul 🎤", "Hip-hop 🎧", "Variété française 🇫🇷"],               type: "guess" },
    { q: "Ta destination de voyage de rêve ?",          a: ["Maldives 🏝️", "Japon 🗾", "New York 🗽", "Bali 🌺"],                           type: "guess" },
    { q: "Si tu pouvais avoir un superpouvoirs ?",      a: ["Voler ✈️", "Invisibilité 👻", "Télépathie 🧠", "Voyage dans le temps ⏰"],       type: "guess" },
    { q: "Ta soirée idéale ?",                          a: ["Resto chic 🍷", "Film à la maison 🎬", "Soirée entre amis 🎉", "Balade nocturne 🌙"], type: "guess" },
    { q: "Ta plus grande peur secrète ?",               a: ["Les araignées 🕷️", "L'échec 😰", "La solitude 💔", "Le vide 🌑"],               type: "guess" },
    { q: "Que ferais-tu avec 1 million d'euros ?",      a: ["Voyager 🌍", "Acheter une maison 🏠", "Investir 📈", "Aider ma famille 💝"],     type: "guess" },
    { q: "Ton animal préféré ?",                        a: ["Chien 🐕", "Chat 🐈", "Lapin 🐇", "Oiseau 🦜"],                                 type: "guess" },
    { q: "Ta saison préférée ?",                        a: ["Printemps 🌸", "Été ☀️", "Automne 🍂", "Hiver ❄️"],                            type: "guess" },
    { q: "Ton petit-déjeuner idéal ?",                  a: ["Croissant ☕", "Pancakes 🥞", "Tartines 🍞", "Smoothie 🥤"],                    type: "guess" },
    { q: "Ton style de film préféré ?",                 a: ["Comédie romantique 💕", "Action 💥", "Horreur 👻", "Documentaire 🎥"],           type: "guess" },
    { q: "Comment tu passes ton dimanche ?",            a: ["Je flemmarde sous la couette 🛌", "Je cuisine 👨‍🍳", "Je sors me promener 🌿", "Je fais du sport 🏃"], type: "guess" },
  ],

  hot: [
    { q: "Ce qui te fait craquer chez l'autre ?",                a: ["Le sourire 😊", "Les yeux 👀", "La voix 🎵", "Les mains 🤲"],                         type: "match" },
    { q: "Ton endroit préféré pour un bisou ?",                  a: ["Les lèvres 💋", "Le cou 😘", "Le front 🥰", "La joue 😳"],                           type: "match" },
    { q: "Le mot doux que tu préfères ?",                        a: ["Chéri(e) 💕", "Mon amour ❤️", "Bébé 🍼", "Mon cœur 💓"],                            type: "match" },
    { q: "L'ambiance romantique parfaite ?",                     a: ["Bougies & musique douce 🕯️", "Plage au coucher du soleil 🌅", "Pluie & plaid 🌧️", "Sous les étoiles 🌟"], type: "match" },
    { q: "Notre prochain rendez-vous idéal ?",                   a: ["Resto romantique 🍽️", "Cinéma 🎬", "Bowling 🎳", "Escape Game 🔐"],                  type: "match" },
    { q: "Le geste romantique que tu préfères ?",                a: ["Des fleurs 🌹", "Un message doux 💌", "Une surprise 🎁", "Un massage 💆"],             type: "match" },
    { q: "Si on était seuls ce soir, tu ferais quoi ?",          a: ["Film & câlins 🎬", "Cuisiner ensemble 👨‍🍳", "Danser 💃", "Parler toute la nuit 🌙"],   type: "match" },
    { q: "La qualité de l'autre qui te touche le plus ?",        a: ["Sa gentillesse 🌟", "Sa drôlerie 😄", "Sa loyauté 🤝", "Son intelligence 🧠"],        type: "match" },
    { q: "Ce que tu aimes le plus dans notre connexion ?",       a: ["La complicité 🔗", "Les fous rires 😂", "La tendresse 🤗", "La confiance 💎"],        type: "match" },
    { q: "Un endroit de rêve pour passer la nuit ensemble ?",    a: ["Chalet à la montagne 🏔️", "Bungalow sur l'eau 🌊", "Hôtel de luxe 🏨", "Camping sous les étoiles ⛺"], type: "match" },
    { q: "Ce que tu remarques en premier chez quelqu'un ?",      a: ["Le sourire 😁", "Les yeux 👁️", "La manière de parler 🗣️", "L'attitude ✨"],           type: "match" },
    { q: "Ton style de câlin préféré ?",                         a: ["Câlin cuillère 🥄", "Face à face ❤️", "Câlin par derrière 🤗", "Enlacés sur le canapé 🛋️"], type: "match" },
  ],

  couple: [
    { q: "Combien d'enfants voudrais-tu avoir ?",                a: ["0 enfant 🚫", "1 ou 2 👶", "3 ou 4 🏡", "Une grande famille 👨‍👩‍👧‍👦"],                  type: "match" },
    { q: "Où voudrais-tu vivre ensemble ?",                      a: ["Grande ville 🌆", "Petite ville 🏘️", "Campagne 🌾", "Bord de mer 🌊"],               type: "match" },
    { q: "Notre style de maison de rêve ?",                      a: ["Moderne & épuré 🏛️", "Cosy & rustique 🏡", "Minimaliste 🎋", "Bohème & colorée 🌈"], type: "match" },
    { q: "Animal de compagnie ensemble ?",                       a: ["Un chien 🐕", "Un chat 🐈", "Les deux 🐾", "Aucun pour l'instant 🚫"],               type: "match" },
    { q: "Votre voyage de noces de rêve ?",                      a: ["Asie mystérieuse 🗾", "Caraïbes ensoleillées 🏝️", "Europe romantique 🗼", "Amérique aventureuse 🗽"], type: "match" },
    { q: "Dans combien de temps se marier ?",                    a: ["Moins de 2 ans 💍", "Dans 2 à 5 ans 📅", "Plus de 5 ans ⏳", "On verra 🤷"],         type: "match" },
    { q: "Votre tradition de couple idéale ?",                   a: ["Soirée film du vendredi 🎬", "Weekend escapade mensuel 🏕️", "Dîner romantique hebdo 🍷", "Journée rien que nous 💑"], type: "match" },
    { q: "Dans 10 ans, on est ?",                                a: ["Mariés avec enfants 👨‍👩‍👧", "En voyage longue durée ✈️", "Installés et heureux 🏠", "En train de réaliser nos rêves 🌟"], type: "match" },
    { q: "Votre film couple préféré ?",                          a: ["La La Land 🎭", "Titanic 🚢", "The Notebook 📔", "Crazy Stupid Love 💕"],             type: "match" },
    { q: "Notre grande valeur commune en tant que couple ?",     a: ["La confiance totale 🔒", "La liberté & l'espace 🌬️", "L'aventure & les projets 🗺️", "La tendresse au quotidien 🌸"], type: "match" },
    { q: "Comment on règle nos disputes ?",                      a: ["On en parle tout de suite 🗣️", "On laisse passer la nuit 🌙", "On fait un câlin 🤗", "On s'excuse par message 💬"], type: "match" },
    { q: "Notre activité couple parfaite le week-end ?",         a: ["Brunch du dimanche 🥐", "Randonnée en nature 🌿", "Marché & cuisine 🛍️", "Ciné & sortie le soir 🎬"],  type: "match" },
  ],

  defi: [
    { q: "Une chose (sympa) à changer chez moi ?",              a: ["Rien du tout ! 😇", "Mon humeur du matin 😴", "Mon attachement au téléphone 📱", "Mon manque de ponctualité ⏰"], type: "match" },
    { q: "Notre plus grosse dispute porterait sur ?",            a: ["Quel resto choisir 🍽️", "La température de la chambre 🌡️", "Netflix — quoi regarder 📺", "Qui fait la vaisselle 🍽️"], type: "match" },
    { q: "Si tu devais me décrire en 1 emoji ?",                a: ["😊 (Solaire)", "🥰 (Adorable)", "😏 (Mystérieux·se)", "🔥 (Passionné·e)"],            type: "match" },
    { q: "Notre meilleure qualité commune ?",                    a: ["On se fait rire 😂", "On se comprend sans parler 🔗", "On s'accepte tels qu'on est 🌟", "On se soutient toujours 💪"], type: "match" },
    { q: "Si on était un film, ce serait ?",                    a: ["Comédie romantique 😂❤️", "Film d'action épique 💥", "Drame passionnel 🎭", "Aventure magique 🌈"],  type: "match" },
    { q: "Notre pire date disaster imaginaire ?",               a: ["Resto qui ferme à notre arrivée 😅", "Pluie torrentielle en balade 🌧️", "Voiture en panne en route 🚗", "Croiser un(e) ex 😱"], type: "match" },
    { q: "Que trouverais-tu sur mon téléphone ?",               a: ["Des photos de nous 📸", "Des mèmes trop drôles 😂", "Nos vieux messages relus 💌", "Rien d'intéressant 😉"], type: "match" },
    { q: "T'offrir quelque chose sans argent, ce serait ?",     a: ["Une lettre d'amour ✍️", "Une playlist rien que pour toi 🎵", "Une soirée étoiles 🌟", "Un bon massage 💆"], type: "match" },
    { q: "Si tu avais une très mauvaise journée, je ferais ?",  a: ["Ton plat préféré 🍳", "T'envoyer des mèmes réconfortants 😄", "T'appeler juste pour écouter 📞", "Tout lâcher pour te rejoindre 🏃"], type: "match" },
    { q: "Notre surnom secret de couple ?",                     a: ["Les Inséparables 🔗", "Bonnie & Clyde 🌹", "Scott & Nolwen Forever 💕", "Les Amoureux Fous 🌙"],  type: "match" },
    { q: "Notre fête idéale ensemble ?",                        a: ["Un Noël en amoureux 🎄", "Un réveillon fou avec amis 🎉", "Un anniversaire surprise 🎂", "Une fête improvisée 🥂"], type: "match" },
    { q: "Si on devait faire un road trip, destination ?",      a: ["Côte d'Azur 🌊", "Bretagne sauvage 🌿", "Route 66 aux USA 🛣️", "Tour de l'Europe 🗺️"],   type: "match" },
  ],
};

// Nombre de questions par partie
const QUESTIONS_PER_GAME = 8;

// Mélangeur Fisher-Yates
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Retourne les indices mélangés pour un mode donné
function getQuestionOrder(mode) {
  const pool = QUESTIONS_DB[mode];
  const indices = pool.map((_, i) => i);
  return shuffleArray(indices).slice(0, QUESTIONS_PER_GAME);
}

// Retourne la question par index
function getQuestion(mode, index) {
  return QUESTIONS_DB[mode][index];
}
