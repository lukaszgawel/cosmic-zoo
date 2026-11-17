// Space base: place decorations and creatures on a grid, buy decorations in the shop.
window.App = window.App || {};
App.screens = App.screens || {};

App.DECOR = [
  { id: 'kwiatek', price: 15 }, { id: 'flaga', price: 20 }, { id: 'krysztal', price: 20 },
  { id: 'grzybek', price: 25 }, { id: 'lampa', price: 25 }, { id: 'drzewko', price: 30 },
  { id: 'domek', price: 50 }, { id: 'teleskop', price: 60 }, { id: 'zjezdzalnia', price: 70 },
  { id: 'fontanna', price: 80 }, { id: 'tecza', price: 100 }, { id: 'zamek', price: 150 }
];
App.BASE_COLS = 8;
App.BASE_ROWS = 5;

App.screens.base = function () {
  var T = App.T, ui = App.ui, art = App.art, st = App.state.data;
  if (App.timer.isOver()) return App.screens.sleep();
  var view = { tab: 'mine', sel: null }; // sel = { type, id }

  ui.render(
    '<div class="screen base">' +
      '<div class="topbar"><button class="link-btn" id="back">⬅ ' + T.back + '</button>' +
        '<h1>🏠 ' + T.baseTitle + '</h1><span class="pill" id="b-stars"></span></div>' +
      '<div id="b-root" class="b-root"></div>' +
    '</div>', '#back');

  App.timer.setActive(true);
  App.timer.onLimit = function () { leave(App.screens.sleep); };

  function leave(next) {
    App.timer.setActive(false);
    App.timer.onLimit = null;
    next();
  }

  function at(x, y) { return st.base.filter(function (b) { return b.x === x && b.y === y; })[0] || null; }
  function placedCount(type, id) { return st.base.filter(function (b) { return b.type === type && b.id === id; }).length; }
  function itemsLeft(id) { return (st.decorations[id] || 0) - placedCount('item', id); }
  function nameOf(s) { return s.type === 'item' ? T.decor[s.id] : T.creatures[s.id]; }
  function draw1(s, size) { return s.type === 'item' ? art.deco(s.id, size) : art.creature(s.id, size); }

  function tray() {
    var things = [];
    App.DECOR.forEach(function (d) { var n = itemsLeft(d.id); if (n > 0) things.push({ type: 'item', id: d.id, n: n }); });
    st.creatures.forEach(function (c) { if (!placedCount('creature', c)) things.push({ type: 'creature', id: c, n: 1 }); });
    return things;
  }

  function draw() {
    if (view.sel && (view.sel.type === 'item' ? itemsLeft(view.sel.id) : 1 - placedCount('creature', view.sel.id)) <= 0) view.sel = null;
    var cells = '';
    for (var y = 0; y < App.BASE_ROWS; y++) {
      for (var x = 0; x < App.BASE_COLS; x++) {
        var b = at(x, y);
        cells += '<button type="button" class="cell' + (b ? ' filled' : (view.sel ? ' target' : '')) + '" data-x="' + x + '" data-y="' + y + '"' +
          ' aria-label="' + (b ? ui.esc(nameOf(b)) : (x + 1) + ',' + (y + 1)) + '">' + (b ? draw1(b, 64) : '') + '</button>';
      }
    }

    var hint = view.sel ? ui.fmt(T.baseHintPlace, { name: nameOf(view.sel) }) : T.baseHintPick;

    var body;
    if (view.tab === 'mine') {
      var things = tray();
      body = things.length ? things.map(function (s) {
        var on = view.sel && view.sel.type === s.type && view.sel.id === s.id;
        return '<button type="button" class="tray-item' + (on ? ' selected' : '') + '" data-pick="' + s.type + ':' + s.id + '">' +
          draw1(s, 60) + '<span>' + nameOf(s) + (s.n > 1 ? ' ×' + s.n : '') + '</span></button>';
      }).join('') : '<p class="note">' + T.trayEmpty + '</p>';
    } else {
      body = App.DECOR.map(function (d) {
        var can = st.stars >= d.price;
        return '<div class="shop-item">' + art.deco(d.id, 60) + '<span class="shop-name">' + T.decor[d.id] + '</span>' +
          '<button type="button" class="btn btn-small" data-buy="' + d.id + '"' + (can ? '' : ' disabled') + '>' +
          (can ? T.buy + ' ' + d.price + ' ⭐' : ui.fmt(T.missing, { n: d.price - st.stars })) + '</button></div>';
      }).join('');
      var canEgg = !st.egg && st.stars >= App.EGG_PRICE;
      body += '<div class="shop-item">' + art.egg(App.EGG_COLORS[3], 60) + '<span class="shop-name">' + T.eggName + '</span>' +
        '<button type="button" class="btn btn-small" data-buy="egg"' + (canEgg ? '' : ' disabled') + '>' +
        (st.egg ? T.nestBusy : (canEgg ? T.buy + ' ' + App.EGG_PRICE + ' ⭐' : ui.fmt(T.missing, { n: App.EGG_PRICE - st.stars }))) + '</button></div>';
    }

    ui.$('#b-root').innerHTML =
      '<div class="base-grid" style="grid-template-columns:repeat(' + App.BASE_COLS + ',1fr)">' + cells + '</div>' +
      '<p class="base-hint">' + hint + '</p>' +
      '<div class="tabs"><button type="button" class="tab' + (view.tab === 'mine' ? ' on' : '') + '" data-tab="mine">' + T.tabMine + '</button>' +
        '<button type="button" class="tab' + (view.tab === 'shop' ? ' on' : '') + '" data-tab="shop">' + T.tabShop + '</button></div>' +
      '<div class="tray ' + (view.tab === 'shop' ? 'shop' : '') + '">' + body + '</div>';
    ui.$('#b-stars').textContent = '⭐ ' + st.stars;
  }

  ui.$('#b-root').addEventListener('click', function (e) {
    var el = e.target.closest('button');
    if (!el || el.disabled) return;
    if (App.timer.isOver()) return leave(App.screens.sleep);

    if (el.hasAttribute('data-tab')) {
      view.tab = el.getAttribute('data-tab');
    } else if (el.hasAttribute('data-pick')) {
      var parts = el.getAttribute('data-pick').split(':');
      var same = view.sel && view.sel.type === parts[0] && view.sel.id === parts[1];
      view.sel = same ? null : { type: parts[0], id: parts[1] };
      App.audio.play('click');
    } else if (el.hasAttribute('data-x')) {
      var x = +el.getAttribute('data-x'), y = +el.getAttribute('data-y'), b = at(x, y);
      if (b) {
        if (view.sel) { ui.toast(T.cellTaken, 1500); return; }
        st.base.splice(st.base.indexOf(b), 1);   // pick it back up into the backpack
        App.audio.play('click');
      } else if (view.sel) {
        st.base.push({ type: view.sel.type, id: view.sel.id, x: x, y: y });
        App.audio.play('pop');
      } else {
        return;
      }
      App.state.save();
    } else if (el.hasAttribute('data-buy')) {
      var id = el.getAttribute('data-buy');
      if (id === 'egg') {
        if (st.egg || st.stars < App.EGG_PRICE) return;
        st.stars -= App.EGG_PRICE;
        App.collection.newEgg();
        ui.toast(T.eggBought, 2500);
      } else {
        var d = App.DECOR.filter(function (x) { return x.id === id; })[0];
        if (!d || st.stars < d.price) return;
        st.stars -= d.price;
        st.decorations[id] = (st.decorations[id] || 0) + 1;
        ui.toast(ui.fmt(T.bought, { name: T.decor[id] }), 2500);
      }
      App.audio.play('coin');
      App.state.save();
    } else {
      return;
    }
    draw();
  });

  ui.on('#back', 'click', function () { leave(App.screens.home); });
  draw();
};
