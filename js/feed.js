// "Nakarm stworki": a creature wants a number; pick every card whose product equals it.
window.App = window.App || {};

App.feed = {
  m: null,
  ROUNDS: 6,
  CARDS: 6,

  start: function () {
    if (App.timer.isOver()) return App.screens.sleep();
    var st = App.state.data, self = this;
    var facts = App.q.buildMission('normal').slice(0, this.ROUNDS);
    this.m = {
      kind: 'normal', mode: 'feed', planet: App.q.activePlanet(),
      rounds: facts, idx: 0, answered: 0, correct: 0, stars: 0, run: 0, bestRun: 0,
      startedAt: Date.now(), endedEarly: false,
      cards: [], sel: {}, checked: false, shownAt: 0, checkedAt: 0,
      creature: st.creatures.length ? App.ui.pickOne(st.creatures) : 'kot'
    };
    this.onKey = function (e) { self.key(e); };
    document.addEventListener('keydown', this.onKey);
    App.timer.setActive(true);
    this.showRound();
  },

  // All unordered pairs (1..10) giving n.
  pairsFor: function (n) {
    var out = [];
    for (var x = 1; x <= 10; x++) for (var y = x; y <= 10; y++) if (x * y === n) out.push({ a: x, b: y });
    return out;
  },

  makeCards: function (f) {
    var n = f.a * f.b, key = App.q.key;
    var good = this.pairsFor(n).filter(function (p) { return key(p.a, p.b) !== key(f.a, f.b); });
    good = [{ a: f.a, b: f.b }].concat(App.q.shuffle(good)).slice(0, 3);
    var used = {};
    good.forEach(function (p) { used[key(p.a, p.b)] = 1; });

    // Wrong cards: products close to n, preferably sharing a factor with the target.
    var near = [], far = [], range = Math.max(4, Math.round(n * 0.35));
    for (var x = 1; x <= 10; x++) for (var y = x; y <= 10; y++) {
      var p = x * y, k = key(x, y);
      if (p === n || used[k]) continue;
      if (Math.abs(p - n) <= range && (x === f.a || x === f.b || y === f.a || y === f.b)) near.push({ a: x, b: y });
      else if (Math.abs(p - n) <= range * 2) far.push({ a: x, b: y });
    }
    var nearPick = App.q.shuffle(near).slice(0, 3);
    var bad = nearPick.concat(App.q.shuffle(far), App.q.shuffle(near).filter(function (p) { return nearPick.indexOf(p) < 0; }))
      .slice(0, this.CARDS - good.length);
    var cards = good.map(function (p) { return { a: p.a, b: p.b, ok: true }; })
      .concat(bad.map(function (p) { return { a: p.a, b: p.b, ok: false }; }));
    cards.forEach(function (c) { if (Math.random() < 0.5) { var t = c.a; c.a = c.b; c.b = t; } });
    return App.q.shuffle(cards);
  },

  showRound: function () {
    var m = this.m, T = App.T, ui = App.ui, f = m.rounds[m.idx], n = f.a * f.b;
    m.cards = this.makeCards(f);
    m.sel = {};
    m.checked = false;
    m.shownAt = Date.now();
    ui.render(
      '<div class="screen mission feed-mode">' +
        '<div class="mission-top"><div class="mission-title">' + T.modes.feed.icon + ' ' + T.modes.feed.name + '</div>' +
          '<span class="pill">⭐ <b id="m-stars">' + m.stars + '</b></span></div>' +
        '<div class="counter">' + ui.fmt(T.roundN, { i: m.idx + 1, n: m.rounds.length }) + '</div>' +
        '<div class="feed-top">' + App.art.creature(m.creature, 130) +
          '<div class="bubble">' + ui.fmt(T.wants, { n: '<b>' + n + '</b>' }) + '</div></div>' +
        '<p class="note">' + ui.fmt(T.pickCards, { n: n }) + '</p>' +
        '<div class="cards" id="f-cards"></div>' +
        '<button class="btn" id="f-btn">' + T.feedBtn + '</button>' +
        '<div id="feedback" class="feedback" aria-live="polite"></div>' +
      '</div>', '#f-btn');
    this.drawCards();
    var self = this;
    ui.$('#f-cards').addEventListener('click', function (e) {
      var b = e.target.closest('[data-card]');
      if (b) self.toggle(+b.getAttribute('data-card'));
    });
    ui.on('#f-btn', 'click', function () { self.primary(); });
    App.audio.say(ui.fmt(T.wants, { n: n }));
  },

  drawCards: function () {
    var m = this.m, T = App.T;
    App.ui.$('#f-cards').innerHTML = m.cards.map(function (c, i) {
      var cls = 'card-btn';
      if (m.sel[i]) cls += ' selected';
      var extra = '';
      if (m.checked) {
        if (c.ok && m.sel[i]) cls += ' right';
        else if (c.ok) { cls += ' missed'; extra = '<small>' + T.feedMissed + '</small>'; }
        else if (m.sel[i]) { cls += ' wrong'; extra = '<small>= ' + (c.a * c.b) + '</small>'; }
        else cls += ' dim';
      }
      return '<button type="button" class="' + cls + '" data-card="' + i + '"' + (m.checked ? ' disabled' : '') + '>' +
        '<span class="card-num">' + (i + 1) + '</span>' + c.a + ' × ' + c.b + extra + '</button>';
    }).join('');
  },

  toggle: function (i) {
    var m = this.m;
    if (!m || m.checked || i < 0 || i >= m.cards.length) return;
    m.sel[i] = !m.sel[i];
    App.audio.play('click');
    this.drawCards();
  },

  key: function (e) {
    if (!this.m) return;
    if (e.key >= '1' && e.key <= '9') { this.toggle(+e.key - 1); return; }
    // Enter on a focused button already "clicks" it; handle Enter only when focus is elsewhere.
    if (e.key === 'Enter' && !(document.activeElement && document.activeElement.tagName === 'BUTTON')) {
      e.preventDefault();
      if (!e.repeat) this.primary();
    }
  },

  primary: function () {
    var m = this.m;
    if (!m) return;
    if (m.checked) { if (Date.now() - m.checkedAt > 400) this.next(); return; }
    this.check();
  },

  check: function () {
    var m = this.m, T = App.T, ui = App.ui, st = App.state.data, f = m.rounds[m.idx], n = f.a * f.b;
    var any = Object.keys(m.sel).some(function (k) { return m.sel[k]; });
    if (!any) { ui.toast(T.pickSome, 1800); return; }
    var ms = Date.now() - m.shownAt, allRight = true, good = 0;
    m.cards.forEach(function (c, i) {
      if (c.ok && m.sel[i]) { App.q.record(c.a, c.b, true, ms); App.q.addFuel(m.planet, c.a, c.b); good++; }
      else if (c.ok) { App.q.record(c.a, c.b, false, ms); allRight = false; }
      else if (m.sel[i]) { App.q.record(c.a, c.b, false, ms); allRight = false; }
    });
    m.answered++;
    m.checked = true;
    m.checkedAt = Date.now();
    var s = good;
    if (allRight) {
      m.correct++; m.run++;
      if (m.run > m.bestRun) m.bestRun = m.run;
      s += 1;
      App.audio.play('correct');
    } else {
      m.run = 0;
      App.audio.play('wrong');
    }
    m.stars += s; st.stars += s;
    App.state.save();
    this.drawCards();
    ui.$('#m-stars').textContent = m.stars;
    ui.$('#f-btn').textContent = T.next;
    ui.$('#feedback').innerHTML = '<div class="' + (allRight ? 'fb-ok' : 'fb-try') + ' pop">' +
      (allRight ? T.feedOk : ui.fmt(T.feedPart, { n: n })) + (s ? ' <span class="plus">+' + s + ' ⭐</span>' : '') + '</div>';
    if (allRight) ui.$('.feed-top .creature').classList.add('happy');
  },

  next: function () {
    var m = this.m;
    m.idx++;
    if (m.idx >= m.rounds.length) return this.finish();
    if (App.timer.isOver()) { m.endedEarly = true; return this.finish(); }
    this.showRound();
  },

  finish: function () {
    var m = this.m;
    this.m = null;
    document.removeEventListener('keydown', this.onKey);
    App.timer.setActive(false);
    App.rewards.finishMission(m);
  }
};
