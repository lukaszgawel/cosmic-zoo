// Planets, fact mastery tracking and adaptive question picking.
window.App = window.App || {};

App.PLANETS = [
  { id: 'p1', track: 'mul', tables: [1, 10], color: '#ffd166', ring: false, creature: 'kot' },
  { id: 'p2', track: 'mul', tables: [2], color: '#06d6a0', ring: true, creature: 'jednorozec' },
  { id: 'p3', track: 'mul', tables: [5], color: '#ef476f', ring: false, creature: 'lis' },
  { id: 'p4', track: 'mul', tables: [3], color: '#4cc9f0', ring: true, creature: 'osmiornica' },
  { id: 'p5', track: 'mul', tables: [4], color: '#f4a261', ring: false, creature: 'zolw' },
  { id: 'p6', track: 'mul', tables: [9], color: '#b388eb', ring: true, creature: 'sowa' },
  { id: 'p7', track: 'mul', tables: [6], color: '#90e0ef', ring: false, creature: 'pingwin' },
  { id: 'p8', track: 'mul', tables: [7], color: '#e76f51', ring: true, creature: 'smok' },
  { id: 'p9', track: 'mul', tables: [8], color: '#ff99c8', ring: false, creature: 'meduza' },
  { id: 'p10', track: 'mul', tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], color: '#c77dff', ring: true, creature: 'feniks', mixed: true },
  // Subtraction galaxy (levels are defined in js/ops.js).
  { id: 's1', track: 'sub', levels: ['within10'], color: '#80ffdb', ring: false, creature: 'krab' },
  { id: 's2', track: 'sub', levels: ['within20'], color: '#48bfe3', ring: true, creature: 'foka' },
  { id: 's3', track: 'sub', levels: ['cross10'], color: '#5390d9', ring: false, creature: 'wieloryb' },
  { id: 's4', track: 'sub', levels: ['tens'], color: '#ffafcc', ring: true, creature: 'rozgwiazda' },
  { id: 's5', track: 'sub', levels: ['minus1'], color: '#f9c74f', ring: false, creature: 'konik' },
  { id: 's6', track: 'sub', levels: ['borrow1'], color: '#f8961e', ring: true, creature: 'rybka' },
  { id: 's7', track: 'sub', levels: ['minus2'], color: '#43aa8b', ring: false, creature: 'delfin' },
  { id: 's8', track: 'sub', levels: ['borrow2'], color: '#7209b7', ring: true, creature: 'mors' },
  { id: 's9', track: 'sub', levels: ['within10', 'within20', 'cross10', 'tens', 'minus1', 'borrow1', 'minus2', 'borrow2'],
    color: '#4cc9f0', ring: true, creature: 'narwal', mixed: true }
];
App.TRACKS = ['mul', 'sub'];
App.BOSS_FUEL = 20;  // correct answers on a planet needed before the Boss
App.BOSS_LEN = 15;   // questions in a Boss fight
App.BOSS_PASS = 12;  // correct answers needed to win
App.FAST_MS = 5000;  // answer faster than this = "Błyskawica" bonus
App.MASTERED = 3;    // mastery level (0-5) at which a fact counts as known

App.q = (function () {
  // Multiplication key, kept for the parent panel's 10×10 heat map.
  function key(a, b) { return App.ops.mul.key(a, b); }
  // Identity of a problem, and the key its practice is recorded under.
  function fkey(f) { return App.opOf(f).keyOf(f); }
  function skey(f) { return App.opOf(f).statKey(f); }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function planetFacts(p) { return App.ops[p.track].planetFacts(p); }

  // Galaxy being played: the parent can limit practice to one operation,
  // otherwise it is the one she picked on the home screen.
  function track() {
    var st = App.state.data, only = st.settings.tracks;
    if (only === 'mul' || only === 'sub') return only;
    return App.TRACKS.indexOf(st.track) >= 0 ? st.track : 'mul';
  }

  function planetsOf(t) {
    return App.PLANETS.filter(function (p) { return p.track === (t || track()); });
  }

  function activePlanet(t) {
    var st = App.state.data;
    return planetsOf(t).filter(function (p) { return st.planets[p.id].status === 'active'; })[0] || null;
  }

  function completedPlanets(t) {
    var st = App.state.data;
    return planetsOf(t).filter(function (p) { return st.planets[p.id].status === 'completed'; });
  }

  function stat(f) { return App.state.data.facts[skey(f)] || null; }

  // Higher weight = more likely to be asked. New, weak, recently wrong
  // and long-unseen facts come up more; mastered facts less.
  function weight(f) {
    var s = stat(f);
    if (!s) return 6;
    var w = 1 + (5 - (s.mastery || 0)) * 1.2;
    if (s.lastWrong) w += 4;
    if (s.lastSeen && App.state.daysBetween(s.lastSeen, App.state.today()) >= 3) w += 2;
    return w;
  }

  // Weighted pick of n facts, without repeats unless the pool is too small.
  function pick(pool, n) {
    var out = [], avail = pool.slice(), guard = 0;
    if (!pool.length) return out;
    while (out.length < n && guard++ < 1000) {
      if (!avail.length) avail = pool.slice();
      var total = avail.reduce(function (s, f) { return s + weight(f); }, 0);
      var r = Math.random() * total, i = 0;
      for (; i < avail.length - 1; i++) { r -= weight(avail[i]); if (r < 0) break; }
      var f = avail.splice(i, 1)[0];
      var last = out[out.length - 1];
      if (last && fkey(last) === fkey(f) && avail.length) { avail.push(f); continue; }
      out.push(f);
    }
    return out;
  }

  // Final form of a fact as asked (e.g. "7 × 3" or "3 × 7").
  function orient(f) { return App.opOf(f).orient(f); }

  function noAdjacentRepeats(list) {
    for (var i = 1; i < list.length; i++) {
      if (fkey(list[i]) === fkey(list[i - 1])) {
        for (var j = i + 1; j < list.length; j++) {
          if (fkey(list[j]) !== fkey(list[i])) { var t = list[i]; list[i] = list[j]; list[j] = t; break; }
        }
      }
    }
    return list;
  }

  // A mission mixes: ~60% current planet, ~25% weak facts from earlier
  // planets, ~15% known facts as an easy review.
  function buildMission(kind, t) {
    t = t || track();
    var st = App.state.data, p = activePlanet(t);
    if (kind === 'boss' && p) return pick(planetFacts(p), App.BOSS_LEN).map(orient);

    var n = st.settings.sessionLength;
    var used = {}, cur = [], other = [];
    if (p) cur = planetFacts(p);
    cur.forEach(function (f) { used[fkey(f)] = 1; });
    completedPlanets(t).forEach(function (dp) {
      planetFacts(dp).forEach(function (f) {
        var k = fkey(f);
        if (!used[k]) { used[k] = 1; other.push(f); }
      });
    });

    if (!p) return pick(other, n).map(orient);
    if (!other.length) return pick(cur, n).map(orient);

    var weak = other.filter(function (f) { var s = stat(f); return s && (s.lastWrong || (s.mastery || 0) <= 1); });
    var known = other.filter(function (f) { return weak.indexOf(f) < 0; });
    var nWeak = Math.min(weak.length, Math.round(n * 0.25));
    var nRev = Math.min(known.length, n - Math.round(n * 0.6) - nWeak);
    var nCur = n - nWeak - nRev;
    var list = pick(cur, nCur).concat(pick(weak, nWeak), pick(known, nRev));
    return noAdjacentRepeats(shuffle(list)).map(orient);
  }

  // Mastery 0-5 goes up at most once per day per fact (so "known" means
  // answered well on several different days), and drops after a mistake.
  function record(q, correct, ms) {
    var st = App.state.data, facts = st.facts, k = skey(q), t = App.state.today();
    // Per-skill accuracy (subtraction levels), shown in the parent panel.
    var op = App.opOf(q);
    if (op.levelOf) {
      var sk = st.skills[op.levelOf(q)] || (st.skills[op.levelOf(q)] = { attempts: 0, correct: 0 });
      sk.attempts++;
      if (correct) sk.correct++;
    }
    var s = facts[k] || (facts[k] = { attempts: 0, correct: 0, avgMs: 0, streak: 0, lastWrong: false, lastSeen: null, mastery: 0, lastUp: null });
    s.attempts++;
    if (correct) {
      s.correct++; s.streak++; s.lastWrong = false;
      s.avgMs = s.avgMs ? Math.round(s.avgMs * 0.7 + ms * 0.3) : ms;
      if (s.lastUp !== t && (ms < App.FAST_MS || (s.mastery || 0) < 2)) {
        s.mastery = Math.min(5, (s.mastery || 0) + 1);
        s.lastUp = t;
      }
    } else {
      s.streak = 0; s.lastWrong = true;
      s.mastery = Math.max(0, (s.mastery || 0) - 2);
    }
    s.lastSeen = t;
  }

  function isPlanetFact(p, q) { return App.opOf(q).id === p.track && App.ops[p.track].isPlanetFact(p, q); }

  // A correct answer from the current planet adds fuel for the Boss.
  // Subtraction: a fast answer gives double fuel, so planets she already
  // knows reach their Boss in about one mission.
  function addFuel(p, q, fast) {
    if (!p || !isPlanetFact(p, q)) return;
    var ps = App.state.data.planets[p.id];
    ps.fuel = Math.min(App.BOSS_FUEL, ps.fuel + (fast && p.track === 'sub' ? 2 : 1));
  }

  return {
    key: key, fkey: fkey, skey: skey, shuffle: shuffle, planetFacts: planetFacts, activePlanet: activePlanet,
    track: track, planetsOf: planetsOf,
    completedPlanets: completedPlanets, pick: pick, weight: weight, buildMission: buildMission,
    record: record, isPlanetFact: isPlanetFact, addFuel: addFuel
  };
})();
