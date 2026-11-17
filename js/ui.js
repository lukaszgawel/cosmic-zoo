// Small UI helpers shared by all screens.
window.App = window.App || {};
App.screens = App.screens || {};

App.ui = {
  shownAt: 0,
  sleepCheck: null,

  root: function () { return document.getElementById('app'); },
  $: function (sel) { return App.ui.root().querySelector(sel); },

  // Replace the screen. The focus is delayed so an Enter press from the
  // previous screen can't accidentally "click" a button on the new one.
  render: function (html, focusSel) {
    clearInterval(this.sleepCheck);
    this.root().innerHTML = html;
    this.shownAt = Date.now();
    window.scrollTo(0, 0);
    if (focusSel) {
      var self = this;
      setTimeout(function () { var el = self.$(focusSel); if (el) el.focus(); }, 350);
    }
  },

  ready: function () { return Date.now() - this.shownAt > 350; },

  on: function (sel, ev, fn) {
    var self = this;
    this.root().querySelectorAll(sel).forEach(function (el) {
      el.addEventListener(ev, function (e) {
        if (ev === 'click' && !self.ready()) return;
        fn(e, el);
      });
    });
  },

  esc: function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  },

  fmt: function (str, params) {
    return str.replace(/\{(\w+)\}/g, function (m, k) { return params[k] !== undefined ? params[k] : m; });
  },

  pickOne: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },

  toast: function (msg, ms) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._toastT);
    this._toastT = setTimeout(function () { el.classList.remove('show'); }, ms || 3000);
  },

  confetti: function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var colors = ['#ffd166', '#ef476f', '#06d6a0', '#4cc9f0', '#c77dff', '#ff8c42'];
    var box = document.createElement('div');
    box.className = 'confetti';
    for (var i = 0; i < 90; i++) {
      var p = document.createElement('span');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = (2 + Math.random() * 2) + 's';
      p.style.animationDelay = (Math.random() * 0.6) + 's';
      p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 5000);
  }
};
