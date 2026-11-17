// Daily play-time tracking and the daily limit (15 minutes by default).
// Only active play counts: a mission is open, the window is visible,
// and there was keyboard/mouse activity in the last minute.
window.App = window.App || {};

App.timer = {
  active: false,
  lastInput: Date.now(),
  warnedDate: null,
  onLimit: null,

  init: function () {
    var self = this;
    var mark = function () { self.lastInput = Date.now(); };
    ['keydown', 'mousedown', 'mousemove', 'touchstart'].forEach(function (e) {
      document.addEventListener(e, mark, { passive: true });
    });
    setInterval(function () { self.tick(); }, 1000);
  },

  ensureDay: function () {
    var pt = App.state.data.playTime, t = App.state.today();
    if (pt.date !== t) { pt.date = t; pt.seconds = 0; pt.extraMinutes = 0; }
    return pt;
  },

  limitSec: function () {
    var pt = this.ensureDay();
    return (App.state.data.settings.dailyLimitMinutes + (pt.extraMinutes || 0)) * 60;
  },

  isOver: function () { return this.ensureDay().seconds >= this.limitSec(); },

  minutesLeft: function () {
    return Math.max(0, Math.ceil((this.limitSec() - this.ensureDay().seconds) / 60));
  },

  setActive: function (v) {
    this.active = v;
    if (v) this.lastInput = Date.now();
  },

  tick: function () {
    if (!this.active || document.hidden || Date.now() - this.lastInput > 60000) return;
    var pt = this.ensureDay();
    pt.seconds++;
    if (pt.seconds % 5 === 0) App.state.save();
    var lim = this.limitSec();
    if (pt.seconds >= lim - 180 && pt.seconds < lim && this.warnedDate !== pt.date) {
      this.warnedDate = pt.date;
      App.ui.toast(App.T.warn, 6000);
      App.audio.play('warn');
    }
    // Screens without questions (the base) use this hook to end play for the day.
    if (pt.seconds >= lim && this.onLimit) this.onLimit();
  }
};
