// Operation strategies. Everything that depends on the kind of arithmetic
// (multiplication now, subtraction later) lives here, so the game modes
// never compute an answer or draw a problem themselves.
//
// A question is { op, a, b, miss? }: op picks the strategy ('mul' or 'sub'),
// a and b are the operands, miss is 'a' / 'b' for the "missing number" mode.
window.App = window.App || {};

App.ops = {};

// keyOf(q) identifies the problem itself (no repeats in a row); statKey(q) is
// where its practice is recorded (mastery, mistakes). They differ only for
// two-digit subtraction, which is credited to the basic fact behind it.
//
// Strategy for a question (old saved queues may have no op: they are multiplication).
App.opOf = function (q) { return App.ops[(q && q.op) || 'mul']; };

App.ops.mul = (function () {
  var SYM = ' × ';

  // Commutative pairs share one stats entry: 3x7 and 7x3 are the same fact.
  function key(a, b) { return Math.min(a, b) + 'x' + Math.max(a, b); }
  function keyOf(q) { return key(q.a, q.b); }
  function result(q) { return q.a * q.b; }
  function answer(q) { return q.miss === 'a' ? q.a : (q.miss === 'b' ? q.b : q.a * q.b); }
  function fact(a, b) { return { op: 'mul', a: a, b: b }; }

  // The problem split around the answer field: left [input] right.
  function parts(q) {
    var p = q.a * q.b;
    if (q.miss === 'a') return { left: '', right: SYM + q.b + ' = ' + p };
    if (q.miss === 'b') return { left: q.a + SYM, right: ' = ' + p };
    return { left: q.a + SYM + q.b + ' = ', right: '' };
  }

  // Short form for meteors and cards: "6 × 7".
  function label(q) { return q.a + SYM + q.b; }

  function speech(q) {
    var p = q.a * q.b;
    if (q.miss === 'a') return 'ile razy ' + q.b + ' daje ' + p;
    if (q.miss === 'b') return q.a + ' razy ile daje ' + p;
    return q.a + ' razy ' + q.b;
  }

  function planetFacts(p) {
    var seen = {}, out = [];
    p.tables.forEach(function (t) {
      for (var m = 1; m <= 10; m++) {
        var k = key(t, m);
        if (!seen[k]) { seen[k] = 1; out.push(fact(t, m)); }
      }
    });
    return out;
  }

  // Show "7 × 3" or "3 × 7" at random so both orders are practised.
  function orient(f) { return Math.random() < 0.5 ? fact(f.a, f.b) : fact(f.b, f.a); }

  function isPlanetFact(p, q) { return p.tables.indexOf(q.a) >= 0 || p.tables.indexOf(q.b) >= 0; }

  // Help card shown after a wrong answer.
  function hintHtml(q, requeued, title) {
    var T = App.T, p = q.a * q.b;
    var a = q.miss === 'a' ? '<b>' + q.a + '</b>' : q.a;
    var b = q.miss === 'b' ? '<b>' + q.b + '</b>' : q.b;
    var res = q.miss ? p : '<b>' + p + '</b>';
    // Two columns: the dot picture on the left, the explanation on the right,
    // so the whole card fits on screen without scrolling.
    return '<div class="hint pop">' +
      '<div class="hint-dots">' + App.art.dots(q.a, q.b) + '</div>' +
      '<div class="hint-text">' +
        '<div class="hint-title">' + (title || T.almost) + '</div>' +
        '<div class="hint-answer">' + a + SYM + b + ' = ' + res + '</div>' +
        '<div class="hint-rows">' + T.rows(q.a, q.b) + ' = ' + p + '</div>' +
        '<div class="hint-tip">💡 ' + T.tip(q.a, q.b) + '</div>' +
        (requeued ? '<div class="hint-later">' + T.backLater + '</div>' : '') +
        '<div class="hint-enter">' + T.pressEnter + ' ⏎</div>' +
      '</div>' +
    '</div>';
  }

  // All unordered pairs (1..10) giving n.
  function pairsFor(n) {
    var out = [];
    for (var x = 1; x <= 10; x++) for (var y = x; y <= 10; y++) if (x * y === n) out.push(fact(x, y));
    return out;
  }

  // Cards for "Nakarm stworki": up to 3 problems equal to result(f), the rest
  // close misses (preferably sharing a factor with the target). Each card is
  // a question plus ok: true/false.
  function cards(f, count) {
    var n = f.a * f.b, shuffle = App.q.shuffle;
    var good = pairsFor(n).filter(function (p) { return key(p.a, p.b) !== key(f.a, f.b); });
    good = [fact(f.a, f.b)].concat(shuffle(good)).slice(0, 3);
    var used = {};
    good.forEach(function (p) { used[key(p.a, p.b)] = 1; });

    var near = [], far = [], range = Math.max(4, Math.round(n * 0.35));
    for (var x = 1; x <= 10; x++) for (var y = x; y <= 10; y++) {
      var p = x * y, k = key(x, y);
      if (p === n || used[k]) continue;
      if (Math.abs(p - n) <= range && (x === f.a || x === f.b || y === f.a || y === f.b)) near.push(fact(x, y));
      else if (Math.abs(p - n) <= range * 2) far.push(fact(x, y));
    }
    var nearPick = shuffle(near).slice(0, 3);
    var bad = nearPick.concat(shuffle(far), shuffle(near).filter(function (p) { return nearPick.indexOf(p) < 0; }))
      .slice(0, count - good.length);
    var out = good.map(function (c) { c.ok = true; return c; })
      .concat(bad.map(function (c) { c.ok = false; return c; }));
    out.forEach(function (c) { if (Math.random() < 0.5) { var t = c.a; c.a = c.b; c.b = t; } });
    return shuffle(out);
  }

  return {
    id: 'mul', key: key, keyOf: keyOf, statKey: keyOf, result: result, answer: answer,
    parts: parts, label: label, speech: speech,
    planetFacts: planetFacts, orient: orient, isPlanetFact: isPlanetFact,
    hintHtml: hintHtml, cards: cards
  };
})();

App.ops.sub = (function () {
  var SYM = ' − ';

  // Skill levels, easiest first. A planet lists the levels it practises (planet.levels).
  //   within10: 9 − 4            within20: 17 − 5, 17 − 10 (no crossing ten)
  //   cross10:  13 − 5           tens:     90 − 40
  //   minus1:   47 − 5           borrow1:  52 − 7  (two-digit − one-digit)
  //   minus2:   85 − 23, 76 − 30 borrow2:  62 − 37 (two-digit − two-digit)
  var ORDER = ['within10', 'within20', 'cross10', 'tens', 'minus1', 'borrow1', 'minus2', 'borrow2'];
  var GEN = {
    within10: function (out) {
      for (var a = 2; a <= 10; a++) for (var b = 1; b < a; b++) out.push(fact(a, b));
    },
    within20: function (out) {
      for (var a = 11; a <= 19; a++) {
        for (var b = 1; b <= a - 10; b++) out.push(fact(a, b));
        out.push(fact(a, 10));
      }
      out.push(fact(20, 10));
    },
    cross10: function (out) {
      for (var a = 11; a <= 18; a++) for (var b = a - 9; b <= 9; b++) out.push(fact(a, b));
    },
    tens: function (out) {
      for (var a = 30; a <= 100; a += 10) for (var b = 10; b < a; b += 10) out.push(fact(a, b));
    },
    minus1: function (out) {
      for (var t = 2; t <= 9; t++) for (var u = 1; u <= 9; u++) for (var b = 1; b <= u; b++) out.push(fact(t * 10 + u, b));
    },
    borrow1: function (out) {
      for (var t = 2; t <= 9; t++) for (var u = 0; u <= 8; u++) for (var b = u + 1; b <= 9; b++) out.push(fact(t * 10 + u, b));
    },
    // Result stays two-digit (tens of a > tens of b); whole tens only (80 − 20) belong to "tens".
    minus2: function (out) {
      for (var ta = 2; ta <= 9; ta++) for (var tb = 1; tb < ta; tb++)
        for (var ua = 0; ua <= 9; ua++) for (var ub = 0; ub <= ua; ub++)
          if (ua || ub) out.push(fact(ta * 10 + ua, tb * 10 + ub));
    },
    borrow2: function (out) {
      for (var ta = 3; ta <= 9; ta++) for (var tb = 1; tb <= ta - 2; tb++)
        for (var ua = 0; ua <= 8; ua++) for (var ub = ua + 1; ub <= 9; ub++) out.push(fact(ta * 10 + ua, tb * 10 + ub));
    }
  };
  var cache = {};
  function levelFacts(l) {
    if (!cache[l]) { cache[l] = []; GEN[l](cache[l]); }
    return cache[l];
  }

  function fact(a, b) { return { op: 'sub', a: a, b: b }; }
  function key(a, b) { return a + '-' + b; }
  function keyOf(q) { return key(q.a, q.b); }
  function result(q) { return q.a - q.b; }
  function answer(q) { return q.miss === 'a' ? q.a : (q.miss === 'b' ? q.b : q.a - q.b); }

  function levelOf(q) {
    var a = q.a, b = q.b, ua = a % 10, ub = b % 10;
    if (a <= 10) return 'within10';
    if (a < 20 || (a === 20 && b === 10)) return (b === 10 || ua >= b) ? 'within20' : 'cross10';
    if (ua === 0 && ub === 0) return 'tens';
    if (b < 10) return ua >= b ? 'minus1' : 'borrow1';
    return ua >= ub ? 'minus2' : 'borrow2';
  }

  // Stats key: two-digit problems are credited to the basic fact they rely on,
  // so 52 − 7 practises (and is weighted by) 12 − 7, and 90 − 40 by 9 − 4.
  // Within 20 every fact is its own key.
  function statKey(q) {
    var a = q.a, b = q.b, ua = a % 10, ub = b % 10, ta = Math.floor(a / 10), tb = Math.floor(b / 10);
    switch (levelOf(q)) {
      case 'tens': return key(a / 10, b / 10);
      case 'minus1': return b < ua ? key(ua, b) : keyOf(q);
      case 'borrow1': return key(10 + ua, b);
      case 'minus2': return (ub >= 1 && ub < ua) ? key(ua, ub) : key(ta, tb);
      case 'borrow2': return key(10 + ua, ub);
      default: return keyOf(q);
    }
  }

  function parts(q) {
    var c = q.a - q.b;
    if (q.miss === 'a') return { left: '', right: SYM + q.b + ' = ' + c };
    if (q.miss === 'b') return { left: q.a + SYM, right: ' = ' + c };
    return { left: q.a + SYM + q.b + ' = ', right: '' };
  }

  function label(q) { return q.a + SYM + q.b; }

  function speech(q) {
    var c = q.a - q.b;
    if (q.miss === 'a') return 'ile odjąć ' + q.b + ' daje ' + c;
    if (q.miss === 'b') return q.a + ' odjąć ile daje ' + c;
    return q.a + ' odjąć ' + q.b;
  }

  // A mixed planet takes an even random sample from each level; otherwise the
  // big two-digit levels (≈2000 problems) would crowd out the small ones (≈50).
  var MIX_SAMPLE = 60;
  function planetFacts(p) {
    return p.levels.reduce(function (out, l) {
      var all = levelFacts(l);
      return out.concat(p.levels.length > 1 && all.length > MIX_SAMPLE ? App.q.shuffle(all.slice()).slice(0, MIX_SAMPLE) : all);
    }, []);
  }

  // Subtraction has only one order.
  function orient(f) { return fact(f.a, f.b); }

  function isPlanetFact(p, q) { return p.levels.indexOf(levelOf(q)) >= 0; }

  function hintHtml(q, requeued, title) {
    var T = App.T, c = q.a - q.b;
    var a = q.miss === 'a' ? '<b>' + q.a + '</b>' : q.a;
    var b = q.miss === 'b' ? '<b>' + q.b + '</b>' : q.b;
    var res = q.miss ? c : '<b>' + c + '</b>';
    var pic = q.a <= 20 ? App.art.takeAway(q.a, q.b) : App.art.blocks(q.a, q.b);
    return '<div class="hint pop">' +
      '<div class="hint-dots">' + pic + '</div>' +
      '<div class="hint-text">' +
        '<div class="hint-title">' + (title || T.almost) + '</div>' +
        '<div class="hint-answer">' + a + SYM + b + ' = ' + res + '</div>' +
        '<div class="hint-rows">' + T.subTake(q.a, q.b, c, levelOf(q)) + '</div>' +
        '<div class="hint-tip">💡 ' + T.subTip(q.a, q.b, levelOf(q)) + '</div>' +
        '<div class="hint-tip">' + App.ui.fmt(T.subCheck, { a: q.a, b: q.b, c: c }) + '</div>' +
        (requeued ? '<div class="hint-later">' + T.backLater + '</div>' : '') +
        '<div class="hint-enter">' + T.pressEnter + ' ⏎</div>' +
      '</div>' +
    '</div>';
  }

  // Cards for "Nakarm stworki", taken from the same level as f: up to 3 problems
  // with the same result, the rest near misses (preferably sharing a number with f).
  function cards(f, count) {
    var n = f.a - f.b, shuffle = App.q.shuffle, pool = levelFacts(levelOf(f));
    var good = shuffle(pool.filter(function (p) { return p.a - p.b === n && keyOf(p) !== keyOf(f); }).slice());
    good = [fact(f.a, f.b)].concat(good).slice(0, 3);
    var range = Math.max(3, Math.round(n * 0.3)), near = [], far = [];
    pool.forEach(function (p) {
      var d = Math.abs(p.a - p.b - n);
      if (d === 0 || d > range * 2) return;
      if (d <= range && (p.a === f.a || p.b === f.b)) near.push(p); else far.push(p);
    });
    var bad = shuffle(near).slice(0, 3);
    bad = bad.concat(shuffle(far)).slice(0, count - good.length);
    return shuffle(good.map(function (p) { var c = fact(p.a, p.b); c.ok = true; return c; })
      .concat(bad.map(function (p) { var c = fact(p.a, p.b); c.ok = false; return c; })));
  }

  return {
    id: 'sub', key: key, keyOf: keyOf, statKey: statKey, result: result, answer: answer,
    parts: parts, label: label, speech: speech, levelOf: levelOf, levels: ORDER, levelFacts: levelFacts,
    planetFacts: planetFacts, orient: orient, isPlanetFact: isPlanetFact,
    hintHtml: hintHtml, cards: cards
  };
})();

// Question from a stats key: "3x7" (multiplication) or "13-5" (subtraction).
App.ops.fromKey = function (k) {
  var m = /^(\d+)([x-])(\d+)$/.exec(k);
  if (!m) return null;
  return { op: m[2] === 'x' ? 'mul' : 'sub', a: +m[1], b: +m[3] };
};

// Help card for any question (shared by all typed-answer modes).
App.hintHtml = function (q, requeued, title) { return App.opOf(q).hintHtml(q, requeued, title); };
