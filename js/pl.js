// All Polish text in one place.
window.App = window.App || {};

App.plural = function (n, one, few, many) {
  if (n === 1) return one;
  var n10 = n % 10, n100 = n % 100;
  if (n10 >= 2 && n10 <= 4 && !(n100 >= 12 && n100 <= 14)) return few;
  return many;
};

App.T = {
  appTitle: 'Kosmiczne Zoo',

  // Profile / first launch
  profileTitleNew: 'Witaj w Kosmicznym Zoo! 🚀',
  profileTitleEdit: 'Mój profil',
  askName: 'Jak masz na imię?',
  pickAvatar: 'Wybierz swoją postać',
  rocketName: 'Jak nazwiesz swoją rakietę?',
  rocketNamePlaceholder: 'np. Iskierka',
  rocketNameDefault: 'Iskierka',
  pickColor: 'Wybierz kolor rakiety',
  letsGo: 'Lecimy! 🚀',
  save: 'Zapisz',
  back: 'Wróć',
  nameMissing: 'Wpisz swoje imię 🙂',
  avatars: {
    astronautka: 'Astronautka',
    kot: 'Kot Astronauta',
    lis: 'Lisica Pilotka',
    robot: 'Robot Bip'
  },

  // Intro
  intro: [
    'Cześć, {name}! To jest twoja rakieta „{rocket}”. Razem polecicie przez całą galaktykę!',
    'Na planetach mieszkają magiczne stworki. Kosmiczny Bałagan namieszał w ich domach i potrzebują twojej pomocy!',
    'Rozwiązuj zadania z mnożenia, żeby zatankować rakietę. Gdy bak będzie pełny, pokonasz Bałagan i uratujesz stworka!'
  ],
  next: 'Dalej ➜',
  startPlaying: 'Zaczynamy! 🚀',

  // Home
  hello: 'Cześć, {name}!',
  rocketWaits: 'Rakieta „{rocket}” czeka na start',
  streakTitle: 'Seria dni z rzędu',
  starsTitle: 'Twoje gwiazdki',
  startMission: 'START MISJI 🚀',
  startBoss: '⚔️ WALKA Z BOSSEM',
  normalMission: 'albo zwykła misja',
  fuel: 'Paliwo do walki z Bossem',
  bossReady: 'Bak pełny! Kosmiczny Bałagan czeka na ciebie!',
  timeLeft: 'Zostało dziś: {m} min',
  allDone: 'Uratowałaś całą galaktykę! 🌌 Ćwicz dalej – zadania same dobierają się do ciebie.',
  myCreatures: 'Twoje stworki',
  noCreatures: 'Pokonaj Bossa, żeby uratować pierwszego stworka!',
  profileLink: '✏️ Mój profil',
  mixedGalaxy: 'Mieszana Galaktyka',
  // Name shown when a galaxy has no active planet left.
  galaxyName: { mul: 'Mieszana Galaktyka', sub: 'Galaktyka Odejmowania' },
  // Galaxy switcher on the home screen
  trackLabel: { mul: '✖️ Mnożenie', sub: '➖ Odejmowanie' },
  trackNotToday: 'Dziś jeszcze nie odwiedzona!',

  planets: {
    p1: 'Planeta Jedynek i Dziesiątek',
    p2: 'Planeta Dwójek',
    p3: 'Planeta Piątek',
    p4: 'Planeta Trójek',
    p5: 'Planeta Czwórek',
    p6: 'Planeta Dziewiątek',
    p7: 'Planeta Szóstek',
    p8: 'Planeta Siódemek',
    p9: 'Planeta Ósemek',
    p10: 'Mieszana Galaktyka',
    s1: 'Planeta Do Dziesięciu',
    s2: 'Planeta Do Dwudziestu',
    s3: 'Planeta Przez Dziesiątkę',
    s4: 'Planeta Pełnych Dziesiątek',
    s5: 'Planeta Jedności',
    s6: 'Planeta Rozmieniania',
    s7: 'Planeta Dwóch Cyfr',
    s8: 'Planeta Wielkiego Rozmieniania',
    s9: 'Mieszana Galaktyka Odejmowania'
  },
  planetShort: {
    p1: '×1 ×10', p2: '×2', p3: '×5', p4: '×3', p5: '×4', p6: '×9', p7: '×6', p8: '×7', p9: '×8', p10: 'Mix',
    s1: 'do 10', s2: 'do 20', s3: 'przez 10', s4: '90−40', s5: '47−5', s6: '52−7', s7: '85−23', s8: '62−37', s9: 'Mix'
  },
  creatures: {
    kot: 'Kot Kosmita', 'kot-2': 'Kot Kosmita Miętowy', 'kot-3': 'Złoty Kot Kosmita',
    jednorozec: 'Jednorożec-Smok', 'jednorozec-2': 'Różowy Jednorożec-Smok', 'jednorozec-3': 'Złoty Jednorożec-Smok',
    lis: 'Lis Świetlik', 'lis-2': 'Niebieski Lis Świetlik', 'lis-3': 'Złoty Lis Świetlik',
    osmiornica: 'Ośmiornica Gwiazdka', 'osmiornica-2': 'Fioletowa Ośmiornica', 'osmiornica-3': 'Złota Ośmiornica',
    zolw: 'Żółw Rakietowy', 'zolw-2': 'Czerwony Żółw Rakietowy', 'zolw-3': 'Złoty Żółw Rakietowy',
    sowa: 'Sowa Nocka', 'sowa-2': 'Sowa Śnieżna', 'sowa-3': 'Złota Sowa',
    pingwin: 'Pingwin Kosmonauta', 'pingwin-2': 'Różowy Pingwin', 'pingwin-3': 'Złoty Pingwin',
    smok: 'Smoczek Ognik', 'smok-2': 'Smoczek Lodowy', 'smok-3': 'Złoty Smoczek',
    meduza: 'Meduza Tęczowa', 'meduza-2': 'Meduza Morska', 'meduza-3': 'Złota Meduza',
    feniks: 'Feniks Galaktyczny', 'feniks-2': 'Feniks Lodowy', 'feniks-3': 'Złoty Feniks',
    krab: 'Krab Kometa', 'krab-2': 'Fioletowy Krab Kometa', 'krab-3': 'Złoty Krab Kometa',
    foka: 'Foka Śnieżynka', 'foka-2': 'Różowa Foka Śnieżynka', 'foka-3': 'Złota Foka',
    wieloryb: 'Wieloryb Gwiezdny', 'wieloryb-2': 'Zielony Wieloryb Gwiezdny', 'wieloryb-3': 'Złoty Wieloryb',
    rozgwiazda: 'Rozgwiazda Gwiazdeczka', 'rozgwiazda-2': 'Błękitna Rozgwiazda', 'rozgwiazda-3': 'Złota Rozgwiazda',
    konik: 'Konik Morski Kosmik', 'konik-2': 'Fioletowy Konik Morski', 'konik-3': 'Złoty Konik Morski',
    rybka: 'Rybka Iskierka', 'rybka-2': 'Turkusowa Rybka', 'rybka-3': 'Złota Rybka',
    delfin: 'Delfin Skoczek', 'delfin-2': 'Różowy Delfin', 'delfin-3': 'Złoty Delfin',
    mors: 'Mors Wąsacz', 'mors-2': 'Srebrny Mors', 'mors-3': 'Złoty Mors',
    narwal: 'Narwal Galaktyczny', 'narwal-2': 'Fioletowy Narwal', 'narwal-3': 'Złoty Narwal'
  },
  decor: {
    kwiatek: 'Kosmiczny kwiatek', flaga: 'Flaga', krysztal: 'Kryształy', grzybek: 'Świecący grzybek',
    lampa: 'Gwiezdna lampa', drzewko: 'Kosmiczne drzewko', domek: 'Domek dla stworka', teleskop: 'Teleskop',
    zjezdzalnia: 'Zjeżdżalnia', fontanna: 'Fontanna', tecza: 'Tęcza', zamek: 'Zamek'
  },

  // Home tiles
  baseTile: 'Moja baza',
  baseTileSub: 'Buduj i dekoruj',
  albumTile: 'Album',
  nestTile: 'Gniazdo',
  nestEmpty: 'Puste. Jajka są w skrzyni albo w sklepie.',
  nestWaiting: 'Wykluje się za {n}',
  nestReady: 'Gotowe! Kliknij, żeby wykluć 🐣',
  playDays: function (n) { return n + ' ' + App.plural(n, 'dzień gry', 'dni gry', 'dni gry'); },

  // Album
  albumTitle: '📖 Album stworków',
  albumCount: 'Zebrane: {c} / {n}',
  albumLegend: '🏆 uratowany od Bossa · 🥚 z jajka · ✨ rzadki',
  unknown: '???',

  // Eggs
  hatchTitle: 'Jajko się wykluwa! 🥚',
  hatchBtn: 'Wykluj! 🐣',
  hatchNew: 'Nowy stworek w albumie!',
  hatchRare: '✨ RZADKI! ✨',
  hatchStars: 'W jajku były gwiazdki! Masz już wszystkie stworki z odwiedzonych planet. +{n} ⭐',
  chestEgg: 'I jeszcze jajko! 🥚 Trafiło do gniazda.',
  chestDecor: 'I prezent do bazy: {item}! 🎁',
  inBase: 'Zamieszka w twojej bazie 🏠',

  // Base
  baseTitle: 'Moja baza',
  tabMine: '🎒 Moje rzeczy',
  tabShop: '🛒 Sklep',
  baseHintPick: 'Wybierz coś z plecaka, a potem kliknij puste pole. Kliknij rzecz w bazie, żeby ją schować.',
  baseHintPlace: 'Kliknij puste pole, żeby postawić: {name}',
  cellTaken: 'To miejsce jest zajęte 🙂',
  trayEmpty: 'Plecak jest pusty. Kup coś w sklepie albo uratuj stworka!',
  buy: 'Kup',
  missing: 'Brakuje {n} ⭐',
  bought: 'Kupione: {name}! Jest w plecaku 🎒',
  eggName: 'Jajko niespodzianka',
  nestBusy: 'Gniazdo zajęte',
  eggBought: 'Jajko jest w gnieździe! 🥚',
  album: '📖 Album',


  // Mission
  check: 'Sprawdź',
  questionN: 'Zadanie {i} z {n}',
  bossTitle: 'Boss: Kosmiczny Bałagan',
  bossGoal: 'Potrzebujesz {need} dobrych odpowiedzi z {n}',
  bossCount: '✅ {c} / {need}',
  praise: ['Brawo!', 'Super!', 'Świetnie!', 'Ekstra!', 'Rewelacja!', 'Jesteś mistrzynią!', 'Doskonale!', 'Tak trzymaj!', 'Wow!', 'Bomba!'],
  fast: 'Błyskawica! ⚡',
  nowYouKnow: 'Teraz już wiesz! 💡',
  almost: 'Prawie! Zobacz:',
  backLater: 'To zadanie jeszcze do ciebie wróci 😉',
  pressEnter: 'Naciśnij Enter',

  rows: function (a, b) {
    return a + ' ' + App.plural(a, 'rząd', 'rzędy', 'rzędów') + ' po ' + b;
  },

  // Subtraction hint lines (level comes from App.ops.sub.levelOf)
  subTake: function (a, b, c, level) {
    if (level === 'borrow1' || level === 'borrow2') return 'Za mało jedności? Rozmień jedną dziesiątkę na 10 jedności (zielona ramka).';
    if (level === 'tens' || level === 'minus2') return 'Patyczek to dziesiątka, kropka to jedność. Skreśl ' + b + ' – zostaje ' + c;
    return 'Z ' + a + ' skreśl ' + b + ' – zostaje ' + c;
  },
  subCheck: 'Sprawdź dodawaniem: {c} + {b} = {a} ✅',
  subTip: function (a, b, level) {
    var T = App.T, c = a - b, u = a % 10, ub = b % 10, tb = b - ub;
    if (level === 'tens') return 'Licz dziesiątkami: ' + (a / 10) + ' − ' + (b / 10) + ' = ' + (c / 10) + ', więc ' + a + ' − ' + b + ' = ' + c;
    if (level === 'minus2') {
      if (!ub) return 'Odejmij dziesiątki: ' + Math.floor(a / 10) + ' − ' + (b / 10) + ' = ' + Math.floor(c / 10) + ', więc ' + a + ' − ' + b + ' = ' + c;
      return 'Najpierw dziesiątki: ' + a + ' − ' + tb + ' = ' + (a - tb) + ', potem jedności: ' + (a - tb) + ' − ' + ub + ' = ' + c;
    }
    if (level === 'borrow2') return 'Najpierw dziesiątki: ' + a + ' − ' + tb + ' = ' + (a - tb) + '. Potem ' + T.downToTen(a - tb, ub);
    if (a > 10 && b < 10 && u < b) { var t = T.downToTen(a, b); return t.charAt(0).toUpperCase() + t.slice(1); }
    if (a > 10 && b === 10) return 'Odjąć 10 to zabrać całą dziesiątkę: ' + a + ' − 10 = ' + c;
    if (a > 10) return 'Odejmij jedności: ' + u + ' − ' + b + ' = ' + (u - b) + ', więc ' + a + ' − ' + b + ' = ' + c;
    if (b === 1) return 'Odjąć 1 to cofnąć się o jeden: ' + a + ' → ' + c;
    if (c === b) return 'To połowa: ' + b + ' + ' + b + ' = ' + a;
    return 'Licz w górę od ' + b + ' do ' + a + ' – to ' + c + ' ' + App.plural(c, 'krok', 'kroki', 'kroków');
  },
  // a − b with b < 10 that crosses a ten: "52 − 2 = 50, a potem 50 − 5 = 45".
  downToTen: function (a, b) {
    var u = a % 10, full = a - u, c = a - b;
    if (!u) return 'rozmień dziesiątkę: ' + a + ' = ' + (a - 10) + ' + 10, a 10 − ' + b + ' = ' + (10 - b) + ', więc ' + a + ' − ' + b + ' = ' + c;
    return 'odejmij najpierw do ' + full + ': ' + a + ' − ' + u + ' = ' + full + ', a potem ' + full + ' − ' + (b - u) + ' = ' + c;
  },

  tip: function (a, b) {
    var lo = Math.min(a, b), hi = Math.max(a, b), p = a * b, o;
    if (lo === 1) return 'Razy 1 to zawsze ta sama liczba: ' + a + ' × ' + b + ' = ' + p;
    if (hi === 10) return 'Razy 10? Dopisz zero na końcu: ' + lo + ' → ' + (lo * 10);
    if (lo === 2) return 'Razy 2 to podwajanie: ' + hi + ' + ' + hi + ' = ' + p;
    if (lo === 5 || hi === 5) {
      o = lo === 5 ? hi : lo;
      return 'Razy 5 to połowa z razy 10: ' + o + ' × 10 = ' + (o * 10) + ', a połowa to ' + p;
    }
    if (lo === 9 || hi === 9) {
      o = hi === 9 ? lo : hi;
      return 'Razy 9: ' + o + ' × 10 − ' + o + ' = ' + (o * 10) + ' − ' + o + ' = ' + p;
    }
    if (lo <= 4) {
      var parts = [];
      for (var i = 0; i < lo; i++) parts.push(hi);
      return 'Dodaj ' + lo + ' razy: ' + parts.join(' + ') + ' = ' + p;
    }
    return 'Rozbij na części: ' + lo + ' × 5 + ' + lo + ' × ' + (hi - 5) + ' = ' + (lo * 5) + ' + ' + (lo * (hi - 5)) + ' = ' + p;
  },

  // Summary
  missionDone: 'Misja zakończona! 🎉',
  missionEndedEarly: 'Rakieta jest już zmęczona – na dziś koniec misji.',
  bossWin: 'Boss pokonany! 🏆',
  bossLose: 'Bałagan był tym razem sprytny!',
  bossLoseText: 'Udało ci się {c} z {n}, a potrzeba {need}. Bak jest wciąż pełny – spróbuj jeszcze raz, dasz radę! 💪',
  bossPostponed: 'Boss poczeka do jutra!',
  rescued: 'Uratowałaś: {creature}!',
  newPlanet: 'Nowa planeta odblokowana: {planet} 🪐',
  allPlanetsDone: 'Uratowałaś wszystkie planety w galaktyce! 🌌',
  summaryCorrect: 'Dobre odpowiedzi',
  summaryStars: 'Gwiazdki',
  summaryRun: 'Najdłuższa seria',
  newRecord: 'Nowy rekord! 🏆',
  streakNow: 'Grasz już {n} z rzędu! 🔥',
  streakFirst: 'Pierwszy dzień serii! 🔥 Wróć jutro, żeby ją przedłużyć.',
  freezeUsed: 'Lodowa tarcza 🧊 ochroniła twoją serię!',

  // Chest
  chestTitle: 'Codzienna skrzynia! 🎁',
  chestHint: 'Kliknij skrzynię albo naciśnij Enter',
  chestOpen: 'Otwórz skrzynię',
  chestGot: 'Znalazłaś {n} {word}! ⭐',

  // Sleep / time limit
  sleepTitle: 'Rakieta śpi 🌙',
  sleepText: 'Świetna robota, {name}! Na dziś wystarczy. Wróć jutro – stworki będą czekać!',
  warn: 'Jeszcze chwilka – rakieta niedługo ląduje na noc 🌙',

  // Mission modes
  modes: {
    classic: { icon: '🚀', name: 'Klasyczna misja', howTo: '' },
    meteor: { icon: '☄️', name: 'Deszcz meteorów', howTo: 'Meteory spadają z nieba! Wpisz wynik i naciśnij Enter, żeby rozbić meteor, zanim wyląduje. Pomyłka? Spróbuj jeszcze raz – meteor spada powoli.' },
    feed: { icon: '🍪', name: 'Nakarm stworki', howTo: 'Stworek chce konkretną liczbę. Wybierz WSZYSTKIE karty, które dają tę liczbę (klikając albo klawiszami 1–6), i naciśnij Enter.' },
    missing: { icon: '❓', name: 'Brakująca liczba', howTo: 'Tym razem brakuje jednej liczby w zadaniu, np. 4 × ? = 28 albo 13 − ? = 5. Wpisz, jaka liczba się schowała!' },
    // Not a mode: the intro card shown on the first visit to the subtraction galaxy.
    sub: { icon: '➖', name: 'Galaktyka Odejmowania', howTo: 'Nowa galaktyka! Tu tankujesz rakietę odejmowaniem, np. 9 − 4. Szybka dobra odpowiedź daje podwójne paliwo ⛽⛽ – planety, które już znasz, przelecisz błyskawicznie!' }
  },
  newGame: 'Nowa gra! 🎉',
  nextMode: 'Następna misja: {icon} {name}',
  tryAgain: 'Spróbuj jeszcze raz! 💪',
  blasted: 'Bum! Meteor rozbity! 💥',
  landed: 'Meteor wylądował! Zobacz:',
  roundN: 'Runda {i} z {n}',
  wants: 'Chcę {n}!',
  feedBtn: 'Nakarm! 😋',
  pickCards: 'Wybierz karty, które dają {n}',
  pickSome: 'Wybierz przynajmniej jedną kartę 🙂',
  feedOk: 'Mniam! Wszystkie dobrze! 😋',
  feedPart: 'Prawie! Zielone karty dają {n}.',
  feedMissed: 'tej brakowało',

  // Real-world rewards (child side)
  giftSurprise: 'Niespodzianka',
  giftStreak: function (n) { return 'Jeszcze ' + n + ' ' + App.plural(n, 'dzień', 'dni', 'dni') + ' z rzędu do nagrody!'; },
  giftDays: function (n) { return 'Jeszcze ' + n + ' ' + App.plural(n, 'dzień gry', 'dni gry', 'dni gry') + ' do nagrody!'; },
  giftCreatures: function (n) { return 'Zbierz jeszcze ' + n + ' ' + App.plural(n, 'stworka', 'stworki', 'stworków') + ' do nagrody!'; },
  giftPlanet: 'Uratuj: {planet}, a dostaniesz nagrodę!',
  rewardsTile: 'Nagrody',
  rewardsTileSub: '{n} do odebrania',
  rewardsTileNone: 'Zobacz, co czeka',
  myRewardsTitle: '🎁 Moje nagrody',
  voucherTitle: 'Masz nagrodę! 🎁',
  voucherFor: 'Bon na:',
  voucherShow: 'Pokaż ten bon rodzicowi!',
  rewardWaiting: 'Czeka na odbiór 🎁',
  rewardGiven: 'Odebrane ✅',
  rewardsEarnedH: 'Zdobyte bony',
  rewardsNextH: 'Następne niespodzianki',
  rewardsEmpty: 'Rodzic jeszcze nie przygotował nagród.',
  milestoneTitle: '🏅 {n}!',
  milestoneText: 'Jesteś niesamowita! Poproś rodzica o wydruk dyplomu 📜',

  // Parent gate & panel
  parentLink: '🔒 Dla rodzica',
  gateTitle: '🔒 Strefa rodzica',
  gateQ: 'Ile to {a} × {b}?',
  gateWrong: 'Niestety nie. Spróbuj jeszcze raz.',
  gateOk: 'Wejdź',
  close: '✖ Zamknij',
  tabProgress: '📊 Postępy',
  tabRewards: '🎁 Nagrody',
  tabSettings: '⚙️ Ustawienia',
  tabCerts: '📜 Dyplomy',
  tabBackup: '💾 Kopia',
  stMastered: 'Opanowane fakty',
  stDays: 'Dni gry',
  stBest: 'Najdłuższa seria',
  stStars: 'Gwiazdki',
  stCreatures: 'Stworki',
  stToday: 'Czas gry dziś',
  heatTitle: 'Tabliczka mnożenia – co już umie',
  progTrack: { mul: '✖️ Mnożenie', sub: '➖ Odejmowanie' },
  heatSub10: 'Odejmowanie do 10 – co już umie',
  heatSub20: 'Odejmowanie od 11 do 19 – co już umie',
  heatSub20Note: 'Pogrubiona ramka = przekraczanie dziesiątki (np. 13 − 5). Na tych faktach opierają się też zadania dwucyfrowe, np. 52 − 7 ćwiczy 12 − 7.',
  stMasteredSub: 'Opanowane fakty do 20',
  skillsTitle: 'Umiejętności – skuteczność',
  skillsNone: 'jeszcze nie ćwiczone',
  skillLine: '{ok} z {n} dobrze',
  levelNames: {
    within10: 'Do 10 (9 − 4)', within20: 'Do 20 bez przekraczania (17 − 5)', cross10: 'Przez dziesiątkę (13 − 5)',
    tens: 'Pełne dziesiątki (90 − 40)', minus1: 'Dwucyfrowa − jednocyfrowa (47 − 5)', borrow1: '…z rozmienianiem (52 − 7)',
    minus2: 'Dwucyfrowa − dwucyfrowa (85 − 23)', borrow2: '…z rozmienianiem (62 − 37)'
  },
  heatLegend: ['jeszcze nie było', 'do ćwiczenia', 'coraz lepiej', 'opanowane'],
  mistakesTitle: 'Najczęstsze błędy',
  mistakesNone: 'Brak błędów – świetnie!',
  mistakeLine: '{q} = {p} — błędy: {w} z {n} {tries}',
  tries: function (n) { return App.plural(n, 'próby', 'prób', 'prób'); },
  historyTitle: 'Ostatnie 14 dni (minuty gry)',
  noHistory: 'Brak danych.',
  // rewards form
  rwNew: 'Dodaj nagrodę',
  rwName: 'Nazwa nagrody',
  rwNamePh: 'np. Lody, Kino, Nowa książka',
  rwEmoji: 'Ikonka',
  rwType: 'Za co?',
  rwTypes: { streak: 'Seria dni z rzędu', days: 'Dni gry (łącznie)', planet: 'Uratowanie planety', creatures: 'Stworki w albumie' },
  rwTarget: 'Cel',
  rwShowName: 'Pokaż nazwę dziecku (inaczej „Niespodzianka”)',
  rwAdd: 'Dodaj',
  rwList: 'Nagrody',
  rwNone: 'Brak nagród. Dodaj pierwszą powyżej.',
  rwStatus: { pending: 'W drodze', earned: 'Zdobyta – do wręczenia', given: 'Wręczona' },
  rwGive: 'Oznacz jako wręczoną',
  rwDelete: 'Usuń',
  rwNameMissing: 'Wpisz nazwę nagrody.',
  rwCond: {
    streak: '{n} dni z rzędu', days: '{n} dni gry', creatures: '{n} stworków w albumie', planet: 'uratowanie: {planet}'
  },
  // settings
  setLimit: 'Dzienny limit gry',
  setExtra: 'Dodatkowy czas dzisiaj',
  setExtraNow: 'Dziś: {m} min limitu, wykorzystano {u} min',
  setQuestions: 'Liczba zadań w misji',
  setModes: 'Rodzaje misji',
  setModesAll: 'Wszystkie (na zmianę)',
  setModesClassic: 'Tylko klasyczne',
  setTracks: 'Co ćwiczymy',
  setTracksBoth: 'Mnożenie i odejmowanie (dziecko wybiera)',
  setTracksMul: 'Tylko mnożenie',
  setTracksSub: 'Tylko odejmowanie',
  setSubStart: 'Odejmowanie: zacznij od planety',
  setSubStartNote: 'Wcześniejsze planety odejmowania zostaną zaliczone (bez stworków). Można tylko przesuwać do przodu.',
  setSubStartDone: 'Wszystkie planety odejmowania są już uratowane.',
  setSpeech: 'Czytaj zadania na głos',
  setSpeechTest: 'Wypróbuj',
  setSpeechNote: 'Wymaga polskiego głosu w systemie lub przeglądarce.',
  setSpeechNone: 'Nie znaleziono polskiego głosu – czytanie może nie działać poprawnie.',
  setSound: 'Dźwięki',
  minutes: '{n} min',
  saved: 'Zapisano ✔',
  // certificates
  certsNone: 'Dyplomy pojawią się po 7 dniach gry i po uratowaniu pierwszej planety.',
  certTitle: 'DYPLOM',
  certFor: 'dla',
  certDays: 'za {n} dni nauki liczenia w Kosmicznym Zoo',
  certPlanet: 'za opanowanie tabliczki {t} i uratowanie planety „{planet}”',
  certSubPlanet: 'za ćwiczenie odejmowania ({t}) i uratowanie planety „{planet}”',
  certSubGalaxy: 'za uratowanie całej Galaktyki Odejmowania i odejmowanie do 100!',
  certGalaxy: 'za uratowanie całej galaktyki i opanowanie tabliczki mnożenia!',
  certPrint: '🖨️ Drukuj',
  certSign: 'Kosmiczne Zoo',
  // backup
  bkExport: 'Pobierz kopię postępów (plik .json)',
  bkExportNote: 'Zapisz plik w bezpiecznym miejscu. Przyda się przy zmianie komputera lub przeglądarki.',
  bkImport: 'Wczytaj kopię z pliku',
  bkImportConfirm: 'Wczytaj (zastąpi obecne postępy)',
  bkImportBad: 'To nie jest plik z kopią Kosmicznego Zoo.',
  bkImportReady: 'Kopia gracza „{name}” gotowa do wczytania.',
  bkReset: 'Zacznij grę od nowa (usuń wszystkie postępy)',
  bkResetConfirm: 'Na pewno? Kliknij jeszcze raz, aby usunąć wszystko.',

  // Misc
  soundOn: 'Wyłącz dźwięk',
  soundOff: 'Włącz dźwięk',
  storageWarn: 'Uwaga: ta przeglądarka nie zapisuje postępów. Otwórz grę w Chrome albo Edge.',

  days: function (n) { return n + ' ' + App.plural(n, 'dzień', 'dni', 'dni'); },
  starsWord: function (n) { return App.plural(n, 'gwiazdkę', 'gwiazdki', 'gwiazdek'); }
};
