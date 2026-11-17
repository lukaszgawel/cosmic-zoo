// Mission types: which ones are unlocked, rotation between them, and the intro card.
window.App = window.App || {};
App.screens = App.screens || {};

App.modes = {
  // Classic from day 1, meteor shower from day 3, feeding from day 5,
  // missing number after planet ×4 is rescued.
  available: function () {
    var st = App.state.data;
    if (st.settings.modes === 'classic') return ['classic'];
    var a = ['classic'];
    if (st.daysPlayed >= 3) a.push('meteor');
    if (st.daysPlayed >= 5) a.push('feed');
    if (st.planets.p5 && st.planets.p5.status === 'completed') a.push('missing');
    return a;
  },

  peek: function () {
    var a = this.available();
    return a[(App.state.data.modeIdx || 0) % a.length];
  },

  // Start the next normal mission (Boss fights always use the classic mode).
  start: function () {
    if (App.timer.isOver()) return App.screens.sleep();
    var st = App.state.data, mode = this.peek(), self = this;
    st.modeIdx = (st.modeIdx || 0) + 1;
    App.state.save();
    if (mode !== 'classic' && !st.seenModes[mode]) {
      st.seenModes[mode] = true;
      App.state.save();
      return App.screens.modeIntro(mode, function () { self.launch(mode); });
    }
    this.launch(mode);
  },

  launch: function (mode) {
    if (mode === 'meteor') App.meteor.start();
    else if (mode === 'feed') App.feed.start();
    else App.mission.start('normal', mode === 'missing');
  }
};

App.screens.modeIntro = function (mode, go) {
  var T = App.T, ui = App.ui, info = T.modes[mode];
  ui.render(
    '<div class="screen mode-intro">' +
      '<div class="mode-icon pop">' + info.icon + '</div>' +
      '<p class="note">' + T.newGame + '</p>' +
      '<h1>' + info.name + '</h1>' +
      '<p class="big">' + info.howTo + '</p>' +
      '<button class="btn" id="go">' + T.startPlaying + '</button>' +
    '</div>', '#go');
  App.audio.play('win');
  App.audio.say(info.name + '. ' + info.howTo);
  ui.on('#go', 'click', go);
};
