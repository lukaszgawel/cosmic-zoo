// Real-world rewards set by the parent, and day-count milestones (with certificates).
window.App = window.App || {};
App.screens = App.screens || {};

App.MILESTONES = [7, 14, 30, 50, 100];
App.REWARD_EMOJI = ['🎁', '🍦', '🎬', '📚', '🧸', '🍕', '🎨', '🏊', '🎮', '🌳', '🍰', '🎢', '⚽', '🦄'];

App.prizes = {
  // { cur, target } for a reward
  progress: function (r) {
    var st = App.state.data, cur = 0, target = r.target;
    if (r.type === 'streak') cur = App.state.displayStreak();
    else if (r.type === 'days') cur = st.daysPlayed;
    else if (r.type === 'creatures') cur = st.creatures.length;
    else if (r.type === 'planet') {
      var tp = App.PLANETS.filter(function (p) { return p.id === r.target; })[0];
      var list = tp ? App.q.planetsOf(tp.track) : [], idx = list.indexOf(tp);
      target = idx + 1;
      cur = list.slice(0, idx + 1).filter(function (p) { return st.planets[p.id].status === 'completed'; }).length;
    }
    return { cur: Math.min(cur, target), target: target };
  },

  // Mark rewards whose goal is reached. Returns ids of newly earned rewards.
  check: function () {
    var self = this, newly = [];
    App.state.data.rewards.forEach(function (r) {
      if (r.status !== 'pending') return;
      var p = self.progress(r);
      if (p.cur >= p.target) { r.status = 'earned'; r.earnedDate = App.state.today(); newly.push(r.id); }
    });
    return newly;
  },

  // The pending reward closest to being earned.
  next: function () {
    var self = this;
    var list = App.state.data.rewards.filter(function (r) { return r.status === 'pending'; });
    list.sort(function (a, b) {
      var pa = self.progress(a), pb = self.progress(b);
      return (pb.cur / pb.target) - (pa.cur / pa.target);
    });
    return list[0] || null;
  },

  label: function (r) { return r.showName ? r.emoji + ' ' + r.name : '🎁 ' + App.T.giftSurprise; },

  childText: function (r) {
    var T = App.T, p = this.progress(r), left = p.target - p.cur;
    if (r.type === 'streak') return T.giftStreak(left);
    if (r.type === 'days') return T.giftDays(left);
    if (r.type === 'creatures') return T.giftCreatures(left);
    return App.ui.fmt(T.giftPlanet, { planet: T.planets[r.target] });
  },

  condText: function (r) {
    var T = App.T;
    if (r.type === 'planet') return App.ui.fmt(T.rwCond.planet, { planet: T.planets[r.target] });
    return App.ui.fmt(T.rwCond[r.type], { n: r.target });
  },

  // Certificates the parent can print.
  certificates: function () {
    var st = App.state.data, T = App.T, ui = App.ui, out = [];
    st.milestones.forEach(function (ms) {
      out.push({ id: 'd' + ms.days, icon: '🏅', reason: ui.fmt(T.certDays, { n: ms.days }), date: ms.date });
    });
    App.PLANETS.forEach(function (p) {
      if (st.planets[p.id].status !== 'completed' || st.planets[p.id].skipped) return;
      if (p.mixed) out.push({ id: p.id, icon: '🌌', reason: p.track === 'sub' ? T.certSubGalaxy : T.certGalaxy, creature: p.creature });
      else out.push({ id: p.id, icon: '🪐', reason: ui.fmt(p.track === 'sub' ? T.certSubPlanet : T.certPlanet, { t: T.planetShort[p.id], planet: T.planets[p.id] }), creature: p.creature });
    });
    return out;
  }
};

App.screens.voucher = function (ids, then) {
  var T = App.T, ui = App.ui;
  var list = App.state.data.rewards.filter(function (r) { return ids.indexOf(r.id) >= 0; });
  ui.render(
    '<div class="screen voucher-screen">' +
      '<h1>' + T.voucherTitle + '</h1>' +
      list.map(function (r) {
        return '<div class="voucher pop"><div class="voucher-emoji">' + r.emoji + '</div>' +
          '<div><div class="note">' + T.voucherFor + '</div><div class="voucher-name">' + ui.esc(r.name) + '</div></div></div>';
      }).join('') +
      '<p class="big">' + T.voucherShow + '</p>' +
      '<button class="btn" id="cont">' + T.next + '</button>' +
    '</div>', '#cont');
  ui.confetti();
  App.audio.play('win');
  ui.on('#cont', 'click', then);
};

App.screens.milestone = function (days, then) {
  var T = App.T, ui = App.ui;
  ui.render(
    '<div class="screen milestone-screen">' +
      '<div class="mode-icon pop">🏅</div>' +
      '<h1>' + ui.fmt(T.milestoneTitle, { n: T.playDays(days) }) + '</h1>' +
      '<p class="big">' + T.milestoneText + '</p>' +
      '<button class="btn" id="cont">' + T.next + '</button>' +
    '</div>', '#cont');
  ui.confetti();
  App.audio.play('win');
  ui.on('#cont', 'click', then);
};

App.screens.myRewards = function () {
  var T = App.T, ui = App.ui, st = App.state.data;
  var earned = st.rewards.filter(function (r) { return r.status !== 'pending'; });
  var pending = st.rewards.filter(function (r) { return r.status === 'pending'; });
  var body = '';
  if (!st.rewards.length) body = '<p class="note">' + T.rewardsEmpty + '</p>';
  if (earned.length) {
    body += '<h2>' + T.rewardsEarnedH + '</h2><div class="reward-list">' + earned.map(function (r) {
      return '<div class="voucher small' + (r.status === 'given' ? ' given' : '') + '"><div class="voucher-emoji">' + r.emoji + '</div>' +
        '<div><div class="voucher-name">' + ui.esc(r.name) + '</div><div class="note">' + (r.status === 'given' ? T.rewardGiven : T.rewardWaiting) + '</div></div></div>';
    }).join('') + '</div>';
  }
  if (pending.length) {
    body += '<h2>' + T.rewardsNextH + '</h2><div class="reward-list">' + pending.map(function (r) {
      var p = App.prizes.progress(r);
      return '<div class="card gift-card"><b>' + ui.esc(App.prizes.label(r)) + '</b>' +
        '<div class="note">' + App.prizes.childText(r) + '</div>' +
        '<div class="bar"><span style="width:' + Math.round(p.cur / p.target * 100) + '%"></span></div></div>';
    }).join('') + '</div>';
  }
  ui.render(
    '<div class="screen my-rewards">' +
      '<div class="topbar"><button class="link-btn" id="back">⬅ ' + T.back + '</button><h1>' + T.myRewardsTitle + '</h1><span></span></div>' +
      body +
    '</div>', '#back');
  ui.on('#back', 'click', function () { App.screens.home(); });
};
