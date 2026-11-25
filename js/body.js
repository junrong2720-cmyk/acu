/* 人体示意图:正面 F / 背面 B / 头面 H / 侧头 S
   身体轮廓按骨度分寸比例绘制,穴位坐标由骨度分寸换算(只标一侧)。 */
(function () {
  'use strict';
  var A = window.ACU;

  /* ---------- 几何工具 ---------- */
  function r1(n) { return Math.round(n * 10) / 10; }
  function pt(p) { return r1(p[0]) + ',' + r1(p[1]); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lp(p, q, t) { return [lerp(p[0], q[0], t), lerp(p[1], q[1], t)]; }
  function add(p, v, k) { return [p[0] + v[0] * k, p[1] + v[1] * k]; }
  function unit(a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; }
  function cr(P, closed) {
    var n = P.length, d = 'M' + pt(P[0]);
    function g(i) { return closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))]; }
    var last = closed ? n : n - 1;
    for (var i = 0; i < last; i++) {
      var p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      d += 'C' + pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]) + ' ' +
        pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]) + ' ' + pt(p2);
    }
    return d + (closed ? 'Z' : '');
  }
  function limb(c) {
    var Lt = [], Rt = [];
    for (var i = 0; i < c.length; i++) {
      var a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)];
      var u = unit(a, b), nx = -u[1], ny = u[0];
      Lt.push([c[i][0] + nx * c[i][2], c[i][1] + ny * c[i][2]]);
      Rt.push([c[i][0] - nx * c[i][2], c[i][1] - ny * c[i][2]]);
    }
    var s = c[0], e = c[c.length - 1];
    var d0 = unit(c[1], s), d1 = unit(c[c.length - 2], e);
    return cr(Lt.concat([[e[0] + d1[0] * e[2], e[1] + d1[1] * e[2]]]).concat(Rt.reverse()).concat([[s[0] + d0[0] * s[2], s[1] + d0[1] * s[2]]]), true);
  }
  function mir(P, W) { return P.map(function (p) { return p.length > 2 ? [W - p[0], p[1], p[2]] : [W - p[0], p[1]]; }); }
  function ell(cx, cy, rx, ry) { return 'M' + r1(cx - rx) + ',' + cy + 'a' + rx + ',' + ry + ' 0 1,0 ' + 2 * rx + ',0a' + rx + ',' + ry + ' 0 1,0 ' + -2 * rx + ',0Z'; }
  function line(a, b) { return 'M' + pt(a) + 'L' + pt(b); }

  /* ---------- 全身(正/背共用,画面右侧肢体) ---------- */
  var ARM = [[348, 234, 21], [352, 270, 19], [362, 325, 18], [372, 378, 17], [386, 450, 15.5], [400, 528, 11.5], [406, 548, 15.5], [410, 575, 16.5], [414, 600, 13.5], [416, 616, 8.5]];
  var THUMB = [[406, 536, 8], [419, 560, 6.5], [429, 584, 5]];
  var LEG = [[298, 498, 44], [303, 560, 39], [305, 630, 33], [305, 700, 26], [305, 730, 25], [306, 780, 28], [306, 830, 25], [305, 880, 18], [304, 935, 13]];
  var FOOT_F = [[304, 930, 13], [307, 958, 17], [311, 984, 20]];
  var FOOT_B = [[304, 930, 13], [304, 956, 15], [304, 972, 14]];
  var TORSO = [[250, 192], [272, 190], [296, 200], [324, 208], [346, 218], [358, 236], [346, 262], [340, 300], [332, 350], [320, 392], [324, 430], [338, 468], [344, 500], [330, 525], [262, 528]];
  var NECK = [[250, 140, 22], [250, 172, 21], [250, 200, 27]];
  var HEAD = [[250, 28], [284, 38], [300, 70], [301, 100], [294, 126], [278, 146], [250, 156], [222, 146], [206, 126], [199, 100], [200, 70], [216, 38]];

  var E = [372, 378], W = [400, 528], AF = [352, 270], TIP = [416, 616];
  var nF = [0.983, -0.183], nU = [0.984, -0.182];
  var dH = unit(W, TIP), nH = [dH[1], -dH[0]];
  var TB = [406, 536], TT = [429, 584], dT = unit(TB, TT), nT = [dT[1], -dT[0]];
  function fa(c, s) { return add(lp(W, E, c / 12), nF, s * lerp(11.5, 17, c / 12) * 0.85); }          // 前臂:腕横纹上 c 寸;s 尺侧-1 … 桡侧+1
  function ua(c, s) { return add(lp(E, AF, c / 9), nU, s * lerp(17, 19, Math.min(c / 9, 1)) * 0.85); } // 上臂:肘横纹上 c 寸
  function hand(a, s) {                                                                             // 手:a 0腕 1掌指关节 2指尖
    var along = a <= 1 ? a * 47 : 47 + (a - 1) * 41, hw = a <= 1 ? lerp(13, 17, a) : lerp(16, 9, a - 1);
    return add(add(W, dH, along), nH, s * hw * 0.9);
  }
  function legAt(y) {
    for (var i = 1; i < LEG.length; i++) if (y <= LEG[i][1] || i === LEG.length - 1) {
      var a = LEG[i - 1], b = LEG[i], t = Math.max(0, Math.min(1, (y - a[1]) / (b[1] - a[1])));
      return [lerp(a[0], b[0], t), lerp(a[2], b[2], t)];
    }
  }
  function leg(y, s) { var q = legAt(y); return [q[0] + s * q[1] * 0.88, y]; }                      // s 内侧-1 … 外侧+1
  function foot(a, s) { var c = lp([304, 935], [311, 986], a), hw = a < 0.5 ? lerp(13, 19, a / 0.5) : 19.5; return [c[0] + s * hw * 0.9, c[1]]; }
  function thighY(c) { return 700 - 11.8 * c; }   // 髌底上 c 寸
  function dubiY(c) { return 728 + 13.25 * c; }   // 犊鼻下 c 寸
  function medY(c) { return 940 - 15.2 * c; }     // 内踝尖上 c 寸
  function latY(c) { return 945 - 13.3 * c; }     // 外踝尖上 c 寸
  function glutY(c) { return 545 + 13.3 * c; }    // 臀沟下 c 寸
  function popY(c) { return 732 + 13.6 * c; }     // 腘横纹下 c 寸
  function X(c) { return 250 + 12.5 * c; }        // 前正中线旁开 c 寸
  function abdY(c) { return c >= 0 ? 414 - 11.9 * c : 414 - 14.4 * c; } // 脐上(+)/下(-) c 寸
  var ICS = [222, 240, 260, 280, 299, 319, 339, 359];                  // 0=锁骨下缘,1–7 肋间隙
  function ch(i, c) { return [X(c), ICS[i] + c * 1.0]; }
  function BX(c) { return 250 + 12.7 * c; }       // 后正中线旁开 c 寸
  function T(i) { return 211 + 15 * (i - 1); }    // 胸椎棘突下
  function Lv(i) { return 393 + 17 * (i - 1); }   // 腰椎棘突下
  var SF = [0, 474, 486, 497, 507];               // 骶后孔

  /* ---------- 头面(H)与侧头(S) ---------- */
  function XH(c) { return 200 + 24.5 * c; }
  function hy(c) { return 95 - 14.6 * c; }        // 前发际上 c 寸(正面透视压缩)
  var ARC1 = [[122, 95], [145, 55], [185, 25], [235, 18]];
  var ARC2 = [[235, 18], [285, 38], [325, 85], [342, 150], [334, 205], [318, 245], [302, 280]];
  function along(P, t) {
    var Ls = [0], i;
    for (i = 1; i < P.length; i++) Ls.push(Ls[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    var d = t * Ls[Ls.length - 1];
    for (i = 1; i < P.length; i++) if (d <= Ls[i] || i === P.length - 1) {
      var u = unit(P[i - 1], P[i]);
      return { p: lp(P[i - 1], P[i], (d - Ls[i - 1]) / (Ls[i] - Ls[i - 1])), n: [-u[1], u[0]] };
    }
  }
  function sArc(c, inset) { var g = c <= 5 ? along(ARC1, c / 5) : along(ARC2, (c - 5) / 7); return add(g.p, g.n, inset); } // 前发际起头正中线 c 寸

  /* ---------- 穴位坐标 ---------- */
  var POS = {};
  function P(code, v, p) { POS[code] = { v: v, x: r1(p[0]), y: r1(p[1]) }; }
  var i, k;

  // 肺经 F
  P('LU1', 'F', ch(1, 6)); P('LU2', 'F', [X(6), 224]); P('LU3', 'F', ua(6, .85)); P('LU4', 'F', ua(5, .85));
  P('LU5', 'F', fa(12, .35)); P('LU6', 'F', fa(7, .52)); P('LU7', 'F', fa(1.5, 1)); P('LU8', 'F', fa(1, .8)); P('LU9', 'F', fa(0, .75));
  P('LU10', 'F', add(lp(TB, TT, .3), nT, 6)); P('LU11', 'F', add(add(TT, nT, 3), dT, -1));
  // 大肠经 B / H / S
  P('LI1', 'B', hand(1.95, .85)); P('LI2', 'B', hand(1.05, 1)); P('LI3', 'B', hand(.9, 1)); P('LI4', 'B', hand(.5, 1.05)); P('LI5', 'B', fa(0, 1.05));
  P('LI6', 'B', fa(3, .95)); P('LI7', 'B', fa(5, .95)); P('LI8', 'B', fa(8, .95)); P('LI9', 'B', fa(9, .95)); P('LI10', 'B', fa(10, .95)); P('LI11', 'B', fa(12, 1.05));
  P('LI12', 'B', ua(1, 1.05)); P('LI13', 'B', ua(3, 1)); P('LI14', 'B', ua(7, .9)); P('LI15', 'B', [360, 226]); P('LI16', 'B', [322, 212]);
  P('LI17', 'S', [230, 400]); P('LI18', 'S', [224, 378]); P('LI19', 'H', [219, 284]); P('LI20', 'H', [230, 266]);
  // 胃经
  P('ST1', 'H', [245, 218]); P('ST2', 'H', [245, 234]); P('ST3', 'H', [245, 262]); P('ST4', 'H', [235, 304]);
  P('ST5', 'S', [185, 340]); P('ST6', 'S', [205, 302]); P('ST7', 'S', [195, 238]); P('ST8', 'S', [152, 100]);
  P('ST9', 'S', [207, 378]); P('ST10', 'S', [202, 400]); P('ST11', 'S', [206, 440]);
  P('ST12', 'F', [300, 212]); P('ST13', 'F', [300, 224]); P('ST14', 'F', ch(1, 4)); P('ST15', 'F', ch(2, 4)); P('ST16', 'F', ch(3, 4)); P('ST17', 'F', [300, 299]); P('ST18', 'F', ch(5, 4));
  for (k = 6, i = 19; i <= 30; i++, k--) P('ST' + i, 'F', [X(2), abdY(k)]);
  P('ST31', 'F', leg(thighY(15), .3)); P('ST32', 'F', leg(thighY(6), .35)); P('ST33', 'F', leg(thighY(3), .4)); P('ST34', 'F', leg(thighY(2), .45));
  P('ST35', 'F', [317, 729]); P('ST36', 'F', leg(dubiY(3), .35)); P('ST37', 'F', leg(dubiY(6), .35)); P('ST38', 'F', leg(dubiY(8), .35)); P('ST39', 'F', leg(dubiY(9), .35));
  P('ST40', 'F', leg(dubiY(8), .65)); P('ST41', 'F', [305, 938]); P('ST42', 'F', foot(.3, -.25)); P('ST43', 'F', foot(.62, -.2)); P('ST44', 'F', foot(.86, -.2)); P('ST45', 'F', foot(1, -.3));
  // 脾经 F
  P('SP1', 'F', foot(1, -.95)); P('SP2', 'F', foot(.82, -1.05)); P('SP3', 'F', foot(.66, -1.05)); P('SP4', 'F', foot(.45, -1.05)); P('SP5', 'F', [298, 947]);
  P('SP6', 'F', leg(medY(3), -.8)); P('SP7', 'F', leg(medY(6), -.8)); P('SP8', 'F', leg(medY(10), -.8)); P('SP9', 'F', leg(medY(13), -.85));
  P('SP10', 'F', leg(thighY(2), -.75)); P('SP11', 'F', leg(thighY(12), -.55)); P('SP12', 'F', [X(3.5), 482]);
  P('SP13', 'F', [X(4), abdY(-4.3)]); P('SP14', 'F', [X(4), abdY(-1.3)]); P('SP15', 'F', [X(4), 414]); P('SP16', 'F', [X(4), abdY(3)]);
  P('SP17', 'F', ch(5, 6)); P('SP18', 'F', ch(4, 6)); P('SP19', 'F', ch(3, 6)); P('SP20', 'F', ch(2, 6)); P('SP21', 'F', [329, 350]);
  // 心经 F
  P('HT1', 'F', [338, 272]); P('HT2', 'F', ua(3, -.85)); P('HT3', 'F', fa(12, -1)); P('HT4', 'F', fa(1.5, -.85)); P('HT5', 'F', fa(1, -.85)); P('HT6', 'F', fa(.5, -.85));
  P('HT7', 'F', fa(0, -.85)); P('HT8', 'F', hand(.85, -.55)); P('HT9', 'F', hand(1.95, -.62));
  // 小肠经 B / H / S
  P('SI1', 'B', hand(1.9, -.92)); P('SI2', 'B', hand(1.05, -1.02)); P('SI3', 'B', hand(.88, -1.06)); P('SI4', 'B', hand(.15, -1.05)); P('SI5', 'B', fa(0, -1));
  P('SI6', 'B', fa(1, -.72)); P('SI7', 'B', fa(5, -1)); P('SI8', 'B', fa(12.3, -.8)); P('SI9', 'B', [338, 272]); P('SI10', 'B', [338, 246]);
  P('SI11', 'B', [307, 258]); P('SI12', 'B', [314, 227]); P('SI13', 'B', [292, 238]); P('SI14', 'B', [BX(3), T(1)]); P('SI15', 'B', [BX(2), 200]);
  P('SI16', 'S', [240, 378]); P('SI17', 'S', [235, 316]); P('SI18', 'H', [262, 262]); P('SI19', 'S', [222, 228]);
  // 膀胱经
  P('BL1', 'H', [226, 195]); P('BL2', 'H', [229, 170]); P('BL3', 'H', [229, 88]); P('BL4', 'H', [XH(1.5), 88]); P('BL5', 'H', [XH(1.5), hy(1)]);
  P('BL6', 'H', [XH(1.5), hy(2.5)]); P('BL7', 'H', [XH(1.5), hy(4)]); P('BL8', 'S', sArc(5.5, 10)); P('BL9', 'S', [322, 176]); P('BL10', 'S', [300, 272]);
  var bl1 = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12];
  for (i = 0; i < 11; i++) P('BL' + (11 + i), 'B', [BX(1.5), T(bl1[i])]);
  for (i = 1; i <= 5; i++) P('BL' + (21 + i), 'B', [BX(1.5), Lv(i)]);
  for (i = 1; i <= 4; i++) { P('BL' + (26 + i), 'B', [BX(1.5), SF[i]]); P('BL' + (30 + i), 'B', [BX(.8), SF[i]]); }
  P('BL35', 'B', [256, 524]); P('BL36', 'B', leg(glutY(0), 0)); P('BL37', 'B', leg(glutY(6), 0)); P('BL38', 'B', leg(glutY(13), .42)); P('BL39', 'B', leg(732, .5)); P('BL40', 'B', leg(732, 0));
  var bl2 = [['T', 2], ['T', 3], ['T', 4], ['T', 5], ['T', 6], ['T', 7], ['T', 9], ['T', 10], ['T', 11], ['T', 12], ['L', 1], ['L', 2]];
  for (i = 0; i < 12; i++) P('BL' + (41 + i), 'B', [BX(3), bl2[i][0] === 'T' ? T(bl2[i][1]) : Lv(bl2[i][1])]);
  P('BL53', 'B', [BX(3), SF[2]]); P('BL54', 'B', [BX(3), SF[4]]);
  P('BL55', 'B', leg(popY(2), 0)); P('BL56', 'B', leg(popY(5), 0)); P('BL57', 'B', leg(popY(8), 0)); P('BL58', 'B', leg(popY(9), .45)); P('BL59', 'B', leg(popY(13), .7));
  P('BL60', 'B', [316, 946]); P('BL61', 'B', [314, 964]); P('BL62', 'B', [319, 955]);
  P('BL63', 'F', foot(.5, 1.08)); P('BL64', 'F', foot(.6, 1.1)); P('BL65', 'F', foot(.74, 1.08)); P('BL66', 'F', foot(.86, 1.02)); P('BL67', 'F', foot(1, .88));
  // 肾经
  P('KI1', 'B', [72, 882]); P('KI2', 'F', foot(.35, -1.12)); P('KI3', 'F', [286, 936]); P('KI4', 'F', [285, 945]); P('KI5', 'F', [287, 952]); P('KI6', 'F', [291, 949]);
  P('KI7', 'F', leg(medY(2), -1)); P('KI8', 'F', leg(medY(2), -.82)); P('KI9', 'F', leg(medY(5), -1)); P('KI10', 'F', leg(735, -1.1));
  var ki = [-5, -4, -3, -2, -1, 0, 2, 3, 4, 5, 6];
  for (i = 0; i < 11; i++) P('KI' + (11 + i), 'F', [X(.5), abdY(ki[i])]);
  for (i = 22; i <= 26; i++) P('KI' + i, 'F', ch(27 - i, 2));
  P('KI27', 'F', [X(2), 222]);
  // 心包经 F
  P('PC1', 'F', ch(4, 5)); P('PC2', 'F', ua(7, 0)); P('PC3', 'F', fa(12, -.15)); P('PC4', 'F', fa(5, 0)); P('PC5', 'F', fa(3, 0)); P('PC6', 'F', fa(2, 0));
  P('PC7', 'F', fa(0, 0)); P('PC8', 'F', hand(.62, .18)); P('PC9', 'F', hand(2, .2));
  // 三焦经
  P('TE1', 'B', hand(1.93, -.38)); P('TE2', 'B', hand(1.05, -.5)); P('TE3', 'B', hand(.85, -.5)); P('TE4', 'B', fa(0, -.15)); P('TE5', 'B', fa(2, 0));
  P('TE6', 'B', fa(3, 0)); P('TE7', 'B', fa(3, -.38)); P('TE8', 'B', fa(4, 0)); P('TE9', 'B', fa(7, 0)); P('TE10', 'B', ua(1, 0)); P('TE11', 'B', ua(2, 0));
  P('TE12', 'B', ua(5, 0)); P('TE13', 'B', ua(7.6, .1)); P('TE14', 'B', [344, 238]); P('TE15', 'B', [290, 224]);
  P('TE16', 'S', [258, 322]); P('TE17', 'S', [248, 268]); P('TE18', 'S', [268, 238]); P('TE19', 'S', [268, 200]); P('TE20', 'S', [248, 166]);
  P('TE21', 'S', [223, 212]); P('TE22', 'S', [214, 198]); P('TE23', 'H', [285, 166]);
  // 胆经
  P('GB1', 'H', [276, 200]); P('GB2', 'S', [223, 244]); P('GB3', 'S', [195, 216]); P('GB4', 'S', [162, 122]); P('GB5', 'S', [176, 142]); P('GB6', 'S', [194, 163]);
  P('GB7', 'S', [212, 182]); P('GB8', 'S', [248, 142]); P('GB9', 'S', [272, 152]); P('GB10', 'S', [284, 190]); P('GB11', 'S', [282, 236]); P('GB12', 'S', [276, 280]);
  P('GB13', 'H', [XH(3), 88]); P('GB14', 'H', [245, 145]); P('GB15', 'H', [245, 88]); P('GB16', 'H', [245, hy(1.5)]); P('GB17', 'H', [245, hy(2.5)]); P('GB18', 'H', [245, hy(4)]);
  P('GB19', 'S', [292, 182]); P('GB20', 'S', [288, 254]); P('GB21', 'B', [298, 203]);
  P('GB22', 'F', [338, 300]); P('GB23', 'F', [331, 307]); P('GB24', 'F', ch(7, 4)); P('GB25', 'F', [318, 396]); P('GB26', 'F', [316, 414]);
  P('GB27', 'F', [318, abdY(-3)]); P('GB28', 'F', [316, 465]); P('GB29', 'F', [334, 486]); P('GB30', 'B', [309, 500]);
  P('GB31', 'F', leg(thighY(7), .95)); P('GB32', 'F', leg(thighY(5), .95)); P('GB33', 'F', leg(704, .98)); P('GB34', 'F', leg(dubiY(1.5), .82));
  P('GB35', 'F', leg(latY(7), .98)); P('GB36', 'F', leg(latY(7), .78)); P('GB37', 'F', leg(latY(5), .78)); P('GB38', 'F', leg(latY(4), .78)); P('GB39', 'F', leg(latY(3), .78));
  P('GB40', 'F', [318, 950]); P('GB41', 'F', foot(.6, .75)); P('GB42', 'F', foot(.72, .55)); P('GB43', 'F', foot(.88, .6)); P('GB44', 'F', foot(1, .52));
  // 肝经 F
  P('LR1', 'F', foot(1, -.6)); P('LR2', 'F', foot(.86, -.6)); P('LR3', 'F', foot(.55, -.6)); P('LR4', 'F', [299, 938]); P('LR5', 'F', leg(medY(5), -.55)); P('LR6', 'F', leg(medY(7), -.55));
  P('LR7', 'F', leg(medY(13), -1)); P('LR8', 'F', leg(733, -1.02)); P('LR9', 'F', leg(thighY(4), -.85)); P('LR10', 'F', [283, 523]); P('LR11', 'F', [281, 511]); P('LR12', 'F', [281, 487]);
  P('LR13', 'F', [318, 374]); P('LR14', 'F', ch(6, 4));
  // 督脉
  P('GV1', 'B', [250, 528]); P('GV2', 'B', [250, 516]); P('GV3', 'B', [250, Lv(4)]); P('GV4', 'B', [250, Lv(2)]); P('GV5', 'B', [250, Lv(1)]);
  var gv = [11, 10, 9, 7, 6, 5, 3, 1];
  for (i = 0; i < 8; i++) P('GV' + (6 + i), 'B', [250, T(gv[i])]);
  P('GV14', 'B', [250, 200]);
  P('GV15', 'S', sArc(11.5, 4)); P('GV16', 'S', sArc(11, 4)); P('GV17', 'S', sArc(9.5, 4)); P('GV18', 'S', sArc(8, 4)); P('GV19', 'S', sArc(6.5, 4));
  P('GV20', 'H', [200, hy(5)]); P('GV21', 'H', [200, hy(3.5)]); P('GV22', 'H', [200, hy(2)]); P('GV23', 'H', [200, hy(1)]); P('GV24', 'H', [200, hy(.5)]);
  P('GV25', 'H', [200, 256]); P('GV26', 'H', [200, 280]); P('GV27', 'H', [200, 297]); P('GV28', 'H', [200, 306]); P('GV29', 'H', [200, 172]);
  // 任脉
  P('CV1', 'F', [250, 522]);
  var cv = [-5, -4, -3, -2, -1.5, -1, 0, 1, 2, 3, 4, 5, 6, 7];
  for (i = 0; i < 14; i++) P('CV' + (2 + i), 'F', [250, abdY(cv[i])]);
  P('CV16', 'F', [250, 319]); P('CV17', 'F', [250, 299]); P('CV18', 'F', [250, 280]); P('CV19', 'F', [250, 260]); P('CV20', 'F', [250, 240]);
  P('CV21', 'F', [250, 218]); P('CV22', 'F', [250, 206]); P('CV23', 'H', [200, 382]); P('CV24', 'H', [200, 333]);
  // 经外奇穴
  P('EX-HN1', 'H', [224, 24]); P('EX-HN4', 'H', [245, 166]); P('EX-HN5', 'S', [160, 196]); P('EX-HN6', 'S', [244, 181]); P('EX-HN7', 'H', [262, 221]);
  P('EX-HN8', 'H', [222, 246]); P('EX-HN12/13', 'H', [208, 314]); P('EX-HN14', 'S', [266, 264]); P('EX-HN15', 'S', [284, 332]);
  P('EX-CA1', 'F', [X(3), abdY(-4)]); P('EX-B1', 'B', [256, 200]); P('EX-B2', 'B', [256, T(6)]); P('EX-B3', 'B', [BX(1.5), T(8)]); P('EX-B7', 'B', [BX(3.5), Lv(4)]); P('EX-B8', 'B', [250, Lv(5)]);
  P('EX-UE2', 'F', fa(4, .22)); P('EX-UE7', 'B', hand(.5, .45)); P('EX-UE8', 'B', hand(.75, .2)); P('EX-UE9', 'B', hand(1.03, 0)); P('EX-UE10', 'F', hand(1.5, .25)); P('EX-UE11', 'F', hand(2.02, .68));
  P('EX-LE2', 'F', [305, 694]); P('EX-LE3', 'F', leg(thighY(3), -.75)); P('EX-LE4', 'F', [294, 729]); P('EX-LE6', 'F', leg(dubiY(3.5), .8)); P('EX-LE7', 'F', leg(dubiY(5), .35));
  P('EX-LE10', 'F', foot(.88, .2)); P('EX-LE11', 'B', [77, 841]);

  /* ---------- 图形 ---------- */
  function union(shapes) {
    var s = shapes.map(function (d) { return '<path d="' + d + '"/>'; }).join('');
    return '<g class="bd-o">' + s + '</g><g class="bd-f">' + s + '</g>';
  }
  function g(cls, ds) { return '<g class="' + cls + '">' + ds.map(function (d) { return '<path d="' + d + '"/>'; }).join('') + '</g>'; }
  function both(fn) { var a = fn(1); return a.concat(fn(-1)); }
  function mx(p, side) { return side > 0 ? p : [500 - p[0], p[1]]; }

  function bodyShapes(back) {
    var torso = TORSO.concat(mir(TORSO.slice(1).reverse(), 500));
    var s = [cr(torso, true), limb(NECK), cr(HEAD, true), ell(299, 104, 6, 13), ell(201, 104, 6, 13)];
    [ARM, THUMB, LEG, back ? FOOT_B : FOOT_F].forEach(function (c) { s.push(limb(c)); s.push(limb(mir(c, 500))); });
    return s;
  }
  var DRAW = {
    F: function () {
      var thin = [], dash = [line([250, 206], [250, 500])];
      both(function (sd) {
        var M = function (p) { return mx(p, sd); };
        thin.push(cr([[254, 208], [280, 214], [312, 212], [342, 220]].map(M)));
        thin.push(cr([[332, 456], [300, 476], [262, 496]].map(M)));
        thin.push(ell(M([305, 712])[0], 712, 12, 14));
        thin.push(ell(M([291, 938])[0], 938, 3.5, 4.5)); thin.push(ell(M([318, 944])[0], 944, 3.5, 4.5));
        thin.push(line(M(add(E, nF, -15)), M(add(E, nF, 15)))); thin.push(line(M(add(W, nF, -10)), M(add(W, nF, 10))));
        [-.5, 0, .5].forEach(function (s) { thin.push(line(M(hand(1.15, s)), M(hand(1.9, s)))); });
        [-.42, 0, .42].forEach(function (s) { thin.push(line(M(foot(.88, s)), M(foot(1.04, s)))); });
        return [];
      });
      return union(bodyShapes(false)) + g('bd-l', thin) + g('bd-d', dash) +
        '<circle class="bd-k" cx="300" cy="299" r="2.4"/><circle class="bd-k" cx="200" cy="299" r="2.4"/><path class="bd-l" d="' + ell(250, 414, 2.6, 3.6) + '"/>';
    },
    B: function () {
      var thin = [], dash = [line([250, 190], [250, 528]), cr([[214, 140], [250, 150], [286, 140]])], dots = '';
      [200].concat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (n) { return T(n) - 6; })).concat([1, 2, 3, 4, 5].map(function (n) { return Lv(n) - 7; }))
        .forEach(function (y, j) { dots += '<circle class="bd-k" cx="250" cy="' + (j === 0 ? 194 : y) + '" r="1.6"/>'; });
      both(function (sd) {
        var M = function (p) { return mx(p, sd); };
        thin.push(cr([[290, 222], [288, 262], [292, 305], [314, 284], [332, 258], [338, 238]].map(M)));
        thin.push(cr([[289, 242], [315, 232], [346, 222]].map(M)));
        thin.push(cr([[268, 440], [300, 435], [330, 446], [341, 462]].map(M)));
        thin.push(cr([[262, 540], [300, 549], [336, 541]].map(M)));
        thin.push(line(M([285, 732]), M([326, 732])));
        thin.push(ell(M(E)[0], E[1], 5, 5));
        [-.5, 0, .5].forEach(function (s) { thin.push(line(M(hand(1.15, s)), M(hand(1.9, s)))); });
        return [];
      });
      dash.push('M266,462L250,518L234,462');
      var sole = [[74, 975, 19], [71, 930, 23], [70, 880, 25], [70, 858, 23]];
      var toes = ell(90, 846, 6.5, 7.5) + ell(77, 838, 4.6, 5.5) + ell(66, 838, 4.2, 5) + ell(57, 842, 3.8, 4.6) + ell(50, 849, 3.4, 4.2);
      return union(bodyShapes(true)) + g('bd-l', thin) + g('bd-d', dash) + dots +
        '<g class="bd-inset"><rect x="28" y="812" width="92" height="190" rx="8"/>' + union([limb(sole), toes]) + '<text x="74" y="828" data-sole="1">足底</text></g>';
    },
    H: function () {
      var face = [[200, 20], [250, 27], [290, 58], [310, 108], [315, 165], [313, 215], [306, 268], [292, 314], [268, 346], [234, 366], [200, 373]];
      var outline = face.concat(mir(face.slice(1, -1).reverse(), 400));
      var shapes = [limb([[200, 330, 60], [200, 400, 62], [200, 470, 74]]), cr(outline, true), ell(319, 226, 9, 30), ell(81, 226, 9, 30)];
      var thin = [], dash = [line([200, 22], [200, 95])], strong = [];
      [1, -1].forEach(function (sd) {
        var M = function (p) { return sd > 0 ? p : [400 - p[0], p[1]]; };
        dash.push(cr([[200, 95], [240, 93], [280, 104], [302, 135], [308, 182]].map(M)));
        strong.push(cr([[222, 172], [248, 163], [272, 163], [290, 171]].map(M)));
        var e1 = M([227, 200]), e2 = M([263, 200]);
        thin.push('M' + pt(e1) + 'Q' + pt(M([245, 189])) + ' ' + pt(e2) + 'Q' + pt(M([245, 209])) + ' ' + pt(e1) + 'Z');
        thin.push(line(M([212, 192]), M([214, 248])));
        thin.push(line(M([196, 274]), M([196, 295])));
      });
      thin.push('M180,258Q174,270 188,271Q200,277 212,271Q226,270 220,258');
      thin.push('M174,304Q186,295 195,297Q200,299 205,297Q214,295 226,304Q200,309 174,304Z');
      thin.push('M178,306Q200,323 222,306');
      return union(shapes) + g('bd-l', thin) + g('bd-s', strong) + g('bd-d', dash) +
        '<circle class="bd-k" cx="245" cy="200" r="3.2"/><circle class="bd-k" cx="155" cy="200" r="3.2"/>';
    },
    S: function () {
      var prof = ARC1.concat(ARC2.slice(1)).concat([[296, 305], [290, 340], [292, 400], [300, 462], [246, 464], [192, 462], [186, 430], [178, 392], [160, 378], [135, 372],
        [112, 362], [104, 345], [104, 328], [97, 312], [103, 302], [95, 293], [98, 282], [102, 268], [84, 262], [80, 250], [96, 222], [114, 190], [108, 165], [116, 130]]);
      var ear = [[236, 180], [256, 184], [268, 205], [268, 232], [258, 258], [246, 270], [236, 262], [230, 246], [226, 228], [228, 206]];
      var eop = sArc(9.5, 0);
      var thin = [cr([[244, 192], [257, 202], [259, 230], [250, 250]]), 'M110,200Q122,193 134,200Q122,206 110,200Z', 'M88,262Q96,257 101,265', 'M97,303L112,303',
        cr([[112, 360], [160, 350], [205, 336], [224, 322], [228, 290], [226, 262]]), 'M' + pt(add(eop, [0, 1], -8)) + 'Q' + pt(add(eop, [-1, 0], 5)) + ' ' + pt(add(eop, [0, 1], 8)),
        'M256,270Q262,284 270,276'];
      var dash = [line([150, 226], [224, 226]), cr([[122, 95], [140, 130], [162, 160], [190, 180], [214, 182], [224, 176]]), cr([[262, 176], [286, 192], [292, 240], [302, 282]]), line([262, 280], [198, 458])];
      return union([cr(prof, true)]) + '<path class="bd-ear" d="' + cr(ear, true) + '"/>' + g('bd-l', thin) + g('bd-s', [cr([[106, 176], [125, 170], [148, 176]])]) + g('bd-d', dash);
    }
  };
  var BASE = { F: [0, 0, 500, 1010], B: [0, 0, 500, 1010], H: [0, 0, 400, 460], S: [0, 0, 420, 470] };
  var COL = { LU: '#B8403F', PC: '#B8403F', HT: '#B8403F', LI: '#9A7432', TE: '#9A7432', SI: '#9A7432', ST: '#3E5866', GB: '#3E5866', BL: '#3E5866',
    SP: '#4F7356', LR: '#4F7356', KI: '#4F7356', GV: '#202A32', CV: '#202A32', EX: '#7A4E68' };
  var BREAK = { 'BL40': 1, 'BL54': 1, 'ST8': 1 }; // 编号相连但循行不相连处
  var cache = {};

  function crop(v, cx, cy, w, h) {
    var b = BASE[v];
    w = Math.min(w, b[2]); h = Math.min(h, b[3]);
    return [Math.max(0, Math.min(b[2] - w, cx - w / 2)), Math.max(0, Math.min(b[3] - h, cy - h / 2)), w, h];
  }
  function bbox(v, pts, pad) {
    var b = BASE[v], x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach(function (p) { var q = POS[p.code]; x0 = Math.min(x0, q.x); y0 = Math.min(y0, q.y); x1 = Math.max(x1, q.x); y1 = Math.max(y1, q.y); });
    var w = x1 - x0 + pad * 2, h = y1 - y0 + pad * 2;
    if (v === 'F' || v === 'B') { w = Math.max(w, 220); h = Math.max(h, 240); if (w < h * 0.55) w = h * 0.55; if (h < w * 0.9) h = w * 0.9; }
    else { w = b[2]; h = b[3]; }
    return crop(v, (x0 + x1) / 2, (y0 + y1) / 2, w, h);
  }
  function viewsOf(pts) {
    var seen = [];
    pts.forEach(function (p) { var q = POS[p.code]; if (q && seen.indexOf(q.v) < 0) seen.push(q.v); });
    return seen;
  }

  /* o: {v, pts:[...] 显示的穴, line:bool, focus:code, labels:'num'|'name'|'', name:fn(p), vb:[...], sole:'足底'} */
  function svg(o) {
    var v = o.v, vb = o.vb || BASE[v], k = vb[2] / 500;
    if (v === 'H' || v === 'S') k = vb[2] / 420;
    var r = 3.4 * k, fs = 10.5 * k, out = [];
    if (!cache[v]) cache[v] = DRAW[v]();
    var pts = o.pts.filter(function (p) { return POS[p.code] && POS[p.code].v === v; });
    if (o.line) {
      var run = [];
      var flush = function () { if (run.length > 1) out.push('<path class="bd-path" stroke="' + COL[run[0].m] + '" stroke-width="' + r1(1.6 * k) + '" d="' + cr(run.map(function (p) { return [POS[p.code].x, POS[p.code].y]; })) + '"/>'); run = []; };
      pts.forEach(function (p, j) {
        var prev = pts[j - 1];
        if (prev && (prev.m !== p.m || prev.i + 1 !== p.i || BREAK[prev.code])) flush();
        run.push(p);
      });
      flush();
    }
    var dots = '', labels = '', focusHtml = '';
    pts.forEach(function (p) {
      var q = POS[p.code], c = COL[p.m];
      if (p.code === o.focus) {
        focusHtml = '<a href="#/p/' + p.code + '" class="bd-pt"><circle cx="' + q.x + '" cy="' + q.y + '" r="' + r1(r * 2.6) + '" fill="none" stroke="' + c + '" stroke-width="' + r1(1.2 * k) + '" opacity=".55"/>' +
          '<circle cx="' + q.x + '" cy="' + q.y + '" r="' + r1(r * 1.5) + '" fill="#B8403F" stroke="#fff" stroke-width="' + r1(r * .45) + '"/><title>' + p.code + ' ' + p.zh + '</title></a>' +
          '<text class="bd-t bd-tf" x="' + r1(q.x + r * 3.2) + '" y="' + r1(q.y + fs * .35) + '" font-size="' + r1(fs * 1.35) + '" stroke-width="' + r1(fs * .35) + '">' + (o.name ? o.name(p) : p.zh) + '</text>';
        return;
      }
      dots += '<a href="#/p/' + p.code + '" class="bd-pt"><circle cx="' + q.x + '" cy="' + q.y + '" r="' + r1(r) + '" fill="' + c + '" stroke="#fff" stroke-width="' + r1(r * .4) + '"/><title>' + p.code + ' ' + p.zh + ' ' + p.py + '</title></a>';
      if (o.labels === 'num') labels += '<text class="bd-t" x="' + r1(q.x + r * 1.5) + '" y="' + r1(q.y - r * .6) + '" font-size="' + r1(fs * .82) + '" stroke-width="' + r1(fs * .3) + '" fill="' + c + '">' + p.code.replace(/^[A-Z-]+/, '').replace(/^HN|^CA|^B|^UE|^LE/, '') + '</text>';
      else if (o.labels === 'name') labels += '<text class="bd-t" x="' + r1(q.x + r * 1.6) + '" y="' + r1(q.y + fs * .35) + '" font-size="' + r1(fs * .9) + '" stroke-width="' + r1(fs * .3) + '">' + (o.name ? o.name(p) : p.zh) + '</text>';
    });
    var fig = cache[v];
    if (o.sole) fig = fig.replace('data-sole="1">足底', 'data-sole="1">' + o.sole);
    return '<svg class="body-svg" viewBox="' + vb.map(r1).join(' ') + '" xmlns="http://www.w3.org/2000/svg" role="img">' + fig + out.join('') + dots + labels + focusHtml + '</svg>';
  }

  window.BODY = { POS: POS, svg: svg, crop: crop, bbox: bbox, viewsOf: viewsOf, BASE: BASE };
})();
