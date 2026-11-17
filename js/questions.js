// Planets, fact mastery tracking and adaptive question picking.
window.App = window.App || {};

App.PLANETS = [
  { id: 'p1', tables: [1, 10], color: '#ffd166', ring: false, creature: 'kot' },
  { id: 'p2', tables: [2], color: '#06d6a0', ring: true, creature: 'jednorozec' },
  { id: 'p3', tables: [5], color: '#ef476f', ring: false, creature: 'lis' },
  { id: 'p4', tables: [3], color: '#4cc9f0', ring: true, creature: 'osmiornica' },
  { id: 'p5', tables: [4], color: '#f4a261', ring: false, creature: 'zolw' },
  { id: 'p6', tables: [9], color: '#b388eb', ring: true, creature: 'sowa' },
  { id: 'p7', tables: [6], color: '#90e0ef', ring: false, creature: 'pingwin' },
  { id: 'p8', tables: [7], color: '#e76f51', ring: true, creature: 'smok' },
  { id: 'p9', tables: [8], color: '#ff99c8', ring: false, creature: 'meduza' },
  { id: 'p10', tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], color: '#c77dff', ring: true, creature: 'feniks', mixed: true }
];
App.BOSS_FUEL = 20;  // correct answers on a planet needed before the Boss
App.BOSS_LEN = 15;   // questions in a Boss fight
App.BOSS_PASS = 12;  // correct answers needed to win
App.FAST_MS = 5000;  // answer faster than this = "Błyskawica" bonus
App.MASTERED = 3;    // mastery level (0-5) at which a fact counts as known

App.q = (function () {
  function key(a, b) { return Math.min(a, b) + 'x' + Math.max(a, b); }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function planetFacts(p) {
    var seen = {}, out = [];
    p.tables.forEach(function (t) {
      for (var m = 1; m <= 10; m++) {
        var k = key(t, m);
        if (!seen[k]) { seen[k] = 1; out.push({ a: t, b: m }); }
      }
    });
    return out;
  }

  function activePlanet() {
    var st = App.state.data;
    return App.PLANETS.filter(function (p) { return st.planets[p.id].status === 'active'; })[0] || null;
  }

  function completedPlanets() {
    var st = App.state.data;
    return App.PLANETS.filter(function (p) { return st.planets[p.id].status === 'completed'; });
  }

  function stat(f) { return App.state.data.facts[key(f.a, f.b)] || null; }

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
      if (last && key(last.a, last.b) === key(f.a, f.b) && avail.length) { avail.push(f); continue; }
      out.push(f);
    }
    return out;
  }

  // Show "7 × 3" or "3 × 7" at random so both orders are practised.
  function orient(f) { return Math.random() < 0.5 ? { a: f.a, b: f.b } : { a: f.b, b: f.a }; }

  function noAdjacentRepeats(list) {
    for (var i = 1; i < list.length; i++) {
      if (key(list[i].a, list[i].b) === key(list[i - 1].a, list[i - 1].b)) {
        for (var j = i + 1; j < list.length; j++) {
          if (key(list[j].a, list[j].b) !== key(list[i].a, list[i].b)) { var t = list[i]; list[i] = list[j]; list[j] = t; break; }
        }
      }
    }
    return list;
  }

  // A mission mixes: ~60% current planet, ~25% weak facts from earlier
  // planets, ~15% known facts as an easy review.
  function buildMission(kind) {
    var st = App.state.data, p = activePlanet();
    if (kind === 'boss' && p) return pick(planetFacts(p), App.BOSS_LEN).map(orient);

    var n = st.settings.sessionLength;
    var used = {}, cur = [], other = [];
    if (p) cur = planetFacts(p);
    cur.forEach(function (f) { used[key(f.a, f.b)] = 1; });
    completedPlanets().forEach(function (dp) {
      planetFacts(dp).forEach(function (f) {
        var k = key(f.a, f.b);
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
  function record(a, b, correct, ms) {
    var facts = App.state.data.facts, k = key(a, b), t = App.state.today();
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

  function isPlanetFact(p, a, b) { return p.tables.indexOf(a) >= 0 || p.tables.indexOf(b) >= 0; }

  // A correct answer from the current planet's table adds fuel for the Boss.
  function addFuel(p, a, b) {
    if (!p || !isPlanetFact(p, a, b)) return;
    var ps = App.state.data.planets[p.id];
    ps.fuel = Math.min(App.BOSS_FUEL, ps.fuel + 1);
  }

  return {
    key: key, shuffle: shuffle, planetFacts: planetFacts, activePlanet: activePlanet,
    completedPlanets: completedPlanets, pick: pick, weight: weight, buildMission: buildMission,
    record: record, isPlanetFact: isPlanetFact, addFuel: addFuel
  };
})();
