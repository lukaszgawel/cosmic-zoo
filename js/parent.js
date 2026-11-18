// Parent gate (simple math question) and parent panel.
window.App = window.App || {};
App.screens = App.screens || {};

App.screens.parentGate = function (msg) {
  var T = App.T, ui = App.ui;
  var a = 11 + Math.floor(Math.random() * 9), b = 3 + Math.floor(Math.random() * 7);
  App.timer.setActive(false);
  ui.render(
    '<form class="screen gate" id="g-form" autocomplete="off">' +
      '<div class="topbar"><button type="button" class="link-btn" id="back">⬅ ' + T.back + '</button><span></span></div>' +
      '<h1>' + T.gateTitle + '</h1>' +
      '<p class="big">' + ui.fmt(T.gateQ, { a: a, b: b }) + '</p>' +
      '<div class="field"><input id="g-in" inputmode="numeric" maxlength="4" aria-label="' + ui.fmt(T.gateQ, { a: a, b: b }) + '"></div>' +
      '<p class="error">' + (msg || '') + '</p>' +
      '<button type="submit" class="btn btn-small">' + T.gateOk + '</button>' +
    '</form>', '#g-in');
  ui.on('#back', 'click', function () { App.screens.home(); });
  ui.$('#g-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (parseInt(ui.$('#g-in').value, 10) === a * b) App.screens.parent('progress');
    else App.screens.parentGate(T.gateWrong);
  });
};

App.parent = {
  progTrack: null, // which operation the Progress tab shows

  // Heat-map cell: colour by mastery, tooltip with the details.
  heatCell: function (q, s) {
    var op = App.opOf(q), lvl = !s || !s.attempts ? 0 : (s.mastery >= App.MASTERED ? 3 : (s.mastery >= 2 ? 2 : 1));
    var title = op.label(q) + ' = ' + op.result(q) + (s && s.attempts ? ' · ' + s.correct + '/' + s.attempts + ' dobrze · poziom ' + (s.mastery || 0) + '/5' : '');
    return { lvl: lvl, title: title };
  },

  mulHeat: function () {
    var T = App.T, st = App.state.data, key = App.q.key, self = this;
    var heat = '<tr><th>×</th>';
    for (var c = 1; c <= 10; c++) heat += '<th>' + c + '</th>';
    heat += '</tr>';
    for (var r = 1; r <= 10; r++) {
      heat += '<tr><th>' + r + '</th>';
      for (c = 1; c <= 10; c++) {
        var h = self.heatCell({ op: 'mul', a: r, b: c }, st.facts[key(r, c)]);
        heat += '<td class="h' + h.lvl + '" title="' + h.title + '">' + (r * c) + '</td>';
      }
      heat += '</tr>';
    }
    return '<section class="card"><h3>' + T.heatTitle + '</h3><div class="heat-wrap"><table class="heat">' + heat + '</table></div>' + this.legend() + '</section>';
  },

  // Rows: the number we subtract from; columns: the number taken away; cell: the result.
  subHeat: function (from, to, title, note) {
    var st = App.state.data, sub = App.ops.sub, self = this;
    var heat = '<tr><th>−</th>';
    for (var c = 1; c <= 9; c++) heat += '<th>' + c + '</th>';
    heat += '</tr>';
    for (var r = from; r <= to; r++) {
      heat += '<tr><th>' + r + '</th>';
      for (c = 1; c <= 9; c++) {
        if (c >= r) { heat += '<td class="h-none"></td>'; continue; }
        var q = { op: 'sub', a: r, b: c }, h = self.heatCell(q, st.facts[sub.keyOf(q)]);
        heat += '<td class="h' + h.lvl + (sub.levelOf(q) === 'cross10' ? ' cross' : '') + '" title="' + h.title + '">' + (r - c) + '</td>';
      }
      heat += '</tr>';
    }
    return '<section class="card"><h3>' + title + '</h3><div class="heat-wrap"><table class="heat heat-sub">' + heat + '</table></div>' +
      (note ? '<p class="note">' + note + '</p>' : '') + this.legend() + '</section>';
  },

  legend: function () {
    return '<div class="heat-legend">' + App.T.heatLegend.map(function (l, i) { return '<span><i class="h' + i + '"></i>' + l + '</span>'; }).join('') + '</div>';
  },

  // Accuracy per subtraction skill level.
  skills: function () {
    var T = App.T, st = App.state.data, ui = App.ui;
    return '<section class="card"><h3>' + T.skillsTitle + '</h3><div class="skills">' + App.ops.sub.levels.map(function (l) {
      var sk = st.skills[l], pct = sk && sk.attempts ? Math.round(sk.correct / sk.attempts * 100) : 0;
      return '<div class="skill-row"><span class="skill-name">' + T.levelNames[l] + '</span>' +
        '<div class="bar"><span style="width:' + pct + '%"></span></div>' +
        '<span class="skill-val">' + (sk && sk.attempts ? pct + '% · ' + ui.fmt(T.skillLine, { ok: sk.correct, n: sk.attempts }) : T.skillsNone) + '</span></div>';
    }).join('') + '</div></section>';
  },

  progressTab: function () {
    var T = App.T, ui = App.ui, st = App.state.data, key = App.q.key;
    var tr = this.progTrack || App.q.track();
    this.progTrack = tr;

    // Facts that count for "mastered": the 55 multiplication facts, or the 136 subtraction facts within 20.
    var all = [];
    if (tr === 'mul') { for (var x = 1; x <= 10; x++) for (var y = x; y <= 10; y++) all.push(key(x, y)); }
    else ['within10', 'within20', 'cross10'].forEach(function (l) { App.ops.sub.levelFacts(l).forEach(function (f) { all.push(App.ops.sub.keyOf(f)); }); });
    var mastered = all.filter(function (k) { var s = st.facts[k]; return s && s.mastery >= App.MASTERED; }).length;

    var stats = [
      [tr === 'mul' ? T.stMastered : T.stMasteredSub, mastered + ' / ' + all.length],
      [T.stDays, st.daysPlayed],
      [T.stBest, T.days(st.streak.best)],
      [T.stStars, st.stars + ' ⭐'],
      [T.stCreatures, App.collection.count() + ' / ' + App.collection.all().length],
      [T.stToday, Math.round(App.timer.ensureDay().seconds / 60) + ' min']
    ].map(function (s) { return '<div class="stat"><div class="stat-num">' + s[1] + '</div><div>' + s[0] + '</div></div>'; }).join('');

    var toggle = '<div class="tabs prog-track">' + App.TRACKS.map(function (t) {
      return '<button type="button" class="tab' + (t === tr ? ' on' : '') + '" data-ptrack="' + t + '">' + T.progTrack[t] + '</button>';
    }).join('') + '</div>';
    var heatHtml = tr === 'mul' ? this.mulHeat()
      : this.subHeat(2, 10, T.heatSub10) + this.subHeat(11, 19, T.heatSub20, T.heatSub20Note) + this.skills();

    var mistakes = Object.keys(st.facts).map(function (k) {
      var s = st.facts[k];
      return { q: App.ops.fromKey(k), w: (s.attempts || 0) - (s.correct || 0), n: s.attempts || 0 };
    }).filter(function (x) { return x.q && x.q.op === tr && x.w > 0; }).sort(function (x, y) { return y.w - x.w || y.n - x.n; }).slice(0, 6);
    var mistakesHtml = mistakes.length ? '<ul class="mistakes">' + mistakes.map(function (x) {
      var op = App.opOf(x.q);
      return '<li>' + ui.fmt(T.mistakeLine, { q: op.label(x.q), p: op.result(x.q), w: x.w, n: x.n, tries: T.tries(x.n) }) + '</li>';
    }).join('') + '</ul>' : '<p class="note">' + T.mistakesNone + '</p>';

    var days = [], perDay = {};
    st.history.forEach(function (h) { perDay[h.date] = (perDay[h.date] || 0) + (h.seconds || 0); });
    for (var i = 13; i >= 0; i--) {
      var d = new Date(); d.setDate(d.getDate() - i);
      var ds = App.state.today(d);
      days.push({ label: ds.slice(8, 10) + '.' + ds.slice(5, 7), min: Math.round((perDay[ds] || 0) / 60) });
    }
    var maxMin = Math.max.apply(null, days.map(function (d) { return d.min; }).concat([15]));
    var hist = '<div class="hist">' + days.map(function (d) {
      return '<div class="hist-col"><span class="hist-val">' + (d.min || '') + '</span>' +
        '<div class="hist-bar" style="height:' + Math.round(d.min / maxMin * 100) + 'px"></div><span class="hist-day">' + d.label + '</span></div>';
    }).join('') + '</div>';

    return toggle + '<div class="stats">' + stats + '</div>' + heatHtml +
      '<section class="card"><h3>' + T.mistakesTitle + '</h3>' + mistakesHtml + '</section>' +
      '<section class="card"><h3>' + T.historyTitle + '</h3>' + hist + '</section>';
  },

  rewardsTab: function () {
    var T = App.T, ui = App.ui, st = App.state.data;
    var emojis = App.REWARD_EMOJI.map(function (e) { return '<option>' + e + '</option>'; }).join('');
    var types = Object.keys(T.rwTypes).map(function (k) { return '<option value="' + k + '">' + T.rwTypes[k] + '</option>'; }).join('');
    var planets = App.PLANETS.map(function (p) { return '<option value="' + p.id + '">' + T.planets[p.id] + ' (' + T.planetShort[p.id] + ')</option>'; }).join('');
    var list = st.rewards.length ? st.rewards.map(function (r) {
      var p = App.prizes.progress(r);
      return '<div class="rw-row">' +
        '<span class="rw-emoji">' + r.emoji + '</span>' +
        '<div class="rw-main"><b>' + ui.esc(r.name) + '</b><div class="note">' + App.prizes.condText(r) + ' · ' + p.cur + '/' + p.target +
          (r.showName ? '' : ' · 🙈') + '</div></div>' +
        '<span class="rw-status s-' + r.status + '">' + T.rwStatus[r.status] + '</span>' +
        (r.status === 'earned' ? '<button type="button" class="btn btn-small" data-give="' + r.id + '">' + T.rwGive + '</button>' : '') +
        '<button type="button" class="link-btn" data-del="' + r.id + '">' + T.rwDelete + '</button>' +
      '</div>';
    }).join('') : '<p class="note">' + T.rwNone + '</p>';

    return '<section class="card form-card"><h3>' + T.rwNew + '</h3>' +
        '<div class="form-grid">' +
          '<label>' + T.rwName + '<input id="rw-name" maxlength="30" placeholder="' + T.rwNamePh + '"></label>' +
          '<label>' + T.rwEmoji + '<select id="rw-emoji">' + emojis + '</select></label>' +
          '<label>' + T.rwType + '<select id="rw-type">' + types + '</select></label>' +
          '<label id="rw-num-wrap">' + T.rwTarget + '<input id="rw-num" type="number" min="1" max="365" value="7"></label>' +
          '<label id="rw-planet-wrap" hidden>' + T.rwTarget + '<select id="rw-planet">' + planets + '</select></label>' +
        '</div>' +
        '<label class="check"><input type="checkbox" id="rw-show"> ' + T.rwShowName + '</label>' +
        '<p class="error" id="rw-err"></p>' +
        '<button type="button" class="btn btn-small" id="rw-add">' + T.rwAdd + '</button>' +
      '</section>' +
      '<section class="card"><h3>' + T.rwList + '</h3>' + list + '</section>';
  },

  wireRewards: function () {
    var T = App.T, ui = App.ui, st = App.state.data;
    var type = ui.$('#rw-type');
    type.addEventListener('change', function () {
      var isPlanet = type.value === 'planet';
      ui.$('#rw-num-wrap').hidden = isPlanet;
      ui.$('#rw-planet-wrap').hidden = !isPlanet;
      ui.$('#rw-num').value = { streak: 7, days: 14, creatures: 10 }[type.value] || 7;
    });
    ui.on('#rw-add', 'click', function () {
      var name = ui.$('#rw-name').value.trim();
      if (!name) { ui.$('#rw-err').textContent = T.rwNameMissing; return; }
      var t = type.value;
      var target = t === 'planet' ? ui.$('#rw-planet').value : Math.max(1, Math.min(365, parseInt(ui.$('#rw-num').value, 10) || 1));
      st.rewards.push({
        id: 'r' + Date.now(), name: name, emoji: ui.$('#rw-emoji').value, type: t, target: target,
        showName: ui.$('#rw-show').checked, status: 'pending', created: App.state.today()
      });
      App.state.save();
      App.screens.parent('rewards');
      ui.toast(T.saved, 1500);
    });
    ui.root().querySelectorAll('[data-give]').forEach(function (b) {
      b.addEventListener('click', function () {
        var r = st.rewards.filter(function (x) { return x.id === b.getAttribute('data-give'); })[0];
        if (r) { r.status = 'given'; r.givenDate = App.state.today(); App.state.save(); }
        App.screens.parent('rewards');
      });
    });
    ui.root().querySelectorAll('[data-del]').forEach(function (b) {
      b.addEventListener('click', function () {
        st.rewards = st.rewards.filter(function (x) { return x.id !== b.getAttribute('data-del'); });
        App.state.save();
        App.screens.parent('rewards');
      });
    });
  },

  settingsTab: function () {
    var T = App.T, ui = App.ui, s = App.state.data.settings, pt = App.timer.ensureDay();
    var opt = function (vals, cur, fmt) {
      return vals.map(function (v) { return '<option value="' + v + '"' + (String(v) === String(cur) ? ' selected' : '') + '>' + fmt(v) + '</option>'; }).join('');
    };
    var mins = function (v) { return ui.fmt(T.minutes, { n: v }); };
    var hasPl = !!App.audio.polishVoice();
    // "Start subtraction from planet": only forward from the active one.
    var subs = App.q.planetsOf('sub'), act = App.q.activePlanet('sub');
    var startOpts = act ? subs.slice(subs.indexOf(act)).map(function (p) {
      return '<option value="' + p.id + '">' + T.planets[p.id] + ' (' + T.planetShort[p.id] + ')</option>';
    }).join('') : '';
    var startHtml = '<section class="card form-card"><h3>' + T.setSubStart + '</h3>' +
      (act ? '<div class="form-grid"><label><select id="s-substart">' + startOpts + '</select></label></div>' +
        '<p class="note">' + T.setSubStartNote + '</p>' : '<p class="note">' + T.setSubStartDone + '</p>') + '</section>';
    var tr = s.tracks === 'mul' || s.tracks === 'sub' ? s.tracks : 'both';
    return '<section class="card form-card"><div class="form-grid">' +
        '<label>' + T.setLimit + '<select id="s-limit">' + opt([5, 10, 15, 20, 30, 45, 60], s.dailyLimitMinutes, mins) + '</select></label>' +
        '<label>' + T.setQuestions + '<select id="s-q">' + opt([5, 10, 15], s.sessionLength, String) + '</select></label>' +
        '<label>' + T.setModes + '<select id="s-modes">' +
          '<option value="all"' + (s.modes !== 'classic' ? ' selected' : '') + '>' + T.setModesAll + '</option>' +
          '<option value="classic"' + (s.modes === 'classic' ? ' selected' : '') + '>' + T.setModesClassic + '</option></select></label>' +
        '<label>' + T.setTracks + '<select id="s-tracks">' +
          opt(['both', 'mul', 'sub'], tr, function (v) { return { both: T.setTracksBoth, mul: T.setTracksMul, sub: T.setTracksSub }[v]; }) + '</select></label>' +
      '</div></section>' + startHtml +
      '<section class="card form-card"><h3>' + T.setExtra + '</h3>' +
        '<p>' + ui.fmt(T.setExtraNow, { m: Math.round(App.timer.limitSec() / 60), u: Math.floor(pt.seconds / 60) }) + '</p>' +
        '<div class="row-btns"><button type="button" class="btn btn-small" data-extra="5">+5 min</button>' +
        '<button type="button" class="btn btn-small" data-extra="10">+10 min</button></div></section>' +
      '<section class="card form-card">' +
        '<label class="check"><input type="checkbox" id="s-speech"' + (s.speech ? ' checked' : '') + '> ' + T.setSpeech + '</label>' +
        '<p class="note">' + (hasPl ? T.setSpeechNote : T.setSpeechNone) + '</p>' +
        '<button type="button" class="link-btn" id="s-test">🔈 ' + T.setSpeechTest + '</button>' +
        '<label class="check"><input type="checkbox" id="s-sound"' + (s.sound ? ' checked' : '') + '> ' + T.setSound + '</label>' +
      '</section>';
  },

  wireSettings: function () {
    var ui = App.ui, s = App.state.data.settings, T = App.T;
    var saved = function () { App.state.save(); ui.toast(T.saved, 1200); };
    ui.$('#s-limit').addEventListener('change', function (e) { s.dailyLimitMinutes = +e.target.value; saved(); App.screens.parent('settings'); });
    ui.$('#s-q').addEventListener('change', function (e) { s.sessionLength = +e.target.value; saved(); });
    ui.$('#s-modes').addEventListener('change', function (e) { s.modes = e.target.value; saved(); });
    ui.$('#s-tracks').addEventListener('change', function (e) { s.tracks = e.target.value; saved(); });
    var subStart = ui.$('#s-substart');
    if (subStart) subStart.addEventListener('change', function (e) {
      // Earlier subtraction planets count as done (no creature); the chosen one becomes active.
      var st = App.state.data, list = App.q.planetsOf('sub');
      var target = list.filter(function (p) { return p.id === e.target.value; })[0];
      var i = list.indexOf(target);
      list.forEach(function (p, k) {
        var ps = st.planets[p.id];
        if (k < i && ps.status !== 'completed') { ps.status = 'completed'; ps.skipped = true; }
        else if (k === i) ps.status = 'active';
      });
      saved();
      App.screens.parent('settings');
    });
    ui.$('#s-speech').addEventListener('change', function (e) { s.speech = e.target.checked; saved(); });
    ui.$('#s-sound').addEventListener('change', function (e) { s.sound = e.target.checked; saved(); if (App.paintMute) App.paintMute(); });
    ui.on('#s-test', 'click', function () { App.audio.say('6 razy 7 to 42. Brawo!', true); });
    ui.root().querySelectorAll('[data-extra]').forEach(function (b) {
      b.addEventListener('click', function () {
        var pt = App.timer.ensureDay();
        pt.extraMinutes = (pt.extraMinutes || 0) + (+b.getAttribute('data-extra'));
        saved();
        App.screens.parent('settings');
      });
    });
  },

  certsTab: function () {
    var T = App.T, certs = App.prizes.certificates();
    if (!certs.length) return '<section class="card"><p class="note">' + T.certsNone + '</p></section>';
    return '<section class="card"><div class="cert-list">' + certs.map(function (c) {
      return '<div class="rw-row"><span class="rw-emoji">' + c.icon + '</span><div class="rw-main">' + c.reason + '</div>' +
        '<button type="button" class="btn btn-small" data-cert="' + c.id + '">' + T.certPrint + '</button></div>';
    }).join('') + '</div></section>';
  },

  wireCerts: function () {
    var certs = App.prizes.certificates();
    App.ui.root().querySelectorAll('[data-cert]').forEach(function (b) {
      b.addEventListener('click', function () {
        var c = certs.filter(function (x) { return x.id === b.getAttribute('data-cert'); })[0];
        if (c) App.screens.certificate(c);
      });
    });
  },

  backupTab: function () {
    var T = App.T;
    return '<section class="card form-card"><button type="button" class="btn btn-small" id="bk-export">💾 ' + T.bkExport + '</button>' +
        '<p class="note">' + T.bkExportNote + '</p></section>' +
      '<section class="card form-card"><h3>' + T.bkImport + '</h3><input type="file" id="bk-file" accept=".json,application/json">' +
        '<p class="note" id="bk-msg"></p><button type="button" class="btn btn-small" id="bk-apply" hidden>' + T.bkImportConfirm + '</button></section>' +
      '<section class="card form-card"><button type="button" class="btn btn-small danger" id="bk-reset">🗑️ ' + T.bkReset + '</button>' +
        '<p class="error" id="bk-reset-msg"></p></section>';
  },

  wireBackup: function () {
    var T = App.T, ui = App.ui, pending = null, resetArmed = 0;
    ui.on('#bk-export', 'click', function () {
      var blob = new Blob([JSON.stringify({ app: 'kosmiczne-zoo', exported: new Date().toISOString(), data: App.state.data }, null, 1)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'kosmiczne-zoo-' + App.state.today() + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    });
    ui.$('#bk-file').addEventListener('change', function (e) {
      var f = e.target.files[0];
      if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        try {
          var obj = JSON.parse(rd.result);
          if (obj.app !== 'kosmiczne-zoo' || !obj.data || !obj.data.player) throw new Error('bad');
          pending = obj.data;
          ui.$('#bk-msg').textContent = ui.fmt(T.bkImportReady, { name: obj.data.player.name });
          ui.$('#bk-apply').hidden = false;
        } catch (err) {
          pending = null;
          ui.$('#bk-msg').textContent = T.bkImportBad;
          ui.$('#bk-apply').hidden = true;
        }
      };
      rd.readAsText(f);
    });
    ui.on('#bk-apply', 'click', function () {
      if (!pending) return;
      App.state.replace(pending);
      location.reload();
    });
    ui.on('#bk-reset', 'click', function () {
      if (Date.now() - resetArmed < 6000) { App.state.wipe(); location.reload(); return; }
      resetArmed = Date.now();
      ui.$('#bk-reset-msg').textContent = T.bkResetConfirm;
    });
  }
};

App.screens.parent = function (tab) {
  var T = App.T, ui = App.ui, P = App.parent;
  tab = tab || 'progress';
  App.timer.setActive(false);
  var tabs = [['progress', T.tabProgress], ['rewards', T.tabRewards], ['settings', T.tabSettings], ['certs', T.tabCerts], ['backup', T.tabBackup]];
  var body = { progress: P.progressTab, rewards: P.rewardsTab, settings: P.settingsTab, certs: P.certsTab, backup: P.backupTab }[tab].call(P);
  ui.render(
    '<div class="screen parent">' +
      '<div class="topbar"><h1>' + T.gateTitle + '</h1><button class="link-btn" id="p-close">' + T.close + '</button></div>' +
      '<div class="tabs wrap">' + tabs.map(function (t) {
        return '<button type="button" class="tab' + (t[0] === tab ? ' on' : '') + '" data-ptab="' + t[0] + '">' + t[1] + '</button>';
      }).join('') + '</div>' +
      body +
    '</div>');
  ui.root().querySelectorAll('[data-ptab]').forEach(function (b) {
    b.addEventListener('click', function () { App.screens.parent(b.getAttribute('data-ptab')); });
  });
  ui.on('#p-close', 'click', function () { App.screens.home(); });
  ui.root().querySelectorAll('[data-ptrack]').forEach(function (b) {
    b.addEventListener('click', function () { P.progTrack = b.getAttribute('data-ptrack'); App.screens.parent('progress'); });
  });
  if (tab === 'rewards') P.wireRewards();
  if (tab === 'settings') P.wireSettings();
  if (tab === 'certs') P.wireCerts();
  if (tab === 'backup') P.wireBackup();
};

App.screens.certificate = function (c) {
  var T = App.T, ui = App.ui, st = App.state.data;
  var d = new Date();
  var date = c.date ? c.date.split('-').reverse().join('.') : ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear();
  ui.render(
    '<div class="screen cert-screen">' +
      '<div class="no-print row-btns"><button class="link-btn" id="c-back">⬅ ' + T.back + '</button>' +
        '<button class="btn btn-small" id="c-print">' + T.certPrint + '</button></div>' +
      '<div class="certificate">' +
        '<div class="cert-stars">⭐ ⭐ ⭐</div>' +
        '<div class="cert-title">' + T.certTitle + '</div>' +
        '<div class="cert-for">' + T.certFor + '</div>' +
        '<div class="cert-name">' + ui.esc(st.player.name) + '</div>' +
        '<div class="cert-reason">' + c.reason + '</div>' +
        '<div class="cert-art">' + App.art.avatar(st.player.avatar, 110) + (c.creature ? App.art.creature(c.creature, 110) : '<span class="cert-icon">' + c.icon + '</span>') +
          App.art.rocket(st.player.rocketColor, 110) + '</div>' +
        '<div class="cert-foot"><span>' + date + '</span><span>🚀 ' + T.certSign + '</span></div>' +
      '</div>' +
    '</div>', '#c-print');
  ui.on('#c-back', 'click', function () { App.screens.parent('certs'); });
  ui.on('#c-print', 'click', function () { window.print(); });
};
