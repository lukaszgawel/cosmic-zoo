// "Deszcz meteorów": a problem falls slowly; type the answer to blast it before it lands.
window.App = window.App || {};

App.meteor = {
  m: null,
  SKY: 340,   // height of the sky area in px
  ROCK: 120,  // meteor size in px

  rockSvg: function () {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="' + this.ROCK + '" height="' + this.ROCK + '" aria-hidden="true">' +
      '<path d="M30 30 Q10 0 4 -10 Q30 8 44 24 Z M50 24 Q46 -6 50 -14 Q60 8 62 26 Z" fill="#ff8c42" opacity=".8"/>' +
      '<circle cx="50" cy="60" r="38" fill="#8d6e63"/><circle cx="36" cy="48" r="7" fill="#6d4c41"/><circle cx="64" cy="72" r="9" fill="#6d4c41"/><circle cx="66" cy="44" r="5" fill="#6d4c41"/>' +
      '</svg>';
  },

  start: function () {
    if (App.timer.isOver()) return App.screens.sleep();
    var track = App.q.track(), p = App.q.activePlanet(track);
    this.m = {
      kind: 'normal', mode: 'meteor', planet: p, track: track,
      queue: App.q.buildMission('normal', track).map(function (f) { return { op: f.op, a: f.a, b: f.b, repeat: false }; }),
      idx: 0, answered: 0, correct: 0, stars: 0, run: 0, bestRun: 0,
      startedAt: Date.now(), endedEarly: false,
      state: 'fall', y: 0, shownAt: 0, last: 0, wrongOnce: false, waitSince: 0
    };
    App.timer.setActive(true);
    this.render();
    this.spawn();
  },

  render: function () {
    var T = App.T, ui = App.ui, st = App.state.data, self = this;
    ui.render(
      '<div class="screen mission meteor-mode">' +
        '<div class="mission-top"><div class="mission-title">' + T.modes.meteor.icon + ' ' + T.modes.meteor.name + '</div>' +
          '<span class="pill">⭐ <b id="m-stars">0</b></span></div>' +
        '<div class="counter" id="m-counter"></div>' +
        '<div class="sky-area" id="mt-sky" style="height:' + this.SKY + 'px">' +
          '<div class="meteor" id="mt-rock">' + this.rockSvg() + '<span id="mt-text"></span></div>' +
          '<div class="ground">' + App.art.rocket(st.player.rocketColor, 70) + '</div>' +
        '</div>' +
        '<form id="q-form" class="problem-card slim" autocomplete="off">' +
          '<div class="problem small">= <input id="q-input" inputmode="numeric" maxlength="3" autocomplete="off" aria-label="Odpowiedź"></div>' +
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

  duration: function () { return Math.max(9000, 14000 - this.m.idx * 400); },

  spawn: function () {
    var m = this.m, ui = App.ui, q = m.queue[m.idx], self = this;
    var rock = ui.$('#mt-rock');
    ui.$('#mt-text').textContent = App.opOf(q).label(q);
    rock.className = 'meteor';
    rock.style.left = (8 + Math.random() * 60) + '%';
    rock.style.top = '0px';
    m.state = 'fall'; m.y = 0; m.wrongOnce = false; m.shownAt = Date.now();
    var input = ui.$('#q-input');
    input.value = ''; input.readOnly = false; input.className = '';
    input.focus();
    ui.$('#feedback').innerHTML = '';
    ui.$('#m-counter').textContent = ui.fmt(App.T.questionN, { i: m.idx + 1, n: m.queue.length });
    App.audio.say(App.opOf(q).speech(q));
    m.last = performance.now();
    requestAnimationFrame(function tick(t) {
      if (self.m !== m || m.state !== 'fall') return;
      if (!document.hidden) m.y += (t - m.last) / self.duration();
      m.last = t;
      rock.style.top = Math.min(1, m.y) * (self.SKY - self.ROCK) + 'px';
      if (m.y >= 1) return self.landed();
      requestAnimationFrame(tick);
    });
  },

  onSubmit: function () {
    var m = this.m, ui = App.ui, T = App.T;
    if (!m) return;
    if (m.state === 'hint') { if (Date.now() - m.waitSince > 400) this.next(); return; }
    if (m.state !== 'fall') return;
    var input = ui.$('#q-input'), v = input.value.trim();
    if (v === '') return;
    var q = m.queue[m.idx];
    if (parseInt(v, 10) === App.opOf(q).answer(q)) return this.blast();
    // Wrong: the meteor keeps falling, she can try again.
    if (!m.wrongOnce) { m.wrongOnce = true; App.q.record(q, false, Date.now() - m.shownAt); m.run = 0; App.state.save(); }
    input.value = '';
    input.className = 'bad';
    setTimeout(function () { input.className = ''; }, 400);
    ui.$('#feedback').innerHTML = '<div class="fb-try pop">' + T.tryAgain + '</div>';
    App.audio.play('wrong');
  },

  blast: function () {
    var m = this.m, ui = App.ui, T = App.T, st = App.state.data, self = this;
    var q = m.queue[m.idx], ms = Date.now() - m.shownAt;
    m.state = 'blast';
    m.answered++;
    var s = 1, msgs = [T.blasted];
    if (!m.wrongOnce) {
      App.q.record(q, true, ms);
      App.q.addFuel(m.planet, q, ms < App.FAST_MS);
      m.correct++; m.run++;
      if (m.run > m.bestRun) m.bestRun = m.run;
      if (ms < App.FAST_MS) { s++; msgs.push(T.fast); }
      if (q.repeat) { s++; msgs.push(T.nowYouKnow); }
    }
    m.stars += s; st.stars += s;
    App.state.save();
    ui.$('#mt-rock').className = 'meteor boom';
    ui.$('#mt-text').textContent = '💥';
    ui.$('#q-input').className = 'ok';
    ui.$('#m-stars').textContent = m.stars;
    ui.$('#feedback').innerHTML = '<div class="fb-ok pop">' + msgs.join(' ') + ' <span class="plus">+' + s + ' ⭐</span></div>';
    App.audio.play(ms < App.FAST_MS && !m.wrongOnce ? 'fast' : 'correct');
    setTimeout(function () { if (self.m === m) self.next(); }, 1100);
  },

  landed: function () {
    var m = this.m, ui = App.ui, q = m.queue[m.idx];
    m.state = 'hint';
    m.waitSince = Date.now();
    m.answered++;
    m.run = 0;
    if (!m.wrongOnce) App.q.record(q, false, Date.now() - m.shownAt);
    var requeued = false;
    if (!q.repeat) { m.queue.splice(Math.min(m.queue.length, m.idx + 3), 0, { op: q.op, a: q.a, b: q.b, repeat: true }); requeued = true; }
    App.state.save();
    ui.$('#mt-rock').className = 'meteor landed';
    ui.$('#q-input').readOnly = true;
    ui.$('#m-counter').textContent = ui.fmt(App.T.questionN, { i: m.idx + 1, n: m.queue.length });
    ui.$('#feedback').innerHTML = App.hintHtml(q, requeued, App.T.landed);
    App.audio.play('wrong');
  },

  next: function () {
    var m = this.m;
    if (!m) return;
    m.idx++;
    if (m.idx >= m.queue.length) return this.finish();
    if (App.timer.isOver()) { m.endedEarly = true; return this.finish(); }
    this.spawn();
  },

  finish: function () {
    var m = this.m;
    this.m = null;
    App.timer.setActive(false);
    App.rewards.finishMission(m);
  }
};
