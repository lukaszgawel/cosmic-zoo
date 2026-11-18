// Classic mission, "missing number" mission and Boss fight gameplay.
window.App = window.App || {};

App.mission = {
  m: null,

  // kind: 'normal' | 'boss'; missing: true for the "missing number" mode
  start: function (kind, missing) {
    if (App.timer.isOver()) return App.screens.sleep();
    var track = App.q.track(), p = App.q.activePlanet(track);
    if (kind === 'boss' && !p) kind = 'normal';
    var useMissing = !!missing && kind !== 'boss';
    var list = App.q.buildMission(kind, track);
    this.m = {
      kind: kind, mode: useMissing ? 'missing' : 'classic', planet: p, track: track,
      queue: list.map(function (f) {
        return { op: f.op, a: f.a, b: f.b, repeat: false, miss: useMissing ? (Math.random() < 0.5 ? 'a' : 'b') : null };
      }),
      idx: 0, answered: 0, correct: 0, stars: 0, run: 0, bestRun: 0,
      startedAt: Date.now(), endedEarly: false,
      waiting: false, waitSince: 0, busy: false, qShownAt: 0
    };
    App.timer.setActive(true);
    this.renderShell();
    this.showQuestion();
  },

  renderShell: function () {
    var m = this.m, T = App.T, ui = App.ui, art = App.art, st = App.state.data, self = this;
    var boss = m.kind === 'boss';
    var title = boss ? T.bossTitle : (m.planet ? T.planets[m.planet.id] : T.galaxyName[m.track]);
    if (m.mode === 'missing') title = T.modes.missing.icon + ' ' + T.modes.missing.name;
    var goal = boss ? art.monster(64) : art.planet(m.planet ? m.planet.color : '#c77dff', 64, true);

    ui.render(
      '<div class="screen mission' + (boss ? ' boss' : '') + '">' +
        '<div class="mission-top">' +
          '<div><div class="mission-title">' + title + '</div>' +
          (boss ? '<div class="sub">' + ui.fmt(T.bossGoal, { need: App.BOSS_PASS, n: App.BOSS_LEN }) + '</div>' : '') + '</div>' +
          '<span class="pill">⭐ <b id="m-stars">0</b></span>' +
        '</div>' +
        '<div class="track">' +
          '<div class="track-run"><div class="track-line"></div><div class="track-fill" id="track-fill"></div>' +
            '<div class="track-rocket" id="track-rocket"><div>' + art.rocket(st.player.rocketColor, 56) + '</div></div></div>' +
          '<div class="track-goal">' + goal + '</div>' +
        '</div>' +
        '<div class="counter" id="m-counter"></div>' +
        '<form id="q-form" class="problem-card" autocomplete="off">' +
          '<div class="problem"><span id="q-left"></span><input id="q-input" inputmode="numeric" maxlength="3" autocomplete="off" aria-label="Odpowiedź"><span id="q-right"></span></div>' +
          '<button type="submit" class="btn btn-small" id="q-btn">' + T.check + '</button>' +
        '</form>' +
        '<div id="feedback" class="feedback" aria-live="polite"></div>' +
      '</div>');

    var input = ui.$('#q-input');
    input.addEventListener('input', function () { input.value = input.value.replace(/\D/g, '').slice(0, 3); });
    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (!e.repeat) self.onSubmit();
    });
    ui.$('#q-form').addEventListener('submit', function (e) { e.preventDefault(); self.onSubmit(); });
  },

  updateTrack: function () {
    var m = this.m, pct = Math.round(m.idx / m.queue.length * 100);
    App.ui.$('#track-fill').style.width = pct + '%';
    var r = App.ui.$('#track-rocket');
    r.style.left = pct + '%';
    r.style.transform = 'translateX(-' + pct + '%)';
  },

  updateCounter: function () {
    var m = this.m, T = App.T, ui = App.ui;
    var txt = ui.fmt(T.questionN, { i: Math.min(m.idx + 1, m.queue.length), n: m.queue.length });
    if (m.kind === 'boss') txt += ' · ' + ui.fmt(T.bossCount, { c: m.correct, need: App.BOSS_PASS });
    ui.$('#m-counter').textContent = txt;
  },

  showQuestion: function () {
    var m = this.m, ui = App.ui, q = m.queue[m.idx], op = App.opOf(q), parts = op.parts(q);
    var input = ui.$('#q-input');
    ui.$('#q-left').textContent = parts.left;
    ui.$('#q-right').textContent = parts.right;
    input.value = '';
    input.readOnly = false;
    input.className = '';
    ui.$('#q-btn').textContent = App.T.check;
    ui.$('#feedback').innerHTML = '';
    this.updateCounter();
    this.updateTrack();
    input.focus();
    App.audio.say(op.speech(q));
    m.qShownAt = Date.now();
    m.waiting = false;
    m.busy = false;
  },

  onSubmit: function () {
    var m = this.m, T = App.T, ui = App.ui, st = App.state.data, self = this;
    if (!m) return;
    if (m.waiting) { if (Date.now() - m.waitSince > 400) this.next(); return; }
    if (m.busy) return;

    var input = ui.$('#q-input');
    var v = input.value.trim();
    if (v === '') return;

    var q = m.queue[m.idx], ms = Date.now() - m.qShownAt;
    var ok = parseInt(v, 10) === App.opOf(q).answer(q);
    App.q.record(q, ok, ms);
    m.answered++;

    if (ok) {
      m.correct++; m.run++;
      if (m.run > m.bestRun) m.bestRun = m.run;
      var s = 1, msgs = [ui.pickOne(T.praise)];
      var fast = ms < App.FAST_MS;
      if (fast) { s++; msgs.push(T.fast); }
      if (q.repeat) { s++; msgs.push(T.nowYouKnow); }
      m.stars += s; st.stars += s;
      if (m.kind !== 'boss') App.q.addFuel(m.planet, q, fast);
      App.state.save();
      m.busy = true;
      input.readOnly = true;
      input.className = 'ok';
      ui.$('#m-stars').textContent = m.stars;
      ui.$('#feedback').innerHTML = '<div class="fb-ok pop">' + msgs.join(' ') + ' <span class="plus">+' + s + ' ⭐</span></div>';
      this.updateCounter();
      App.audio.play(fast ? 'fast' : 'correct');
      setTimeout(function () { if (self.m === m) self.next(); }, 1100);
    } else {
      m.run = 0;
      var requeued = false;
      if (m.kind !== 'boss' && !q.repeat) {
        m.queue.splice(Math.min(m.queue.length, m.idx + 3), 0, { op: q.op, a: q.a, b: q.b, repeat: true, miss: q.miss });
        requeued = true;
      }
      App.state.save();
      m.waiting = true;
      m.waitSince = Date.now();
      input.readOnly = true;
      input.className = 'bad';
      ui.$('#q-btn').textContent = T.next;
      ui.$('#feedback').innerHTML = App.hintHtml(q, requeued);
      this.updateCounter();
      App.audio.play('wrong');
    }
  },

  next: function () {
    var m = this.m;
    if (!m) return;
    m.waiting = false;
    m.idx++;
    if (m.idx >= m.queue.length) return this.finish();
    if (App.timer.isOver()) { m.endedEarly = true; return this.finish(); }
    this.showQuestion();
  },

  finish: function () {
    var m = this.m;
    this.m = null;
    App.timer.setActive(false);
    App.rewards.finishMission(m);
  }
};
