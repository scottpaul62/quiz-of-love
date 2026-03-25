// ═══════════════════════════════════════════════════════════
//  QUIZ OF LOVE — Banque de questions (18-25 ans, vibe fr)
//  type "guess"  → l'un répond sur lui-même, l'autre devine
//  type "match"  → les deux répondent, points si identique
// ═══════════════════════════════════════════════════════════

const QUESTIONS_DB = {

  // ══════════════════════════════════════════════════════
  //  CONNAISSANCE (52 questions)
  // ══════════════════════════════════════════════════════
  connaissance: [
    { q: "Ton réseau social le plus utilisé ?",              a: ["TikTok 🎵", "Instagram 📸", "Snapchat 👻", "Twitter/X 🐦"],                type: "guess" },
    { q: "Tu te lèves à quelle heure le week-end ?",         a: ["Avant 9h 🐓", "Entre 9h et 11h ☕", "Entre 11h et 13h 😴", "Après 13h 💀"],  type: "guess" },
    { q: "Ton genre de musique préféré ?",                   a: ["Rap FR 🎤", "Pop/R&B 🎵", "Drill/Trap 🔥", "Variété/Autre 🎶"],            type: "guess" },
    { q: "Ta destination de voyage de rêve ?",               a: ["New York 🗽", "Dubaï 🏙️", "Bali 🌴", "Tokyo 🗾"],                         type: "guess" },
    { q: "Tu passes combien de temps sur ton téléphone ?",   a: ["Moins de 2h 😇", "2 à 4h 📱", "4 à 6h 😅", "Plus de 6h 💀"],              type: "guess" },
    { q: "Ta soirée idéale ?",                               a: ["Sortie en boîte 🕺", "Soirée chez des amis 🍕", "Film à la maison 🎬", "Restau sympa 🍜"], type: "guess" },
    { q: "Ton mood quand t'as pas de 4G ?",                  a: ["Je survis 😇", "Je stresse un peu 😬", "C'est la catastrophe 😱", "Je fais semblant d'aller bien 🙂"], type: "guess" },
    { q: "Que ferais-tu avec 10 000€ inattendus ?",          a: ["Voyage immédiatement ✈️", "J'économise sagement 🏦", "Je m'offre des trucs 🛍️", "Je fais la fête 🎉"], type: "guess" },
    { q: "Ton animal préféré ?",                             a: ["Chien 🐕", "Chat 🐈", "Aucun 🚫", "Autre 🦎"],                             type: "guess" },
    { q: "Ta saison préférée ?",                             a: ["Été ☀️", "Automne 🍂", "Printemps 🌸", "Hiver ❄️"],                       type: "guess" },
    { q: "Ton petit-déj idéal ?",                            a: ["Croissant & café ☕", "Pancakes 🥞", "Rien, j'mange pas le matin 😴", "Smoothie healthy 🥤"], type: "guess" },
    { q: "Comment tu réponds aux textos ?",                  a: ["Tout de suite 📲", "Dans l'heure ⏰", "Dans la journée 📅", "Quand j'y pense... 👀"], type: "guess" },
    { q: "Ton superpouvoir de rêve ?",                       a: ["Voyager dans le temps ⏰", "Lire dans les pensées 🧠", "Invisibilité 👻", "Avoir infiniment d'argent 💸"], type: "guess" },
    { q: "Ce que tu fais en premier le matin ?",             a: ["Je check mon téléphone 📱", "Je me lève direct 💪", "Je reste au lit 30min 😴", "Je mange 🍳"], type: "guess" },
    { q: "Ton film/série préféré en ce moment ?",            a: ["Une série Netflix 📺", "Un film d'action 💥", "Une comédie romantique 💕", "Un anime 🎌"], type: "guess" },
    { q: "Ton plus grand défaut ?",                          a: ["Je suis trop flemmard(e) 😴", "Je suis trop dans ma tête 🧠", "Je procrastine tout 📅", "Je m'énerve vite 😤"], type: "guess" },
    { q: "Ton type de sortie préféré ?",                     a: ["Soirée clubbing 🕺", "Ciné entre potes 🎬", "Bowling/laser game 🎳", "Restau/bar 🍹"], type: "guess" },
    { q: "Si t'étais un plat ?",                             a: ["Pizza 🍕", "Sushi 🍣", "Burger 🍔", "Tacos 🌮"], type: "guess" },
    { q: "Ton style vestimentaire au quotidien ?",           a: ["Streetwear 🧢", "Casual chic 👔", "Confort total (jogging) 😌", "Toujours au goût du jour 💅"], type: "guess" },
    { q: "Tu plutôt nuit ou matin ?",                        a: ["Oiseau de nuit 🦉", "Lève-tôt motivé(e) 🌅", "Ça dépend des jours 🤷", "Ni l'un ni l'autre 💀"], type: "guess" },
    { q: "Ton sport préféré ou activité physique ?",         a: ["La salle de sport 💪", "Football/basket ⚽", "Aucun sport, la vie 😂", "Marche / vélo 🚴"], type: "guess" },
    { q: "Ton fast-food préféré ?",                          a: ["McDonald's 🍟", "KFC 🍗", "Subway 🥖", "Aucun, je mange sain 🥗"], type: "guess" },
    { q: "Ce qui te stresse le plus ?",                      a: ["L'argent 💸", "Le futur 😰", "Les conflits 😤", "Être en retard ⏰"], type: "guess" },
    { q: "Ton langage d'amour ?",                            a: ["Les mots doux 💌", "Les cadeaux 🎁", "Les actes du quotidien 🛠️", "Le toucher/câlins 🤗"], type: "guess" },
    { q: "Quelle ambiance tu préfères pour travailler ?",    a: ["Musique à fond 🎵", "Silence total 🤫", "Café/bruit de fond ☕", "J'arrive pas à bosser de toute façon 😅"], type: "guess" },
    { q: "Ton emoji le plus utilisé ?",                      a: ["😂 (mort de rire)", "❤️ (amour)", "😭 (overdramatique)", "💀 (je suis mort)"], type: "guess" },
    { q: "Si tu pouvais habiter n'importe où ?",             a: ["Paris 🗼", "Miami 🌴", "Tokyo 🗾", "Bali 🌺"], type: "guess" },
    { q: "Ta boisson préférée en soirée ?",                  a: ["Jus de fruit 🧃", "Bière 🍺", "Cocktail exotique 🍹", "Eau, je conduis 💧"], type: "guess" },
    { q: "Ton type de film préféré ?",                       a: ["Horreur 👻", "Action 💥", "Romance 💕", "Comédie 😂"], type: "guess" },
    { q: "Comment tu gères le stress ?",                     a: ["Je dors 😴", "Je mange 🍕", "Je fais du sport 💪", "Je scroll sur mon tel 📱"], type: "guess" },
    { q: "Ton activité préférée un dimanche pluvieux ?",     a: ["Série Netflix toute la journée 📺", "Cuisiner tranquillement 🍳", "Lire ou dessiner 📚", "Dormir jusqu'au soir 😴"], type: "guess" },
    { q: "Plutôt plage ou montagne ?",                       a: ["Plage à 100% 🏖️", "Montagne absolument ⛰️", "Les deux c'est parfait 🌍", "Ni l'un ni l'autre 🏙️"], type: "guess" },
    { q: "Tes dépenses impulsives c'est quoi ?",             a: ["Fringues & chaussures 👟", "Nourriture/livraison 🍔", "Jeux vidéo/applis 🎮", "Trucs inutiles en ligne 📦"], type: "guess" },
    { q: "Ton signe astrologique te correspond ?",           a: ["Oui totalement 🌟", "Un peu oui 🤔", "Pas vraiment 😅", "J'y crois pas 🙃"], type: "guess" },
    { q: "Tu fais quoi juste avant de dormir ?",             a: ["Je scrolle sur mon tel 📱", "Je regarde une série 📺", "Je lis 📖", "Je m'endors direct 💤"], type: "guess" },
    { q: "Ta qualité principale selon toi ?",                a: ["L'humour 😂", "La loyauté 💎", "La gentillesse 🌸", "L'ambition 🔥"], type: "guess" },
    { q: "Comment tu prends tes décisions importantes ?",    a: ["Avec mon instinct 🧭", "J'analyse tout 🔬", "Je demande des avis 🗣️", "Je procrastine jusqu'au dernier moment 💀"], type: "guess" },
    { q: "Ta relation avec l'argent ?",                      a: ["Je dépense tout 💸", "J'économise max 🏦", "J'essaie d'équilibrer ⚖️", "Quel argent ? 😭"], type: "guess" },
    { q: "Quel type d'élève t'étais/t'es ?",                 a: ["Studieux(se) sérieux 📚", "Moyen mais sympa 🙂", "La terreur de la classe 😈", "Absent(e) mentalement 🌙"], type: "guess" },
    { q: "Ta façon de draguer ?",                            a: ["Direct, j'assume 😎", "Timide et subtil(e) 🙈", "Par humour 😂", "Je drague pas, ça vient 🤷"], type: "guess" },
    { q: "T'es plutôt introverti(e) ou extraverti(e) ?",    a: ["100% introverti(e) 🏠", "Extraverti(e) à fond 🎉", "Ambivert selon les jours 🌗", "Je sais plus 😅"], type: "guess" },
    { q: "Ton pire cauchemar ?",                             a: ["Perdre mes proches 💔", "Être fauché(e) 💸", "L'échec professionnel 😰", "Être seul(e) 😢"], type: "guess" },
    { q: "La chose dont tu es le plus fier(e) ?",           a: ["Mon parcours 🏆", "Mes amis que j'ai choisis 👥", "Ma résilience 💪", "Mon sens de l'humour 😂"], type: "guess" },
    { q: "Ton type de musique pour te motiver ?",            a: ["Rap/hip-hop 🎤", "Musique électro/EDM 🎧", "Rock/indie 🎸", "Peu importe si c'est fort 🔊"], type: "guess" },
    { q: "Ta plus grande peur irrationnelle ?",              a: ["Les insectes 🕷️", "Le noir total 🌑", "L'océan profond 🌊", "Rater mon vol ✈️"], type: "guess" },
    { q: "Si tu pouvais avoir un talent instantané ?",       a: ["Chanter parfaitement 🎤", "Jouer d'un instrument 🎸", "Danser pro 💃", "Parler 5 langues 🌍"], type: "guess" },
    { q: "Ton snack de confort ?",                           a: ["Chips 🥔", "Chocolat 🍫", "Glace 🍦", "Tout ce qui est sucré 🍬"], type: "guess" },
    { q: "Tu te décrirais en 1 mot ?",                       a: ["Authentique 💯", "Ambitieux·se 🚀", "Bienveillant(e) 🌸", "Imprévisible 🎲"], type: "guess" },
    { q: "Ton meilleur souvenir d'enfance ?",                a: ["Vacances en famille 🏖️", "Un cadeau inoubliable 🎁", "Un moment avec mes amis 👫", "Une fête d'anniversaire 🎂"], type: "guess" },
    { q: "Ton rapport aux réseaux sociaux ?",                a: ["Totalement accro 📱", "J'essaie de me détacher 😅", "Je gère ça bien 👍", "Je les déteste mais j'les utilise 🙃"], type: "guess" },
    { q: "Comment tu réagis quand t'es stressé(e) ?",       a: ["Je me renferme 🐚", "Je parle à quelqu'un 🗣️", "Je mange 🍕", "Je bouge / je fais du sport 🏃"], type: "guess" },
    { q: "Ta conception du bonheur ?",                       a: ["La santé et la famille 🏡", "L'amour et les amis 💕", "La réussite perso 🌟", "Profiter du moment présent ☀️"], type: "guess" },
  ],

  // ══════════════════════════════════════════════════════
  //  HOT & SPICY (52 questions)
  // ══════════════════════════════════════════════════════
  hot: [
    { q: "Ce qui te fait craquer instantanément chez l'autre ?",   a: ["Un beau sourire 😊", "Les yeux 👀", "Une bonne odeur 😮‍💨", "L'humour 😂"],               type: "match" },
    { q: "Ton endroit préféré pour un bisou ?",                    a: ["Les lèvres 💋", "Le cou 😘", "Le front 🥰", "La joue 😳"],                               type: "match" },
    { q: "Le mot doux que tu préfères recevoir ?",                 a: ["Chéri(e) 💕", "Mon amour ❤️", "Bébé 🍼", "Mon cœur 💓"],                                type: "match" },
    { q: "Ce que tu ferais si on était seuls ce soir ?",          a: ["Film & câlins sur le canapé 🎬", "Cuisiner ensemble 👨‍🍳", "Danser dans le salon 💃", "Parler toute la nuit 🌙"], type: "match" },
    { q: "Notre prochain rendez-vous idéal ?",                    a: ["Resto romantique 🍽️", "Ciné & pop-corn 🎬", "Bowling ou karting 🎳", "Escape Game 🔐"],    type: "match" },
    { q: "Le geste romantique qui te touche le plus ?",           a: ["Un message inattendu 💌", "Des fleurs 🌹", "Une surprise 🎁", "Un long câlin 🤗"],         type: "match" },
    { q: "La chose la plus folle que t'aurais fait pour quelqu'un ?", a: ["Traverser une ville la nuit 🌃", "Sécher les cours pour lui/elle 📚", "Cuisiner à minuit 🍳", "Écrire une lettre 📝"], type: "match" },
    { q: "Ton mood quand l'autre répond pas depuis 2h ?",         a: ["Je m'en fous 😌", "Léger malaise 😬", "Je check son actif Instagram 👀", "Je commence à écrire un roman dans ma tête 📖"], type: "match" },
    { q: "Ce que t'aimes le plus dans notre connexion ?",         a: ["La complicité 🔗", "Les fous rires 😂", "La tendresse 🤗", "La confiance totale 💎"],      type: "match" },
    { q: "Un endroit de rêve pour passer une nuit ensemble ?",    a: ["Hôtel de luxe 🏨", "Chalet à la montagne 🏔️", "Bungalow sur l'eau 🌊", "Camping sous les étoiles ⛺"], type: "match" },
    { q: "Ton style de câlin préféré ?",                          a: ["Câlin cuillère 🥄", "Face à face serré ❤️", "Sur le canapé devant la télé 📺", "Câlin surprise par derrière 🫂"], type: "match" },
    { q: "Ce que tu aimes le plus chez l'autre physiquement ?",   a: ["Le sourire 😁", "Les yeux 👁️", "La silhouette 🔥", "Les mains 🤲"],                      type: "match" },
    { q: "Ta définition d'une soirée parfaite à deux ?",          a: ["On sort en ville 🌆", "On reste chez nous 🏠", "On fait une surprise à l'autre 🎁", "On part en mini-aventure 🗺️"], type: "match" },
    { q: "Ce qui te donne des papillons chez l'autre ?",          a: ["Quand il/elle rit vraiment 😂", "Quand il/elle te regarde intensément 👀", "Quand il/elle te prend la main 🤝", "Ses messages du matin ☀️"], type: "match" },
    { q: "Si on devait mettre une chanson sur notre relation ?",   a: ["Quelque chose de doux 🎵", "Quelque chose de passionné 🔥", "Quelque chose de drôle 😂", "Quelque chose de nostalgique 🌙"], type: "match" },
    { q: "Ce que t'apprécies le plus dans nos moments ensemble ?", a: ["Quand on délire 😂", "Quand on parle de tout 🗣️", "Les silences confortables 🌸", "Quand on se fait des câlins 🫂"], type: "match" },
    { q: "Le premier truc que tu remarques chez quelqu'un ?",     a: ["Les yeux 👀", "Le sourire 😁", "Le style vestimentaire 👗", "La façon de parler 🗣️"], type: "match" },
    { q: "Ton geste d'affection préféré ?",                       a: ["Se tenir la main 🤝", "Les bisous sur le front 🥰", "Les câlins longs ❤️", "Jouer avec les cheveux de l'autre 💆"], type: "match" },
    { q: "Comment tu montres que tu tiens à quelqu'un ?",         a: ["Avec des mots doux 💌", "En étant là pour lui/elle 🤗", "Avec des petites attentions 🎁", "En passant du temps de qualité ⏰"], type: "match" },
    { q: "Ton vibe pour un premier rendez-vous ?",                a: ["Déjeuner décontracté 🥗", "Balade romantique 🌳", "Activité fun (bowling, karting) 🎳", "Soirée bar et bonne conversation 🍹"], type: "match" },
    { q: "Ce que tu attends le plus d'une relation ?",            a: ["La complicité et le rire 😂", "La passion et l'intensité 🔥", "La stabilité et la sécurité 🏡", "La liberté tout en étant ensemble 🌸"], type: "match" },
    { q: "Ton deal-breaker absolu dans une relation ?",           a: ["Le manque de confiance 😒", "L'absence de communication 🤐", "L'infidélité 💔", "La jalousie excessive 😤"], type: "match" },
    { q: "Comment tu réagis quand tu es jaloux·se ?",             a: ["Je le dis directement 🗣️", "Je fais semblant de rien 😐", "Je deviens distant(e) 🌬️", "Je fais semblant d'être occupé 📱"], type: "match" },
    { q: "Ta façon de séduire ?",                                 a: ["L'humour avant tout 😂", "L'intelligence qui parle 🧠", "La douceur et l'écoute 👂", "La confiance en soi 😎"], type: "match" },
    { q: "Ton type amoureux idéal ?",                             a: ["Drôle et spontané(e) 😂", "Doux·ce et attentionné(e) 🌸", "Ambitieux·se et déterminé(e) 🔥", "Mystérieux·se et profond(e) 🌙"], type: "match" },
    { q: "Qu'est-ce qui te rendrait jaloux·se ?",                 a: ["Trop de proches du sexe opposé 👀", "Des sorties sans moi 🌃", "Des conversations secrètes 📱", "Pas grand chose, je fais confiance 😌"], type: "match" },
    { q: "Le signe qui montre qu'on s'entend vraiment bien ?",    a: ["On peut se parler de tout 🗣️", "On rit pour les mêmes trucs 😂", "Le silence est confortable 😌", "On anticipe ce que l'autre pense 🧠"], type: "match" },
    { q: "Comment tu voudrais qu'on se retrouve après une semaine séparés ?", a: ["Gros câlin direct 🤗", "Un repas qu'on a préparé ensemble 🍳", "Sortie improvisée 🌃", "Juste on reste ensemble à rien faire 🛋️"], type: "match" },
    { q: "Ton niveau d'exigence en amour ?",                      a: ["Très élevé, j'veux le top 👑", "Équilibré, je suis raisonnable 🙂", "Bas, l'amour c'est l'amour 💕", "Je sais même pas 🤷"], type: "match" },
    { q: "Comment tu vis la distance (même temporaire) ?",        a: ["Ça me tue 💔", "Ça va, on se texte 📱", "Ça renforce le lien 💪", "Absence = cœur qui se souvient 🥰"], type: "match" },
    { q: "Ton love language principal ?",                         a: ["Mots d'affirmation 💬", "Actes de service 🛠️", "Cadeaux 🎁", "Temps de qualité ⏳"], type: "match" },
    { q: "Un truc que tu trouves hyper romantique ?",             a: ["Regarder les étoiles ensemble 🌟", "Danser sous la pluie 🌧️", "Cuisiner ensemble en musique 🍳🎵", "Un message à 3h du matin 🌙"], type: "match" },
    { q: "Quelle ambiance pour une soirée romantique ?",          a: ["Lumières tamisées & bougies 🕯️", "En plein air sous les étoiles 🌃", "Au coin du feu 🔥", "Musique douce & dîner maison 🍷"], type: "match" },
    { q: "Ce qui te fait rougir instantanément ?",                a: ["Un compliment inattendu 😊", "Un regard insistant 👀", "Être surpris(e) en train de sourire 😳", "Un message particulièrement doux 💌"], type: "match" },
    { q: "Combien de temps après le premier RDV tu fais le premier bisou ?", a: ["Le premier soir 💋", "Après 2-3 RDV 🥰", "Quand le moment se présente 🌸", "Je laisse l'autre prendre l'initiative 😏"], type: "match" },
    { q: "Ce qui te manquerait le plus si on se voit pas ?",      a: ["Tes messages 💬", "Tes fous rires 😂", "Ta présence physique 🤗", "Nos conversations profondes 🌙"], type: "match" },
    { q: "Comment tu exprimes que tu es en colère contre l'autre ?", a: ["Je le dis clairement 🗣️", "Je deviens froid·e 🌬️", "Je fais la tête un peu 😒", "Je préfère en parler après avoir calmé 😌"], type: "match" },
    { q: "Le truc qui te touche le plus chez quelqu'un ?",        a: ["Sa vulnérabilité assumée 🥺", "Sa générosité sans attendre 🌸", "Sa passion pour ce qu'il/elle aime 🔥", "Sa fidélité en toute circonstance 💎"], type: "match" },
    { q: "Tu préfères qu'on soit comment en public ?",            a: ["Discrets et complicies 🤫", "Affectueux sans complexe ❤️", "Naturels, comme d'hab 😌", "Dépend de l'humeur 🤷"], type: "match" },
    { q: "Qu'est-ce que tu ferais si je pleurais ?",              a: ["Te serrer dans mes bras sans rien dire 🤗", "Trouver des solutions pratiques 🛠️", "Te faire rire pour alléger 😂", "T'écouter parler autant que tu veux 👂"], type: "match" },
    { q: "Ton sentiment au début d'une nouvelle relation ?",      a: ["Les papillons absolus 🦋", "Un peu de stress aussi 😬", "De la curiosité avant tout 🔍", "Une confiance naturelle 😊"], type: "match" },
    { q: "Ce que tu aimes dans les nuits ensemble ?",             a: ["Parler jusqu'à l'aube 🌅", "Les câlins prolongés 🫂", "Regarder quelque chose ensemble 📺", "Juste dormir collés 😴"], type: "match" },
    { q: "Ton truc pour rendre l'autre heureux·se facilement ?",  a: ["Un message surprise le matin ☀️", "Son plat favori commandé 🍔", "Lui/elle dire ce qu'on apprécie 💬", "Une sortie imprévue et fun 🎉"], type: "match" },
    { q: "Ce que tu ressens quand l'autre te surprend ?",         a: ["De la joie pure 🥰", "De l'émotion sincère 🥺", "Du rire et du bonheur 😂", "Un peu d'embarras touchant 😊"], type: "match" },
    { q: "Comment tu sais que tu kiffes vraiment quelqu'un ?",    a: ["Je pense à lui/elle tout le temps 💭", "Je veux lui montrer tout ce que j'aime 🌍", "Je suis moi-même sans filtre 🪞", "Je veux qu'il/elle soit heureux·se 🌸"], type: "match" },
    { q: "Ton geste spontané pour montrer de l'amour ?",          a: ["Un bisou surprise 💋", "Un 'je pense à toi' sans raison 💬", "Lui apporter quelque chose dont il/elle avait besoin 🎁", "Le prendre dans mes bras sans prévenir 🤗"], type: "match" },
    { q: "Après une dispute, tu fais quoi en premier ?",          a: ["Je m'excuse si j'avais tort 🙏", "J'attends qu'il/elle vienne vers moi 😶", "Je fais un geste concret 🤗", "On repart de zéro direct 🌟"], type: "match" },
    { q: "Ce que tu voudrais qu'on fasse plus souvent ?",         a: ["Se retrouver juste nous deux 💑", "Sortir découvrir des endroits 🗺️", "Parler de nos projets 🌟", "Se faire des fous rires 😂"], type: "match" },
    { q: "Ton moment préféré de la journée avec l'autre ?",       a: ["Le matin au réveil ☀️", "L'après-midi sans rien faire 🛋️", "Le soir autour d'un repas 🍴", "La nuit à discuter 🌙"], type: "match" },
    { q: "Ce que tu veux qu'on construise ensemble ?",            a: ["Des souvenirs inoubliables 📸", "Un foyer plein d'amour 🏡", "Des projets communs ambitieux 🚀", "Une amitié solide en plus 👫"], type: "match" },
    { q: "Ton truc pour te réconcilier après une dispute ?",      a: ["Un câlin sincère 🤗", "Un humour pour dédramatiser 😂", "Une vraie discussion calme 🗣️", "Un geste attentionné surprise 🎁"], type: "match" },
  ],

  // ══════════════════════════════════════════════════════
  //  COUPLE GOALS (52 questions)
  // ══════════════════════════════════════════════════════
  couple: [
    { q: "Combien d'enfants tu voudrais ?",                        a: ["0 enfant 🚫", "1 ou 2 👶", "3 ou 4 🏡", "Une grande famille 👨‍👩‍👧‍👦"],                     type: "match" },
    { q: "Où voudrais-tu qu'on vive ensemble ?",                   a: ["Grande ville animée 🌆", "Banlieue tranquille 🏘️", "Campagne 🌾", "Bord de mer 🌊"],        type: "match" },
    { q: "Notre style de maison de rêve ?",                        a: ["Appart moderne en ville 🏛️", "Maison avec jardin 🌿", "Loft industriel 🏭", "Maison bohème colorée 🌈"], type: "match" },
    { q: "Animal de compagnie ensemble ?",                         a: ["Un chien 🐕", "Un chat 🐈", "Les deux 🐾", "Aucun 🚫"],                                     type: "match" },
    { q: "Notre premier grand voyage ensemble ?",                  a: ["Asie 🗾", "Caraïbes 🏝️", "Amérique 🗽", "Afrique 🌍"],                                     type: "match" },
    { q: "Votre date idéale avec seulement 50€ ?",                 a: ["Pique-nique romantique 🧺", "Ciné + McDo après 🍟", "Balade + café 🌿", "Marché + cuisine ensemble 🛒"], type: "match" },
    { q: "Dans combien de temps se marier ?",                      a: ["Moins de 2 ans 💍", "Dans 2 à 5 ans 📅", "Plus de 5 ans ⏳", "On verra 🤷"],                type: "match" },
    { q: "Notre tradition de couple idéale ?",                     a: ["Soirée film du vendredi 🎬", "Weekend escapade 🏕️", "Dîner romantique hebdo 🍷", "Journée rien que nous 💑"], type: "match" },
    { q: "Le premier truc que tu ferais si on habitait ensemble ?", a: ["Décorer ensemble 🛋️", "Cuisiner un gros repas 🍳", "Faire une soirée pyjama 🎉", "Mettre la musique à fond 🎵"], type: "match" },
    { q: "Dans 10 ans, on fait quoi ?",                            a: ["On voyage partout ✈️", "On est installés avec enfants 👨‍👩‍👧", "On réalise nos projets 🌟", "On est encore en train de rigoler 😂"], type: "match" },
    { q: "Comment on gère nos disputes ?",                         a: ["On en parle tout de suite 🗣️", "On laisse passer la nuit 🌙", "Câlin = paix 🤗", "Message d'excuse 💬"], type: "match" },
    { q: "Notre activité couple parfaite le week-end ?",           a: ["Brunch du dimanche 🥐", "Séance sport ensemble 💪", "Marché + cuisine 🛍️", "Grasse mat' & Netflix 📺"], type: "match" },
    { q: "Votre film/série couple à regarder ensemble ?",          a: ["Comédie romantique 💕", "Thriller haletant 😱", "Série longue durée 📺", "Documentaire intéressant 🌍"], type: "match" },
    { q: "Ce que tu veux absolument partager avec l'autre ?",      a: ["Mes passions 🎨", "Mes potes 👥", "Ma famille 👨‍👩‍👧", "Mes voyages ✈️"],                       type: "match" },
    { q: "Notre valeur la plus importante en tant que couple ?",   a: ["La confiance 🔒", "La communication 🗣️", "Le respect 🌸", "Le fun & les rires 😂"],          type: "match" },
    { q: "Votre couple de célébrités préféré ?",                   a: ["Beyoncé & Jay-Z 👑", "Ryan Reynolds & Blake 😍", "Zendaya & Tom Holland 🕷️", "Un couple inconnu mais heureux 💝"], type: "match" },
    { q: "Notre futur chat ou chien s'appellerait ?",              a: ["Mochi 🍡", "Zeus ⚡", "Bella 🌸", "Un truc complètement random 🎲"], type: "match" },
    { q: "On ferait comment pour la Saint-Valentin ?",             a: ["Gros restau romantique 🍽️", "Soirée maison cocooning 🕯️", "Weekend en amoureux 🏨", "C'est tous les jours la St-V chez nous 😏"], type: "match" },
    { q: "Notre façon de gérer les finances à deux ?",             a: ["Compte joint pour tout 🏦", "On partage les dépenses communes 💳", "Chacun paie à son tour 🔄", "On improvise selon les situations 🤷"], type: "match" },
    { q: "Notre tradition du réveillon de Noël ?",                 a: ["En famille élargie 🎄", "Juste nous deux au calme ❄️", "Avec les amis proches 🎉", "Voyage à l'étranger 🌍"], type: "match" },
    { q: "Ce qu'on ferait pour notre anniversaire de couple ?",    a: ["Retourner là où ça a commencé 🌹", "Voyage surprise 🛫", "Soirée habillés super chic 🥂", "Quelque chose de nouveau à chaque fois 🎲"], type: "match" },
    { q: "Notre style d'éducation pour nos enfants ?",             a: ["Cadre strict mais bienveillant 📚", "Super libres et créatifs 🎨", "Équilibre entre tout 🌗", "On verra le moment venu 🤷"], type: "match" },
    { q: "Qui ferait la cuisine à la maison ?",                    a: ["Moi je maîtrise 👨‍🍳", "Toi tu cuisines mieux 🙏", "On partage équitablement ⚖️", "Livraison tous les soirs 🛵"], type: "match" },
    { q: "Votre sport ou activité physique en couple ?",           a: ["La salle ensemble 💪", "Le vélo ou la randonnée 🚴", "La natation 🏊", "On regarde le sport à la télé 😂"], type: "match" },
    { q: "Notre première maison : on achète ou on loue ?",         a: ["On achète dès qu'on peut 🏠", "On loue tranquille d'abord 🔑", "Dépend de la situation 🤔", "On y pense pas encore ✌️"], type: "match" },
    { q: "Comment on prendrait les grandes décisions ensemble ?",  a: ["Discussion approfondie 🗣️", "L'un propose, l'autre valide 👍", "Majorité = on y va 🗳️", "Instinct et confiance 🧭"], type: "match" },
    { q: "Notre façon d'accueillir des amis chez nous ?",          a: ["Dîners organisés soignés 🍽️", "Soirées improvisées 🎉", "Apéros décontractés 🍷", "On préfère aller chez les autres 😂"], type: "match" },
    { q: "Quel genre d'anniversaire pour nos enfants ?",           a: ["Gros anniversaire avec plein d'amis 🎈", "Sortie spéciale en famille 🎡", "Surprise bien préparée 🎁", "Simple mais mémorable 🌟"], type: "match" },
    { q: "Notre hobby qu'on ferait ensemble ?",                    a: ["Cuisiner/pâtisserie 🧁", "Voyager et explorer 🗺️", "Série/ciné marathon 📺", "Sport ou activité physique 💪"], type: "match" },
    { q: "Comment on gérerait une mauvaise passe financière ?",    a: ["On se serre les coudes sans juger 💪", "On fait un budget commun serré 📊", "On cherche des solutions créatives 💡", "On en parle ouvertement avec calme 🗣️"], type: "match" },
    { q: "Notre déco intérieure idéale ?",                         a: ["Minimaliste et épuré 🤍", "Chaud et cocooning 🕯️", "Coloré et bohème 🌈", "Moderne et design 🏙️"], type: "match" },
    { q: "Votre activité en cas de panne d'électricité ?",         a: ["Bougies et jeux de société 🕯️🎲", "Sortir se balader dehors 🌙", "Dormir ultra tôt 😴", "Chercher une prise chez les voisins 😂"], type: "match" },
    { q: "Dans notre couple, qui serait le plus romantique ?",     a: ["Moi sans hésitation 😍", "Toi clairement 🥰", "On est à égalité 💕", "Aucun de nous deux, on est carrés 😂"], type: "match" },
    { q: "Notre langue secrète de couple ce serait ?",             a: ["Des surnoms ridicules 🐣", "Des blagues internes 😂", "Des regards complices 👀", "Des emojis incompréhensibles pour les autres 🤣"], type: "match" },
    { q: "Votre rituel du coucher ensemble ?",                     a: ["Discusssions infinies dans le noir 🌙", "Une série ensemble 📺", "Chacun son côté mais collés 💑", "Endormis en 2 min 😴"], type: "match" },
    { q: "Ce qu'on apporterait l'un à l'autre ?",                  a: ["De la stabilité 🏡", "De l'aventure et du fun 🎉", "Un regard bienveillant 🌸", "De l'ambition partagée 🚀"], type: "match" },
    { q: "Notre voyage de noces si on se mariait ?",               a: ["Maldives ou Bora Bora 🏝️", "Road trip américain 🚗", "Asie du Sud-Est 🗾", "Europe romantique 🗼"], type: "match" },
    { q: "Quelle langue on apprendrait ensemble ?",                a: ["L'espagnol 🇪🇸", "Le japonais 🇯🇵", "L'arabe 🌙", "On s'en fout, Google Translate 😂"], type: "match" },
    { q: "Notre soir de semaine en couple ressemblerait à quoi ?", a: ["Câlins & série 📺", "Sport ensemble puis douche 💪", "Cuisiner quelque chose de bon 🍳", "Chacun fait ses trucs mais ensemble 🛋️"], type: "match" },
    { q: "Dans 5 ans notre relation ressemble à quoi ?",           a: ["Ensemble, installés et épanouis 🏡", "En train de voyager partout 🌍", "À fond sur nos projets communs 🚀", "Pareil qu'aujourd'hui en mieux 💕"], type: "match" },
    { q: "Votre façon d'élever des enfants : quelles valeurs en priorité ?", a: ["Le respect des autres 🌸", "L'honnêteté absolue 💎", "L'ambition et le travail 🔥", "La générosité et le partage 🤝"], type: "match" },
    { q: "Quelle cause on défendrait ensemble ?",                  a: ["L'environnement 🌍", "Les inégalités sociales 🤝", "Les droits des animaux 🐾", "L'éducation pour tous 📚"], type: "match" },
    { q: "Notre habitude couple qu'on adorerais avoir ?",          a: ["Le café du matin ensemble ☕", "La balade du dimanche 🌳", "Le repas sans téléphone 🚫📱", "Le film du vendredi soir 🎬"], type: "match" },
    { q: "Ce qu'on ferait de notre premier appart ensemble ?",     a: ["On redécorerait tout 🎨", "On organiserait une pendaison de crémaillère 🎉", "On se ferait enfin notre soirée idéale 🕯️", "On resterait des heures à réaliser qu'on est chez nous 🥹"], type: "match" },
    { q: "Votre équipe en toutes circonstances ?",                 a: ["Solidaires face à tout 💪", "On se complète parfaitement 🧩", "On rit de tout ensemble 😂", "On grandit l'un grâce à l'autre 🌱"], type: "match" },
    { q: "La chose qui cimentera notre couple ?",                  a: ["Notre complicité unique 🔗", "Notre projet de vie commun 🌟", "Notre confiance absolue 🔒", "Notre humour et nos fous rires 😂"], type: "match" },
    { q: "Ce qui te rendrait le plus fier(e) de nous deux ?",      a: ["Avoir construit quelque chose ensemble 🏡", "Avoir voyagé partout 🌍", "Se voir grandir et évoluer 🌱", "Ne jamais avoir perdu notre complicité 💕"], type: "match" },
    { q: "Dans notre couple, qui prendrait les décisions rapides ?", a: ["Moi, j'hésite jamais 😎", "Toi, tu es plus décidé(e) 👍", "On décide ensemble toujours ⚖️", "On flippe une pièce 🪙"], type: "match" },
    { q: "Notre façon de fêter une bonne nouvelle ?",              a: ["Un bon restau improvisé 🍽️", "Un voyage surprise 🛫", "Une soirée à la maison classe 🥂", "Appeler tout le monde pour partager 📣"], type: "match" },
    { q: "Ce qu'on ferait si on avait 1 an sabbatique ensemble ?", a: ["Tour du monde complet 🌍", "Monter notre projet 💡", "Se poser et profiter 🛋️", "Explorer l'Europe en van 🚐"], type: "match" },
    { q: "Notre rituel du matin ensemble ?",                       a: ["Café au lit 🛏️☕", "Petit-dej élaboré ensemble 🥞", "Sport matinal côte à côte 🏃", "Chacun son rythme mais câlin obligatoire 🤗"], type: "match" },
  ],

  // ══════════════════════════════════════════════════════
  //  DÉFI FOU (52 questions)
  // ══════════════════════════════════════════════════════
  defi: [
    { q: "Le truc le plus gênant que j'aurais dit à quelqu'un ?",    a: ["Rien, je suis un saint 😇", "J'ai dragué en mode catastrophe 😬", "J'ai dit 'je t'aime' trop tôt 💀", "J'ai appelé mon prof par le prénom de ma mère 😭"], type: "match" },
    { q: "Notre plus grosse dispute porterait sur ?",                 a: ["Quel resto choisir 🍽️", "La température de la chambre 🌡️", "Netflix — quoi regarder 📺", "Qui répond pas assez vite 📱"], type: "match" },
    { q: "Si tu devais me décrire en 1 emoji ?",                     a: ["😊 (Solaire)", "🥰 (Trop mignon·ne)", "😏 (Mystérieux·se)", "🔥 (Intense)"], type: "match" },
    { q: "Si on était un duo de rappeurs, on s'appellerait ?",       a: ["Scott & Nolwen Forever 💕", "Les Inséparables 🔗", "Bonnie & Clyde 2.0 🌹", "Le Duo du Siècle 👑"], type: "match" },
    { q: "Si on était un film, ce serait ?",                         a: ["Comédie romantique 😂❤️", "Film d'action épique 💥", "Drame passionnel 🎭", "Comédie délirante 😂"], type: "match" },
    { q: "Notre pire date disaster imaginaire ?",                     a: ["Resto qui ferme à notre arrivée 😅", "Pluie torrentielle en balade 🌧️", "Voiture en panne 🚗", "Croiser un(e) ex 😱"], type: "match" },
    { q: "Que trouverais-tu sur mon téléphone ?",                    a: ["Des photos de nous 📸", "Des mèmes trop drôles 😂", "Nos vieux messages relus 💌", "Des vidéos TikTok sauvegardées 📱"], type: "match" },
    { q: "T'offrir quelque chose sans argent, ce serait ?",          a: ["Une lettre d'amour ✍️", "Une playlist rien que pour toi 🎵", "Une soirée étoiles 🌟", "Un bon massage 💆"], type: "match" },
    { q: "Si on devait faire un road trip, destination ?",           a: ["Côte d'Azur 🌊", "Bretagne sauvage 🌿", "Espagne soleil 🇪🇸", "Tour de l'Europe 🗺️"], type: "match" },
    { q: "Mon pire trait de caractère selon toi ?",                  a: ["Trop têtu(e) 🐂", "Trop dans la lune 🌙", "Trop intense parfois 🔥", "Trop flemmard(e) 😴"], type: "match" },
    { q: "Ce qu'on ferait si on avait une semaine libre et 5000€ ?", a: ["Road trip 🚗", "Hôtel luxe & spa 🏨", "Festival de musique 🎵", "Partir à l'imprévu 🎲"], type: "match" },
    { q: "Si je devais te décrire à mes potes en un mot ?",          a: ["Adorable 🥰", "Drôle 😂", "Intense 🔥", "Mystérieux·se 🌙"], type: "match" },
    { q: "Ce que tu ferais si j'avais une très mauvaise journée ?",  a: ["Ton plat préféré commandé 🍔", "Te faire rire avec des mèmes 😄", "T'appeler juste pour écouter 📞", "Tout lâcher pour te rejoindre 🏃"], type: "match" },
    { q: "Notre meilleure qualité commune ?",                        a: ["On se fait rire 😂", "On se comprend sans parler 🔗", "On s'accepte tels qu'on est 🌟", "On est loyaux 💪"], type: "match" },
    { q: "Si on devait créer un business ensemble ?",                a: ["Un restau / bar 🍹", "Une boutique en ligne 💻", "Une agence de voyage ✈️", "Un truc complètement random 🎲"], type: "match" },
    { q: "Le truc que je ferais jamais mais toi oui ?",              a: ["Sauter en parachute 🪂", "Parler en public sans stresser 🎤", "Manger un truc bizarre 🐛", "Voyager seul(e) à l'autre bout du monde 🌏"], type: "match" },
    { q: "Si on devait résumer notre amitié en une série ?",         a: ["Friends 😂", "Euphoria 🌈", "Emily in Paris 🗼", "Stranger Things 👾"], type: "match" },
    { q: "Notre plus grand talent caché en couple ?",                a: ["Faire des plans qui tombent à l'eau 😅", "Finir les phrases de l'autre 🗣️", "Trouver des resto en 2 secondes 🍽️", "Rire au pire moment 😂"], type: "match" },
    { q: "Si on passait une nuit coincés quelque part ?",            a: ["Dans un aéroport ✈️", "Dans une cabane en montagne ⛰️", "Dans un Airbnb bizarre 🏚️", "Dans notre voiture en panne 🚗"], type: "match" },
    { q: "Ce que tu ramènerais si on était perdus sur une île déserte ?", a: ["Mon téléphone (avec batterie) 📱", "De la nourriture 🍕", "Toi directement 😍", "Un couteau suisse 🔪"], type: "match" },
    { q: "Notre superpower en tant que duo ?",                       a: ["On résout tout ensemble 🧩", "On fait rire n'importe qui 😂", "On mange n'importe où 🍔", "On trouve des plans à 23h59 🌙"], type: "match" },
    { q: "Si notre couple était un animal, ce serait ?",             a: ["Des dauphins (intelligents & complices) 🐬", "Des lions (forts & protecteurs) 🦁", "Des pandas (cute & chill) 🐼", "Des pingouins (fidèles) 🐧"], type: "match" },
    { q: "Ce qu'on ferait si on était invisibles pendant 1h ?",      a: ["Observer les réactions des gens 👀", "Entrer dans un endroit inaccessible 🏰", "Jouer des tours à nos potes 😂", "Faire rien, on serait perdus 🤷"], type: "match" },
    { q: "Notre place dans un groupe d'amis ?",                      a: ["Le duo trop mignon 🥰", "Les fous de la bande 😂", "Les organisateurs de soirées 🎉", "Les sagesses en retrait 🌙"], type: "match" },
    { q: "Si on devait gagner un concours, ce serait lequel ?",      a: ["Le couple le plus complice 🔗", "Le plus drôle 😂", "Le plus beau 😍", "Le plus original 🎨"], type: "match" },
    { q: "Le truc qu'on ferait que personne comprendrait ?",         a: ["Rigoler pour rien pendant 20 min 😂", "Manger à des horaires bizarres 🕐", "Partir en road trip la nuit 🌙", "Avoir des débats sérieux sur des trucs absurdes 🤔"], type: "match" },
    { q: "Comment on réagirait si on gagnait à la loterie ?",        a: ["Voyage immédiatement ✈️", "On investit intelligemment 📈", "On aide la famille et les amis 🤝", "On pète un câble de joie 🥳"], type: "match" },
    { q: "Notre film préféré à regarder ensemble en pyjama ?",       a: ["Harry Potter 🧙", "Avengers 💥", "Un Disney 🏰", "Un film d'horreur pour se serrer 😱"], type: "match" },
    { q: "Ce qu'on ferait à minuit si on pouvait tout faire ?",      a: ["Sortir manger quelque chose de bon 🍔", "Aller sur une plage ou une colline voir les étoiles 🌟", "Danser quelque part 💃", "Rouler sans destination 🚗"], type: "match" },
    { q: "Notre réaction face à une araignée dans la chambre ?",     a: ["Je la gère froidement 😎", "On fuit tous les deux 😱", "L'un paniques, l'autre rigole 😂", "On appelle quelqu'un 📞"], type: "match" },
    { q: "Notre truc pour passer le temps en voiture ?",             a: ["Musique à fond et on chante 🎵", "Débats sur des sujets random 🗣️", "Jeux de mots et devinettes 🧩", "On se tait et on savoure 😌"], type: "match" },
    { q: "Ce qu'on ferait si on avait un clone de nous-mêmes ?",     a: ["On le fait travailler à notre place 😂", "On observerait comme on est vraiment 🔍", "On doublerait nos aventures 🌍", "On serait jaloux de nous-mêmes 😅"], type: "match" },
    { q: "Notre pire qualité en tant que couple ?",                  a: ["On rit trop fort partout 😂", "On mange trop bien 🍕", "On perd la notion du temps 🕐", "On est trop dans notre bulle 🫧"], type: "match" },
    { q: "Si on devait faire un TikTok viral, ce serait quoi ?",     a: ["Un défi danse 💃", "Un sketch comique 😂", "Un truc mignon et relatable 🥰", "Un vrai moment improvisé 🎥"], type: "match" },
    { q: "Ce qu'on ferait si on se retrouvait dans le passé ?",      a: ["Explorer une autre époque 🕰️", "Corriger nos erreurs 😅", "Profiter de la musique de l'époque 🎵", "Revenir vite c'est mieux maintenant 🚀"], type: "match" },
    { q: "Notre troll préféré à faire aux amis ?",                   a: ["Faire semblant qu'on s'est séparés 😈", "Inventer une histoire de fou 🤥", "Disparaître et réapparaître sans explication 👻", "On est trop gentils pour troller 😇"], type: "match" },
    { q: "Si on avait un slogan de couple ?",                        a: ["'On s'en fout, on s'aime' 💕", "'Deux fous, zéro regret' 😂", "'Toujours ensemble, toujours debout' 💪", "'On mange bien et on rigole' 🍕😂"], type: "match" },
    { q: "Notre talent secret qu'on révélerait au monde ?",          a: ["Cuisiner incroyablement bien 👨‍🍳", "Danser comme des pros 💃", "Faire rire n'importe qui 😂", "Trouver les meilleurs coins cachés 🗺️"], type: "match" },
    { q: "Ce qu'on ferait si on devait survivre en forêt 3 jours ?", a: ["On se débrouille, on est malins 🧠", "Panique totale mais on s'entraide 😱", "On ferait comme si c'était camping 🏕️", "On appelle à l'aide le plus vite possible 📞"], type: "match" },
    { q: "Notre reaction si un paparazzi nous prenait en photo ?",   a: ["On poserait sérieusement 😎", "On ferait des grimaces 😜", "On ignorerait royalement 👑", "On lui demanderait les photos 😂"], type: "match" },
    { q: "Ce qu'on posterait comme couple sur les réseaux ?",        a: ["Rien, notre vie c'est privé 🔒", "Les moments drôles seulement 😂", "Quelques beaux souvenirs de voyage 📸", "Tout, on assume d'être chou 🥰"], type: "match" },
    { q: "Notre scénario de fin du monde en couple ?",               a: ["On cherche un bunker bien équipé 🏚️", "On profite de chaque instant restant 🌅", "On rassemble famille et amis 👨‍👩‍👧‍👦", "On fait des trucs fous qu'on s'était interdits 🎲"], type: "match" },
    { q: "Si on devait être des personnages dans un jeu vidéo ?",    a: ["Des héros épiques qui sauvent le monde ⚔️", "Des personnages comiques de fond 😂", "Le boss final imbattable 👾", "Les villains séduisants 😈"], type: "match" },
    { q: "Ce qu'on écrirait dans une bouteille à la mer ?",          a: ["Notre histoire d'amour ❤️", "Un message absurde et drôle 😂", "Des conseils de vie sages 🌟", "Rien, on garde le mystère 🌊"], type: "match" },
    { q: "Notre mode de transport de couple préféré ?",              a: ["Voiture fenêtres ouvertes 🚗🎵", "Train avec vue 🚂", "Avion pour aller loin ✈️", "À pied, on prend notre temps 🚶"], type: "match" },
    { q: "Ce qu'on ferait si on avait le choix de vivre dans un film ?", a: ["Un film d'aventure 🗺️", "Une comédie romantique 💕", "Un film de super-héros 💥", "Un film culinaire 🍳"], type: "match" },
    { q: "Notre reaction si on croisait notre célébrité préférée ?", a: ["On la/le salue naturellement 😎", "On panique et on bégaie 😅", "On prend une photo super classe 📸", "On stalk tranquillement de loin 👀"], type: "match" },
    { q: "Notre tradition bizarre qu'on inventerait ?",              a: ["Danser à 00h01 chaque 1er du mois 💃", "Manger un truc spécial chaque dimanche 🍽️", "S'envoyer un mème chaque matin 😂", "Regarder les étoiles le premier vendredi du mois 🌟"], type: "match" },
    { q: "Si on devait s'inscrire à une émission de télé-réalité ?", a: ["Koh-Lanta 🏝️ (on survivrait)", "The Voice 🎤 (on a du talent)", "L'amour est dans le pré 🌾 (trop mignons)", "Pékin Express 🌍 (on roule)"], type: "match" },
    { q: "Ce qu'on garderait secret au monde entier ?",              a: ["Notre playlist secrète 🎵", "Nos délires privés 😂", "Nos projets avant qu'ils soient réels 🌟", "Certaines conversations nocturnes 🌙"], type: "match" },
    { q: "Si on écrivait un livre sur notre histoire ?",             a: ["Une comédie romantique hilarante 😂❤️", "Une aventure épique 🌍", "Un roman plein d'émotions 🥺", "Un guide de survie en couple 😂"], type: "match" },
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
  "Vous êtes pas du tout sur la même longueur d'onde 📡",
  "C'est la loose totale là 💀",
  "Vous vous connaissez depuis quand déjà ? 😂",
  "Respectueusement... vous n'etes pas connectes la.",
  "La c'est du freestyle sans permis.",
  "On dirait deux dimensions differentes.",
  "Meme le chat a mieux repondu que vous.",
  "Ce n'est pas un match, c'est un clash.",
  "Team aleatoire validee.",
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
  "La défaite te va bien Scott 😂 — Nolwen",
  "Prochain niveau : reconnaître qu'on te bat Scott 👑 — Nolwen",
  "Chef du game ? Non. Chef de la lose ? Oui Scott.",
  "Scott, ton aura s'est deconnectee du serveur.",
  "Faut reviser tes potins, champion.",
  "Scott en mode speedrun de la defaite.",
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
  "La défaite te va tellement bien Nolwen 😂 — Scott",
  "Champion(ne) du lendemain peut-être 👑 — Scott",
  "Nolwen, la c'etait un 0-2 sec et sans VAR.",
  "Ton cerveau a fait pause au pire moment.",
  "Nolwen en full impro, j'ai vu mais j'ai rien dit.",
  "C'est mignon de participer, continue.",
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
  "Vous pensez pareil — c'est flippant et magnifique 🤩",
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
