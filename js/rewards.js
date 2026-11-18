// End of mission: stars, streak, eggs, Boss results, summary screen and daily chest.
window.App = window.App || {};
App.screens = App.screens || {};

App.rewards = {
  finishMission: function (m) {
    var st = App.state.data, today = App.state.today();
    var res = { m: m, streak: null, boss: null, newRecord: false, steps: [] };

    if (m.answered > 0) {
      res.streak = App.state.markDayPlayed();
      st.history.push({
        date: today, kind: m.kind, track: m.track || 'mul', questions: m.answered, correct: m.correct,
        seconds: Math.round((Date.now() - m.startedAt) / 1000)
      });
      if (st.history.length > 400) st.history = st.history.slice(-400);
      if (m.bestRun > st.records.bestRun) {
        res.newRecord = st.records.bestRun > 0;
        st.records.bestRun = m.bestRun;
      }
      // A new day of play brings the egg one day closer to hatching.
      if (res.streak.increased && App.collection.tickEgg()) res.steps.push('hatch');
      if (st.lastChestDate !== today) res.steps.push('chest');
    }

    if (m.kind === 'boss' && m.planet) {
      if (m.endedEarly) {
        res.boss = { postponed: true };
      } else {
        var win = m.correct >= App.BOSS_PASS;
        res.boss = { win: win, creature: m.planet.creature };
        if (win) {
          st.planets[m.planet.id].status = 'completed';
          if (st.creatures.indexOf(m.planet.creature) < 0) st.creatures.push(m.planet.creature);
          st.stars += 20; m.stars += 20;
          var list = App.q.planetsOf(m.planet.track), nxt = list[list.indexOf(m.planet) + 1];
          if (nxt && st.planets[nxt.id].status === 'locked') {
            st.planets[nxt.id].status = 'active';
            res.boss.next = nxt;
          }
        }
      }
    }

    // Milestones: 7, 14, 30, 50, 100 days of play.
    if (res.streak && res.streak.increased && App.MILESTONES.indexOf(st.daysPlayed) >= 0 &&
        !st.milestones.some(function (x) { return x.days === st.daysPlayed; })) {
      st.milestones.push({ days: st.daysPlayed, date: today });
      res.steps.push({ type: 'milestone', days: st.daysPlayed });
    }
    // Real-world rewards set by the parent.
    var newly = App.prizes.check();
    if (newly.length) res.steps.push({ type: 'voucher', ids: newly });

    App.state.save();
    App.screens.summary(res);
  },

  // Show the queued screens (hatching egg, daily chest) one after another, then go home.
  runSteps: function (steps) {
    var next = steps.shift(), self = this;
    var cont = function () { self.runSteps(steps); };
    var type = next && (typeof next === 'string' ? next : next.type);
    if (type === 'hatch') App.screens.hatch(cont);
    else if (type === 'chest') App.screens.chest(cont);
    else if (type === 'milestone') App.screens.milestone(next.days, cont);
    else if (type === 'voucher') App.screens.voucher(next.ids, cont);
    else this.afterSession();
  },

  afterSession: function () {
    if (App.timer.isOver()) App.screens.sleep(); else App.screens.home();
  }
};

App.screens.summary = function (res) {
  var T = App.T, ui = App.ui, art = App.art, m = res.m;
  var head = '', title = T.missionDone, celebrate = m.answered > 0 && m.correct / m.answered >= 0.6;

  if (res.boss && res.boss.postponed) {
    title = T.bossPostponed;
    head = art.monster(110);
    celebrate = false;
  } else if (res.boss && res.boss.win) {
    title = T.bossWin;
    celebrate = true;
    head = '<div class="rescued">' + art.creature(res.boss.creature, 150) + '</div>' +
      '<p class="big">' + ui.fmt(T.rescued, { creature: T.creatures[res.boss.creature] }) + ' ' + T.inBase + '</p>' +
      '<p>' + (res.boss.next ? ui.fmt(T.newPlanet, { planet: T.planets[res.boss.next.id] }) : T.allPlanetsDone) + '</p>';
  } else if (res.boss) {
    title = T.bossLose;
    celebrate = false;
    head = art.monster(110) + '<p class="big">' + ui.fmt(T.bossLoseText, { c: m.correct, n: m.answered, need: App.BOSS_PASS }) + '</p>';
  }
  if (m.endedEarly) head += '<p>' + T.missionEndedEarly + '</p>';

  var streakHtml = '';
  if (res.streak && res.streak.increased) {
    streakHtml = '<p class="streak-msg">' +
      (res.streak.current === 1 ? T.streakFirst : ui.fmt(T.streakNow, { n: T.days(res.streak.current) })) + '</p>' +
      (res.streak.usedFreeze ? '<p>' + T.freezeUsed + '</p>' : '');
  }

  ui.render(
    '<div class="screen summary">' +
      '<h1>' + title + '</h1>' + head +
      '<div class="stats">' +
        '<div class="stat"><div class="stat-num">' + m.correct + ' / ' + m.answered + '</div><div>' + T.summaryCorrect + '</div></div>' +
        '<div class="stat"><div class="stat-num">+' + m.stars + ' ⭐</div><div>' + T.summaryStars + '</div></div>' +
        '<div class="stat"><div class="stat-num">' + m.bestRun + '</div><div>' + T.summaryRun + (res.newRecord ? '<br><b>' + T.newRecord + '</b>' : '') + '</div></div>' +
      '</div>' + streakHtml +
      '<button class="btn" id="cont">' + T.next + '</button>' +
    '</div>', '#cont');

  if (celebrate) { ui.confetti(); App.audio.play('win'); }

  ui.on('#cont', 'click', function () { App.rewards.runSteps(res.steps.slice()); });
};

App.screens.chest = function (then) {
  var T = App.T, ui = App.ui, art = App.art, st = App.state.data, opened = false;

  ui.render(
    '<div class="screen chest-screen">' +
      '<h1>' + T.chestTitle + '</h1>' +
      '<button class="chest-btn" id="chest" aria-label="' + T.chestOpen + '">' + art.chest(false, 220) + '</button>' +
      '<p class="big" id="chest-msg">' + T.chestHint + '</p>' +
      '<div class="chest-extras" id="chest-extras"></div>' +
      '<button class="btn" id="chest-next" hidden>' + T.next + '</button>' +
    '</div>', '#chest');

  ui.on('#chest', 'click', function (e, el) {
    if (opened) return;
    opened = true;
    var bonus = Math.min(App.state.displayStreak(), 7) * 2;
    var n = 10 + Math.floor(Math.random() * 11) + bonus;
    st.stars += n;
    st.lastChestDate = App.state.today();

    var extras = '';
    // The very first chest always has an egg, so she learns how eggs work.
    if (!st.egg && (st.eggsReceived === 0 || Math.random() < 0.4)) {
      App.collection.newEgg();
      extras += '<div class="extra pop">' + art.egg(st.egg.color, 70) + '<span>' + T.chestEgg + '</span></div>';
    }
    if (Math.random() < 0.3) {
      var cheap = App.DECOR.filter(function (d) { return d.price <= 30; });
      var item = ui.pickOne(cheap);
      st.decorations[item.id] = (st.decorations[item.id] || 0) + 1;
      extras += '<div class="extra pop">' + art.deco(item.id, 70) + '<span>' + ui.fmt(T.chestDecor, { item: T.decor[item.id] }) + '</span></div>';
    }
    App.state.save();

    el.innerHTML = art.chest(true, 220);
    el.classList.add('opened');
    ui.$('#chest-msg').textContent = ui.fmt(T.chestGot, { n: n, word: T.starsWord(n) });
    ui.$('#chest-extras').innerHTML = extras;
    App.audio.play('chest');
    ui.confetti();
    var nb = ui.$('#chest-next');
    nb.hidden = false;
    ui.shownAt = Date.now();
    setTimeout(function () { nb.focus(); }, 350);
  });
  ui.on('#chest-next', 'click', function () { (then || App.rewards.afterSession.bind(App.rewards))(); });
};
