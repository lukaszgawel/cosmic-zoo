// Simple SVG drawings. Every function returns an SVG string.
window.App = window.App || {};

App.art = (function () {
  function svg(inner, size, cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="' + size + '" height="' + size + '"' +
      (cls ? ' class="' + cls + '"' : '') + ' aria-hidden="true">' + inner + '</svg>';
  }

  function rocket(color, size, flame) {
    if (flame === undefined) flame = true;
    return svg(
      (flame ? '<g class="flame"><path d="M41 78 Q50 102 59 78 Z" fill="#ffb703"/><path d="M45 78 Q50 93 55 78 Z" fill="#fb5607"/></g>' : '') +
      '<path d="M50 6 C66 20 68 50 62 78 L38 78 C32 50 34 20 50 6 Z" fill="#f1f5ff"/>' +
      '<path d="M50 6 C58 13 62 22 63 30 L37 30 C38 22 42 13 50 6 Z" fill="' + color + '"/>' +
      '<path d="M37 54 L22 76 L38 74 Z" fill="' + color + '"/>' +
      '<path d="M63 54 L78 76 L62 74 Z" fill="' + color + '"/>' +
      '<rect x="44" y="68" width="12" height="10" rx="2" fill="' + color + '"/>' +
      '<circle cx="50" cy="45" r="8" fill="#5bc0eb" stroke="#2b2d42" stroke-width="3"/>' +
      '<circle cx="47" cy="42" r="2.5" fill="#fff" opacity=".8"/>',
      size, 'rocket');
  }

  var helmet = '<circle cx="50" cy="50" r="46" fill="#e9efff" stroke="#9fb0d6" stroke-width="3"/>' +
    '<circle cx="50" cy="50" r="37" fill="#9ad1ff"/>';
  var shine = '<ellipse cx="32" cy="27" rx="9" ry="4" fill="#fff" opacity=".7" transform="rotate(-35 32 27)"/>';

  var avatars = {
    astronautka: helmet +
      '<circle cx="27" cy="54" r="9" fill="#7a4a2b"/><circle cx="73" cy="54" r="9" fill="#7a4a2b"/>' +
      '<circle cx="50" cy="55" r="22" fill="#ffd9b8"/>' +
      '<path d="M28 53 C28 30 72 30 72 53 C64 43 56 41 50 45 C44 41 36 43 28 53 Z" fill="#7a4a2b"/>' +
      '<circle cx="42" cy="57" r="3" fill="#2b2d42"/><circle cx="58" cy="57" r="3" fill="#2b2d42"/>' +
      '<circle cx="37" cy="64" r="3.5" fill="#ff8fab" opacity=".7"/><circle cx="63" cy="64" r="3.5" fill="#ff8fab" opacity=".7"/>' +
      '<path d="M44 66 Q50 71 56 66" stroke="#2b2d42" stroke-width="2.5" fill="none" stroke-linecap="round"/>' + shine,
    kot: helmet +
      '<path d="M30 46 L31 22 L47 36 Z" fill="#f4a261"/><path d="M70 46 L69 22 L53 36 Z" fill="#f4a261"/>' +
      '<path d="M33 40 L34 28 L42 35 Z" fill="#ffb4c6"/><path d="M67 40 L66 28 L58 35 Z" fill="#ffb4c6"/>' +
      '<circle cx="50" cy="55" r="22" fill="#f4a261"/>' +
      '<ellipse cx="42" cy="53" rx="4" ry="5" fill="#2a9d8f"/><ellipse cx="58" cy="53" rx="4" ry="5" fill="#2a9d8f"/>' +
      '<circle cx="43" cy="52" r="1.5" fill="#fff"/><circle cx="59" cy="52" r="1.5" fill="#fff"/>' +
      '<path d="M47 61 L53 61 L50 64 Z" fill="#ff8fab"/>' +
      '<path d="M50 64 Q46 69 43 66 M50 64 Q54 69 57 66" stroke="#2b2d42" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M30 60 L40 62 M30 66 L40 65 M70 60 L60 62 M70 66 L60 65" stroke="#2b2d42" stroke-width="1.5" stroke-linecap="round"/>' + shine,
    lis:
      '<circle cx="50" cy="50" r="46" fill="#ffe8cc"/>' +
      '<path d="M20 34 L30 8 L44 28 Z" fill="#f77f00"/><path d="M80 34 L70 8 L56 28 Z" fill="#f77f00"/>' +
      '<path d="M16 40 Q50 16 84 40 L50 88 Z" fill="#f77f00"/>' +
      '<path d="M26 52 Q50 62 74 52 L50 88 Z" fill="#fff"/>' +
      '<rect x="22" y="29" width="56" height="6" rx="3" fill="#6d4c41"/>' +
      '<circle cx="38" cy="32" r="8" fill="#9ad1ff" stroke="#6d4c41" stroke-width="3"/><circle cx="62" cy="32" r="8" fill="#9ad1ff" stroke="#6d4c41" stroke-width="3"/>' +
      '<circle cx="41" cy="52" r="3.5" fill="#2b2d42"/><circle cx="59" cy="52" r="3.5" fill="#2b2d42"/>' +
      '<circle cx="50" cy="80" r="4.5" fill="#2b2d42"/>' +
      '<path d="M45 70 Q50 74 55 70" stroke="#2b2d42" stroke-width="2" fill="none" stroke-linecap="round"/>',
    robot:
      '<circle cx="50" cy="50" r="46" fill="#dfe7fd"/>' +
      '<line x1="50" y1="12" x2="50" y2="26" stroke="#6c757d" stroke-width="4"/><circle cx="50" cy="11" r="5" fill="#ef476f"/>' +
      '<rect x="14" y="42" width="9" height="18" rx="3" fill="#6c757d"/><rect x="77" y="42" width="9" height="18" rx="3" fill="#6c757d"/>' +
      '<rect x="22" y="26" width="56" height="50" rx="12" fill="#adb5bd"/>' +
      '<rect x="30" y="36" width="40" height="22" rx="6" fill="#1d3557"/>' +
      '<circle cx="41" cy="47" r="5" fill="#00f5d4"/><circle cx="59" cy="47" r="5" fill="#00f5d4"/>' +
      '<path d="M38 65 Q50 72 62 65" stroke="#495057" stroke-width="4" fill="none" stroke-linecap="round"/>'
  };

  function avatar(id, size) { return svg(avatars[id] || avatars.astronautka, size, 'avatar'); }

  var shadow = '<ellipse cx="50" cy="93" rx="28" ry="5" fill="#000" opacity=".25"/>';
  var eye = function (x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#2b2d42"/><circle cx="' + (x + 1) + '" cy="' + (y - 1) + '" r="' + (r / 3) + '" fill="#fff"/>';
  };
  var smile = function (y) { return '<path d="M44 ' + y + ' Q50 ' + (y + 5) + ' 56 ' + y + '" stroke="#2b2d42" stroke-width="2.2" fill="none" stroke-linecap="round"/>'; };

  // Each species is drawn from a palette: m = main colour, d = darker/second colour, a = accent.
  var species = {
    kot: function (p) {
      return shadow +
        '<path d="M72 80 Q94 72 86 50" stroke="' + p.m + '" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '<line x1="40" y1="26" x2="33" y2="8" stroke="' + p.d + '" stroke-width="3"/><circle cx="33" cy="8" r="5" fill="' + p.a + '"/>' +
        '<line x1="60" y1="26" x2="67" y2="8" stroke="' + p.d + '" stroke-width="3"/><circle cx="67" cy="8" r="5" fill="' + p.a + '"/>' +
        '<path d="M26 42 L29 16 L46 30 Z" fill="' + p.m + '"/><path d="M74 42 L71 16 L54 30 Z" fill="' + p.m + '"/>' +
        '<ellipse cx="50" cy="76" rx="24" ry="16" fill="' + p.m + '"/>' +
        '<circle cx="50" cy="47" r="24" fill="' + p.m + '"/>' +
        '<ellipse cx="41" cy="46" rx="7" ry="9" fill="#fff"/><ellipse cx="59" cy="46" rx="7" ry="9" fill="#fff"/>' +
        '<circle cx="42" cy="48" r="4.5" fill="#240046"/><circle cx="60" cy="48" r="4.5" fill="#240046"/>' +
        '<circle cx="43.5" cy="46" r="1.5" fill="#fff"/><circle cx="61.5" cy="46" r="1.5" fill="#fff"/>' +
        '<path d="M47 57 L53 57 L50 60 Z" fill="#ff8fab"/>' +
        '<path d="M50 60 Q46 65 43 62 M50 60 Q54 65 57 62" stroke="#240046" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<circle cx="40" cy="78" r="2.5" fill="' + p.a + '"/><circle cx="58" cy="82" r="2" fill="' + p.a + '"/><circle cx="52" cy="72" r="1.8" fill="' + p.a + '"/>';
    },
    jednorozec: function (p) {
      return shadow +
        '<path d="M32 66 Q6 44 12 74 Q22 68 32 76 Z" fill="' + p.d + '"/><path d="M68 66 Q94 44 88 74 Q78 68 68 76 Z" fill="' + p.d + '"/>' +
        '<ellipse cx="50" cy="72" rx="24" ry="18" fill="' + p.m + '"/>' +
        '<ellipse cx="38" cy="88" rx="6" ry="4" fill="' + p.d + '"/><ellipse cx="62" cy="88" rx="6" ry="4" fill="' + p.d + '"/>' +
        '<circle cx="50" cy="43" r="21" fill="' + p.m + '"/>' +
        '<path d="M50 6 L44 26 L56 26 Z" fill="' + p.a + '"/><path d="M46 18 L54 15 M45 22 L55 19" stroke="#f4a261" stroke-width="1.5"/>' +
        '<circle cx="33" cy="30" r="7" fill="#ff8fab"/><circle cx="29" cy="40" r="7" fill="#cdb4db"/><circle cx="30" cy="51" r="6" fill="#a2d2ff"/>' +
        eye(43, 42, 3.5) + eye(59, 42, 3.5) +
        '<circle cx="39" cy="50" r="3.5" fill="#ff8fab" opacity=".6"/><circle cx="63" cy="50" r="3.5" fill="#ff8fab" opacity=".6"/>' +
        '<path d="M45 53 Q51 58 57 53" stroke="#2b2d42" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    },
    lis: function (p) {
      return shadow +
        '<path d="M68 78 Q100 62 86 32 Q82 56 64 68 Z" fill="' + p.m + '"/><path d="M86 32 Q90 42 88 50 Q82 44 84 36 Z" fill="#fff"/>' +
        '<ellipse cx="50" cy="76" rx="20" ry="14" fill="' + p.m + '"/>' +
        '<path d="M24 36 L34 12 L44 30 Q50 28 56 30 L66 12 L76 36 Q76 60 50 66 Q24 60 24 36 Z" fill="' + p.m + '"/>' +
        '<path d="M30 18 L34 12 L40 26 Z M70 18 L66 12 L60 26 Z" fill="' + p.d + '"/>' +
        '<path d="M28 46 Q40 58 50 64 Q60 58 72 46 Q60 54 50 54 Q40 54 28 46 Z" fill="#fff"/>' +
        eye(41, 42, 3.5) + eye(59, 42, 3.5) +
        '<circle cx="50" cy="57" r="3.5" fill="#2b2d42"/>' +
        '<circle cx="14" cy="24" r="3" fill="' + p.a + '"/><circle cx="88" cy="14" r="2.5" fill="' + p.a + '"/><circle cx="12" cy="70" r="2" fill="' + p.a + '"/>';
    },
    osmiornica: function (p) {
      return shadow +
        '<path d="M30 56 Q22 72 30 88 M40 58 Q34 76 42 90 M50 58 Q50 78 50 92 M60 58 Q66 76 58 90 M70 56 Q78 72 70 88" stroke="' + p.m + '" stroke-width="8" fill="none" stroke-linecap="round"/>' +
        '<path d="M22 60 Q22 16 50 16 Q78 16 78 60 Z" fill="' + p.m + '"/>' +
        '<path d="M50 4 L53 12 L62 12 L55 17 L58 26 L50 21 L42 26 L45 17 L38 12 L47 12 Z" fill="' + p.a + '"/>' +
        '<circle cx="41" cy="42" r="6" fill="#fff"/><circle cx="59" cy="42" r="6" fill="#fff"/>' +
        '<circle cx="42" cy="43" r="3.5" fill="#2b2d42"/><circle cx="60" cy="43" r="3.5" fill="#2b2d42"/>' +
        '<circle cx="34" cy="51" r="3.5" fill="' + p.d + '" opacity=".45"/><circle cx="66" cy="51" r="3.5" fill="' + p.d + '" opacity=".45"/>' +
        smile(52);
    },
    zolw: function (p) {
      return shadow +
        '<rect x="12" y="40" width="10" height="24" rx="4" fill="#adb5bd"/><rect x="78" y="40" width="10" height="24" rx="4" fill="#adb5bd"/>' +
        '<path d="M13 64 Q17 76 21 64 Z M79 64 Q83 76 87 64 Z" fill="#ffb703"/>' +
        '<ellipse cx="30" cy="86" rx="8" ry="5" fill="' + p.a + '"/><ellipse cx="70" cy="86" rx="8" ry="5" fill="' + p.a + '"/>' +
        '<ellipse cx="50" cy="66" rx="32" ry="24" fill="' + p.m + '"/>' +
        '<circle cx="50" cy="64" r="8" fill="' + p.d + '"/><circle cx="34" cy="70" r="6" fill="' + p.d + '"/><circle cx="66" cy="70" r="6" fill="' + p.d + '"/>' +
        '<circle cx="38" cy="54" r="5" fill="' + p.d + '"/><circle cx="62" cy="54" r="5" fill="' + p.d + '"/>' +
        '<circle cx="50" cy="34" r="17" fill="' + p.a + '"/>' +
        eye(44, 32, 3.5) + eye(57, 32, 3.5) + smile(40);
    },
    sowa: function (p) {
      return shadow +
        '<path d="M28 34 L30 10 L44 26 Z M72 34 L70 10 L56 26 Z" fill="' + p.m + '"/>' +
        '<ellipse cx="50" cy="56" rx="29" ry="34" fill="' + p.m + '"/>' +
        '<ellipse cx="23" cy="62" rx="8" ry="18" fill="' + p.d + '" transform="rotate(12 23 62)"/><ellipse cx="77" cy="62" rx="8" ry="18" fill="' + p.d + '" transform="rotate(-12 77 62)"/>' +
        '<ellipse cx="50" cy="70" rx="17" ry="18" fill="' + p.a + '"/>' +
        '<path d="M42 66 L45 69 L48 66 M52 66 L55 69 L58 66 M47 74 L50 77 L53 74" stroke="' + p.d + '" stroke-width="2" fill="none"/>' +
        '<circle cx="39" cy="42" r="11" fill="#fff" stroke="' + p.d + '" stroke-width="3"/><circle cx="61" cy="42" r="11" fill="#fff" stroke="' + p.d + '" stroke-width="3"/>' +
        eye(39, 43, 5) + eye(61, 43, 5) +
        '<path d="M46 52 L54 52 L50 59 Z" fill="#ffb703"/>' +
        '<path d="M40 89 L43 84 L46 89 M54 89 L57 84 L60 89" stroke="#ffb703" stroke-width="3" fill="none" stroke-linecap="round"/>';
    },
    pingwin: function (p) {
      return shadow +
        '<ellipse cx="22" cy="60" rx="7" ry="17" fill="' + p.m + '" transform="rotate(20 22 60)"/><ellipse cx="78" cy="60" rx="7" ry="17" fill="' + p.m + '" transform="rotate(-20 78 60)"/>' +
        '<ellipse cx="50" cy="56" rx="27" ry="36" fill="' + p.m + '"/>' +
        '<ellipse cx="50" cy="66" rx="18" ry="24" fill="#fff"/>' +
        '<circle cx="42" cy="38" r="9" fill="#fff"/><circle cx="58" cy="38" r="9" fill="#fff"/>' +
        eye(42, 38, 3.5) + eye(58, 38, 3.5) +
        '<path d="M44 46 L56 46 L50 53 Z" fill="#ff9f1c"/>' +
        '<rect x="28" y="54" width="44" height="7" rx="3" fill="' + p.a + '"/><rect x="60" y="56" width="8" height="18" rx="3" fill="' + p.a + '"/>' +
        '<ellipse cx="40" cy="91" rx="8" ry="4" fill="#ff9f1c"/><ellipse cx="60" cy="91" rx="8" ry="4" fill="#ff9f1c"/>';
    },
    smok: function (p) {
      return shadow +
        '<path d="M30 58 L8 36 L14 60 L4 62 L28 72 Z" fill="' + p.d + '"/><path d="M70 58 L92 36 L86 60 L96 62 L72 72 Z" fill="' + p.d + '"/>' +
        '<path d="M68 82 Q90 86 88 70 L96 66 L86 62" stroke="' + p.m + '" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<ellipse cx="50" cy="72" rx="22" ry="18" fill="' + p.m + '"/>' +
        '<ellipse cx="50" cy="76" rx="13" ry="12" fill="' + p.a + '"/>' +
        '<path d="M36 26 L32 10 L44 22 Z M64 26 L68 10 L56 22 Z" fill="' + p.a + '"/>' +
        '<circle cx="50" cy="40" r="20" fill="' + p.m + '"/>' +
        '<path d="M46 20 L50 12 L54 20 Z" fill="' + p.d + '"/>' +
        eye(42, 38, 4) + eye(58, 38, 4) +
        '<circle cx="46" cy="49" r="1.5" fill="#2b2d42"/><circle cx="54" cy="49" r="1.5" fill="#2b2d42"/>' + smile(52);
    },
    meduza: function (p) {
      return '<path d="M28 52 Q22 68 30 82 Q36 92 28 96 M40 54 Q46 70 38 84 M50 54 Q44 72 52 88 M60 54 Q66 70 58 86 M72 52 Q78 68 70 82 Q64 92 72 96" stroke="' + p.d + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<path d="M35 54 Q30 70 36 80 M65 54 Q70 70 64 80" stroke="' + p.a + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<path d="M18 52 Q18 12 50 12 Q82 12 82 52 Q74 58 66 52 Q58 58 50 52 Q42 58 34 52 Q26 58 18 52 Z" fill="' + p.m + '"/>' +
        '<ellipse cx="36" cy="24" rx="8" ry="4" fill="#fff" opacity=".6" transform="rotate(-25 36 24)"/>' +
        eye(41, 36, 4) + eye(59, 36, 4) +
        '<circle cx="34" cy="44" r="3.5" fill="#ff5d8f" opacity=".5"/><circle cx="66" cy="44" r="3.5" fill="#ff5d8f" opacity=".5"/>' + smile(43);
    },
    feniks: function (p) {
      return shadow +
        '<path d="M44 74 Q30 90 22 96 Q40 92 48 80 Z" fill="' + p.d + '"/><path d="M56 74 Q70 90 78 96 Q60 92 52 80 Z" fill="' + p.d + '"/>' +
        '<path d="M48 76 Q50 92 50 98 Q52 92 52 76 Z" fill="' + p.a + '"/>' +
        '<path d="M36 50 Q8 30 4 52 Q14 50 18 58 Q8 60 10 68 Q24 62 38 66 Z" fill="' + p.d + '"/>' +
        '<path d="M64 50 Q92 30 96 52 Q86 50 82 58 Q92 60 90 68 Q76 62 62 66 Z" fill="' + p.d + '"/>' +
        '<ellipse cx="50" cy="60" rx="17" ry="21" fill="' + p.m + '"/>' +
        '<path d="M42 22 Q38 10 44 6 Q44 14 48 18 Q48 6 54 2 Q52 12 56 18 Q60 10 64 12 Q58 16 58 24 Z" fill="' + p.a + '"/>' +
        '<circle cx="50" cy="34" r="14" fill="' + p.m + '"/>' +
        eye(45, 32, 3) + eye(56, 32, 3) +
        '<path d="M47 38 L53 38 L50 45 Z" fill="#ffb703"/>' +
        '<ellipse cx="50" cy="64" rx="9" ry="11" fill="' + p.a + '" opacity=".7"/>';
    }
  };

  var GOLD = { m: '#ffd166', d: '#e09f3e', a: '#fff3c4' };
  // [base (rescued from the Boss), alternate colour (egg), rare gold (egg)]
  var palettes = {
    kot: [{ m: '#9d4edd', d: '#7b2cbf', a: '#ffd166' }, { m: '#52b788', d: '#2d6a4f', a: '#ff8fab' }, GOLD],
    jednorozec: [{ m: '#c7f9cc', d: '#80ed99', a: '#ffd166' }, { m: '#ffc8dd', d: '#ffafcc', a: '#ffd166' }, { m: '#fff3c4', d: '#ffd166', a: '#e09f3e' }],
    lis: [{ m: '#ff9f1c', d: '#e85d04', a: '#ffd166' }, { m: '#4cc9f0', d: '#4361ee', a: '#caf0f8' }, GOLD],
    osmiornica: [{ m: '#ff6fa8', d: '#c9184a', a: '#ffd166' }, { m: '#9b5de5', d: '#5a189a', a: '#00f5d4' }, GOLD],
    zolw: [{ m: '#2a9d8f', d: '#264653', a: '#90be6d' }, { m: '#e63946', d: '#9d0208', a: '#b5e48c' }, GOLD],
    sowa: [{ m: '#7b61ff', d: '#4b3fbf', a: '#e0d7ff' }, { m: '#e9ecef', d: '#adb5bd', a: '#ffffff' }, GOLD],
    pingwin: [{ m: '#1d3557', d: '#1d3557', a: '#e63946' }, { m: '#ff70a6', d: '#ff70a6', a: '#70d6ff' }, { m: '#e09f3e', d: '#e09f3e', a: '#fff3c4' }],
    smok: [{ m: '#e76f51', d: '#9d0208', a: '#ffd166' }, { m: '#90e0ef', d: '#0077b6', a: '#caf0f8' }, GOLD],
    meduza: [{ m: '#ff99c8', d: '#a9def9', a: '#fcf6bd' }, { m: '#4cc9f0', d: '#4361ee', a: '#b8f2e6' }, GOLD],
    feniks: [{ m: '#f15bb5', d: '#9b5de5', a: '#fee440' }, { m: '#4cc9f0', d: '#4361ee', a: '#caf0f8' }, GOLD]
  };

  var sparkles = '<g fill="#fff"><path d="M12 14 L14 20 L20 22 L14 24 L12 30 L10 24 L4 22 L10 20 Z"/>' +
    '<path d="M86 24 L87.5 28 L92 29.5 L87.5 31 L86 35 L84.5 31 L80 29.5 L84.5 28 Z"/><circle cx="90" cy="70" r="2"/></g>';

  function creature(id, size) {
    var parts = String(id).split('-'), sp = species[parts[0]] ? parts[0] : 'kot';
    var v = Math.min(3, Math.max(1, +(parts[1] || 1)));
    return svg(species[sp](palettes[sp][v - 1]) + (v === 3 ? sparkles : ''), size, 'creature' + (v === 3 ? ' rare' : ''));
  }

  var decor = {
    kwiatek: '<path d="M50 92 Q48 70 50 50" stroke="#2d6a4f" stroke-width="4" fill="none"/><ellipse cx="40" cy="76" rx="9" ry="4" fill="#52b788" transform="rotate(-30 40 76)"/>' +
      '<circle cx="50" cy="28" r="10" fill="#ff8fab"/><circle cx="61" cy="36" r="10" fill="#ff8fab"/><circle cx="57" cy="50" r="10" fill="#ff8fab"/><circle cx="43" cy="50" r="10" fill="#ff8fab"/><circle cx="39" cy="36" r="10" fill="#ff8fab"/>' +
      '<circle cx="50" cy="40" r="8" fill="#ffd166"/>',
    flaga: '<ellipse cx="32" cy="90" rx="12" ry="4" fill="#000" opacity=".2"/><line x1="32" y1="10" x2="32" y2="90" stroke="#adb5bd" stroke-width="4"/>' +
      '<path d="M34 12 L82 26 L34 40 Z" fill="#ff6fa8"/><path d="M48 21 L50 26 L55 26 L51 29 L52 34 L48 31 L44 34 L45 29 L41 26 L46 26 Z" fill="#ffd166"/>',
    krysztal: '<polygon points="28,90 36,48 46,90" fill="#9b5de5"/><polygon points="40,90 51,26 63,90" fill="#4cc9f0"/><polygon points="57,90 67,54 76,90" fill="#c77dff"/>' +
      '<line x1="49" y1="40" x2="46" y2="70" stroke="#fff" stroke-width="2" opacity=".7"/>',
    grzybek: '<rect x="42" y="50" width="16" height="40" rx="6" fill="#fff1e6"/>' +
      '<path d="M16 56 Q16 18 50 18 Q84 18 84 56 Z" fill="#ef476f"/><circle cx="36" cy="38" r="5" fill="#fff"/><circle cx="56" cy="30" r="6" fill="#fff"/><circle cx="68" cy="46" r="4" fill="#fff"/>',
    lampa: '<rect x="47" y="38" width="6" height="50" fill="#6c757d"/><ellipse cx="50" cy="90" rx="14" ry="4" fill="#495057"/>' +
      '<path d="M50 12 L55 24 L68 24 L58 32 L62 45 L50 37 L38 45 L42 32 L32 24 L45 24 Z" fill="#ffd166"/>',
    drzewko: '<rect x="45" y="55" width="10" height="36" rx="3" fill="#7b2cbf"/><circle cx="50" cy="38" r="22" fill="#06d6a0"/><circle cx="32" cy="52" r="13" fill="#06d6a0"/><circle cx="68" cy="52" r="13" fill="#06d6a0"/>' +
      '<circle cx="44" cy="32" r="3" fill="#ffd166"/><circle cx="60" cy="44" r="3" fill="#ffd166"/><circle cx="34" cy="50" r="3" fill="#ffd166"/>',
    domek: '<line x1="50" y1="30" x2="50" y2="14" stroke="#adb5bd" stroke-width="3"/><circle cx="50" cy="12" r="4" fill="#ef476f"/>' +
      '<path d="M12 90 Q12 30 50 30 Q88 30 88 90 Z" fill="#e0e1ff"/><path d="M40 90 Q40 66 50 66 Q60 66 60 90 Z" fill="#5a189a"/><circle cx="68" cy="58" r="6" fill="#ffd166"/><circle cx="32" cy="58" r="6" fill="#ffd166"/>',
    teleskop: '<line x1="50" y1="58" x2="32" y2="92" stroke="#6c757d" stroke-width="4"/><line x1="50" y1="58" x2="68" y2="92" stroke="#6c757d" stroke-width="4"/><line x1="50" y1="58" x2="50" y2="92" stroke="#6c757d" stroke-width="4"/>' +
      '<rect x="22" y="34" width="56" height="15" rx="6" fill="#4361ee" transform="rotate(-25 50 41)"/><circle cx="74" cy="29" r="7" fill="#90e0ef" stroke="#3a0ca3" stroke-width="3"/>',
    zjezdzalnia: '<line x1="18" y1="30" x2="18" y2="92" stroke="#adb5bd" stroke-width="4"/><line x1="32" y1="30" x2="32" y2="92" stroke="#adb5bd" stroke-width="4"/>' +
      '<path d="M18 44 H32 M18 58 H32 M18 72 H32 M18 86 H32" stroke="#adb5bd" stroke-width="3"/><rect x="14" y="26" width="24" height="6" rx="2" fill="#6c757d"/>' +
      '<path d="M34 30 Q62 30 70 60 Q78 88 94 88" stroke="#ff8c42" stroke-width="10" fill="none" stroke-linecap="round"/>',
    fontanna: '<path d="M14 74 L86 74 L78 92 L22 92 Z" fill="#adb5bd"/><ellipse cx="50" cy="74" rx="36" ry="6" fill="#4cc9f0"/><rect x="46" y="44" width="8" height="30" fill="#ced4da"/>' +
      '<ellipse cx="50" cy="44" rx="13" ry="4" fill="#ced4da"/><path d="M50 40 Q30 26 22 70 M50 40 Q70 26 78 70 M50 40 Q50 22 50 16" stroke="#90e0ef" stroke-width="4" fill="none" stroke-linecap="round"/>',
    tecza: '<path d="M10 86 A40 40 0 0 1 90 86" stroke="#ff595e" stroke-width="7" fill="none"/><path d="M17 86 A33 33 0 0 1 83 86" stroke="#ffca3a" stroke-width="7" fill="none"/>' +
      '<path d="M24 86 A26 26 0 0 1 76 86" stroke="#8ac926" stroke-width="7" fill="none"/><path d="M31 86 A19 19 0 0 1 69 86" stroke="#1982c4" stroke-width="7" fill="none"/>' +
      '<path d="M38 86 A12 12 0 0 1 62 86" stroke="#6a4c93" stroke-width="7" fill="none"/>' +
      '<circle cx="12" cy="88" r="8" fill="#fff"/><circle cx="22" cy="90" r="7" fill="#fff"/><circle cx="88" cy="88" r="8" fill="#fff"/><circle cx="78" cy="90" r="7" fill="#fff"/>',
    zamek: '<rect x="16" y="36" width="16" height="56" fill="#cdb4db"/><rect x="68" y="36" width="16" height="56" fill="#cdb4db"/><rect x="28" y="52" width="44" height="40" fill="#e0c3fc"/>' +
      '<path d="M14 36 L24 16 L34 36 Z M66 36 L76 16 L86 36 Z" fill="#9b5de5"/><path d="M40 92 Q40 72 50 72 Q60 72 60 92 Z" fill="#5a189a"/>' +
      '<line x1="24" y1="16" x2="24" y2="6" stroke="#6c757d" stroke-width="2"/><path d="M24 6 L34 9 L24 12 Z" fill="#ff6fa8"/>' +
      '<line x1="76" y1="16" x2="76" y2="6" stroke="#6c757d" stroke-width="2"/><path d="M76 6 L86 9 L76 12 Z" fill="#ff6fa8"/>' +
      '<rect x="20" y="50" width="8" height="10" rx="3" fill="#ffd166"/><rect x="72" y="50" width="8" height="10" rx="3" fill="#ffd166"/>'
  };

  function deco(id, size) { return svg(decor[id] || '', size, 'deco'); }

  function egg(color, size, cracked) {
    return svg('<ellipse cx="50" cy="92" rx="24" ry="5" fill="#000" opacity=".25"/>' +
      '<path d="M50 8 C72 8 84 44 84 62 C84 82 68 94 50 94 C32 94 16 82 16 62 C16 44 28 8 50 8 Z" fill="#fff8e7"/>' +
      '<circle cx="38" cy="40" r="7" fill="' + color + '"/><circle cx="62" cy="54" r="9" fill="' + color + '"/><circle cx="40" cy="72" r="6" fill="' + color + '"/><circle cx="58" cy="26" r="4" fill="' + color + '"/>' +
      (cracked ? '<path d="M18 56 L30 50 L38 60 L48 50 L58 60 L68 50 L82 56" stroke="#6d4c41" stroke-width="3" fill="none" stroke-linejoin="round"/>' : ''),
      size, 'egg');
  }

  function nest(size) {
    return svg('<ellipse cx="50" cy="70" rx="40" ry="16" fill="#8d5524"/><ellipse cx="50" cy="64" rx="30" ry="9" fill="#5c3a1e"/>' +
      '<path d="M14 70 Q30 80 50 72 Q70 80 86 70 M18 76 Q40 86 62 76" stroke="#c68642" stroke-width="3" fill="none"/>', size, 'nest');
  }

  function monster(size) {
    return svg(
      '<path d="M50 6 L58 21 L74 13 L72 31 L90 33 L78 48 L92 62 L74 66 L76 84 L60 76 L50 92 L40 76 L24 84 L26 66 L8 62 L22 48 L10 33 L28 31 L26 13 L42 21 Z" fill="#5a189a"/>' +
      '<circle cx="50" cy="50" r="26" fill="#7b2cbf"/>' +
      '<circle cx="39" cy="46" r="7" fill="#fff"/><circle cx="61" cy="46" r="7" fill="#fff"/><circle cx="50" cy="33" r="5" fill="#fff"/>' +
      '<circle cx="40" cy="47" r="3.5" fill="#10002b"/><circle cx="60" cy="47" r="3.5" fill="#10002b"/><circle cx="51" cy="34" r="2.5" fill="#10002b"/>' +
      '<path d="M36 60 L42 66 L48 60 L54 66 L60 60 L64 64" stroke="#fff" stroke-width="3" fill="none" stroke-linejoin="round"/>',
      size, 'monster');
  }

  function planet(color, size, ring) {
    return svg(
      '<circle cx="50" cy="50" r="32" fill="' + color + '"/>' +
      '<circle cx="40" cy="40" r="6" fill="#000" opacity=".12"/><circle cx="61" cy="58" r="8" fill="#000" opacity=".12"/><circle cx="57" cy="35" r="4" fill="#000" opacity=".12"/>' +
      '<path d="M28 38 Q34 24 48 21" stroke="#fff" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"/>' +
      (ring ? '<ellipse cx="50" cy="50" rx="47" ry="11" fill="none" stroke="#fff" stroke-width="4" opacity=".55" transform="rotate(-18 50 50)"/>' : ''),
      size, 'planet');
  }

  function chest(open, size) {
    var body = '<rect x="16" y="48" width="68" height="38" rx="6" fill="#a0522d"/>' +
      '<rect x="16" y="58" width="68" height="5" fill="#ffd166"/>' +
      '<rect x="24" y="48" width="6" height="38" fill="#ffd166"/><rect x="70" y="48" width="6" height="38" fill="#ffd166"/>';
    if (!open) {
      return svg(body +
        '<path d="M16 50 Q16 24 50 24 Q84 24 84 50 Z" fill="#cd853f"/>' +
        '<rect x="24" y="30" width="6" height="20" fill="#ffd166"/><rect x="70" y="30" width="6" height="20" fill="#ffd166"/>' +
        '<rect x="43" y="42" width="14" height="16" rx="3" fill="#ffd166"/><circle cx="50" cy="49" r="2.5" fill="#6d4c41"/>',
        size, 'chest');
    }
    return svg('<circle cx="50" cy="40" r="38" fill="#ffd166" opacity=".3"/>' +
      '<circle cx="12" cy="20" r="3" fill="#ffd166"/><circle cx="90" cy="14" r="3.5" fill="#ffd166"/>' +
      '<circle cx="8" cy="52" r="2.5" fill="#fff"/><circle cx="94" cy="46" r="2.5" fill="#fff"/>' + body +
      '<path d="M18 38 Q14 12 48 6 Q80 2 84 28 Z" fill="#cd853f"/>' +
      '<path d="M50 22 L54 32 L64 32 L56 38 L59 48 L50 42 L41 48 L44 38 L36 32 L46 32 Z" fill="#ffd166" stroke="#f4a261" stroke-width="1.5"/>',
      size, 'chest open');
  }

  function moon(size) {
    return svg('<path d="M60 12 A40 40 0 1 0 88 68 A32 32 0 1 1 60 12 Z" fill="#fff3b0"/>' +
      '<circle cx="34" cy="56" r="4" fill="#f4d58d"/><circle cx="46" cy="76" r="3" fill="#f4d58d"/>', size, 'moon');
  }

  // Array of dots: a rows of b dots, with a gap after every 5 to make counting easier.
  function dots(a, b) {
    var c = 12, g = 6, s = '';
    var w = b * c + (b > 5 ? g : 0), h = a * c + (a > 5 ? g : 0);
    var colors = ['#ffd166', '#06d6a0'];
    for (var r = 0; r < a; r++) {
      for (var k = 0; k < b; k++) {
        var x = k * c + (k >= 5 ? g : 0) + 6, y = r * c + (r >= 5 ? g : 0) + 6;
        s += '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="' + colors[r % 2] + '"/>';
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + (w * 2) + '" height="' + (h * 2) + '" class="dots" aria-hidden="true">' + s + '</svg>';
  }

  return {
    rocket: rocket, avatar: avatar, creature: creature, monster: monster,
    planet: planet, chest: chest, moon: moon, dots: dots, deco: deco, egg: egg, nest: nest,
    avatarIds: ['astronautka', 'kot', 'lis', 'robot'],
    rocketColors: ['#ff6fa8', '#9b5de5', '#00bbf9', '#00c49a', '#fee440', '#ff8c42']
  };
})();
