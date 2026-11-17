// Creature collection: album, eggs and hatching.
window.App = window.App || {};
App.screens = App.screens || {};

App.EGG_DAYS = 3;     // days of play until an egg hatches
App.EGG_PRICE = 60;   // egg price in the shop
App.EGG_COLORS = ['#ff8fab', '#4cc9f0', '#80ed99', '#c77dff', '#ffd166'];

App.collection = {
  species: function () { return App.PLANETS.map(function (p) { return p.creature; }); },
  variants: function (sp) { return [sp, sp + '-2', sp + '-3']; },
  all: function () {
    var self = this;
    return this.species().reduce(function (out, sp) { return out.concat(self.variants(sp)); }, []);
  },
  owned: function (id) { return App.state.data.creatures.indexOf(id) >= 0; },
  count: function () {
    var self = this;
    return this.all().filter(function (id) { return self.owned(id); }).length;
  },
  variantOf: function (id) { return +(String(id).split('-')[1] || 1); },

  newEgg: function () {
    var st = App.state.data;
    st.egg = { daysLeft: App.EGG_DAYS, color: App.ui.pickOne(App.EGG_COLORS) };
    st.eggsReceived++;
  },

  // Called once per day of play (when the streak day is counted).
  tickEgg: function () {
    var egg = App.state.data.egg;
    if (egg && egg.daysLeft > 0) egg.daysLeft--;
    return !!(egg && egg.daysLeft <= 0);
  },

  eggReady: function () { var e = App.state.data.egg; return !!(e && e.daysLeft <= 0); },

  // Eggs hatch into colour variants of creatures from planets she has reached.
  hatchEgg: function () {
    var st = App.state.data, self = this;
    var reached = App.PLANETS.filter(function (p) { return st.planets[p.id].status !== 'locked'; })
      .map(function (p) { return p.creature; });
    var alts = [], rares = [];
    reached.forEach(function (sp) {
      if (!self.owned(sp + '-2')) alts.push(sp + '-2');
      if (!self.owned(sp + '-3')) rares.push(sp + '-3');
    });
    st.egg = null;
    var pickFrom = (rares.length && (Math.random() < 0.2 || !alts.length)) ? rares : alts;
    if (!pickFrom.length) {
      st.stars += 40;
      App.state.save();
      return { creature: null, stars: 40 };
    }
    var id = App.ui.pickOne(pickFrom);
    st.creatures.push(id);
    App.state.save();
    return { creature: id, rare: self.variantOf(id) === 3 };
  }
};

App.screens.album = function () {
  var T = App.T, ui = App.ui, art = App.art, st = App.state.data, col = App.collection;
  var rows = App.PLANETS.map(function (p) {
    var slots = col.variants(p.creature).map(function (id, i) {
      var have = col.owned(id);
      var badge = i === 0 ? '🏆' : (i === 1 ? '🥚' : '✨');
      return '<div class="slot' + (have ? ' owned' : ' missing') + (i === 2 ? ' rare-slot' : '') + '">' +
        '<span class="slot-badge">' + badge + '</span>' +
        art.creature(id, 84) +
        '<div class="slot-name">' + (have ? T.creatures[id] : T.unknown) + '</div></div>';
    }).join('');
    var locked = st.planets[p.id].status === 'locked';
    return '<div class="album-row' + (locked ? ' locked' : '') + '">' +
      '<div class="album-planet">' + art.planet(p.color, 48, p.ring) + '<span>' + T.planetShort[p.id] + '</span></div>' +
      '<div class="album-slots">' + slots + '</div></div>';
  }).join('');

  ui.render(
    '<div class="screen album">' +
      '<div class="topbar"><button class="link-btn" id="back">⬅ ' + T.back + '</button>' +
        '<h1>' + T.albumTitle + '</h1>' +
        '<span class="pill">' + ui.fmt(T.albumCount, { c: col.count(), n: col.all().length }) + '</span></div>' +
      '<p class="note">' + T.albumLegend + '</p>' +
      '<div class="album-grid">' + rows + '</div>' +
    '</div>', '#back');
  ui.on('#back', 'click', function () { App.screens.home(); });
};

App.screens.hatch = function (then) {
  var T = App.T, ui = App.ui, art = App.art, st = App.state.data, done = false;
  var color = st.egg ? st.egg.color : App.EGG_COLORS[0];

  ui.render(
    '<div class="screen hatch">' +
      '<h1>' + T.hatchTitle + '</h1>' +
      '<div class="hatch-stage" id="h-stage"><div class="egg-wobble">' + art.egg(color, 200, true) + '</div></div>' +
      '<p class="big" id="h-msg"></p>' +
      '<button class="btn" id="h-btn">' + T.hatchBtn + '</button>' +
    '</div>', '#h-btn');

  ui.on('#h-btn', 'click', function (e, btn) {
    if (done) { then(); return; }
    done = true;
    var res = App.collection.hatchEgg();
    var stage = ui.$('#h-stage');
    if (res.creature) {
      stage.innerHTML = '<div class="pop rescued">' + art.creature(res.creature, 200) + '</div>';
      ui.$('#h-msg').innerHTML = (res.rare ? '<b class="rare-label">' + T.hatchRare + '</b><br>' : '') +
        '<b>' + T.creatures[res.creature] + '</b><br>' + T.hatchNew;
    } else {
      stage.innerHTML = '<div class="pop big-emoji">⭐</div>';
      ui.$('#h-msg').textContent = ui.fmt(T.hatchStars, { n: res.stars });
    }
    ui.confetti();
    App.audio.play('win');
    btn.textContent = T.next;
    ui.shownAt = Date.now();
  });
};
