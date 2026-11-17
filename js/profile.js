// First launch (name, avatar, rocket) and the short intro story.
window.App = window.App || {};
App.screens = App.screens || {};

App.screens.profile = function (isNew) {
  var T = App.T, ui = App.ui, art = App.art, st = App.state.data;
  var pl = st.player || { name: '', avatar: 'astronautka', rocketName: '', rocketColor: art.rocketColors[0] };
  var sel = { avatar: pl.avatar, color: pl.rocketColor };

  var avatarsHtml = art.avatarIds.map(function (id) {
    return '<button type="button" class="choice' + (id === sel.avatar ? ' selected' : '') + '" data-avatar="' + id + '">' +
      art.avatar(id, 84) + '<span>' + T.avatars[id] + '</span></button>';
  }).join('');

  var colorsHtml = art.rocketColors.map(function (c) {
    return '<button type="button" class="swatch' + (c === sel.color ? ' selected' : '') + '" data-color="' + c + '" style="background:' + c + '" aria-label="' + c + '"></button>';
  }).join('');

  ui.render(
    '<form class="screen profile" id="profile-form" autocomplete="off">' +
      '<h1>' + (isNew ? T.profileTitleNew : T.profileTitleEdit) + '</h1>' +
      '<label class="field"><span>' + T.askName + '</span>' +
        '<input id="p-name" maxlength="15" value="' + ui.esc(pl.name) + '"></label>' +
      '<div class="field"><span>' + T.pickAvatar + '</span><div class="choices">' + avatarsHtml + '</div></div>' +
      '<div class="rocket-row">' +
        '<div class="rocket-fields">' +
          '<label class="field"><span>' + T.rocketName + '</span>' +
            '<input id="p-rocket" maxlength="15" placeholder="' + T.rocketNamePlaceholder + '" value="' + ui.esc(pl.rocketName) + '"></label>' +
          '<div class="field"><span>' + T.pickColor + '</span><div class="swatches">' + colorsHtml + '</div></div>' +
        '</div>' +
        '<div class="rocket-preview" id="p-preview">' + art.rocket(sel.color, 130) + '</div>' +
      '</div>' +
      '<p class="error" id="p-error"></p>' +
      '<div class="actions">' +
        '<button type="submit" class="btn">' + (isNew ? T.letsGo : T.save) + '</button>' +
        (isNew ? '' : '<button type="button" class="link-btn" id="p-back">' + T.back + '</button>') +
      '</div>' +
    '</form>', '#p-name');

  ui.on('[data-avatar]', 'click', function (e, el) {
    sel.avatar = el.getAttribute('data-avatar');
    ui.root().querySelectorAll('[data-avatar]').forEach(function (b) { b.classList.toggle('selected', b === el); });
    App.audio.play('click');
  });
  ui.on('[data-color]', 'click', function (e, el) {
    sel.color = el.getAttribute('data-color');
    ui.root().querySelectorAll('[data-color]').forEach(function (b) { b.classList.toggle('selected', b === el); });
    ui.$('#p-preview').innerHTML = art.rocket(sel.color, 130);
    App.audio.play('click');
  });
  // Enter in the name field moves on to the avatar choice instead of submitting.
  ui.$('#p-name').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); var b = ui.$('.choice.selected'); if (b) b.focus(); }
  });
  ui.on('#p-back', 'click', function () { App.screens.home(); });

  ui.$('#profile-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = ui.$('#p-name').value.trim();
    if (!name) {
      ui.$('#p-error').textContent = T.nameMissing;
      ui.$('#p-name').focus();
      return;
    }
    st.player = {
      name: name,
      avatar: sel.avatar,
      rocketName: ui.$('#p-rocket').value.trim() || T.rocketNameDefault,
      rocketColor: sel.color
    };
    App.state.save();
    if (isNew) App.screens.intro(0); else App.screens.home();
  });
};

App.screens.intro = function (i) {
  var T = App.T, ui = App.ui, art = App.art, pl = App.state.data.player;
  var pics = [
    '<div class="intro-rocket">' + art.rocket(pl.rocketColor, 130) + '</div>' + art.planet('#ffd166', 90) + art.planet('#06d6a0', 70, true),
    art.creature('kot', 100) + art.creature('jednorozec', 100) + art.creature('lis', 100) + art.creature('osmiornica', 100),
    '<div class="intro-problem">3 × 4 = 12 ✅</div>' + art.rocket(pl.rocketColor, 110) + art.monster(90)
  ];
  var last = i === pics.length - 1;
  var dots = pics.map(function (_, k) { return '<span class="' + (k === i ? 'on' : '') + '"></span>'; }).join('');

  ui.render(
    '<div class="screen intro">' +
      '<div class="intro-pic">' + pics[i] + '</div>' +
      '<p class="big">' + ui.fmt(T.intro[i], { name: ui.esc(pl.name), rocket: ui.esc(pl.rocketName) }) + '</p>' +
      '<div class="step-dots">' + dots + '</div>' +
      '<button class="btn" id="next">' + (last ? T.startPlaying : T.next) + '</button>' +
    '</div>', '#next');

  ui.on('#next', 'click', function () {
    App.audio.play('click');
    if (last) App.screens.home(); else App.screens.intro(i + 1);
  });
};
