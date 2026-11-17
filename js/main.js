// Home screen, "rocket sleeps" screen, and startup.
window.App = window.App || {};
App.screens = App.screens || {};

App.screens.home = function () {
  var T = App.T, ui = App.ui, art = App.art, st = App.state.data;
  if (App.timer.isOver()) return App.screens.sleep();

  var p = App.q.activePlanet();
  var streak = App.state.displayStreak();

  var nodes = App.PLANETS.map(function (pl) {
    var ps = st.planets[pl.id];
    return '<div class="planet-node ' + ps.status + '">' +
      (ps.status === 'active' ? '<div class="rocket-on">' + art.rocket(st.player.rocketColor, 44) + '</div>' : '') +
      art.planet(pl.color, 62, pl.ring) +
      (ps.status === 'completed' ? '<div class="creature-on">' + art.creature(pl.creature, 34) + '</div>' : '') +
      (ps.status === 'locked' ? '<div class="lock">🔒</div>' : '') +
      '<div class="planet-label">' + T.planetShort[pl.id] + '</div>' +
    '</div>';
  });

  var fuel = p ? st.planets[p.id].fuel : 0;
  var bossReady = p && fuel >= App.BOSS_FUEL;

  var fuelHtml = p
    ? '<div class="fuel"><div class="fuel-label">⛽ ' + T.fuel + ': ' + fuel + ' / ' + App.BOSS_FUEL + '</div>' +
      '<div class="bar"><span style="width:' + Math.round(fuel / App.BOSS_FUEL * 100) + '%"></span></div></div>'
    : '<p class="note">' + T.allDone + '</p>';

  var actions = bossReady
    ? '<p class="boss-ready">' + T.bossReady + '</p>' +
      '<button class="btn btn-boss" id="go-boss">' + T.startBoss + '</button>' +
      '<button class="link-btn" id="go">' + T.normalMission + '</button>'
    : '<button class="btn" id="go">' + T.startMission + '</button>';
  var modes = App.modes.available();
  if (modes.length > 1) {
    var nm = T.modes[App.modes.peek()];
    actions += '<p class="next-mode">' + ui.fmt(T.nextMode, { icon: nm.icon, name: nm.name }) + '</p>';
  }

  // The real-world reward closest to being earned, shown as a gift on the route.
  var gift = App.prizes.next(), giftHtml = '';
  if (gift) {
    var gp = App.prizes.progress(gift);
    giftHtml = '<div class="gift-strip"><span class="gift-icon">🎁</span><div class="gift-body">' +
      '<b>' + ui.esc(App.prizes.label(gift)) + '</b><span>' + App.prizes.childText(gift) + '</span>' +
      '<div class="bar"><span style="width:' + Math.round(gp.cur / gp.target * 100) + '%"></span></div></div></div>';
  }
  var toCollect = st.rewards.filter(function (r) { return r.status === 'earned'; }).length;

  var col = App.collection;
  var lastCreature = st.creatures[st.creatures.length - 1];
  var eggReady = col.eggReady();
  var nestSub = !st.egg ? T.nestEmpty : (eggReady ? T.nestReady : ui.fmt(T.nestWaiting, { n: T.playDays(st.egg.daysLeft) }));
  var nestPic = st.egg
    ? '<div class="nest-pic' + (st.egg.daysLeft <= 1 ? ' egg-wobble' : '') + '">' + art.egg(st.egg.color, 64, eggReady) + '</div>'
    : art.nest(64);
  var tiles =
    '<div class="tiles">' +
      '<button class="tile" id="go-base">' + art.deco('domek', 64) + '<b>' + T.baseTile + '</b><span>' + T.baseTileSub + '</span></button>' +
      '<button class="tile" id="go-album">' +
        (lastCreature ? art.creature(lastCreature, 64) : '<span class="silhouette">' + art.creature('kot', 64) + '</span>') +
        '<b>' + T.albumTile + '</b><span>' + ui.fmt(T.albumCount, { c: col.count(), n: col.all().length }) + '</span></button>' +
      (eggReady
        ? '<button class="tile tile-ready" id="go-hatch">' + nestPic + '<b>' + T.nestTile + '</b><span>' + nestSub + '</span></button>'
        : '<div class="tile">' + nestPic + '<b>' + T.nestTile + '</b><span>' + nestSub + '</span></div>') +
      (st.rewards.length
        ? '<button class="tile' + (toCollect ? ' tile-ready' : '') + '" id="go-rewards"><span class="tile-emoji">🎁</span><b>' + T.rewardsTile + '</b><span>' +
          (toCollect ? ui.fmt(T.rewardsTileSub, { n: toCollect }) : T.rewardsTileNone) + '</span></button>'
        : '') +
    '</div>';

  ui.render(
    '<div class="screen home">' +
      '<header class="home-head">' +
        '<div class="who">' + art.avatar(st.player.avatar, 68) +
          '<div><div class="hello">' + ui.fmt(T.hello, { name: ui.esc(st.player.name) }) + '</div>' +
          '<div class="sub">' + ui.fmt(T.rocketWaits, { rocket: ui.esc(st.player.rocketName) }) + '</div></div></div>' +
        '<div class="pills"><span class="pill" title="' + T.streakTitle + '">🔥 ' + streak + '</span>' +
          '<span class="pill" title="' + T.starsTitle + '">⭐ ' + st.stars + '</span></div>' +
      '</header>' +
      '<section class="galaxy">' + nodes.join('<div class="path"></div>') + '</section>' +
      '<h2 class="planet-name">' + (p ? T.planets[p.id] : T.mixedGalaxy) + '</h2>' +
      fuelHtml + giftHtml +
      '<div class="actions">' + actions + '</div>' +
      '<p class="time-left">⏳ ' + ui.fmt(T.timeLeft, { m: App.timer.minutesLeft() }) + '</p>' +
      tiles +
      '<div class="foot-links"><button class="link-btn" id="go-profile">' + T.profileLink + '</button>' +
        '<button class="link-btn" id="go-parent">' + T.parentLink + '</button></div>' +
    '</div>', bossReady ? '#go-boss' : '#go');

  ui.on('#go', 'click', function () { App.modes.start(); });
  ui.on('#go-parent', 'click', function () { App.screens.parentGate(); });
  ui.on('#go-rewards', 'click', function () { App.screens.myRewards(); });
  ui.on('#go-boss', 'click', function () { App.mission.start('boss'); });
  ui.on('#go-profile', 'click', function () { App.screens.profile(false); });
  ui.on('#go-base', 'click', function () { App.screens.base(); });
  ui.on('#go-album', 'click', function () { App.screens.album(); });
  ui.on('#go-hatch', 'click', function () { App.screens.hatch(function () { App.screens.home(); }); });
};

App.screens.sleep = function () {
  var T = App.T, ui = App.ui, art = App.art, st = App.state.data;
  App.timer.setActive(false);
  ui.render(
    '<div class="screen sleep">' +
      art.moon(140) +
      '<h1>' + T.sleepTitle + '</h1>' +
      '<div class="sleep-rocket">' + art.rocket(st.player.rocketColor, 100, false) + '<span class="zzz">Z z z</span></div>' +
      '<p class="big">' + ui.fmt(T.sleepText, { name: ui.esc(st.player.name) }) + '</p>' +
      '<div class="pills"><span class="pill">🔥 ' + App.state.displayStreak() + '</span><span class="pill">⭐ ' + st.stars + '</span></div>' +
      '<div class="foot-links"><button class="link-btn" id="go-album">' + T.album + '</button>' +
        (st.rewards.length ? '<button class="link-btn" id="go-rewards">🎁 ' + T.rewardsTile + '</button>' : '') +
        '<button class="link-btn" id="go-parent">' + T.parentLink + '</button></div>' +
    '</div>');
  ui.on('#go-album', 'click', function () { App.screens.album(); });
  ui.on('#go-rewards', 'click', function () { App.screens.myRewards(); });
  ui.on('#go-parent', 'click', function () { App.screens.parentGate(); });
  // If the page stays open past midnight, wake the rocket up.
  ui.sleepCheck = setInterval(function () { if (!App.timer.isOver()) App.screens.home(); }, 30000);
};

(function start() {
  App.state.load();
  App.timer.init();

  var mute = document.getElementById('mute');
  function paintMute() {
    var on = App.state.data.settings.sound;
    mute.textContent = on ? '🔊' : '🔇';
    mute.title = on ? App.T.soundOn : App.T.soundOff;
  }
  paintMute();
  App.paintMute = paintMute;
  mute.addEventListener('click', function () {
    App.state.data.settings.sound = !App.state.data.settings.sound;
    App.state.save();
    paintMute();
    mute.blur();
    var input = document.getElementById('q-input');
    if (input) input.focus();
  });

  // Browsers only allow sound after the first click or key press.
  var unlock = function () { App.audio.ensure(); };
  document.addEventListener('keydown', unlock, { once: true });
  document.addEventListener('mousedown', unlock, { once: true });

  if (!App.state.storageOk) {
    var b = document.getElementById('banner');
    b.textContent = App.T.storageWarn;
    b.hidden = false;
  }

  if (!App.state.data.player) App.screens.profile(true);
  else App.screens.home();
})();
