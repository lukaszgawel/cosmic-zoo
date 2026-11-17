// Short sounds generated with the Web Audio API (no audio files needed).
window.App = window.App || {};

App.audio = {
  ctx: null,

  ensure: function () {
    if (!this.ctx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (C) this.ctx = new C();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },

  tone: function (freq, start, dur, type, vol) {
    var c = this.ctx, o = c.createOscillator(), g = c.createGain();
    var t = c.currentTime + start;
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.15, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  },

  sounds: {
    correct: [[660, 0, 0.12], [880, 0.1, 0.22]],
    fast: [[880, 0, 0.08], [1175, 0.07, 0.08], [1568, 0.14, 0.18]],
    wrong: [[330, 0, 0.18, 'triangle'], [262, 0.15, 0.28, 'triangle']],
    win: [[523, 0, 0.15], [659, 0.12, 0.15], [784, 0.24, 0.15], [1047, 0.36, 0.45]],
    chest: [[392, 0, 0.1], [523, 0.1, 0.1], [659, 0.2, 0.1], [784, 0.3, 0.1], [1047, 0.4, 0.4]],
    click: [[600, 0, 0.05]],
    pop: [[520, 0, 0.06], [780, 0.05, 0.1]],
    coin: [[988, 0, 0.08], [1319, 0.08, 0.25]],
    warn: [[440, 0, 0.2, 'triangle'], [349, 0.2, 0.35, 'triangle']]
  },

  // Read text aloud in Polish (optional, switched on in the parent panel).
  polishVoice: function () {
    if (!window.speechSynthesis) return null;
    return speechSynthesis.getVoices().filter(function (v) { return /^pl/i.test(v.lang); })[0] || null;
  },

  say: function (text, force) {
    if (!window.speechSynthesis || !App.state.data) return;
    if (!force && !App.state.data.settings.speech) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'pl-PL';
      u.rate = 0.9;
      var v = this.polishVoice();
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) { /* speech is optional */ }
  },

  play: function (name) {
    if (!App.state.data || !App.state.data.settings.sound) return;
    var c = this.ensure(), self = this;
    if (!c) return;
    (this.sounds[name] || []).forEach(function (n) { self.tone(n[0], n[1], n[2], n[3]); });
  }
};
