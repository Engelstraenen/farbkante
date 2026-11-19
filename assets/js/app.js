/* FARBKANTE – Demo (PROJEKT EX). Vanilla-JS, alles hängt an der Scroll-Position. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var eout = function (t) { return 1 - Math.pow(1 - t, 3); };
  var mobile = function () { return innerWidth < 900; };

  /* ---------- Bilder: data-img="name" → assets/img/name.webp (mobil -m) ---------- */
  var IMG = window.FK_IMG || {};           // aus img.js: {name:{w,h,png}}
  function src(name, png) {
    var m = mobile() ? '-m' : '';
    return 'assets/img/' + name + m + (png ? '.png' : '.webp') + '?v=' + (IMG._v || 1);
  }
  $$('[data-img]').forEach(function (el) {
    var n = el.getAttribute('data-img');
    if (IMG[n]) { el.src = src(n, el.hasAttribute('data-png')); }
    else { el.classList.add('ph'); el.setAttribute('data-ph', n + ' rendert'); el.removeAttribute('src'); }
  });

  /* ---------- Persönlicher Link: ?firma=Maler+Müller ---------- */
  (function () {
    var f = null;
    try { f = new URLSearchParams(location.search).get('firma'); if (f) sessionStorage.setItem('fk-firma', f); else f = sessionStorage.getItem('fk-firma'); } catch (e) {}
    if (!f) return;
    $$('[data-firma]').forEach(function (el) { el.textContent = f; });
    root.classList.add('has-firma');
  })();

  /* ---------- Menü, Toast, Modal ---------- */
  $('.nav-menu').addEventListener('click', function () {
    var o = root.classList.toggle('menu-open'); this.setAttribute('aria-expanded', o);
  });
  $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { root.classList.remove('menu-open'); }); });
  var toastT;
  function toast(t) { var el = $('.toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2600); }
  $$('[data-open="termin"]').forEach(function (b) { b.addEventListener('click', function () { var m = $('#m-termin'); if (m.showModal) m.showModal(); }); });
  $('#m-termin form').addEventListener('submit', function () { toast('Demo: Anfrage wäre jetzt beim Meister.'); });
  $$('.social span').forEach(function (s) { s.addEventListener('click', function () { toast('Demo: Beispiel-Kanal'); }); });

  /* ---------- Kapitel-Punkte ---------- */
  var chs = $$('.ch');
  var dots = $('.dots');
  chs.forEach(function (c) { var i = document.createElement('i'); dots.appendChild(i); });
  var dotEls = $$('i', dots);

  /* ---------- Fortschritt je Kapitel ---------- */
  function prog(sec) {
    var r = sec.getBoundingClientRect(), h = sec.offsetHeight - innerHeight;
    return h > 0 ? clamp(-r.top / h, 0, 1) : (r.top < innerHeight && r.bottom > 0 ? 1 : 0);
  }
  function show(el, o, dy) {
    if (!el) return;
    el.style.opacity = o.toFixed(3);
    el.style.transform = (el.classList.contains('b-hero') ? 'translateY(-40%) ' : '') + 'translateY(' + ((1 - o) * (dy == null ? 24 : dy)).toFixed(1) + 'px)';
  }
  function band(p, a, b, f) { f = f || .06; return Math.min(seg(p, a, a + f), 1 - seg(p, b - f, b)); }

  /* ---------- Film-Kapitel: Video spulen oder Standbild mit Kamerafahrt ---------- */
  function Film(sec, from, to) {
    var v = $('.vid', sec), stage = $('.stage', sec), ok = false;
    var base = v.getAttribute('data-src');
    if (base && (window.FK_VID || {})[sec.id]) {
      var s = document.createElement('source');
      s.src = base + (mobile() ? '-m' : '') + '.mp4?v=' + FK_VID._v; s.type = 'video/mp4'; v.appendChild(s);
      v.addEventListener('loadeddata', function () { ok = true; stage.classList.add('has-vid'); });
      v.load(); var pr = v.play && v.play(); if (pr && pr.then) pr.then(function () { v.pause(); }).catch(function () {});
    }
    var want = 0, cur = 0;
    return function (p, z) {
      $('.media', sec).style.setProperty('--z', z);
      if (ok && v.duration) {
        want = from + (Math.min(to || v.duration, v.duration - .05) - from) * p;
        cur += (want - cur) * .35;
        if (Math.abs(v.currentTime - cur) > .02) v.currentTime = cur;
      }
    };
  }

  /* 1 Fassade */
  var S1 = $('#fassade'), f1 = Film(S1, 0), b1 = $$('.beat', S1), t1 = $('.tag', S1);
  function ch1(p) {
    f1(seg(p, 0, .72), 1 + .14 * ease(seg(p, 0, .72)));
    show(b1[0], 1 - seg(p, .06, .14), 30);
    show(b1[1], band(p, .2, .42));
    show(b1[2], band(p, .46, .68));
    t1.classList.toggle('on', p > .46 && p < .74);
    var w = seg(p, .72, 1), win = $('.window', S1);
    win.style.opacity = seg(p, .72, .78).toFixed(3);
    win.style.setProperty('--wz', (1 + 5.5 * Math.pow(ease(seg(p, .78, 1)), 1.6)).toFixed(3));
    $('.wipe', S1).style.opacity = seg(p, .9, 1).toFixed(3);
  }

  /* 2 Leistungen: Rolle rollt fünf Streifen in den Rahmen */
  var S2 = $('#leistungen'), stripes = $$('.stripe', S2), roller2 = $('.roller', S2), frameIn = $('.frame-in', S2);
  var GEO = window.FK_GEO || {};
  // Streifen-Bänder im Bild m1-streifen (Anteil der Bildhöhe) und Rahmen-Innenmaß in m2-rahmen
  var BANDS = GEO.bands || [[.10, .26], [.28, .44], [.46, .62], [.64, .80], [.82, .98]];
  var STRIPE_END = GEO.stripeEnd || .80;
  (function () {
    var hasImg = !!IMG['m1-streifen'];
    stripes.forEach(function (s, i) {
      var b = BANDS[i], hgt = b[1] - b[0];
      s.style.setProperty('--y0', (b[0] * 100) + '%');
      s.style.setProperty('--bh', (hgt * 100) + '%');
      if (hasImg) {
        s.style.setProperty('--src', 'url(' + src('m1-streifen') + ')');
        s.style.setProperty('--bf', hgt);
        s.style.setProperty('--bp', (b[0] / (1 - hgt) * 100) + '%');
      } else s.classList.add('noimg');
    });
    if (GEO.frame && !mobile()) {
      var f = GEO.frame; frameIn.style.setProperty('--fx0', f[0] * 100 + '%'); frameIn.style.setProperty('--fy0', f[1] * 100 + '%');
      frameIn.style.setProperty('--fw', (f[2] - f[0]) * 100 + '%'); frameIn.style.setProperty('--fh', (f[3] - f[1]) * 100 + '%');
    }
  })();
  var INFO = [
    ['Innen', 'Wände & Decken', 'Abdecken, spachteln, streichen. Wir räumen auf, bevor wir gehen.', ['Altbau mit Stuck', 'Treppenhäuser', 'Büros am Wochenende']],
    ['Fassade', 'Außen', 'Gerüst, Reinigung, Risse, Anstrich. Ein Ansprechpartner von der Planung bis zum Abbau.', ['Fassadenanstrich', 'Wärmedämmung', 'Graffiti-Schutz']],
    ['Lack', 'Türen, Fenster, Treppen', 'Hochglanz oder seidenmatt, gespritzt oder gestrichen. Alte Türen sehen wieder aus wie neu.', ['Holzfenster', 'Haustüren', 'Heizkörper & Geländer']],
    ['Tapete', 'Tapezieren', 'Von Vlies bis Fototapete. Auf Wunsch mit passender Wandfarbe aus dem Farblabor.', ['Vliestapete', 'Mustertapete', 'Malervlies glatt']],
    ['Spachtel', 'Spachteltechnik', 'Beton-Optik, Kalkputz, Glanzspachtel. Flächen, die man anfassen will.', ['Venezianer Glanz', 'Beton-Optik', 'Kalk & Lehm']]
  ];
  var sheet = $('.sheet', S2);
  stripes.forEach(function (s, i) {
    s.addEventListener('click', function () {
      var d = INFO[i];
      $('.kicker', sheet).textContent = d[1]; $('h3', sheet).textContent = d[0]; $('.txt', sheet).textContent = d[2];
      $('.pts', sheet).innerHTML = d[3].map(function (x) { return '<li>' + x + '</li>'; }).join('');
      sheet.style.setProperty('--c', getComputedStyle(s).getPropertyValue('--c'));
      sheet.hidden = false;
    });
  });
  $('.sheet-x', S2).addEventListener('click', function () { sheet.hidden = true; });
  function ch2(p) {
    $('.frame-img', S2).style.setProperty('--fz', (1.5 - .5 * eout(seg(p, 0, .14))).toFixed(3));
    frameIn.style.opacity = seg(p, .08, .14).toFixed(3);
    S2.querySelector('.ch-title').style.setProperty('--to', seg(p, .12, .2).toFixed(3));
    var k = seg(p, .14, .9) * 5, act = Math.min(4, Math.floor(k));
    stripes.forEach(function (s, i) {
      var r = clamp(k - i, 0, 1), e = ease(r) * STRIPE_END * 100;
      s.style.setProperty('--rv', (r >= 1 ? 100 : e).toFixed(2) + '%');
      s.style.setProperty('--lo', seg(r, .5, 1).toFixed(3));
    });
    var r = clamp(k - act, 0, 1), b = BANDS[act];
    roller2.style.left = (ease(r) * STRIPE_END * 100).toFixed(2) + '%';
    roller2.style.top = ((b[0] + b[1]) / 2 * 100).toFixed(2) + '%';
    roller2.style.opacity = (p > .9 ? 1 - seg(p, .9, .97) : seg(p, .1, .16)).toFixed(3);
  }

  /* 3 Raum für Raum */
  var S3 = $('#raum'), f3 = Film(S3, 0), b3 = $$('.beat', S3), st3 = $$('.steps li', S3), t3 = $('.tag', S3);
  function ch3(p) {
    f3(seg(p, 0, .78), 1 + .08 * seg(p, 0, .78));
    show(b3[0], band(p, .02, .3));
    show(b3[1], band(p, .5, .74));
    var k = seg(p, .08, .7) * 4;
    st3.forEach(function (li, i) { li.classList.toggle('on', k > i); });
    $('.steps', S3).style.opacity = (1 - seg(p, .74, .8)).toFixed(3);
    t3.classList.toggle('on', p > .04 && p < .76);
    $('.rollover', S3).style.setProperty('--rx', (-105 + 105 * ease(seg(p, .8, 1))).toFixed(2) + '%');
  }

  /* 4 Farblabor + Angebot per Foto */
  var S4 = $('#farblabor');
  var COLORS = [
    ['Petrol', '#13777c'], ['Ocker', '#d6963f'], ['Salbei', '#9dbcb2'], ['Terrakotta', '#c4673f'],
    ['Altrosa', '#d8a7a0'], ['Taubenblau', '#7c93a8'], ['Sand', '#d9c7a6'], ['Anthrazit', '#4a4f53']
  ];
  var chipsEl = $('.chips', S4), room = $('.room', S4), labName = $('.lab-name', S4), picked = -1;
  COLORS.forEach(function (c, i) {
    var b = document.createElement('button'); b.className = 'chip'; b.style.setProperty('--c', c[1]);
    b.setAttribute('role', 'radio'); b.setAttribute('aria-label', c[0]); b.setAttribute('aria-checked', 'false');
    b.addEventListener('click', function () { picked = i; setColor(i); });
    chipsEl.appendChild(b);
  });
  var curCol = -1;
  function setColor(i) {
    if (i === curCol) return; curCol = i;
    room.style.setProperty('--wall', COLORS[i][1]);
    labName.textContent = 'Deine Wand in ' + COLORS[i][0];
    $$('.chip', S4).forEach(function (c, j) { c.setAttribute('aria-checked', j === i ? 'true' : 'false'); });
  }
  if (IMG['m5b-maske']) room.style.setProperty('--mask', 'url(' + src('m5b-maske', true) + ')'); else room.classList.add('nomask');
  var phone = $('.phone-scene', S4), calc = $('.calc', S4);
  if (GEO.screen) { var g = GEO.screen; var sc = $('.screen', phone);
    sc.style.setProperty('--sx0', g[0] * 100 + '%'); sc.style.setProperty('--sy0', g[1] * 100 + '%');
    sc.style.setProperty('--sw', (g[2] - g[0]) * 100 + '%'); sc.style.setProperty('--sh', (g[3] - g[1]) * 100 + '%'); }
  // Rechner: jeder Regler bewegt das Messfeld und die Fläche
  var vals = { w: 4.5, h: 3.2, n: 4 };
  function calcUpd() {
    var a = vals.w * vals.h * vals.n;
    $('[data-o="w"]', calc).textContent = vals.w.toFixed(1).replace('.', ',') + ' m';
    $('[data-o="h"]', calc).textContent = vals.h.toFixed(1).replace('.', ',') + ' m';
    $('[data-o="n"]', calc).textContent = vals.n;
    $('[data-o="a"]', calc).textContent = Math.round(a);
    var m = $('.measure', phone);
    m.style.setProperty('--mw', (40 + vals.w / 9 * 52).toFixed(1) + '%');
    m.style.setProperty('--mh', (24 + vals.h / 4.2 * 40).toFixed(1) + '%');
    $('.m2', m).textContent = (vals.w * vals.h).toFixed(1).replace('.', ',') + ' m² × ' + vals.n;
  }
  $$('input[type=range]', calc).forEach(function (r) {
    r.addEventListener('input', function () { vals[r.getAttribute('data-k')] = parseFloat(r.value); calcUpd(); });
  });
  calcUpd();
  $('.shot input', phone).addEventListener('change', function () {
    var f = this.files && this.files[0]; if (!f) return;
    var u = URL.createObjectURL(f); $('.cam', phone).style.setProperty('--camimg', 'url(' + u + ')');
    toast('Foto bleibt auf deinem Gerät (Demo).');
  });
  function ch4(p) {
    $('.fan', S4).style.setProperty('--fa', (ease(seg(p, .02, .16)) * 120).toFixed(1) + 'deg');
    if (picked < 0) setColor(Math.min(7, Math.floor(seg(p, .14, .5) * 8)));
    var t = ease(seg(p, .52, .64));
    room.style.opacity = (1 - t).toFixed(3);
    room.style.transform = 'translateY(' + (-40 * t).toFixed(1) + 'px) scale(' + (1 - .04 * t).toFixed(3) + ')';
    phone.style.opacity = t.toFixed(3);
    phone.style.transform = 'translateY(' + (40 * (1 - t)).toFixed(1) + 'px) scale(' + (.96 + .04 * t).toFixed(3) + ')';
    $('.lab-l', S4).style.opacity = (1 - .55 * t).toFixed(3);
    calc.classList.toggle('on', p > .62 && p < .99);
    // Messfeld zieht sich beim Scrollen auf
    $('.measure', phone).style.opacity = seg(p, .64, .7).toFixed(3);
  }

  /* 5 Karriere */
  var S5 = $('#karriere'), f5 = Film(S5, 0), b5 = $$('.beat', S5);
  function ch5(p) {
    f5(seg(p, 0, 1), 1.02 + .08 * p);
    show(b5[0], band(p, .04, .55));
    show(b5[1], band(p, .5, 1.2));
    $$('.perks li', S5).forEach(function (li, i) { var o = seg(p, .52 + i * .06, .6 + i * .06); li.style.opacity = o; li.style.transform = 'translateY(' + (1 - o) * 14 + 'px)'; });
  }

  /* 6 Bewerben: Wisch-Karten */
  var Q = [
    ['Lieber drinnen oder draußen?', 'Drinnen', 'Draußen'],
    ['Höhe auf dem Gerüst?', 'Lieber unten', 'Kein Problem'],
    ['Was reizt dich mehr?', 'Farbe & Gestaltung', 'Lack & Technik'],
    ['Wann kannst du starten?', 'Nach der Schule', 'Sofort'],
    ['Wie erreichen wir dich?', 'Anruf', 'WhatsApp']
  ];
  var deck = $('.deck'), progEl = $('.prog'), qi = 0, t0 = 0, clockT, answers = [];
  function fmt(s) { return Math.floor(s / 60) + ':' + ('0' + Math.floor(s % 60)).slice(-2); }
  function renderCard() {
    deck.innerHTML = '';
    if (qi >= Q.length) {
      clearInterval(clockT);
      var s = (Date.now() - t0) / 1000;
      deck.innerHTML = '<div class="card done"><h4>Fertig in ' + fmt(s) + '.</h4><p>Wir melden uns per ' + (answers[4] || 'WhatsApp') + '. (Demo, es wird nichts gesendet.)</p></div>';
      progEl.textContent = 'Geschafft'; return;
    }
    var q = Q[qi], c = document.createElement('div'); c.className = 'card';
    c.innerHTML = '<h4>' + q[0] + '</h4><div class="opts"><span>← ' + q[1] + '</span><span>' + q[2] + ' →</span></div>';
    deck.appendChild(c); progEl.textContent = 'Frage ' + (qi + 1) + ' von ' + Q.length;
    var sx = null, dx = 0;
    c.addEventListener('pointerdown', function (e) { sx = e.clientX; c.setPointerCapture(e.pointerId); c.style.transition = 'none'; });
    c.addEventListener('pointermove', function (e) { if (sx == null) return; dx = e.clientX - sx; c.style.transform = 'translateX(' + dx + 'px) rotate(' + dx / 18 + 'deg)'; });
    c.addEventListener('pointerup', function () { c.style.transition = ''; if (Math.abs(dx) > 70) answer(dx > 0); else c.style.transform = ''; sx = null; dx = 0; });
  }
  function answer(right) {
    if (!t0) { t0 = Date.now(); clockT = setInterval(function () { $('.clock b').textContent = fmt((Date.now() - t0) / 1000); }, 250); }
    if (qi >= Q.length) return;
    answers[qi] = Q[qi][right ? 2 : 1];
    var c = $('.card', deck); if (c) { c.style.transform = 'translateX(' + (right ? 140 : -140) + '%) rotate(' + (right ? 18 : -18) + 'deg)'; c.style.opacity = 0; }
    qi++; setTimeout(renderCard, 260);
  }
  $('.deck-nav .no').addEventListener('click', function () { answer(false); });
  $('.deck-nav .yes').addEventListener('click', function () { answer(true); });
  $$('.roles button').forEach(function (b) { b.addEventListener('click', function () { $$('.roles button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }); });
  renderCard();
  if (IMG['m7-handy-front'] && IMG['m7-handy-front'].screen) {
    var ap = $('.apply-phone'), g7 = IMG['m7-handy-front'];
    ap.style.setProperty('--pa', g7.w + '/' + g7.h);
    var sc7 = $('.screen', ap), q7 = g7.screen;
    sc7.style.setProperty('--sx0', q7[0] * 100 + '%'); sc7.style.setProperty('--sy0', q7[1] * 100 + '%');
    sc7.style.setProperty('--sw', (q7[2] - q7[0]) * 100 + '%'); sc7.style.setProperty('--sh', (q7[3] - q7[1]) * 100 + '%');
  }

  /* 7 Finale: Rolle malt die Wortmarke */
  var S7 = $('#termin'), paint = $('.paint', S7), roller7 = $('.roller', S7);
  function ch7(p) {
    var t = ease(seg(p, .05, .7)), end = (GEO.paintEnd || .9) * 100;
    paint.style.setProperty('--pv', (t * end).toFixed(2) + '%');
    paint.style.setProperty('--wv', (seg(t * end, 8, end) * 100).toFixed(2) + '%');
    roller7.style.left = (t * end).toFixed(2) + '%'; roller7.style.top = (GEO.paintY || 50) + '%';
    roller7.style.opacity = (1 - seg(p, .72, .8)).toFixed(3);
    S7.querySelector('.fin').style.setProperty('--fo', seg(p, .6, .78).toFixed(3));
  }

  /* ---------- Schleife ---------- */
  var tick = false;
  function frame() {
    tick = false;
    root.classList.toggle('scrolled', scrollY > 30);
    var P = chs.map(prog);
    ch1(P[0]); ch2(P[1]); ch3(P[2]); ch4(P[3]); ch5(P[4]); ch7(P[6]);
    var act = 0; chs.forEach(function (c, i) { if (c.getBoundingClientRect().top < innerHeight * .5) act = i; });
    dotEls.forEach(function (d, i) { d.classList.toggle('on', i === act); });
  }
  function req() { if (!tick) { tick = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  frame();
  // Video-Spulen glätten: weiter rechnen, solange sich etwas bewegt
  setInterval(req, 120);
})();
