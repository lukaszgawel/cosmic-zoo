// "Nakarm stworki": a creature wants a number; pick every card whose result equals it.
window.App = window.App || {};

App.feed = {
  m: null,
  ROUNDS: 6,
  CARDS: 6,

  start: function () {
    if (App.timer.isOver()) return App.screens.sleep();
    var st = App.state.data, self = this;
    var track = App.q.track();
    var facts = App.q.buildMission('normal', track).slice(0, this.ROUNDS);
    this.m = {
      kind: 'normal', mode: 'feed', planet: App.q.activePlanet(track), track: track,
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

  showRound: function () {
    var m = this.m, T = App.T, ui = App.ui, f = m.rounds[m.idx], n = App.opOf(f).result(f);
    m.cards = App.opOf(f).cards(f, this.CARDS);
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
        else if (m.sel[i]) { cls += ' wrong'; extra = '<small>= ' + App.opOf(c).result(c) + '</small>'; }
        else cls += ' dim';
      }
      return '<button type="button" class="' + cls + '" data-card="' + i + '"' + (m.checked ? ' disabled' : '') + '>' +
        '<span class="card-num">' + (i + 1) + '</span>' + App.opOf(c).label(c) + extra + '</button>';
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
    var m = this.m, T = App.T, ui = App.ui, st = App.state.data, f = m.rounds[m.idx], n = App.opOf(f).result(f);
    var any = Object.keys(m.sel).some(function (k) { return m.sel[k]; });
    if (!any) { ui.toast(T.pickSome, 1800); return; }
    var ms = Date.now() - m.shownAt, allRight = true, good = 0;
    m.cards.forEach(function (c, i) {
      if (c.ok && m.sel[i]) { App.q.record(c, true, ms); App.q.addFuel(m.planet, c, ms < App.FAST_MS); good++; }
      else if (c.ok) { App.q.record(c, false, ms); allRight = false; }
      else if (m.sel[i]) { App.q.record(c, false, ms); allRight = false; }
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
