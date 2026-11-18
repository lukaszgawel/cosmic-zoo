// Saved progress (localStorage), dates, and the daily streak.
window.App = window.App || {};

(function () {
  var KEY = 'kosmiczne-zoo-v1';

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function today(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function toUTC(s) { var p = s.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function daysBetween(a, b) { return Math.round((toUTC(b) - toUTC(a)) / 86400000); }
  // Monday of the week, used to give one streak "freeze" per week.
  function weekId(s) {
    var t = toUTC(s);
    var dow = (new Date(t).getUTCDay() + 6) % 7;
    return new Date(t - dow * 86400000).toISOString().slice(0, 10);
  }

  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
  function merge(def, obj) {
    var out = Object.assign({}, def, obj);
    Object.keys(def).forEach(function (k) {
      if (isObj(def[k]) && isObj(obj[k])) out[k] = merge(def[k], obj[k]);
    });
    return out;
  }

  function defaults() {
    var planets = {};
    // The first planet of each galaxy starts open.
    App.PLANETS.forEach(function (p) {
      var first = App.PLANETS.filter(function (x) { return x.track === p.track; })[0] === p;
      planets[p.id] = { status: first ? 'active' : 'locked', fuel: 0 };
    });
    return {
      version: 1,
      player: null, // { name, avatar, rocketName, rocketColor }
      stars: 0,
      streak: { current: 0, best: 0, lastPlayed: null, freezesLeft: 1, freezeWeek: null },
      playTime: { date: null, seconds: 0, extraMinutes: 0 },
      facts: {},
      skills: {},         // subtraction accuracy per skill level: { level: { attempts, correct } }
      planets: planets,
      creatures: [],      // creature ids: 'kot' (from Boss), 'kot-2' / 'kot-3' (from eggs)
      decorations: {},    // bought or found decorations: { itemId: count }
      base: [],           // placed things: { type: 'item' | 'creature', id, x, y }
      egg: null,          // { daysLeft, color } – hatches after N days of play
      eggsReceived: 0,
      lastChestDate: null,
      history: [],
      records: { bestRun: 0 },
      daysPlayed: 0,      // total days with at least one mission
      track: 'mul',       // galaxy picked on the home screen: 'mul' | 'sub'
      modeIdx: 0,         // rotation of mission types
      seenModes: {},      // mission types already introduced
      rewards: [],        // real-world rewards set by the parent
      milestones: [],     // { days, date } – 7, 14, 30, 50, 100 days of play
      // tracks: what to practise – 'both' (she picks), 'mul' or 'sub' only
      settings: { sound: true, speech: false, sessionLength: 10, dailyLimitMinutes: 15, modes: 'all', tracks: 'both' }
    };
  }

  function refreshFreeze(s, t) {
    var wk = weekId(t);
    if (s.freezeWeek !== wk) { s.freezeWeek = wk; s.freezesLeft = 1; }
  }

  App.state = {
    data: null,
    storageOk: true,
    today: today,
    daysBetween: daysBetween,
    weekId: weekId,
    defaults: defaults,

    load: function () {
      var raw = null, obj = null;
      try {
        localStorage.setItem('kz-test', '1');
        localStorage.removeItem('kz-test');
        raw = localStorage.getItem(KEY);
      } catch (e) { this.storageOk = false; }
      try { obj = raw ? JSON.parse(raw) : null; } catch (e) { obj = null; }
      this.data = obj ? merge(defaults(), obj) : defaults();
      this.migrate();
    },

    // Bring progress saved by an older version up to date.
    migrate: function () {
      var d = this.data;
      if (!d.daysPlayed && d.history.length) {
        var days = {};
        d.history.forEach(function (h) { days[h.date] = 1; });
        d.daysPlayed = Object.keys(days).length;
      }
      Object.keys(d.facts).forEach(function (k) {
        var s = d.facts[k];
        if (s.mastery === undefined) s.mastery = Math.min(App.MASTERED, s.streak || 0);
      });
      // New planets were added (new galaxy, or after the last planet of one):
      // in each galaxy with nothing active, open the first planet still locked
      // whose predecessor is completed.
      App.TRACKS.forEach(function (t) {
        var list = App.PLANETS.filter(function (p) { return p.track === t; });
        var hasActive = list.some(function (p) { return d.planets[p.id].status === 'active'; });
        if (hasActive) return;
        for (var i = 0; i < list.length; i++) {
          var p = list[i];
          if (d.planets[p.id].status === 'locked' && (i === 0 || d.planets[list[i - 1].id].status === 'completed')) {
            d.planets[p.id].status = 'active';
            break;
          }
        }
      });
    },

    // Replace all progress (import from a backup file).
    replace: function (obj) {
      this.data = merge(defaults(), obj);
      this.migrate();
      this.save();
    },

    // Delete all progress (reset from the parent panel).
    wipe: function () {
      try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
      this.data = defaults();
    },

    save: function () {
      try { localStorage.setItem(KEY, JSON.stringify(this.data)); this.storageOk = true; }
      catch (e) { this.storageOk = false; }
    },

    // Streak as it should be shown right now (0 if it was broken).
    displayStreak: function () {
      var s = this.data.streak, t = App.state.today();
      if (!s.lastPlayed) return 0;
      var gap = daysBetween(s.lastPlayed, t);
      if (gap <= 1) return s.current;
      if (gap === 2) {
        var freezes = weekId(t) !== s.freezeWeek ? 1 : s.freezesLeft;
        if (freezes > 0) return s.current;
      }
      return 0;
    },

    // Call once a mission is finished. Returns what happened to the streak.
    markDayPlayed: function () {
      var s = this.data.streak, t = App.state.today();
      refreshFreeze(s, t);
      if (s.lastPlayed === t) return { increased: false, usedFreeze: false, current: s.current };
      var gap = s.lastPlayed ? daysBetween(s.lastPlayed, t) : null;
      var usedFreeze = false;
      if (gap === 1) s.current++;
      else if (gap === 2 && s.freezesLeft > 0) { s.freezesLeft--; s.current++; usedFreeze = true; }
      else s.current = 1;
      s.lastPlayed = t;
      if (s.current > s.best) s.best = s.current;
      this.data.daysPlayed = (this.data.daysPlayed || 0) + 1;
      return { increased: true, usedFreeze: usedFreeze, current: s.current };
    }
  };
})();
