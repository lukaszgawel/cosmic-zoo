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
    p10: 'Mieszana Galaktyka'
  },
  planetShort: { p1: '×1 ×10', p2: '×2', p3: '×5', p4: '×3', p5: '×4', p6: '×9', p7: '×6', p8: '×7', p9: '×8', p10: 'Mix' },
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
    feniks: 'Feniks Galaktyczny', 'feniks-2': 'Feniks Lodowy', 'feniks-3': 'Złoty Feniks'
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
    missing: { icon: '❓', name: 'Brakująca liczba', howTo: 'Tym razem brakuje jednej liczby w mnożeniu, np. 4 × ? = 28. Wpisz, jaka liczba się schowała!' }
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
  heatLegend: ['jeszcze nie było', 'do ćwiczenia', 'coraz lepiej', 'opanowane'],
  mistakesTitle: 'Najczęstsze błędy',
  mistakesNone: 'Brak błędów – świetnie!',
  mistakeLine: '{a} × {b} = {p} — błędy: {w} z {n} {tries}',
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
  certDays: 'za {n} dni nauki tabliczki mnożenia',
  certPlanet: 'za opanowanie tabliczki {t} i uratowanie planety „{planet}”',
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
