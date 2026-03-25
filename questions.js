// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  QUIZ OF LOVE â€” Banque de questions (18-25 ans, vibe fr)
//  type "guess"  â†’ l'un rÃ©pond sur lui-mÃªme, l'autre devine
//  type "match"  â†’ les deux rÃ©pondent, points si identique
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const QUESTIONS_DB = {

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  //  CONNAISSANCE (52 questions)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  connaissance: [
    { q: "Ton rÃ©seau social le plus utilisÃ© ?",              a: ["TikTok ðŸŽµ", "Instagram ðŸ“¸", "Snapchat ðŸ‘»", "Twitter/X ðŸ¦"],                type: "guess" },
    { q: "Tu te lÃ¨ves Ã  quelle heure le week-end ?",         a: ["Avant 9h ðŸ“", "Entre 9h et 11h â˜•", "Entre 11h et 13h ðŸ˜´", "AprÃ¨s 13h ðŸ’€"],  type: "guess" },
    { q: "Ton genre de musique prÃ©fÃ©rÃ© ?",                   a: ["Rap FR ðŸŽ¤", "Pop/R&B ðŸŽµ", "Drill/Trap ðŸ”¥", "VariÃ©tÃ©/Autre ðŸŽ¶"],            type: "guess" },
    { q: "Ta destination de voyage de rÃªve ?",               a: ["New York ðŸ—½", "DubaÃ¯ ðŸ™ï¸", "Bali ðŸŒ´", "Tokyo ðŸ—¾"],                         type: "guess" },
    { q: "Tu passes combien de temps sur ton tÃ©lÃ©phone ?",   a: ["Moins de 2h ðŸ˜‡", "2 Ã  4h ðŸ“±", "4 Ã  6h ðŸ˜…", "Plus de 6h ðŸ’€"],              type: "guess" },
    { q: "Ta soirÃ©e idÃ©ale ?",                               a: ["Sortie en boÃ®te ðŸ•º", "SoirÃ©e chez des amis ðŸ•", "Film Ã  la maison ðŸŽ¬", "Restau sympa ðŸœ"], type: "guess" },
    { q: "Ton mood quand t'as pas de 4G ?",                  a: ["Je survis ðŸ˜‡", "Je stresse un peu ðŸ˜¬", "C'est la catastrophe ðŸ˜±", "Je fais semblant d'aller bien ðŸ™‚"], type: "guess" },
    { q: "Que ferais-tu avec 10 000â‚¬ inattendus ?",          a: ["Voyage immÃ©diatement âœˆï¸", "J'Ã©conomise sagement ðŸ¦", "Je m'offre des trucs ðŸ›ï¸", "Je fais la fÃªte ðŸŽ‰"], type: "guess" },
    { q: "Ton animal prÃ©fÃ©rÃ© ?",                             a: ["Chien ðŸ•", "Chat ðŸˆ", "Aucun ðŸš«", "Autre ðŸ¦Ž"],                             type: "guess" },
    { q: "Ta saison prÃ©fÃ©rÃ©e ?",                             a: ["Ã‰tÃ© â˜€ï¸", "Automne ðŸ‚", "Printemps ðŸŒ¸", "Hiver â„ï¸"],                       type: "guess" },
    { q: "Ton petit-dÃ©j idÃ©al ?",                            a: ["Croissant & cafÃ© â˜•", "Pancakes ðŸ¥ž", "Rien, j'mange pas le matin ðŸ˜´", "Smoothie healthy ðŸ¥¤"], type: "guess" },
    { q: "Comment tu rÃ©ponds aux textos ?",                  a: ["Tout de suite ðŸ“²", "Dans l'heure â°", "Dans la journÃ©e ðŸ“…", "Quand j'y pense... ðŸ‘€"], type: "guess" },
    { q: "Ton superpouvoir de rÃªve ?",                       a: ["Voyager dans le temps â°", "Lire dans les pensÃ©es ðŸ§ ", "InvisibilitÃ© ðŸ‘»", "Avoir infiniment d'argent ðŸ’¸"], type: "guess" },
    { q: "Ce que tu fais en premier le matin ?",             a: ["Je check mon tÃ©lÃ©phone ðŸ“±", "Je me lÃ¨ve direct ðŸ’ª", "Je reste au lit 30min ðŸ˜´", "Je mange ðŸ³"], type: "guess" },
    { q: "Ton film/sÃ©rie prÃ©fÃ©rÃ© en ce moment ?",            a: ["Une sÃ©rie Netflix ðŸ“º", "Un film d'action ðŸ’¥", "Une comÃ©die romantique ðŸ’•", "Un anime ðŸŽŒ"], type: "guess" },
    { q: "Ton plus grand dÃ©faut ?",                          a: ["Je suis trop flemmard(e) ðŸ˜´", "Je suis trop dans ma tÃªte ðŸ§ ", "Je procrastine tout ðŸ“…", "Je m'Ã©nerve vite ðŸ˜¤"], type: "guess" },
    { q: "Ton type de sortie prÃ©fÃ©rÃ© ?",                     a: ["SoirÃ©e clubbing ðŸ•º", "CinÃ© entre potes ðŸŽ¬", "Bowling/laser game ðŸŽ³", "Restau/bar ðŸ¹"], type: "guess" },
    { q: "Si t'Ã©tais un plat ?",                             a: ["Pizza ðŸ•", "Sushi ðŸ£", "Burger ðŸ”", "Tacos ðŸŒ®"], type: "guess" },
    { q: "Ton style vestimentaire au quotidien ?",           a: ["Streetwear ðŸ§¢", "Casual chic ðŸ‘”", "Confort total (jogging) ðŸ˜Œ", "Toujours au goÃ»t du jour ðŸ’…"], type: "guess" },
    { q: "Tu plutÃ´t nuit ou matin ?",                        a: ["Oiseau de nuit ðŸ¦‰", "LÃ¨ve-tÃ´t motivÃ©(e) ðŸŒ…", "Ã‡a dÃ©pend des jours ðŸ¤·", "Ni l'un ni l'autre ðŸ’€"], type: "guess" },
    { q: "Ton sport prÃ©fÃ©rÃ© ou activitÃ© physique ?",         a: ["La salle de sport ðŸ’ª", "Football/basket âš½", "Aucun sport, la vie ðŸ˜‚", "Marche / vÃ©lo ðŸš´"], type: "guess" },
    { q: "Ton fast-food prÃ©fÃ©rÃ© ?",                          a: ["McDonald's ðŸŸ", "KFC ðŸ—", "Subway ðŸ¥–", "Aucun, je mange sain ðŸ¥—"], type: "guess" },
    { q: "Ce qui te stresse le plus ?",                      a: ["L'argent ðŸ’¸", "Le futur ðŸ˜°", "Les conflits ðŸ˜¤", "ÃŠtre en retard â°"], type: "guess" },
    { q: "Ton langage d'amour ?",                            a: ["Les mots doux ðŸ’Œ", "Les cadeaux ðŸŽ", "Les actes du quotidien ðŸ› ï¸", "Le toucher/cÃ¢lins ðŸ¤—"], type: "guess" },
    { q: "Quelle ambiance tu prÃ©fÃ¨res pour travailler ?",    a: ["Musique Ã  fond ðŸŽµ", "Silence total ðŸ¤«", "CafÃ©/bruit de fond â˜•", "J'arrive pas Ã  bosser de toute faÃ§on ðŸ˜…"], type: "guess" },
    { q: "Ton emoji le plus utilisÃ© ?",                      a: ["ðŸ˜‚ (mort de rire)", "â¤ï¸ (amour)", "ðŸ˜­ (overdramatique)", "ðŸ’€ (je suis mort)"], type: "guess" },
    { q: "Si tu pouvais habiter n'importe oÃ¹ ?",             a: ["Paris ðŸ—¼", "Miami ðŸŒ´", "Tokyo ðŸ—¾", "Bali ðŸŒº"], type: "guess" },
    { q: "Ta boisson prÃ©fÃ©rÃ©e en soirÃ©e ?",                  a: ["Jus de fruit ðŸ§ƒ", "BiÃ¨re ðŸº", "Cocktail exotique ðŸ¹", "Eau, je conduis ðŸ’§"], type: "guess" },
    { q: "Ton type de film prÃ©fÃ©rÃ© ?",                       a: ["Horreur ðŸ‘»", "Action ðŸ’¥", "Romance ðŸ’•", "ComÃ©die ðŸ˜‚"], type: "guess" },
    { q: "Comment tu gÃ¨res le stress ?",                     a: ["Je dors ðŸ˜´", "Je mange ðŸ•", "Je fais du sport ðŸ’ª", "Je scroll sur mon tel ðŸ“±"], type: "guess" },
    { q: "Ton activitÃ© prÃ©fÃ©rÃ©e un dimanche pluvieux ?",     a: ["SÃ©rie Netflix toute la journÃ©e ðŸ“º", "Cuisiner tranquillement ðŸ³", "Lire ou dessiner ðŸ“š", "Dormir jusqu'au soir ðŸ˜´"], type: "guess" },
    { q: "PlutÃ´t plage ou montagne ?",                       a: ["Plage Ã  100% ðŸ–ï¸", "Montagne absolument â›°ï¸", "Les deux c'est parfait ðŸŒ", "Ni l'un ni l'autre ðŸ™ï¸"], type: "guess" },
    { q: "Tes dÃ©penses impulsives c'est quoi ?",             a: ["Fringues & chaussures ðŸ‘Ÿ", "Nourriture/livraison ðŸ”", "Jeux vidÃ©o/applis ðŸŽ®", "Trucs inutiles en ligne ðŸ“¦"], type: "guess" },
    { q: "Ton signe astrologique te correspond ?",           a: ["Oui totalement ðŸŒŸ", "Un peu oui ðŸ¤”", "Pas vraiment ðŸ˜…", "J'y crois pas ðŸ™ƒ"], type: "guess" },
    { q: "Tu fais quoi juste avant de dormir ?",             a: ["Je scrolle sur mon tel ðŸ“±", "Je regarde une sÃ©rie ðŸ“º", "Je lis ðŸ“–", "Je m'endors direct ðŸ’¤"], type: "guess" },
    { q: "Ta qualitÃ© principale selon toi ?",                a: ["L'humour ðŸ˜‚", "La loyautÃ© ðŸ’Ž", "La gentillesse ðŸŒ¸", "L'ambition ðŸ”¥"], type: "guess" },
    { q: "Comment tu prends tes dÃ©cisions importantes ?",    a: ["Avec mon instinct ðŸ§­", "J'analyse tout ðŸ”¬", "Je demande des avis ðŸ—£ï¸", "Je procrastine jusqu'au dernier moment ðŸ’€"], type: "guess" },
    { q: "Ta relation avec l'argent ?",                      a: ["Je dÃ©pense tout ðŸ’¸", "J'Ã©conomise max ðŸ¦", "J'essaie d'Ã©quilibrer âš–ï¸", "Quel argent ? ðŸ˜­"], type: "guess" },
    { q: "Quel type d'Ã©lÃ¨ve t'Ã©tais/t'es ?",                 a: ["Studieux(se) sÃ©rieux ðŸ“š", "Moyen mais sympa ðŸ™‚", "La terreur de la classe ðŸ˜ˆ", "Absent(e) mentalement ðŸŒ™"], type: "guess" },
    { q: "Ta faÃ§on de draguer ?",                            a: ["Direct, j'assume ðŸ˜Ž", "Timide et subtil(e) ðŸ™ˆ", "Par humour ðŸ˜‚", "Je drague pas, Ã§a vient ðŸ¤·"], type: "guess" },
    { q: "T'es plutÃ´t introverti(e) ou extraverti(e) ?",    a: ["100% introverti(e) ðŸ ", "Extraverti(e) Ã  fond ðŸŽ‰", "Ambivert selon les jours ðŸŒ—", "Je sais plus ðŸ˜…"], type: "guess" },
    { q: "Ton pire cauchemar ?",                             a: ["Perdre mes proches ðŸ’”", "ÃŠtre fauchÃ©(e) ðŸ’¸", "L'Ã©chec professionnel ðŸ˜°", "ÃŠtre seul(e) ðŸ˜¢"], type: "guess" },
    { q: "La chose dont tu es le plus fier(e) ?",           a: ["Mon parcours ðŸ†", "Mes amis que j'ai choisis ðŸ‘¥", "Ma rÃ©silience ðŸ’ª", "Mon sens de l'humour ðŸ˜‚"], type: "guess" },
    { q: "Ton type de musique pour te motiver ?",            a: ["Rap/hip-hop ðŸŽ¤", "Musique Ã©lectro/EDM ðŸŽ§", "Rock/indie ðŸŽ¸", "Peu importe si c'est fort ðŸ”Š"], type: "guess" },
    { q: "Ta plus grande peur irrationnelle ?",              a: ["Les insectes ðŸ•·ï¸", "Le noir total ðŸŒ‘", "L'ocÃ©an profond ðŸŒŠ", "Rater mon vol âœˆï¸"], type: "guess" },
    { q: "Si tu pouvais avoir un talent instantanÃ© ?",       a: ["Chanter parfaitement ðŸŽ¤", "Jouer d'un instrument ðŸŽ¸", "Danser pro ðŸ’ƒ", "Parler 5 langues ðŸŒ"], type: "guess" },
    { q: "Ton snack de confort ?",                           a: ["Chips ðŸ¥”", "Chocolat ðŸ«", "Glace ðŸ¦", "Tout ce qui est sucrÃ© ðŸ¬"], type: "guess" },
    { q: "Tu te dÃ©crirais en 1 mot ?",                       a: ["Authentique ðŸ’¯", "AmbitieuxÂ·se ðŸš€", "Bienveillant(e) ðŸŒ¸", "ImprÃ©visible ðŸŽ²"], type: "guess" },
    { q: "Ton meilleur souvenir d'enfance ?",                a: ["Vacances en famille ðŸ–ï¸", "Un cadeau inoubliable ðŸŽ", "Un moment avec mes amis ðŸ‘«", "Une fÃªte d'anniversaire ðŸŽ‚"], type: "guess" },
    { q: "Ton rapport aux rÃ©seaux sociaux ?",                a: ["Totalement accro ðŸ“±", "J'essaie de me dÃ©tacher ðŸ˜…", "Je gÃ¨re Ã§a bien ðŸ‘", "Je les dÃ©teste mais j'les utilise ðŸ™ƒ"], type: "guess" },
    { q: "Comment tu rÃ©agis quand t'es stressÃ©(e) ?",       a: ["Je me renferme ðŸš", "Je parle Ã  quelqu'un ðŸ—£ï¸", "Je mange ðŸ•", "Je bouge / je fais du sport ðŸƒ"], type: "guess" },
    { q: "Ta conception du bonheur ?",                       a: ["La santÃ© et la famille ðŸ¡", "L'amour et les amis ðŸ’•", "La rÃ©ussite perso ðŸŒŸ", "Profiter du moment prÃ©sent â˜€ï¸"], type: "guess" },
  ],

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  //  HOT & SPICY (52 questions)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  hot: [
    { q: "Ce qui te fait craquer instantanÃ©ment chez l'autre ?",   a: ["Un beau sourire ðŸ˜Š", "Les yeux ðŸ‘€", "Une bonne odeur ðŸ˜®â€ðŸ’¨", "L'humour ðŸ˜‚"],               type: "match" },
    { q: "Ton endroit prÃ©fÃ©rÃ© pour un bisou ?",                    a: ["Les lÃ¨vres ðŸ’‹", "Le cou ðŸ˜˜", "Le front ðŸ¥°", "La joue ðŸ˜³"],                               type: "match" },
    { q: "Le mot doux que tu prÃ©fÃ¨res recevoir ?",                 a: ["ChÃ©ri(e) ðŸ’•", "Mon amour â¤ï¸", "BÃ©bÃ© ðŸ¼", "Mon cÅ“ur ðŸ’“"],                                type: "match" },
    { q: "Ce que tu ferais si on Ã©tait seuls ce soir ?",          a: ["Film & cÃ¢lins sur le canapÃ© ðŸŽ¬", "Cuisiner ensemble ðŸ‘¨â€ðŸ³", "Danser dans le salon ðŸ’ƒ", "Parler toute la nuit ðŸŒ™"], type: "match" },
    { q: "Notre prochain rendez-vous idÃ©al ?",                    a: ["Resto romantique ðŸ½ï¸", "CinÃ© & pop-corn ðŸŽ¬", "Bowling ou karting ðŸŽ³", "Escape Game ðŸ”"],    type: "match" },
    { q: "Le geste romantique qui te touche le plus ?",           a: ["Un message inattendu ðŸ’Œ", "Des fleurs ðŸŒ¹", "Une surprise ðŸŽ", "Un long cÃ¢lin ðŸ¤—"],         type: "match" },
    { q: "La chose la plus folle que t'aurais fait pour quelqu'un ?", a: ["Traverser une ville la nuit ðŸŒƒ", "SÃ©cher les cours pour lui/elle ðŸ“š", "Cuisiner Ã  minuit ðŸ³", "Ã‰crire une lettre ðŸ“"], type: "match" },
    { q: "Ton mood quand l'autre rÃ©pond pas depuis 2h ?",         a: ["Je m'en fous ðŸ˜Œ", "LÃ©ger malaise ðŸ˜¬", "Je check son actif Instagram ðŸ‘€", "Je commence Ã  Ã©crire un roman dans ma tÃªte ðŸ“–"], type: "match" },
    { q: "Ce que t'aimes le plus dans notre connexion ?",         a: ["La complicitÃ© ðŸ”—", "Les fous rires ðŸ˜‚", "La tendresse ðŸ¤—", "La confiance totale ðŸ’Ž"],      type: "match" },
    { q: "Un endroit de rÃªve pour passer une nuit ensemble ?",    a: ["HÃ´tel de luxe ðŸ¨", "Chalet Ã  la montagne ðŸ”ï¸", "Bungalow sur l'eau ðŸŒŠ", "Camping sous les Ã©toiles â›º"], type: "match" },
    { q: "Ton style de cÃ¢lin prÃ©fÃ©rÃ© ?",                          a: ["CÃ¢lin cuillÃ¨re ðŸ¥„", "Face Ã  face serrÃ© â¤ï¸", "Sur le canapÃ© devant la tÃ©lÃ© ðŸ“º", "CÃ¢lin surprise par derriÃ¨re ðŸ«‚"], type: "match" },
    { q: "Ce que tu aimes le plus chez l'autre physiquement ?",   a: ["Le sourire ðŸ˜", "Les yeux ðŸ‘ï¸", "La silhouette ðŸ”¥", "Les mains ðŸ¤²"],                      type: "match" },
    { q: "Ta dÃ©finition d'une soirÃ©e parfaite Ã  deux ?",          a: ["On sort en ville ðŸŒ†", "On reste chez nous ðŸ ", "On fait une surprise Ã  l'autre ðŸŽ", "On part en mini-aventure ðŸ—ºï¸"], type: "match" },
    { q: "Ce qui te donne des papillons chez l'autre ?",          a: ["Quand il/elle rit vraiment ðŸ˜‚", "Quand il/elle te regarde intensÃ©ment ðŸ‘€", "Quand il/elle te prend la main ðŸ¤", "Ses messages du matin â˜€ï¸"], type: "match" },
    { q: "Si on devait mettre une chanson sur notre relation ?",   a: ["Quelque chose de doux ðŸŽµ", "Quelque chose de passionnÃ© ðŸ”¥", "Quelque chose de drÃ´le ðŸ˜‚", "Quelque chose de nostalgique ðŸŒ™"], type: "match" },
    { q: "Ce que t'apprÃ©cies le plus dans nos moments ensemble ?", a: ["Quand on dÃ©lire ðŸ˜‚", "Quand on parle de tout ðŸ—£ï¸", "Les silences confortables ðŸŒ¸", "Quand on se fait des cÃ¢lins ðŸ«‚"], type: "match" },
    { q: "Le premier truc que tu remarques chez quelqu'un ?",     a: ["Les yeux ðŸ‘€", "Le sourire ðŸ˜", "Le style vestimentaire ðŸ‘—", "La faÃ§on de parler ðŸ—£ï¸"], type: "match" },
    { q: "Ton geste d'affection prÃ©fÃ©rÃ© ?",                       a: ["Se tenir la main ðŸ¤", "Les bisous sur le front ðŸ¥°", "Les cÃ¢lins longs â¤ï¸", "Jouer avec les cheveux de l'autre ðŸ’†"], type: "match" },
    { q: "Comment tu montres que tu tiens Ã  quelqu'un ?",         a: ["Avec des mots doux ðŸ’Œ", "En Ã©tant lÃ  pour lui/elle ðŸ¤—", "Avec des petites attentions ðŸŽ", "En passant du temps de qualitÃ© â°"], type: "match" },
    { q: "Ton vibe pour un premier rendez-vous ?",                a: ["DÃ©jeuner dÃ©contractÃ© ðŸ¥—", "Balade romantique ðŸŒ³", "ActivitÃ© fun (bowling, karting) ðŸŽ³", "SoirÃ©e bar et bonne conversation ðŸ¹"], type: "match" },
    { q: "Ce que tu attends le plus d'une relation ?",            a: ["La complicitÃ© et le rire ðŸ˜‚", "La passion et l'intensitÃ© ðŸ”¥", "La stabilitÃ© et la sÃ©curitÃ© ðŸ¡", "La libertÃ© tout en Ã©tant ensemble ðŸŒ¸"], type: "match" },
    { q: "Ton deal-breaker absolu dans une relation ?",           a: ["Le manque de confiance ðŸ˜’", "L'absence de communication ðŸ¤", "L'infidÃ©litÃ© ðŸ’”", "La jalousie excessive ðŸ˜¤"], type: "match" },
    { q: "Comment tu rÃ©agis quand tu es jalouxÂ·se ?",             a: ["Je le dis directement ðŸ—£ï¸", "Je fais semblant de rien ðŸ˜", "Je deviens distant(e) ðŸŒ¬ï¸", "Je fais semblant d'Ãªtre occupÃ© ðŸ“±"], type: "match" },
    { q: "Ta faÃ§on de sÃ©duire ?",                                 a: ["L'humour avant tout ðŸ˜‚", "L'intelligence qui parle ðŸ§ ", "La douceur et l'Ã©coute ðŸ‘‚", "La confiance en soi ðŸ˜Ž"], type: "match" },
    { q: "Ton type amoureux idÃ©al ?",                             a: ["DrÃ´le et spontanÃ©(e) ðŸ˜‚", "DouxÂ·ce et attentionnÃ©(e) ðŸŒ¸", "AmbitieuxÂ·se et dÃ©terminÃ©(e) ðŸ”¥", "MystÃ©rieuxÂ·se et profond(e) ðŸŒ™"], type: "match" },
    { q: "Qu'est-ce qui te rendrait jalouxÂ·se ?",                 a: ["Trop de proches du sexe opposÃ© ðŸ‘€", "Des sorties sans moi ðŸŒƒ", "Des conversations secrÃ¨tes ðŸ“±", "Pas grand chose, je fais confiance ðŸ˜Œ"], type: "match" },
    { q: "Le signe qui montre qu'on s'entend vraiment bien ?",    a: ["On peut se parler de tout ðŸ—£ï¸", "On rit pour les mÃªmes trucs ðŸ˜‚", "Le silence est confortable ðŸ˜Œ", "On anticipe ce que l'autre pense ðŸ§ "], type: "match" },
    { q: "Comment tu voudrais qu'on se retrouve aprÃ¨s une semaine sÃ©parÃ©s ?", a: ["Gros cÃ¢lin direct ðŸ¤—", "Un repas qu'on a prÃ©parÃ© ensemble ðŸ³", "Sortie improvisÃ©e ðŸŒƒ", "Juste on reste ensemble Ã  rien faire ðŸ›‹ï¸"], type: "match" },
    { q: "Ton niveau d'exigence en amour ?",                      a: ["TrÃ¨s Ã©levÃ©, j'veux le top ðŸ‘‘", "Ã‰quilibrÃ©, je suis raisonnable ðŸ™‚", "Bas, l'amour c'est l'amour ðŸ’•", "Je sais mÃªme pas ðŸ¤·"], type: "match" },
    { q: "Comment tu vis la distance (mÃªme temporaire) ?",        a: ["Ã‡a me tue ðŸ’”", "Ã‡a va, on se texte ðŸ“±", "Ã‡a renforce le lien ðŸ’ª", "Absence = cÅ“ur qui se souvient ðŸ¥°"], type: "match" },
    { q: "Ton love language principal ?",                         a: ["Mots d'affirmation ðŸ’¬", "Actes de service ðŸ› ï¸", "Cadeaux ðŸŽ", "Temps de qualitÃ© â³"], type: "match" },
    { q: "Un truc que tu trouves hyper romantique ?",             a: ["Regarder les Ã©toiles ensemble ðŸŒŸ", "Danser sous la pluie ðŸŒ§ï¸", "Cuisiner ensemble en musique ðŸ³ðŸŽµ", "Un message Ã  3h du matin ðŸŒ™"], type: "match" },
    { q: "Quelle ambiance pour une soirÃ©e romantique ?",          a: ["LumiÃ¨res tamisÃ©es & bougies ðŸ•¯ï¸", "En plein air sous les Ã©toiles ðŸŒƒ", "Au coin du feu ðŸ”¥", "Musique douce & dÃ®ner maison ðŸ·"], type: "match" },
    { q: "Ce qui te fait rougir instantanÃ©ment ?",                a: ["Un compliment inattendu ðŸ˜Š", "Un regard insistant ðŸ‘€", "ÃŠtre surpris(e) en train de sourire ðŸ˜³", "Un message particuliÃ¨rement doux ðŸ’Œ"], type: "match" },
    { q: "Combien de temps aprÃ¨s le premier RDV tu fais le premier bisou ?", a: ["Le premier soir ðŸ’‹", "AprÃ¨s 2-3 RDV ðŸ¥°", "Quand le moment se prÃ©sente ðŸŒ¸", "Je laisse l'autre prendre l'initiative ðŸ˜"], type: "match" },
    { q: "Ce qui te manquerait le plus si on se voit pas ?",      a: ["Tes messages ðŸ’¬", "Tes fous rires ðŸ˜‚", "Ta prÃ©sence physique ðŸ¤—", "Nos conversations profondes ðŸŒ™"], type: "match" },
    { q: "Comment tu exprimes que tu es en colÃ¨re contre l'autre ?", a: ["Je le dis clairement ðŸ—£ï¸", "Je deviens froidÂ·e ðŸŒ¬ï¸", "Je fais la tÃªte un peu ðŸ˜’", "Je prÃ©fÃ¨re en parler aprÃ¨s avoir calmÃ© ðŸ˜Œ"], type: "match" },
    { q: "Le truc qui te touche le plus chez quelqu'un ?",        a: ["Sa vulnÃ©rabilitÃ© assumÃ©e ðŸ¥º", "Sa gÃ©nÃ©rositÃ© sans attendre ðŸŒ¸", "Sa passion pour ce qu'il/elle aime ðŸ”¥", "Sa fidÃ©litÃ© en toute circonstance ðŸ’Ž"], type: "match" },
    { q: "Tu prÃ©fÃ¨res qu'on soit comment en public ?",            a: ["Discrets et complicies ðŸ¤«", "Affectueux sans complexe â¤ï¸", "Naturels, comme d'hab ðŸ˜Œ", "DÃ©pend de l'humeur ðŸ¤·"], type: "match" },
    { q: "Qu'est-ce que tu ferais si je pleurais ?",              a: ["Te serrer dans mes bras sans rien dire ðŸ¤—", "Trouver des solutions pratiques ðŸ› ï¸", "Te faire rire pour allÃ©ger ðŸ˜‚", "T'Ã©couter parler autant que tu veux ðŸ‘‚"], type: "match" },
    { q: "Ton sentiment au dÃ©but d'une nouvelle relation ?",      a: ["Les papillons absolus ðŸ¦‹", "Un peu de stress aussi ðŸ˜¬", "De la curiositÃ© avant tout ðŸ”", "Une confiance naturelle ðŸ˜Š"], type: "match" },
    { q: "Ce que tu aimes dans les nuits ensemble ?",             a: ["Parler jusqu'Ã  l'aube ðŸŒ…", "Les cÃ¢lins prolongÃ©s ðŸ«‚", "Regarder quelque chose ensemble ðŸ“º", "Juste dormir collÃ©s ðŸ˜´"], type: "match" },
    { q: "Ton truc pour rendre l'autre heureuxÂ·se facilement ?",  a: ["Un message surprise le matin â˜€ï¸", "Son plat favori commandÃ© ðŸ”", "Lui/elle dire ce qu'on apprÃ©cie ðŸ’¬", "Une sortie imprÃ©vue et fun ðŸŽ‰"], type: "match" },
    { q: "Ce que tu ressens quand l'autre te surprend ?",         a: ["De la joie pure ðŸ¥°", "De l'Ã©motion sincÃ¨re ðŸ¥º", "Du rire et du bonheur ðŸ˜‚", "Un peu d'embarras touchant ðŸ˜Š"], type: "match" },
    { q: "Comment tu sais que tu kiffes vraiment quelqu'un ?",    a: ["Je pense Ã  lui/elle tout le temps ðŸ’­", "Je veux lui montrer tout ce que j'aime ðŸŒ", "Je suis moi-mÃªme sans filtre ðŸªž", "Je veux qu'il/elle soit heureuxÂ·se ðŸŒ¸"], type: "match" },
    { q: "Ton geste spontanÃ© pour montrer de l'amour ?",          a: ["Un bisou surprise ðŸ’‹", "Un 'je pense Ã  toi' sans raison ðŸ’¬", "Lui apporter quelque chose dont il/elle avait besoin ðŸŽ", "Le prendre dans mes bras sans prÃ©venir ðŸ¤—"], type: "match" },
    { q: "AprÃ¨s une dispute, tu fais quoi en premier ?",          a: ["Je m'excuse si j'avais tort ðŸ™", "J'attends qu'il/elle vienne vers moi ðŸ˜¶", "Je fais un geste concret ðŸ¤—", "On repart de zÃ©ro direct ðŸŒŸ"], type: "match" },
    { q: "Ce que tu voudrais qu'on fasse plus souvent ?",         a: ["Se retrouver juste nous deux ðŸ’‘", "Sortir dÃ©couvrir des endroits ðŸ—ºï¸", "Parler de nos projets ðŸŒŸ", "Se faire des fous rires ðŸ˜‚"], type: "match" },
    { q: "Ton moment prÃ©fÃ©rÃ© de la journÃ©e avec l'autre ?",       a: ["Le matin au rÃ©veil â˜€ï¸", "L'aprÃ¨s-midi sans rien faire ðŸ›‹ï¸", "Le soir autour d'un repas ðŸ´", "La nuit Ã  discuter ðŸŒ™"], type: "match" },
    { q: "Ce que tu veux qu'on construise ensemble ?",            a: ["Des souvenirs inoubliables ðŸ“¸", "Un foyer plein d'amour ðŸ¡", "Des projets communs ambitieux ðŸš€", "Une amitiÃ© solide en plus ðŸ‘«"], type: "match" },
    { q: "Ton truc pour te rÃ©concilier aprÃ¨s une dispute ?",      a: ["Un cÃ¢lin sincÃ¨re ðŸ¤—", "Un humour pour dÃ©dramatiser ðŸ˜‚", "Une vraie discussion calme ðŸ—£ï¸", "Un geste attentionnÃ© surprise ðŸŽ"], type: "match" },
  ],

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  //  COUPLE GOALS (52 questions)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  couple: [
    { q: "Combien d'enfants tu voudrais ?",                        a: ["0 enfant ðŸš«", "1 ou 2 ðŸ‘¶", "3 ou 4 ðŸ¡", "Une grande famille ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦"],                     type: "match" },
    { q: "OÃ¹ voudrais-tu qu'on vive ensemble ?",                   a: ["Grande ville animÃ©e ðŸŒ†", "Banlieue tranquille ðŸ˜ï¸", "Campagne ðŸŒ¾", "Bord de mer ðŸŒŠ"],        type: "match" },
    { q: "Notre style de maison de rÃªve ?",                        a: ["Appart moderne en ville ðŸ›ï¸", "Maison avec jardin ðŸŒ¿", "Loft industriel ðŸ­", "Maison bohÃ¨me colorÃ©e ðŸŒˆ"], type: "match" },
    { q: "Animal de compagnie ensemble ?",                         a: ["Un chien ðŸ•", "Un chat ðŸˆ", "Les deux ðŸ¾", "Aucun ðŸš«"],                                     type: "match" },
    { q: "Notre premier grand voyage ensemble ?",                  a: ["Asie ðŸ—¾", "CaraÃ¯bes ðŸï¸", "AmÃ©rique ðŸ—½", "Afrique ðŸŒ"],                                     type: "match" },
    { q: "Votre date idÃ©ale avec seulement 50â‚¬ ?",                 a: ["Pique-nique romantique ðŸ§º", "CinÃ© + McDo aprÃ¨s ðŸŸ", "Balade + cafÃ© ðŸŒ¿", "MarchÃ© + cuisine ensemble ðŸ›’"], type: "match" },
    { q: "Dans combien de temps se marier ?",                      a: ["Moins de 2 ans ðŸ’", "Dans 2 Ã  5 ans ðŸ“…", "Plus de 5 ans â³", "On verra ðŸ¤·"],                type: "match" },
    { q: "Notre tradition de couple idÃ©ale ?",                     a: ["SoirÃ©e film du vendredi ðŸŽ¬", "Weekend escapade ðŸ•ï¸", "DÃ®ner romantique hebdo ðŸ·", "JournÃ©e rien que nous ðŸ’‘"], type: "match" },
    { q: "Le premier truc que tu ferais si on habitait ensemble ?", a: ["DÃ©corer ensemble ðŸ›‹ï¸", "Cuisiner un gros repas ðŸ³", "Faire une soirÃ©e pyjama ðŸŽ‰", "Mettre la musique Ã  fond ðŸŽµ"], type: "match" },
    { q: "Dans 10 ans, on fait quoi ?",                            a: ["On voyage partout âœˆï¸", "On est installÃ©s avec enfants ðŸ‘¨â€ðŸ‘©â€ðŸ‘§", "On rÃ©alise nos projets ðŸŒŸ", "On est encore en train de rigoler ðŸ˜‚"], type: "match" },
    { q: "Comment on gÃ¨re nos disputes ?",                         a: ["On en parle tout de suite ðŸ—£ï¸", "On laisse passer la nuit ðŸŒ™", "CÃ¢lin = paix ðŸ¤—", "Message d'excuse ðŸ’¬"], type: "match" },
    { q: "Notre activitÃ© couple parfaite le week-end ?",           a: ["Brunch du dimanche ðŸ¥", "SÃ©ance sport ensemble ðŸ’ª", "MarchÃ© + cuisine ðŸ›ï¸", "Grasse mat' & Netflix ðŸ“º"], type: "match" },
    { q: "Votre film/sÃ©rie couple Ã  regarder ensemble ?",          a: ["ComÃ©die romantique ðŸ’•", "Thriller haletant ðŸ˜±", "SÃ©rie longue durÃ©e ðŸ“º", "Documentaire intÃ©ressant ðŸŒ"], type: "match" },
    { q: "Ce que tu veux absolument partager avec l'autre ?",      a: ["Mes passions ðŸŽ¨", "Mes potes ðŸ‘¥", "Ma famille ðŸ‘¨â€ðŸ‘©â€ðŸ‘§", "Mes voyages âœˆï¸"],                       type: "match" },
    { q: "Notre valeur la plus importante en tant que couple ?",   a: ["La confiance ðŸ”’", "La communication ðŸ—£ï¸", "Le respect ðŸŒ¸", "Le fun & les rires ðŸ˜‚"],          type: "match" },
    { q: "Votre couple de cÃ©lÃ©britÃ©s prÃ©fÃ©rÃ© ?",                   a: ["BeyoncÃ© & Jay-Z ðŸ‘‘", "Ryan Reynolds & Blake ðŸ˜", "Zendaya & Tom Holland ðŸ•·ï¸", "Un couple inconnu mais heureux ðŸ’"], type: "match" },
    { q: "Notre futur chat ou chien s'appellerait ?",              a: ["Mochi ðŸ¡", "Zeus âš¡", "Bella ðŸŒ¸", "Un truc complÃ¨tement random ðŸŽ²"], type: "match" },
    { q: "On ferait comment pour la Saint-Valentin ?",             a: ["Gros restau romantique ðŸ½ï¸", "SoirÃ©e maison cocooning ðŸ•¯ï¸", "Weekend en amoureux ðŸ¨", "C'est tous les jours la St-V chez nous ðŸ˜"], type: "match" },
    { q: "Notre faÃ§on de gÃ©rer les finances Ã  deux ?",             a: ["Compte joint pour tout ðŸ¦", "On partage les dÃ©penses communes ðŸ’³", "Chacun paie Ã  son tour ðŸ”„", "On improvise selon les situations ðŸ¤·"], type: "match" },
    { q: "Notre tradition du rÃ©veillon de NoÃ«l ?",                 a: ["En famille Ã©largie ðŸŽ„", "Juste nous deux au calme â„ï¸", "Avec les amis proches ðŸŽ‰", "Voyage Ã  l'Ã©tranger ðŸŒ"], type: "match" },
    { q: "Ce qu'on ferait pour notre anniversaire de couple ?",    a: ["Retourner lÃ  oÃ¹ Ã§a a commencÃ© ðŸŒ¹", "Voyage surprise ðŸ›«", "SoirÃ©e habillÃ©s super chic ðŸ¥‚", "Quelque chose de nouveau Ã  chaque fois ðŸŽ²"], type: "match" },
    { q: "Notre style d'Ã©ducation pour nos enfants ?",             a: ["Cadre strict mais bienveillant ðŸ“š", "Super libres et crÃ©atifs ðŸŽ¨", "Ã‰quilibre entre tout ðŸŒ—", "On verra le moment venu ðŸ¤·"], type: "match" },
    { q: "Qui ferait la cuisine Ã  la maison ?",                    a: ["Moi je maÃ®trise ðŸ‘¨â€ðŸ³", "Toi tu cuisines mieux ðŸ™", "On partage Ã©quitablement âš–ï¸", "Livraison tous les soirs ðŸ›µ"], type: "match" },
    { q: "Votre sport ou activitÃ© physique en couple ?",           a: ["La salle ensemble ðŸ’ª", "Le vÃ©lo ou la randonnÃ©e ðŸš´", "La natation ðŸŠ", "On regarde le sport Ã  la tÃ©lÃ© ðŸ˜‚"], type: "match" },
    { q: "Notre premiÃ¨re maison : on achÃ¨te ou on loue ?",         a: ["On achÃ¨te dÃ¨s qu'on peut ðŸ ", "On loue tranquille d'abord ðŸ”‘", "DÃ©pend de la situation ðŸ¤”", "On y pense pas encore âœŒï¸"], type: "match" },
    { q: "Comment on prendrait les grandes dÃ©cisions ensemble ?",  a: ["Discussion approfondie ðŸ—£ï¸", "L'un propose, l'autre valide ðŸ‘", "MajoritÃ© = on y va ðŸ—³ï¸", "Instinct et confiance ðŸ§­"], type: "match" },
    { q: "Notre faÃ§on d'accueillir des amis chez nous ?",          a: ["DÃ®ners organisÃ©s soignÃ©s ðŸ½ï¸", "SoirÃ©es improvisÃ©es ðŸŽ‰", "ApÃ©ros dÃ©contractÃ©s ðŸ·", "On prÃ©fÃ¨re aller chez les autres ðŸ˜‚"], type: "match" },
    { q: "Quel genre d'anniversaire pour nos enfants ?",           a: ["Gros anniversaire avec plein d'amis ðŸŽˆ", "Sortie spÃ©ciale en famille ðŸŽ¡", "Surprise bien prÃ©parÃ©e ðŸŽ", "Simple mais mÃ©morable ðŸŒŸ"], type: "match" },
    { q: "Notre hobby qu'on ferait ensemble ?",                    a: ["Cuisiner/pÃ¢tisserie ðŸ§", "Voyager et explorer ðŸ—ºï¸", "SÃ©rie/cinÃ© marathon ðŸ“º", "Sport ou activitÃ© physique ðŸ’ª"], type: "match" },
    { q: "Comment on gÃ©rerait une mauvaise passe financiÃ¨re ?",    a: ["On se serre les coudes sans juger ðŸ’ª", "On fait un budget commun serrÃ© ðŸ“Š", "On cherche des solutions crÃ©atives ðŸ’¡", "On en parle ouvertement avec calme ðŸ—£ï¸"], type: "match" },
    { q: "Notre dÃ©co intÃ©rieure idÃ©ale ?",                         a: ["Minimaliste et Ã©purÃ© ðŸ¤", "Chaud et cocooning ðŸ•¯ï¸", "ColorÃ© et bohÃ¨me ðŸŒˆ", "Moderne et design ðŸ™ï¸"], type: "match" },
    { q: "Votre activitÃ© en cas de panne d'Ã©lectricitÃ© ?",         a: ["Bougies et jeux de sociÃ©tÃ© ðŸ•¯ï¸ðŸŽ²", "Sortir se balader dehors ðŸŒ™", "Dormir ultra tÃ´t ðŸ˜´", "Chercher une prise chez les voisins ðŸ˜‚"], type: "match" },
    { q: "Dans notre couple, qui serait le plus romantique ?",     a: ["Moi sans hÃ©sitation ðŸ˜", "Toi clairement ðŸ¥°", "On est Ã  Ã©galitÃ© ðŸ’•", "Aucun de nous deux, on est carrÃ©s ðŸ˜‚"], type: "match" },
    { q: "Notre langue secrÃ¨te de couple ce serait ?",             a: ["Des surnoms ridicules ðŸ£", "Des blagues internes ðŸ˜‚", "Des regards complices ðŸ‘€", "Des emojis incomprÃ©hensibles pour les autres ðŸ¤£"], type: "match" },
    { q: "Votre rituel du coucher ensemble ?",                     a: ["Discusssions infinies dans le noir ðŸŒ™", "Une sÃ©rie ensemble ðŸ“º", "Chacun son cÃ´tÃ© mais collÃ©s ðŸ’‘", "Endormis en 2 min ðŸ˜´"], type: "match" },
    { q: "Ce qu'on apporterait l'un Ã  l'autre ?",                  a: ["De la stabilitÃ© ðŸ¡", "De l'aventure et du fun ðŸŽ‰", "Un regard bienveillant ðŸŒ¸", "De l'ambition partagÃ©e ðŸš€"], type: "match" },
    { q: "Notre voyage de noces si on se mariait ?",               a: ["Maldives ou Bora Bora ðŸï¸", "Road trip amÃ©ricain ðŸš—", "Asie du Sud-Est ðŸ—¾", "Europe romantique ðŸ—¼"], type: "match" },
    { q: "Quelle langue on apprendrait ensemble ?",                a: ["L'espagnol ðŸ‡ªðŸ‡¸", "Le japonais ðŸ‡¯ðŸ‡µ", "L'arabe ðŸŒ™", "On s'en fout, Google Translate ðŸ˜‚"], type: "match" },
    { q: "Notre soir de semaine en couple ressemblerait Ã  quoi ?", a: ["CÃ¢lins & sÃ©rie ðŸ“º", "Sport ensemble puis douche ðŸ’ª", "Cuisiner quelque chose de bon ðŸ³", "Chacun fait ses trucs mais ensemble ðŸ›‹ï¸"], type: "match" },
    { q: "Dans 5 ans notre relation ressemble Ã  quoi ?",           a: ["Ensemble, installÃ©s et Ã©panouis ðŸ¡", "En train de voyager partout ðŸŒ", "Ã€ fond sur nos projets communs ðŸš€", "Pareil qu'aujourd'hui en mieux ðŸ’•"], type: "match" },
    { q: "Votre faÃ§on d'Ã©lever des enfants : quelles valeurs en prioritÃ© ?", a: ["Le respect des autres ðŸŒ¸", "L'honnÃªtetÃ© absolue ðŸ’Ž", "L'ambition et le travail ðŸ”¥", "La gÃ©nÃ©rositÃ© et le partage ðŸ¤"], type: "match" },
    { q: "Quelle cause on dÃ©fendrait ensemble ?",                  a: ["L'environnement ðŸŒ", "Les inÃ©galitÃ©s sociales ðŸ¤", "Les droits des animaux ðŸ¾", "L'Ã©ducation pour tous ðŸ“š"], type: "match" },
    { q: "Notre habitude couple qu'on adorerais avoir ?",          a: ["Le cafÃ© du matin ensemble â˜•", "La balade du dimanche ðŸŒ³", "Le repas sans tÃ©lÃ©phone ðŸš«ðŸ“±", "Le film du vendredi soir ðŸŽ¬"], type: "match" },
    { q: "Ce qu'on ferait de notre premier appart ensemble ?",     a: ["On redÃ©corerait tout ðŸŽ¨", "On organiserait une pendaison de crÃ©maillÃ¨re ðŸŽ‰", "On se ferait enfin notre soirÃ©e idÃ©ale ðŸ•¯ï¸", "On resterait des heures Ã  rÃ©aliser qu'on est chez nous ðŸ¥¹"], type: "match" },
    { q: "Votre Ã©quipe en toutes circonstances ?",                 a: ["Solidaires face Ã  tout ðŸ’ª", "On se complÃ¨te parfaitement ðŸ§©", "On rit de tout ensemble ðŸ˜‚", "On grandit l'un grÃ¢ce Ã  l'autre ðŸŒ±"], type: "match" },
    { q: "La chose qui cimentera notre couple ?",                  a: ["Notre complicitÃ© unique ðŸ”—", "Notre projet de vie commun ðŸŒŸ", "Notre confiance absolue ðŸ”’", "Notre humour et nos fous rires ðŸ˜‚"], type: "match" },
    { q: "Ce qui te rendrait le plus fier(e) de nous deux ?",      a: ["Avoir construit quelque chose ensemble ðŸ¡", "Avoir voyagÃ© partout ðŸŒ", "Se voir grandir et Ã©voluer ðŸŒ±", "Ne jamais avoir perdu notre complicitÃ© ðŸ’•"], type: "match" },
    { q: "Dans notre couple, qui prendrait les dÃ©cisions rapides ?", a: ["Moi, j'hÃ©site jamais ðŸ˜Ž", "Toi, tu es plus dÃ©cidÃ©(e) ðŸ‘", "On dÃ©cide ensemble toujours âš–ï¸", "On flippe une piÃ¨ce ðŸª™"], type: "match" },
    { q: "Notre faÃ§on de fÃªter une bonne nouvelle ?",              a: ["Un bon restau improvisÃ© ðŸ½ï¸", "Un voyage surprise ðŸ›«", "Une soirÃ©e Ã  la maison classe ðŸ¥‚", "Appeler tout le monde pour partager ðŸ“£"], type: "match" },
    { q: "Ce qu'on ferait si on avait 1 an sabbatique ensemble ?", a: ["Tour du monde complet ðŸŒ", "Monter notre projet ðŸ’¡", "Se poser et profiter ðŸ›‹ï¸", "Explorer l'Europe en van ðŸš"], type: "match" },
    { q: "Notre rituel du matin ensemble ?",                       a: ["CafÃ© au lit ðŸ›ï¸â˜•", "Petit-dej Ã©laborÃ© ensemble ðŸ¥ž", "Sport matinal cÃ´te Ã  cÃ´te ðŸƒ", "Chacun son rythme mais cÃ¢lin obligatoire ðŸ¤—"], type: "match" },
  ],

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  //  DÃ‰FI FOU (52 questions)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  defi: [
    { q: "Le truc le plus gÃªnant que j'aurais dit Ã  quelqu'un ?",    a: ["Rien, je suis un saint ðŸ˜‡", "J'ai draguÃ© en mode catastrophe ðŸ˜¬", "J'ai dit 'je t'aime' trop tÃ´t ðŸ’€", "J'ai appelÃ© mon prof par le prÃ©nom de ma mÃ¨re ðŸ˜­"], type: "match" },
    { q: "Notre plus grosse dispute porterait sur ?",                 a: ["Quel resto choisir ðŸ½ï¸", "La tempÃ©rature de la chambre ðŸŒ¡ï¸", "Netflix â€” quoi regarder ðŸ“º", "Qui rÃ©pond pas assez vite ðŸ“±"], type: "match" },
    { q: "Si tu devais me dÃ©crire en 1 emoji ?",                     a: ["ðŸ˜Š (Solaire)", "ðŸ¥° (Trop mignonÂ·ne)", "ðŸ˜ (MystÃ©rieuxÂ·se)", "ðŸ”¥ (Intense)"], type: "match" },
    { q: "Si on Ã©tait un duo de rappeurs, on s'appellerait ?",       a: ["Scott & Nolwen Forever ðŸ’•", "Les InsÃ©parables ðŸ”—", "Bonnie & Clyde 2.0 ðŸŒ¹", "Le Duo du SiÃ¨cle ðŸ‘‘"], type: "match" },
    { q: "Si on Ã©tait un film, ce serait ?",                         a: ["ComÃ©die romantique ðŸ˜‚â¤ï¸", "Film d'action Ã©pique ðŸ’¥", "Drame passionnel ðŸŽ­", "ComÃ©die dÃ©lirante ðŸ˜‚"], type: "match" },
    { q: "Notre pire date disaster imaginaire ?",                     a: ["Resto qui ferme Ã  notre arrivÃ©e ðŸ˜…", "Pluie torrentielle en balade ðŸŒ§ï¸", "Voiture en panne ðŸš—", "Croiser un(e) ex ðŸ˜±"], type: "match" },
    { q: "Que trouverais-tu sur mon tÃ©lÃ©phone ?",                    a: ["Des photos de nous ðŸ“¸", "Des mÃ¨mes trop drÃ´les ðŸ˜‚", "Nos vieux messages relus ðŸ’Œ", "Des vidÃ©os TikTok sauvegardÃ©es ðŸ“±"], type: "match" },
    { q: "T'offrir quelque chose sans argent, ce serait ?",          a: ["Une lettre d'amour âœï¸", "Une playlist rien que pour toi ðŸŽµ", "Une soirÃ©e Ã©toiles ðŸŒŸ", "Un bon massage ðŸ’†"], type: "match" },
    { q: "Si on devait faire un road trip, destination ?",           a: ["CÃ´te d'Azur ðŸŒŠ", "Bretagne sauvage ðŸŒ¿", "Espagne soleil ðŸ‡ªðŸ‡¸", "Tour de l'Europe ðŸ—ºï¸"], type: "match" },
    { q: "Mon pire trait de caractÃ¨re selon toi ?",                  a: ["Trop tÃªtu(e) ðŸ‚", "Trop dans la lune ðŸŒ™", "Trop intense parfois ðŸ”¥", "Trop flemmard(e) ðŸ˜´"], type: "match" },
    { q: "Ce qu'on ferait si on avait une semaine libre et 5000â‚¬ ?", a: ["Road trip ðŸš—", "HÃ´tel luxe & spa ðŸ¨", "Festival de musique ðŸŽµ", "Partir Ã  l'imprÃ©vu ðŸŽ²"], type: "match" },
    { q: "Si je devais te dÃ©crire Ã  mes potes en un mot ?",          a: ["Adorable ðŸ¥°", "DrÃ´le ðŸ˜‚", "Intense ðŸ”¥", "MystÃ©rieuxÂ·se ðŸŒ™"], type: "match" },
    { q: "Ce que tu ferais si j'avais une trÃ¨s mauvaise journÃ©e ?",  a: ["Ton plat prÃ©fÃ©rÃ© commandÃ© ðŸ”", "Te faire rire avec des mÃ¨mes ðŸ˜„", "T'appeler juste pour Ã©couter ðŸ“ž", "Tout lÃ¢cher pour te rejoindre ðŸƒ"], type: "match" },
    { q: "Notre meilleure qualitÃ© commune ?",                        a: ["On se fait rire ðŸ˜‚", "On se comprend sans parler ðŸ”—", "On s'accepte tels qu'on est ðŸŒŸ", "On est loyaux ðŸ’ª"], type: "match" },
    { q: "Si on devait crÃ©er un business ensemble ?",                a: ["Un restau / bar ðŸ¹", "Une boutique en ligne ðŸ’»", "Une agence de voyage âœˆï¸", "Un truc complÃ¨tement random ðŸŽ²"], type: "match" },
    { q: "Le truc que je ferais jamais mais toi oui ?",              a: ["Sauter en parachute ðŸª‚", "Parler en public sans stresser ðŸŽ¤", "Manger un truc bizarre ðŸ›", "Voyager seul(e) Ã  l'autre bout du monde ðŸŒ"], type: "match" },
    { q: "Si on devait rÃ©sumer notre amitiÃ© en une sÃ©rie ?",         a: ["Friends ðŸ˜‚", "Euphoria ðŸŒˆ", "Emily in Paris ðŸ—¼", "Stranger Things ðŸ‘¾"], type: "match" },
    { q: "Notre plus grand talent cachÃ© en couple ?",                a: ["Faire des plans qui tombent Ã  l'eau ðŸ˜…", "Finir les phrases de l'autre ðŸ—£ï¸", "Trouver des resto en 2 secondes ðŸ½ï¸", "Rire au pire moment ðŸ˜‚"], type: "match" },
    { q: "Si on passait une nuit coincÃ©s quelque part ?",            a: ["Dans un aÃ©roport âœˆï¸", "Dans une cabane en montagne â›°ï¸", "Dans un Airbnb bizarre ðŸšï¸", "Dans notre voiture en panne ðŸš—"], type: "match" },
    { q: "Ce que tu ramÃ¨nerais si on Ã©tait perdus sur une Ã®le dÃ©serte ?", a: ["Mon tÃ©lÃ©phone (avec batterie) ðŸ“±", "De la nourriture ðŸ•", "Toi directement ðŸ˜", "Un couteau suisse ðŸ”ª"], type: "match" },
    { q: "Notre superpower en tant que duo ?",                       a: ["On rÃ©sout tout ensemble ðŸ§©", "On fait rire n'importe qui ðŸ˜‚", "On mange n'importe oÃ¹ ðŸ”", "On trouve des plans Ã  23h59 ðŸŒ™"], type: "match" },
    { q: "Si notre couple Ã©tait un animal, ce serait ?",             a: ["Des dauphins (intelligents & complices) ðŸ¬", "Des lions (forts & protecteurs) ðŸ¦", "Des pandas (cute & chill) ðŸ¼", "Des pingouins (fidÃ¨les) ðŸ§"], type: "match" },
    { q: "Ce qu'on ferait si on Ã©tait invisibles pendant 1h ?",      a: ["Observer les rÃ©actions des gens ðŸ‘€", "Entrer dans un endroit inaccessible ðŸ°", "Jouer des tours Ã  nos potes ðŸ˜‚", "Faire rien, on serait perdus ðŸ¤·"], type: "match" },
    { q: "Notre place dans un groupe d'amis ?",                      a: ["Le duo trop mignon ðŸ¥°", "Les fous de la bande ðŸ˜‚", "Les organisateurs de soirÃ©es ðŸŽ‰", "Les sagesses en retrait ðŸŒ™"], type: "match" },
    { q: "Si on devait gagner un concours, ce serait lequel ?",      a: ["Le couple le plus complice ðŸ”—", "Le plus drÃ´le ðŸ˜‚", "Le plus beau ðŸ˜", "Le plus original ðŸŽ¨"], type: "match" },
    { q: "Le truc qu'on ferait que personne comprendrait ?",         a: ["Rigoler pour rien pendant 20 min ðŸ˜‚", "Manger Ã  des horaires bizarres ðŸ•", "Partir en road trip la nuit ðŸŒ™", "Avoir des dÃ©bats sÃ©rieux sur des trucs absurdes ðŸ¤”"], type: "match" },
    { q: "Comment on rÃ©agirait si on gagnait Ã  la loterie ?",        a: ["Voyage immÃ©diatement âœˆï¸", "On investit intelligemment ðŸ“ˆ", "On aide la famille et les amis ðŸ¤", "On pÃ¨te un cÃ¢ble de joie ðŸ¥³"], type: "match" },
    { q: "Notre film prÃ©fÃ©rÃ© Ã  regarder ensemble en pyjama ?",       a: ["Harry Potter ðŸ§™", "Avengers ðŸ’¥", "Un Disney ðŸ°", "Un film d'horreur pour se serrer ðŸ˜±"], type: "match" },
    { q: "Ce qu'on ferait Ã  minuit si on pouvait tout faire ?",      a: ["Sortir manger quelque chose de bon ðŸ”", "Aller sur une plage ou une colline voir les Ã©toiles ðŸŒŸ", "Danser quelque part ðŸ’ƒ", "Rouler sans destination ðŸš—"], type: "match" },
    { q: "Notre rÃ©action face Ã  une araignÃ©e dans la chambre ?",     a: ["Je la gÃ¨re froidement ðŸ˜Ž", "On fuit tous les deux ðŸ˜±", "L'un paniques, l'autre rigole ðŸ˜‚", "On appelle quelqu'un ðŸ“ž"], type: "match" },
    { q: "Notre truc pour passer le temps en voiture ?",             a: ["Musique Ã  fond et on chante ðŸŽµ", "DÃ©bats sur des sujets random ðŸ—£ï¸", "Jeux de mots et devinettes ðŸ§©", "On se tait et on savoure ðŸ˜Œ"], type: "match" },
    { q: "Ce qu'on ferait si on avait un clone de nous-mÃªmes ?",     a: ["On le fait travailler Ã  notre place ðŸ˜‚", "On observerait comme on est vraiment ðŸ”", "On doublerait nos aventures ðŸŒ", "On serait jaloux de nous-mÃªmes ðŸ˜…"], type: "match" },
    { q: "Notre pire qualitÃ© en tant que couple ?",                  a: ["On rit trop fort partout ðŸ˜‚", "On mange trop bien ðŸ•", "On perd la notion du temps ðŸ•", "On est trop dans notre bulle ðŸ«§"], type: "match" },
    { q: "Si on devait faire un TikTok viral, ce serait quoi ?",     a: ["Un dÃ©fi danse ðŸ’ƒ", "Un sketch comique ðŸ˜‚", "Un truc mignon et relatable ðŸ¥°", "Un vrai moment improvisÃ© ðŸŽ¥"], type: "match" },
    { q: "Ce qu'on ferait si on se retrouvait dans le passÃ© ?",      a: ["Explorer une autre Ã©poque ðŸ•°ï¸", "Corriger nos erreurs ðŸ˜…", "Profiter de la musique de l'Ã©poque ðŸŽµ", "Revenir vite c'est mieux maintenant ðŸš€"], type: "match" },
    { q: "Notre troll prÃ©fÃ©rÃ© Ã  faire aux amis ?",                   a: ["Faire semblant qu'on s'est sÃ©parÃ©s ðŸ˜ˆ", "Inventer une histoire de fou ðŸ¤¥", "DisparaÃ®tre et rÃ©apparaÃ®tre sans explication ðŸ‘»", "On est trop gentils pour troller ðŸ˜‡"], type: "match" },
    { q: "Si on avait un slogan de couple ?",                        a: ["'On s'en fout, on s'aime' ðŸ’•", "'Deux fous, zÃ©ro regret' ðŸ˜‚", "'Toujours ensemble, toujours debout' ðŸ’ª", "'On mange bien et on rigole' ðŸ•ðŸ˜‚"], type: "match" },
    { q: "Notre talent secret qu'on rÃ©vÃ©lerait au monde ?",          a: ["Cuisiner incroyablement bien ðŸ‘¨â€ðŸ³", "Danser comme des pros ðŸ’ƒ", "Faire rire n'importe qui ðŸ˜‚", "Trouver les meilleurs coins cachÃ©s ðŸ—ºï¸"], type: "match" },
    { q: "Ce qu'on ferait si on devait survivre en forÃªt 3 jours ?", a: ["On se dÃ©brouille, on est malins ðŸ§ ", "Panique totale mais on s'entraide ðŸ˜±", "On ferait comme si c'Ã©tait camping ðŸ•ï¸", "On appelle Ã  l'aide le plus vite possible ðŸ“ž"], type: "match" },
    { q: "Notre reaction si un paparazzi nous prenait en photo ?",   a: ["On poserait sÃ©rieusement ðŸ˜Ž", "On ferait des grimaces ðŸ˜œ", "On ignorerait royalement ðŸ‘‘", "On lui demanderait les photos ðŸ˜‚"], type: "match" },
    { q: "Ce qu'on posterait comme couple sur les rÃ©seaux ?",        a: ["Rien, notre vie c'est privÃ© ðŸ”’", "Les moments drÃ´les seulement ðŸ˜‚", "Quelques beaux souvenirs de voyage ðŸ“¸", "Tout, on assume d'Ãªtre chou ðŸ¥°"], type: "match" },
    { q: "Notre scÃ©nario de fin du monde en couple ?",               a: ["On cherche un bunker bien Ã©quipÃ© ðŸšï¸", "On profite de chaque instant restant ðŸŒ…", "On rassemble famille et amis ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦", "On fait des trucs fous qu'on s'Ã©tait interdits ðŸŽ²"], type: "match" },
    { q: "Si on devait Ãªtre des personnages dans un jeu vidÃ©o ?",    a: ["Des hÃ©ros Ã©piques qui sauvent le monde âš”ï¸", "Des personnages comiques de fond ðŸ˜‚", "Le boss final imbattable ðŸ‘¾", "Les villains sÃ©duisants ðŸ˜ˆ"], type: "match" },
    { q: "Ce qu'on Ã©crirait dans une bouteille Ã  la mer ?",          a: ["Notre histoire d'amour â¤ï¸", "Un message absurde et drÃ´le ðŸ˜‚", "Des conseils de vie sages ðŸŒŸ", "Rien, on garde le mystÃ¨re ðŸŒŠ"], type: "match" },
    { q: "Notre mode de transport de couple prÃ©fÃ©rÃ© ?",              a: ["Voiture fenÃªtres ouvertes ðŸš—ðŸŽµ", "Train avec vue ðŸš‚", "Avion pour aller loin âœˆï¸", "Ã€ pied, on prend notre temps ðŸš¶"], type: "match" },
    { q: "Ce qu'on ferait si on avait le choix de vivre dans un film ?", a: ["Un film d'aventure ðŸ—ºï¸", "Une comÃ©die romantique ðŸ’•", "Un film de super-hÃ©ros ðŸ’¥", "Un film culinaire ðŸ³"], type: "match" },
    { q: "Notre reaction si on croisait notre cÃ©lÃ©britÃ© prÃ©fÃ©rÃ©e ?", a: ["On la/le salue naturellement ðŸ˜Ž", "On panique et on bÃ©gaie ðŸ˜…", "On prend une photo super classe ðŸ“¸", "On stalk tranquillement de loin ðŸ‘€"], type: "match" },
    { q: "Notre tradition bizarre qu'on inventerait ?",              a: ["Danser Ã  00h01 chaque 1er du mois ðŸ’ƒ", "Manger un truc spÃ©cial chaque dimanche ðŸ½ï¸", "S'envoyer un mÃ¨me chaque matin ðŸ˜‚", "Regarder les Ã©toiles le premier vendredi du mois ðŸŒŸ"], type: "match" },
    { q: "Si on devait s'inscrire Ã  une Ã©mission de tÃ©lÃ©-rÃ©alitÃ© ?", a: ["Koh-Lanta ðŸï¸ (on survivrait)", "The Voice ðŸŽ¤ (on a du talent)", "L'amour est dans le prÃ© ðŸŒ¾ (trop mignons)", "PÃ©kin Express ðŸŒ (on roule)"], type: "match" },
    { q: "Ce qu'on garderait secret au monde entier ?",              a: ["Notre playlist secrÃ¨te ðŸŽµ", "Nos dÃ©lires privÃ©s ðŸ˜‚", "Nos projets avant qu'ils soient rÃ©els ðŸŒŸ", "Certaines conversations nocturnes ðŸŒ™"], type: "match" },
    { q: "Si on Ã©crivait un livre sur notre histoire ?",             a: ["Une comÃ©die romantique hilarante ðŸ˜‚â¤ï¸", "Une aventure Ã©pique ðŸŒ", "Un roman plein d'Ã©motions ðŸ¥º", "Un guide de survie en couple ðŸ˜‚"], type: "match" },
  ],
};

// Nombre de questions par partie
const QUESTIONS_PER_GAME = 15;

// Messages troll quand les rÃ©ponses ne matchent pas
const TROLL_MESSAGES = [
  "T'es vraiment nul(le) lÃ  ðŸ’€",
  "EspÃ¨ce de Tana du quiz ðŸ˜­",
  "T'as rÃ©pondu quoi lÃ  sÃ©rieux ?? ðŸ˜‚",
  "Tout pour la thune, rien pour le cÅ“ur ðŸ¤‘",
  "Que par intÃ©rÃªt... ðŸ™„",
  "Ma grand-mÃ¨re jouerait mieux ðŸ‘µ",
  "T'as rÃ©flÃ©chi avec tes pieds ? ðŸ¦¶",
  "C'est pas grave... mais si quand mÃªme ðŸ˜…",
  "RatÃ© ! RÃ©vise avant la prochaine ðŸŽ¯",
  "On peut plus rien faire de toi ðŸ˜”",
  "Retente ta chance pitiÃ© ðŸ™",
  "T'as googlelÃ© une mauvaise rÃ©ponse ou quoi ðŸ˜­",
  "Vous Ãªtes pas du tout sur la mÃªme longueur d'onde ðŸ“¡",
  "C'est la loose totale lÃ  ðŸ’€",
  "Vous vous connaissez depuis quand dÃ©jÃ  ? ðŸ˜‚",
  "Respectueusement... vous n'etes pas connectes la.",
  "La c'est du freestyle sans permis.",
  "On dirait deux dimensions differentes.",
  "Meme le chat a mieux repondu que vous.",
  "Ce n'est pas un match, c'est un clash.",
  "Team aleatoire validee.",
];

// Messages troll pour le perdant (fin de partie)
const LOSER_MESSAGES_SCOTT = [
  "De toute faÃ§on je te bats la bagarre ðŸ’ª â€” Nolwen",
  "Vu que t'as perdu, on fera des enfants Scott ðŸ‘¶ðŸ˜‚",
  "Tes pieds Ã  la el mordjene Scott ðŸ’…",
  "T'as perdu donc c'est toi qui fais la vaisselle ðŸ½ï¸",
  "MÃªme en triche t'aurais perdu Scott ðŸ˜­",
  "EntraÃ®ne-toi, je te donne une revanche dans 10 ans â³",
  "C'est pas grave, t'es beau au moins ðŸ˜˜ â€” Nolwen",
  "Scott tu crains dans ce jeu mais je t'aime quand mÃªme ðŸ’•",
  "La dÃ©faite te va bien Scott ðŸ˜‚ â€” Nolwen",
  "Prochain niveau : reconnaÃ®tre qu'on te bat Scott ðŸ‘‘ â€” Nolwen",
  "Chef du game ? Non. Chef de la lose ? Oui Scott.",
  "Scott, ton aura s'est deconnectee du serveur.",
  "Faut reviser tes potins, champion.",
  "Scott en mode speedrun de la defaite.",
];

const LOSER_MESSAGES_NOLWEN = [
  "De toute faÃ§on je te bats la bagarre ðŸ’ª â€” Scott",
  "Vu que t'as perdu, on fera des enfants Nolwen ðŸ‘¶ðŸ˜‚",
  "Tes pieds Ã  la el mordjene Nolwen ðŸ’…",
  "T'as perdu donc c'est toi qui fais la vaisselle ðŸ½ï¸",
  "MÃªme en triche t'aurais perdu ðŸ˜­",
  "EntraÃ®ne-toi, je te donne une revanche dans 10 ans â³",
  "C'est pas grave, t'es belle au moins ðŸ˜˜ â€” Scott",
  "Nolwen tu crains dans ce jeu mais je t'aime quand mÃªme ðŸ’•",
  "La dÃ©faite te va tellement bien Nolwen ðŸ˜‚ â€” Scott",
  "Champion(ne) du lendemain peut-Ãªtre ðŸ‘‘ â€” Scott",
  "Nolwen, la c'etait un 0-2 sec et sans VAR.",
  "Ton cerveau a fait pause au pire moment.",
  "Nolwen en full impro, j'ai vu mais j'ai rien dit.",
  "C'est mignon de participer, continue.",
];

// Messages pour le gagnant
const WINNER_MESSAGES = [
  "Champion(ne) absolu(e) ðŸ‘‘",
  "T'as tout dÃ©chirÃ©, respect ðŸ”¥",
  "Trop fort(e), logique c'Ã©tait toi ðŸ˜Ž",
  "Victoire totale, aucune discussion possible ðŸ†",
  "Le/La meilleur(e) tout simplement ðŸ’…",
];

// Messages Ã©galitÃ©
const DRAW_MESSAGES = [
  "Vous Ãªtes vraiment faits l'un pour l'autre ðŸ’•",
  "MÃªme score = mÃªme Ã¢me, c'est beau ðŸŒ¸",
  "Ã‰galitÃ© parfaite â€” on remet Ã§a ? ðŸ¤",
  "Personne perd, personne gagne... et si c'Ã©tait Ã§a l'amour ? ðŸ¥°",
  "Vous pensez pareil â€” c'est flippant et magnifique ðŸ¤©",
];

// MÃ©langeur Fisher-Yates
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
