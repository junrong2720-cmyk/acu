/* 针灸腧穴库 主程序:路由、页面、搜索、特定穴表、练习 */
(function () {
  'use strict';
  var A = window.ACU;
  var app = document.getElementById('app');

  /* ---------- 状态 ---------- */
  var KEY = 'acu-v1';
  var S = (function () {
    var s;
    try { s = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { s = {}; }
    var lq = /[?&]lang=(zh|en|bi)\b/.exec(location.search);
    if (lq) s.lang = lq[1];
    if (!s.lang) s.lang = 'zh';
    s.star = s.star || []; s.wrong = s.wrong || {}; s.seen = s.seen || {};
    return s;
  })();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  /* ---------- 文案 ---------- */
  var T = {
    zh: {
      site: '针灸腧穴库', siteSub: '十四经 · 362 穴 · 常用奇穴',
      navHome: '经络', navTables: '特定穴', navQuiz: '练习', navMe: '我的', navBody: '人体图',
      figVF: '正面', figVB: '背面', figVH: '头面', figVS: '侧头', zoomIn: '局部', zoomOut: '全身', mFig: '经络图', sole: '足底',
      figNote: '示意图按骨度分寸比例绘制,双侧穴位只标一侧,取穴以文字定位为准。',
      bodyTitle: '人体穴位图', bodyTip: '点穴位可打开详情', allM: '全部', showLabels: '显示穴名',
      searchPh: '搜穴名 / 拼音 / 代号 / 主治…',
      disclaimer: '仅供学习参考,不替代教材与临床带教;针刺操作须由具备资质的医师进行。',
      source: '定位依 GB/T 12346-2021《腧穴名称与定位》;主治与刺灸法参考《经络腧穴学》教材。',
      heroSub: '十四经 362 穴 + 常用经外奇穴 —— 定位、主治、刺灸法、特定穴,一处查全,随手自测。',
      now: '现在是', nowRule: '当令', twelve: '十二经脉', twelveNote: '按气血流注次序排列', others: '任督二脉 · 经外奇穴',
      pts: '穴', today: '今日一穴', quick: '复习入口',
      qTables: '特定穴总表', qTablesD: '五输、原络、郄穴、俞募、下合、八会、八脉交会',
      qQuiz: '自测练习', qQuizD: '归经、特定穴、看定位认穴、看主治认穴、闪卡',
      qMe: '收藏与错题', qMeD: '收藏的穴位和做错的题都在这里',
      sisters: '姐妹站', learnLink: '读懂中医', learnLinkD: '从阴阳五行到 417 味中药、162 首方剂',
      tizhiLink: '中医体质测试', tizhiLinkD: '国家标准 60 题,测测你是哪种体质',
      course: '循行', mInd: '主治概要', time: '流注', group: '分类',
      all: '全部', onlySpec: '只看特定穴', practiceThis: '练这条经',
      loc: '定位', ind: '主治', ndl: '刺灸法', star: '收藏', starred: '已收藏',
      prev: '上一穴', next: '下一穴', prevM: '上一经', nextM: '下一经',
      results: '条结果', noResult: '没有找到。试试穴名、拼音(不用声调)、代号如 ST36,或主治关键词如“失眠”。',
      searchTip: '在上方输入穴名、拼音、代号或主治关键词。',
      tables: { wushu: '五输穴', yuanluo: '原穴 · 络穴', xi: '郄穴', shumu: '背俞穴 · 募穴', xiahe: '下合穴', bahui: '八会穴', bamai: '八脉交会穴' },
      meridian: '经脉', yinM: '阴经五输穴', yangM: '阳经五输穴', yuan: '原穴', luo: '络穴', xiP: '郄穴',
      organ: '脏腑', shu: '背俞穴', mu: '募穴', xiaheP: '下合穴', huiOf: '所会', point: '穴位',
      bamaiP: '穴位', bamaiV: '所通奇经', bamaiArea: '主治部位(相合)',
      noteWushu: '阴经井穴属木,阳经井穴属金,依五行相生顺序排列。',
      noteYuan: '阴经“以输代原”,原穴与输穴为同一穴。另有任脉络穴鸠尾、督脉络穴长强、脾之大络大包,合称十五络穴。',
      noteXi: '十二经郄穴之外,阴跷、阳跷、阴维、阳维四脉也各有郄穴。阴经郄穴多治血证,阳经郄穴多治急性痛证。',
      noteShumu: '背俞穴均在足太阳膀胱经第一侧线;募穴分布于胸腹部,部分在本经,部分在他经。',
      noteXiahe: '六腑之气下合于足三阳经的腧穴。“合治内腑”。',
      noteBahui: '脏、腑、气、血、筋、脉、骨、髓之精气聚会之处。',
      noteBamai: '奇经八脉与十二正经脉气相通的八个腧穴,上下配穴使用。',
      quizTitle: '自测练习', mode: '题型', scope: '范围', count: '题数', start: '开始',
      mMer: '归经', mMerD: '看穴名选经脉', mTag: '特定穴', mTagD: '如“肺经的原穴是?”',
      mLoc: '看定位认穴', mLocD: '读定位描述,选穴名', mInd2: '看主治认穴', mInd2D: '读主治,选穴名', mCard: '闪卡', mCardD: '翻卡自评,记不住的进错题本',
      scAll: '全部穴位', scStar: '我的收藏', scWrong: '错题本',
      qMerAsk: '属于哪条经?', qLocAsk: '这是哪个穴?', qIndAsk: '主治如上,是哪个穴?',
      right: '答对了', wrongA: '答错了,正确答案:', nextQ: '下一题', finish: '看结果', viewPt: '查看此穴',
      flip: '翻面', know: '记住了', dontKnow: '还不熟',
      done: '本组完成', score: '得分', again: '再来一组', back: '返回设置', reviewWrong: '本组做错的穴位',
      notEnough: '这个范围里的题目不够(至少要 4 个穴位)。换个范围试试。',
      me: '我的学习', seenN: '已浏览', starList: '收藏的穴位', wrongList: '错题本', noStar: '还没有收藏。在穴位页点“收藏”即可。',
      noWrong: '错题本是空的。', practiceWrong: '练错题', clearWrong: '清空错题本', clearSeen: '清空浏览记录',
      confirmClear: '确定清空吗?此操作不可撤销。', times: '次', store: '学习记录只保存在本机浏览器里。'
    },
    en: {
      site: 'Acupoint Library', siteSub: '14 meridians · 362 points · extra points',
      navHome: 'Meridians', navTables: 'Specific points', navQuiz: 'Practice', navMe: 'My study', navBody: 'Body map',
      figVF: 'Front', figVB: 'Back', figVH: 'Face', figVS: 'Side of head', zoomIn: 'Close-up', zoomOut: 'Whole body', mFig: 'Meridian diagram', sole: 'Sole',
      figNote: 'Schematic drawn to proportional cun; bilateral points are shown on one side only. Always locate by the written description.',
      bodyTitle: 'Acupoint body map', bodyTip: 'Tap a point to open it', allM: 'All', showLabels: 'Show names',
      searchPh: 'Name, pinyin, code or symptom…',
      disclaimer: 'For study only. Not a substitute for textbooks or supervised clinical training; needling must be performed by qualified practitioners.',
      source: 'Locations follow GB/T 12346-2021 (Nomenclature and location of acupuncture points); indications and needling follow the standard Chinese textbook of Meridians and Acupoints.',
      heroSub: '362 points of the 14 meridians plus common extra points — location, indications, needling and specific-point categories in one place, with self-tests.',
      now: 'It is now', nowRule: 'peak time of the', twelve: 'Twelve Regular Meridians', twelveNote: 'in order of qi-blood circulation', others: 'Governor & Conception Vessels · Extra Points',
      pts: 'pts', today: 'Point of the day', quick: 'Review',
      qTables: 'Specific-point tables', qTablesD: 'Five Shu, Yuan & Luo, Xi-Cleft, Back-Shu & Front-Mu, Lower He-Sea, Influential, Confluent',
      qQuiz: 'Self-test', qQuizD: 'Meridian, specific points, location, indications, flashcards',
      qMe: 'Starred & mistakes', qMeD: 'Your starred points and missed questions',
      sisters: 'Sister sites', learnLink: 'Chinese Medicine Explained', learnLinkD: 'From yin-yang to 417 herbs and 162 formulas',
      tizhiLink: 'Body Constitution Test', tizhiLinkD: 'The standard 60-question test',
      course: 'Pathway', mInd: 'Main indications', time: 'Peak time', group: 'Group',
      all: 'All', onlySpec: 'Specific points only', practiceThis: 'Practice this meridian',
      loc: 'Location', ind: 'Indications', ndl: 'Needling & moxibustion', star: 'Star', starred: 'Starred',
      prev: 'Previous', next: 'Next', prevM: 'Previous meridian', nextM: 'Next meridian',
      results: 'results', noResult: 'Nothing found. Try a point name, pinyin without tones, a code like ST36, or a symptom such as “insomnia”.',
      searchTip: 'Type a point name, pinyin, code or symptom above.',
      tables: { wushu: 'Five Shu', yuanluo: 'Yuan & Luo', xi: 'Xi-Cleft', shumu: 'Back-Shu & Front-Mu', xiahe: 'Lower He-Sea', bahui: 'Influential', bamai: 'Confluent' },
      meridian: 'Meridian', yinM: 'Five Shu points of the yin meridians', yangM: 'Five Shu points of the yang meridians', yuan: 'Yuan-Source', luo: 'Luo-Connecting', xiP: 'Xi-Cleft',
      organ: 'Organ', shu: 'Back-Shu', mu: 'Front-Mu', xiaheP: 'Lower He-Sea', huiOf: 'Gathers', point: 'Point',
      bamaiP: 'Point', bamaiV: 'Connects with', bamaiArea: 'Paired use for',
      noteWushu: 'Jing-Well points of yin meridians belong to Wood, those of yang meridians to Metal; the rest follow the generating cycle.',
      noteYuan: 'On yin meridians the Shu-Stream point serves as the Yuan-Source point. With CV15, GV1 and the Great Luo SP21 they form the fifteen Luo points.',
      noteXi: 'Besides the twelve meridians, the Yin/Yang Heel and Yin/Yang Link vessels each have a Xi-Cleft point. Yin Xi points treat bleeding; yang Xi points treat acute pain.',
      noteShumu: 'All Back-Shu points lie on the first lateral line of the Bladder Meridian; Front-Mu points lie on the chest and abdomen.',
      noteXiahe: 'Points on the three foot-yang meridians where the qi of the six fu organs converges. “He-Sea points treat the fu organs.”',
      noteBahui: 'Points where the essence of the zang, fu, qi, blood, tendons, vessels, bones and marrow gathers.',
      noteBamai: 'Eight points where the extraordinary vessels communicate with the regular meridians; used in upper–lower pairs.',
      quizTitle: 'Self-test', mode: 'Question type', scope: 'Scope', count: 'Questions', start: 'Start',
      mMer: 'Meridian', mMerD: 'Name → meridian', mTag: 'Specific points', mTagD: 'e.g. “Yuan point of the Lung?”',
      mLoc: 'Location', mLocD: 'Read the location, pick the point', mInd2: 'Indications', mInd2D: 'Read the indications, pick the point', mCard: 'Flashcards', mCardD: 'Flip and self-rate; misses go to your mistakes list',
      scAll: 'All points', scStar: 'Starred', scWrong: 'Mistakes',
      qMerAsk: 'Which meridian?', qLocAsk: 'Which point is this?', qIndAsk: 'Which point has these indications?',
      right: 'Correct', wrongA: 'Not quite. Answer:', nextQ: 'Next', finish: 'See results', viewPt: 'Open point',
      flip: 'Flip', know: 'Got it', dontKnow: 'Not yet',
      done: 'Set complete', score: 'Score', again: 'New set', back: 'Back to settings', reviewWrong: 'Points you missed',
      notEnough: 'Not enough questions in this scope (needs at least 4 points). Try another scope.',
      me: 'My study', seenN: 'Viewed', starList: 'Starred points', wrongList: 'Mistakes', noStar: 'Nothing starred yet. Tap “Star” on any point page.',
      noWrong: 'Your mistakes list is empty.', practiceWrong: 'Practice mistakes', clearWrong: 'Clear mistakes', clearSeen: 'Clear viewed history',
      confirmClear: 'Clear it? This cannot be undone.', times: '×', store: 'Your study data stays in this browser only.'
    }
  };
  function t(k) { return (S.lang === 'en' ? T.en : T.zh)[k]; }

  /* ---------- 工具 ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function L(zh, en) {
    if (S.lang === 'zh') return esc(zh);
    if (S.lang === 'en') return esc(en || zh);
    return esc(zh) + '<span class="sub-en">' + esc(en) + '</span>';
  }
  function plain(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[\s'·\-]/g, '').toLowerCase(); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function pick(a, n) { return shuffle(a).slice(0, n); }
  function mOf(p) { return A.byId[p.m]; }
  var ORDER12 = ['LU', 'LI', 'ST', 'SP', 'HT', 'SI', 'BL', 'KI', 'PC', 'TE', 'GB', 'LR'];
  Object.keys(T.zh).forEach(function (k) { if (typeof T.zh[k] === 'string') T.zh[k] = fw(T.zh[k]); });

  var ORG = { '肺': 'Lung', '大肠': 'Large Intestine', '胃': 'Stomach', '脾': 'Spleen', '心': 'Heart', '小肠': 'Small Intestine', '膀胱': 'Bladder', '肾': 'Kidney', '心包': 'Pericardium', '三焦': 'Triple Energizer', '胆': 'Gallbladder', '肝': 'Liver' };
  var HUI = { '脏': 'zang organs', '腑': 'fu organs', '气': 'qi', '血': 'blood', '筋': 'tendons', '脉': 'vessels', '骨': 'bones', '髓': 'marrow' };
  var VES = { '任脉': 'Conception Vessel', '督脉': 'Governor Vessel', '冲脉': 'Thoroughfare Vessel', '带脉': 'Belt Vessel', '阴跷': 'Yin Heel Vessel', '阳跷': 'Yang Heel Vessel', '阴维': 'Yin Link Vessel', '阳维': 'Yang Link Vessel' };
  var BASIC = { '井': ['井穴', 'Jing-Well'], '荥': ['荥穴', 'Ying-Spring'], '输': ['输穴', 'Shu-Stream'], '经': ['经穴', 'Jing-River'], '合': ['合穴', 'He-Sea'], '原': ['原穴', 'Yuan-Source'], '络': ['络穴', 'Luo-Connecting'], '大络': ['脾之大络', 'Great Luo of the Spleen'], '郄': ['郄穴', 'Xi-Cleft'] };

  function tagText(tag, lang) {
    var p = tag.split(':'), k = p[0], v = p[1], zh, en;
    if (!v) { zh = BASIC[k][0]; en = BASIC[k][1]; }
    else if (k === '募') { zh = v + '之募穴'; en = 'Front-Mu of the ' + ORG[v]; }
    else if (k === '俞') { zh = v + '之背俞穴'; en = 'Back-Shu of the ' + ORG[v]; }
    else if (k === '下合') { zh = v + '之下合穴'; en = 'Lower He-Sea of the ' + ORG[v]; }
    else if (k === '会') { zh = v + '会'; en = 'Influential point of ' + HUI[v]; }
    else if (k === '八脉') { zh = '八脉交会穴（通' + v + '）'; en = 'Confluent point of the ' + VES[v]; }
    else if (k === '郄') { zh = v + '脉郄穴'; en = 'Xi-Cleft of the ' + VES[v]; }
    return lang === 'en' ? en : zh;
  }
  function tagClass(tag) {
    var k = tag.split(':')[0];
    if ('井荥输经合'.indexOf(k) >= 0 && k.length === 1) return 'c-wu';
    if (k === '原' || k === '络' || k === '大络') return 'c-yl';
    if (k === '郄') return 'c-xi';
    if (k === '募' || k === '俞') return 'c-sm';
    return 'c-hui';
  }
  function chips(p, full) {
    return p.tags.map(function (tg) {
      var txt;
      if (S.lang === 'en') txt = esc(tagText(tg, 'en'));
      else if (S.lang === 'bi' && full) txt = esc(tagText(tg, 'zh')) + ' <i>' + esc(tagText(tg, 'en')) + '</i>';
      else txt = esc(tagText(tg, 'zh'));
      return '<span class="chip ' + tagClass(tg) + '" title="' + esc(tagText(tg, 'en')) + '">' + txt + '</span>';
    }).join('');
  }
  function mName(m, sub) {
    if (S.lang === 'zh') return esc(m.zh);
    if (S.lang === 'en') return esc(m.en);
    return esc(m.zh) + (sub === false ? '' : '<span class="sub-en">' + esc(m.en) + '</span>');
  }
  function mShort(m) { return S.lang === 'en' ? esc(m.se) : esc(m.s); }
  function pName(p) {
    if (S.lang === 'en') return '<b>' + esc(p.py) + '</b> <span class="zh-s">' + esc(p.zh) + '</span>';
    return '<b>' + esc(p.zh) + '</b> <span class="py-s">' + esc(p.py) + '</span>';
  }
  function brief(p) {
    var s = S.lang === 'en' ? p.indEn : p.ind;
    return esc(s.split(/[;；]/)[0].replace(/[。.]$/, ''));
  }
  function markWarn(s, en) {
    var re = en ? /([Nn]ever[^.;]*|Avoid[^.;;]*|Contraindicated[^.;]*|[Cc]aution[^.;]*|Do not[^.;]*|do not[^.;]*|Not used[^.;]*)/g
      : /((?:不可[^，；。]*|不宜[^，；。]*|禁针|禁灸|禁用|孕妇[^，；。]*|避开[^，；。]*|慎[^，；。]*|必须[^；。]*))/g;
    return esc(s).replace(re, '<mark>$1</mark>');
  }
  function splitList(s) { return s.split(/[;；]\s*/).filter(Boolean).map(function (x) { return x.replace(/[。.]$/, ''); }); }
  function listHtml(zh, en) {
    var z = splitList(zh), e = splitList(en);
    var mk = function (arr) { return '<ul class="ind">' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; };
    if (S.lang === 'zh') return mk(z);
    if (S.lang === 'en') return mk(e);
    return mk(z) + '<div class="sub-en">' + mk(e) + '</div>';
  }

  /* ---------- 外壳 ---------- */
  function shell(active) {
    document.documentElement.lang = S.lang === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = t(el.getAttribute('data-t')); });
    document.getElementById('q').placeholder = t('searchPh');
    document.querySelectorAll('#lang button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-lang') === S.lang); });
    document.querySelectorAll('[data-nav]').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-nav') === active); });
  }

  /* ---------- 首页 ---------- */
  function nowMeridian() {
    var h = new Date().getHours();
    var order = ['GB', 'LR', 'LU', 'LI', 'ST', 'SP', 'HT', 'SI', 'BL', 'KI', 'PC', 'TE'];
    return A.byId[order[Math.floor(((h + 1) % 24) / 2)]];
  }
  function mCard(m) {
    var n = m.pts.length, seen = m.pts.filter(function (p) { return S.seen[p.code]; }).length;
    return '<a class="mcard g-' + esc(m.id) + '" href="#/m/' + m.id + '">' +
      '<span class="mc-code">' + esc(m.id) + '</span>' +
      '<span class="mc-name">' + (S.lang === 'en' ? esc(m.se) : esc(m.zh)) + '</span>' +
      '<span class="mc-sub">' + (S.lang === 'en' ? esc(m.zh) : (S.lang === 'bi' ? esc(m.se) : esc(m.group))) + '</span>' +
      '<span class="mc-meta">' + n + ' ' + t('pts') + (m.time ? ' · ' + esc(S.lang === 'en' ? m.te : m.time) : '') + '</span>' +
      '<span class="bar"><i style="width:' + Math.round(seen / n * 100) + '%"></i></span></a>';
  }
  function pageHome() {
    shell('home');
    var nm = nowMeridian();
    var d = new Date(), seed = d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate();
    var pool = A.pts.filter(function (p) { return p.code !== 'ST17'; });
    var tp = pool[(seed * 7919) % pool.length];
    var total = A.pts.length, seenN = Object.keys(S.seen).length;
    var html = '<section class="hero"><h1>' + esc(t('site')) + '</h1><p>' + esc(t('heroSub')) + '</p>' +
      '<a class="now" href="#/m/' + nm.id + '"><span class="dot"></span>' + esc(t('now')) + ' ' + esc(S.lang === 'en' ? nm.te : nm.time.split(' ')[0]) + ' · ' +
      (S.lang === 'en' ? esc(t('nowRule')) + ' ' + esc(nm.se) + ' meridian' : esc(nm.s) + esc(t('nowRule'))) + ' →</a>' +
      '<div class="stat">' + esc(t('seenN')) + ' <b>' + seenN + '</b> / ' + total + '</div></section>';
    html += '<section><div class="sec-h"><h2>' + esc(t('twelve')) + '</h2><span class="muted">' + esc(t('twelveNote')) + '</span></div><div class="mgrid">' +
      ORDER12.map(function (id) { return mCard(A.byId[id]); }).join('') + '</div></section>';
    html += '<section><div class="sec-h"><h2>' + esc(t('others')) + '</h2></div><div class="mgrid">' +
      ['GV', 'CV', 'EX'].map(function (id) { return mCard(A.byId[id]); }).join('') + '</div></section>';
    html += '<section class="duo"><div><div class="sec-h"><h2>' + esc(t('today')) + '</h2></div>' + todayCard(tp) + '</div>' +
      '<div><div class="sec-h"><h2>' + esc(t('quick')) + '</h2></div><div class="quick">' +
      '<a href="#/t/wushu"><b>' + esc(t('qTables')) + '</b><span>' + esc(t('qTablesD')) + '</span></a>' +
      '<a href="#/q"><b>' + esc(t('qQuiz')) + '</b><span>' + esc(t('qQuizD')) + '</span></a>' +
      '<a href="#/me"><b>' + esc(t('qMe')) + '</b><span>' + esc(t('qMeD')) + '</span></a></div></div></section>';
    html += '<section><div class="sec-h"><h2>' + esc(t('sisters')) + '</h2></div><div class="quick qsites">' +
      '<a href="https://junrong2720-cmyk.github.io/learn/' + (S.lang === 'zh' ? '' : '?lang=' + S.lang) + '" target="_blank" rel="noopener"><b>' + esc(t('learnLink')) + '</b><span>' + esc(t('learnLinkD')) + '</span></a>' +
      '<a href="https://junrong2720-cmyk.github.io/tcmjr/' + (S.lang === 'en' ? 'en.html' : '') + '" target="_blank" rel="noopener"><b>' + esc(t('tizhiLink')) + '</b><span>' + esc(t('tizhiLinkD')) + '</span></a></div></section>';
    app.innerHTML = html;
  }
  function todayCard(p) {
    var m = mOf(p);
    return '<a class="today" href="#/p/' + p.code + '"><span class="code">' + esc(p.code) + ' · ' + mShort(m) + '</span>' +
      '<span class="t-name">' + esc(p.zh) + '</span><span class="t-py">' + esc(p.py) + '</span>' +
      '<span class="chips">' + chips(p) + '</span>' +
      '<span class="t-loc">' + esc(S.lang === 'en' ? p.locEn : p.loc) + '</span></a>';
  }

  /* ---------- 经脉页 ---------- */
  var onlySpec = false;
  function pRow(p, extra) {
    return '<a class="prow' + (S.seen[p.code] ? ' seen' : '') + '" href="#/p/' + p.code + '">' +
      '<span class="code">' + esc(p.code) + '</span>' +
      '<span class="nm">' + pName(p) + '</span>' +
      '<span class="chips">' + chips(p) + '</span>' +
      '<span class="brief">' + (extra || brief(p)) + '</span>' +
      (S.star.indexOf(p.code) >= 0 ? '<span class="st" aria-label="starred">★</span>' : '') + '</a>';
  }
  function pageMeridian(id) {
    var m = A.byId[id]; if (!m) return pageHome();
    shell('home');
    var ids = ORDER12.concat(['GV', 'CV', 'EX']), k = ids.indexOf(id);
    var prevM = A.byId[ids[(k + ids.length - 1) % ids.length]], nextM = A.byId[ids[(k + 1) % ids.length]];
    var list = onlySpec ? m.pts.filter(function (p) { return p.tags.length; }) : m.pts;
    var html = '<nav class="crumb"><a href="#/">' + esc(t('navHome')) + '</a><span>/</span>' + mShort(m) + '</nav>' +
      '<header class="mhead g-' + esc(m.id) + '"><span class="m-code">' + esc(m.id) + '</span><div><h1>' + esc(S.lang === 'en' ? m.en : m.zh) + '</h1>' +
      '<p class="m-alt">' + esc(S.lang === 'en' ? m.zh : m.en) + '</p>' +
      '<p class="m-meta">' + m.pts.length + ' ' + t('pts') + ' · ' + esc(S.lang === 'en' ? m.ge : m.group) + (m.time ? ' · ' + esc(t('time')) + ' ' + esc(S.lang === 'en' ? m.te : m.time) : '') + '</p></div></header>' +
      '<div class="minfo"><div><h3>' + esc(t('course')) + '</h3><p>' + L(m.course, m.courseEn) + '</p></div>' +
      '<div><h3>' + esc(t('mInd')) + '</h3><p>' + L(m.ind, m.indEn) + '</p></div></div>' + meridianFigs(m) +
      '<div class="mtools"><div class="seg"><button data-spec="0" class="' + (onlySpec ? '' : 'on') + '">' + esc(t('all')) + ' ' + m.pts.length + '</button>' +
      '<button data-spec="1" class="' + (onlySpec ? 'on' : '') + '">' + esc(t('onlySpec')) + ' ' + m.pts.filter(function (p) { return p.tags.length; }).length + '</button></div>' +
      '<a class="btn ghost" href="#/q/' + m.id + '">' + esc(t('practiceThis')) + ' →</a></div>' +
      '<div class="plist">' + list.map(function (p) { return pRow(p); }).join('') + '</div>' +
      '<nav class="pager"><a href="#/m/' + prevM.id + '">← ' + mShort(prevM) + '</a><a href="#/m/' + nextM.id + '">' + mShort(nextM) + ' →</a></nav>';
    app.innerHTML = html;
    app.querySelectorAll('[data-spec]').forEach(function (b) {
      b.onclick = function () { onlySpec = b.getAttribute('data-spec') === '1'; pageMeridian(id); };
    });
  }

  /* ---------- 人体图 ---------- */
  var B = window.BODY, figFull = false;
  function ptLabel(p) { return esc(S.lang === 'en' ? p.py : p.zh); }
  function figBlock(p) {
    var q = B.POS[p.code]; if (!q) return '';
    var body = q.v === 'F' || q.v === 'B';
    var vb = body && !figFull ? B.crop(q.v, q.x, q.y, 230, 270) : null;
    var svg = B.svg({ v: q.v, pts: mOf(p).pts, line: p.m !== 'EX', focus: p.code, vb: vb, name: ptLabel, sole: t('sole') });
    var tog = body ? '<div class="seg sm"><button data-fz="0" class="' + (figFull ? '' : 'on') + '">' + esc(t('zoomIn')) + '</button><button data-fz="1" class="' + (figFull ? 'on' : '') + '">' + esc(t('zoomOut')) + '</button></div>' : '';
    return '<section class="figblk"><div class="fig-h"><h3>' + esc(t('figV' + q.v)) + '</h3>' + tog + '</div><div class="fig' + (body && figFull ? ' tall' : '') + '">' + svg + '</div><p class="fig-note">' + esc(t('figNote')) + '</p></section>';
  }
  function meridianFigs(m) {
    var views = B.viewsOf(m.pts);
    return '<section class="mfig"><div class="sec-h"><h2>' + esc(t('mFig')) + '</h2><a class="btn ghost sm" href="#/b/' + m.id + '">' + esc(t('navBody')) + ' →</a></div><div class="figs">' +
      views.map(function (v) {
        var inV = m.pts.filter(function (p) { return B.POS[p.code] && B.POS[p.code].v === v; });
        return '<figure class="fig"><figcaption>' + esc(t('figV' + v)) + '</figcaption>' +
          B.svg({ v: v, pts: m.pts, line: m.id !== 'EX', labels: m.id === 'EX' ? 'name' : 'num', name: ptLabel, vb: B.bbox(v, inV, 40), sole: t('sole') }) + '</figure>';
      }).join('') + '</div><p class="fig-note">' + esc(t('figNote')) + '</p></section>';
  }
  var bodyV = 'F', bodyLabels = false;
  function pageBody(mid) {
    shell('b');
    var m = A.byId[mid] || null;
    var pts = m ? m.pts : A.pts;
    if (m) { var vs = B.viewsOf(m.pts); if (vs.indexOf(bodyV) < 0) bodyV = vs[0]; }
    var tabs = ['F', 'B', 'H', 'S'].map(function (v) {
      var n = pts.filter(function (p) { return B.POS[p.code] && B.POS[p.code].v === v; }).length;
      return '<button data-v="' + v + '" class="' + (v === bodyV ? 'on' : '') + '"' + (n ? '' : ' disabled') + '>' + esc(t('figV' + v)) + ' <small>' + n + '</small></button>';
    }).join('');
    var ms = '<a href="#/b" class="' + (m ? '' : 'on') + '">' + esc(t('allM')) + '</a>' + A.list.map(function (x) {
      return '<a href="#/b/' + x.id + '" class="g-' + x.id + (m === x ? ' on' : '') + '">' + mShort(x) + '</a>';
    }).join('');
    app.innerHTML = '<div class="sec-h"><h2>' + esc(t('bodyTitle')) + '</h2><span class="muted">' + esc(t('bodyTip')) + '</span></div>' +
      '<nav class="mchips">' + ms + '</nav>' +
      '<div class="btools"><div class="seg">' + tabs + '</div><label class="chk"><input type="checkbox" id="blab"' + (bodyLabels ? ' checked' : '') + '> ' + esc(t('showLabels')) + '</label></div>' +
      '<div class="fig bodymap' + (bodyV === 'F' || bodyV === 'B' ? ' tall' : '') + '">' +
      B.svg({ v: bodyV, pts: pts, line: !!m && m.id !== 'EX', labels: bodyLabels ? 'name' : (m ? 'num' : ''), name: ptLabel, sole: t('sole') }) +
      '</div><p class="fig-note">' + esc(t('figNote')) + '</p>';
    app.querySelectorAll('[data-v]').forEach(function (b) { b.onclick = function () { bodyV = b.getAttribute('data-v'); pageBody(mid); }; });
    document.getElementById('blab').onchange = function () { bodyLabels = this.checked; pageBody(mid); };
  }

  /* ---------- 穴位页 ---------- */
  function pagePoint(code) {
    var p = A.byCode[code]; if (!p) return pageHome();
    shell('home');
    var m = mOf(p);
    if (!S.seen[p.code]) { S.seen[p.code] = 1; save(); }
    var prev = m.pts[p.i - 1], next = m.pts[p.i + 1];
    var starred = S.star.indexOf(p.code) >= 0;
    var ndl = S.lang === 'en' ? markWarn(p.ndlEn, true) : (S.lang === 'zh' ? markWarn(p.ndl) : markWarn(p.ndl) + '<span class="sub-en">' + markWarn(p.ndlEn, true) + '</span>');
    var html = '<nav class="crumb"><a href="#/">' + esc(t('navHome')) + '</a><span>/</span><a href="#/m/' + m.id + '">' + mShort(m) + '</a><span>/</span>' + esc(p.zh) + '</nav>' +
      '<article class="point g-' + esc(m.id) + '"><header class="phead">' +
      '<div class="ph-l"><span class="ph-code">' + esc(p.code) + '</span><h1>' + esc(p.zh) + '</h1><div class="ph-py">' + esc(p.py) + '</div>' +
      '<a class="ph-m" href="#/m/' + m.id + '">' + mName(m, false) + '</a>' +
      (p.tags.length ? '<div class="chips big">' + chips(p, true) + '</div>' : '') + '</div>' +
      '<button class="starbtn' + (starred ? ' on' : '') + '" id="starbtn">' + (starred ? '★ ' + esc(t('starred')) : '☆ ' + esc(t('star'))) + '</button></header>' +
      '<div class="pbody"><div class="ptext">' +
      '<section class="blk"><h3>' + esc(t('loc')) + '</h3><p>' + L(p.loc, p.locEn) + '</p></section>' +
      '<section class="blk"><h3>' + esc(t('ind')) + '</h3>' + listHtml(p.ind, p.indEn) + '</section>' +
      '<section class="blk"><h3>' + esc(t('ndl')) + '</h3><p>' + ndl + '</p></section></div>' + figBlock(p) + '</div></article>' +
      '<nav class="pager">' + (prev ? '<a href="#/p/' + prev.code + '">← ' + esc(prev.code) + ' ' + esc(S.lang === 'en' ? prev.py : prev.zh) + '</a>' : '<span></span>') +
      (next ? '<a href="#/p/' + next.code + '">' + esc(next.code) + ' ' + esc(S.lang === 'en' ? next.py : next.zh) + ' →</a>' : '<span></span>') + '</nav>';
    app.innerHTML = html;
    document.getElementById('starbtn').onclick = function () {
      var i = S.star.indexOf(p.code);
      if (i >= 0) S.star.splice(i, 1); else S.star.push(p.code);
      save(); pagePoint(code);
    };
    app.querySelectorAll('[data-fz]').forEach(function (b) {
      b.onclick = function () { figFull = b.getAttribute('data-fz') === '1'; var y = window.scrollY; pagePoint(code); window.scrollTo(0, y); };
    });
  }

  /* ---------- 搜索 ---------- */
  A.pts.forEach(function (p) {
    p._py = plain(p.py);
    p._txt = (p.ind + p.loc).toLowerCase();
    p._txtEn = (p.indEn + ' ' + p.locEn).toLowerCase();
  });
  function search(q) {
    var raw = q.trim(); if (!raw) return [];
    var ql = raw.toLowerCase(), qp = plain(raw), qc = raw.replace(/\s+/g, '').toUpperCase();
    var out = [];
    A.pts.forEach(function (p) {
      var s = 0;
      if (p.code === qc) s = 100;
      else if (p.zh === raw) s = 90;
      else if (p.zh.indexOf(raw) >= 0) s = 70;
      else if (qp && p._py === qp) s = 85;
      else if (qp.length >= 2 && p._py.indexOf(qp) === 0) s = 60;
      else if (qp.length >= 3 && p._py.indexOf(qp) >= 0) s = 45;
      else if (qc.length >= 2 && /^[A-Z]/.test(qc) && p.code.indexOf(qc) === 0) s = 40;
      else if (p._txt.indexOf(ql) >= 0) s = 20;
      else if (ql.length >= 3 && p._txtEn.indexOf(ql) >= 0) s = 15;
      if (s) out.push({ p: p, s: s });
    });
    out.sort(function (a, b) { return b.s - a.s || A.pts.indexOf(a.p) - A.pts.indexOf(b.p); });
    return out.map(function (x) { return x.p; });
  }
  function hl(text, q) {
    var e = esc(text); if (!q) return e;
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return e;
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }
  function snippet(p, q) {
    var src = S.lang === 'en' ? p.indEn : p.ind;
    if (src.toLowerCase().indexOf(q.toLowerCase()) >= 0) return hl(src, q);
    var lsrc = S.lang === 'en' ? p.locEn : p.loc;
    if (lsrc.toLowerCase().indexOf(q.toLowerCase()) >= 0) return hl(lsrc, q);
    var other = S.lang === 'en' ? p.ind : p.indEn;
    if (other.toLowerCase().indexOf(q.toLowerCase()) >= 0) return hl(other, q);
    return brief(p);
  }
  function pageSearch(q) {
    shell('');
    var inp = document.getElementById('q');
    if (document.activeElement !== inp) inp.value = q;
    if (!q.trim()) { app.innerHTML = '<p class="empty">' + esc(t('searchTip')) + '</p>'; return; }
    var res = search(q);
    app.innerHTML = '<div class="sec-h"><h2>“' + esc(q) + '”</h2><span class="muted">' + res.length + ' ' + esc(t('results')) + '</span></div>' +
      (res.length ? '<div class="plist">' + res.slice(0, 150).map(function (p) { return pRow(p, snippet(p, q.trim())); }).join('') + '</div>' : '<p class="empty">' + esc(t('noResult')) + '</p>');
  }

  /* ---------- 特定穴表 ---------- */
  function withTag(tag, mid) {
    return A.pts.filter(function (p) { return (!mid || p.m === mid) && p.tags.indexOf(tag) >= 0; });
  }
  function cell(p) {
    if (!p) return '<td class="na">—</td>';
    var main = S.lang === 'en' ? esc(p.py) : esc(p.zh);
    var sub = S.lang === 'en' ? esc(p.code) + ' · ' + esc(p.zh) : (S.lang === 'bi' ? esc(p.py) + ' · ' + esc(p.code) : esc(p.code));
    return '<td><a href="#/p/' + p.code + '">' + main + '<small>' + sub + '</small></a></td>';
  }
  function mCell(m) { return '<th scope="row"><a href="#/m/' + m.id + '">' + mShort(m) + '</a></th>'; }
  function orgCell(o) { return '<th scope="row">' + (S.lang === 'en' ? esc(ORG[o]) : esc(o) + (S.lang === 'bi' ? '<small>' + esc(ORG[o]) + '</small>' : '')) + '</th>'; }
  function hd(zh, en) { return S.lang === 'en' ? en : (S.lang === 'bi' ? zh + '<small>' + en + '</small>' : zh); }
  function table(head, rows) {
    return '<div class="tbl-wrap"><table class="tbl"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table></div>';
  }
  var TABLES = {
    wushu: function () {
      var k5 = ['井', '荥', '输', '经', '合'];
      var yinH = [hd('井（木）', 'Well · Wood'), hd('荥（火）', 'Spring · Fire'), hd('输（土）', 'Stream · Earth'), hd('经（金）', 'River · Metal'), hd('合（水）', 'Sea · Water')];
      var yangH = [hd('井（金）', 'Well · Metal'), hd('荥（水）', 'Spring · Water'), hd('输（木）', 'Stream · Wood'), hd('经（火）', 'River · Fire'), hd('合（土）', 'Sea · Earth')];
      var row = function (id) { var m = A.byId[id]; return '<tr>' + mCell(m) + k5.map(function (k) { return cell(withTag(k, id)[0]); }).join('') + '</tr>'; };
      return '<h3>' + esc(t('yinM')) + '</h3>' + table([esc(t('meridian'))].concat(yinH), ['LU', 'PC', 'HT', 'SP', 'LR', 'KI'].map(row)) +
        '<h3>' + esc(t('yangM')) + '</h3>' + table([esc(t('meridian'))].concat(yangH), ['LI', 'TE', 'SI', 'ST', 'GB', 'BL'].map(row)) +
        '<p class="note">' + esc(t('noteWushu')) + '</p>';
    },
    yuanluo: function () {
      var rows = ORDER12.map(function (id) { return '<tr>' + mCell(A.byId[id]) + cell(withTag('原', id)[0]) + cell(withTag('络', id)[0]) + '</tr>'; });
      rows.push('<tr>' + mCell(A.byId.CV) + '<td class="na">—</td>' + cell(A.byCode.CV15) + '</tr>');
      rows.push('<tr>' + mCell(A.byId.GV) + '<td class="na">—</td>' + cell(A.byCode.GV1) + '</tr>');
      rows.push('<tr><th scope="row">' + hd('脾之大络', 'Great Luo of Spleen') + '</th><td class="na">—</td>' + cell(A.byCode.SP21) + '</tr>');
      return table([esc(t('meridian')), esc(t('yuan')), esc(t('luo'))], rows) + '<p class="note">' + esc(t('noteYuan')) + '</p>';
    },
    xi: function () {
      var rows = ORDER12.map(function (id) { return '<tr>' + mCell(A.byId[id]) + cell(withTag('郄', id)[0]) + '</tr>'; });
      ['阴跷', '阳跷', '阴维', '阳维'].forEach(function (v) {
        rows.push('<tr><th scope="row">' + hd(v + '脉', VES[v]) + '</th>' + cell(withTag('郄:' + v)[0]) + '</tr>');
      });
      return table([esc(t('meridian')), esc(t('xiP'))], rows) + '<p class="note">' + esc(t('noteXi')) + '</p>';
    },
    shumu: function () {
      var orgs = ['肺', '心包', '心', '肝', '胆', '脾', '胃', '三焦', '肾', '大肠', '小肠', '膀胱'];
      return table([esc(t('organ')), esc(t('shu')), esc(t('mu'))], orgs.map(function (o) { return '<tr>' + orgCell(o) + cell(withTag('俞:' + o)[0]) + cell(withTag('募:' + o)[0]) + '</tr>'; })) +
        '<p class="note">' + esc(t('noteShumu')) + '</p>';
    },
    xiahe: function () {
      var orgs = ['胃', '大肠', '小肠', '三焦', '膀胱', '胆'];
      return table([esc(t('organ')), esc(t('xiaheP'))], orgs.map(function (o) { return '<tr>' + orgCell(o) + cell(withTag('下合:' + o)[0]) + '</tr>'; })) +
        '<p class="note">' + esc(t('noteXiahe')) + '</p>';
    },
    bahui: function () {
      var ks = ['脏', '腑', '气', '血', '筋', '脉', '骨', '髓'];
      return table([esc(t('huiOf')), esc(t('point'))], ks.map(function (k) { return '<tr><th scope="row">' + hd(k + '会', HUI[k]) + '</th>' + cell(withTag('会:' + k)[0]) + '</tr>'; })) +
        '<p class="note">' + esc(t('noteBahui')) + '</p>';
    },
    bamai: function () {
      var pairs = [['冲脉', '阴维', '胃、心、胸', 'Stomach, heart, chest'], ['督脉', '阳跷', '目内眦、颈项、耳、肩胛', 'Inner canthus, neck, ear, scapula'],
        ['带脉', '阳维', '目锐眦、耳后、颊、颈、肩', 'Outer canthus, behind the ear, cheek, neck, shoulder'], ['任脉', '阴跷', '肺系、咽喉、胸膈', 'Lung system, throat, chest and diaphragm']];
      var rows = [];
      pairs.forEach(function (pr) {
        var a = withTag('八脉:' + pr[0])[0], b = withTag('八脉:' + pr[1])[0];
        var area = '<td rowspan="2" class="area">' + (S.lang === 'en' ? esc(pr[3]) : esc(pr[2]) + (S.lang === 'bi' ? '<small>' + esc(pr[3]) + '</small>' : '')) + '</td>';
        rows.push('<tr class="pair-a">' + cell(a) + '<td>' + hd(pr[0], VES[pr[0]]) + '</td>' + area + '</tr>');
        rows.push('<tr class="pair-b">' + cell(b) + '<td>' + hd(pr[1] + (pr[1].length === 2 && pr[1] !== '冲脉' ? '脉' : ''), VES[pr[1]]) + '</td></tr>');
      });
      return table([esc(t('bamaiP')), esc(t('bamaiV')), esc(t('bamaiArea'))], rows) + '<p class="note">' + esc(t('noteBamai')) + '</p>';
    }
  };
  function pageTables(key) {
    if (!TABLES[key]) key = 'wushu';
    shell('t');
    var tabs = Object.keys(TABLES).map(function (k) { return '<a href="#/t/' + k + '" class="' + (k === key ? 'on' : '') + '">' + esc(t('tables')[k]) + '</a>'; }).join('');
    app.innerHTML = '<div class="sec-h"><h2>' + esc(t('navTables')) + '</h2></div><nav class="tabs">' + tabs + '</nav><div class="tbl-page">' + TABLES[key]() + '</div>';
  }

  /* ---------- 练习 ---------- */
  var Q = { mode: 'mer', scope: 'all', n: 10 };
  function scopePool(scope) {
    if (scope === 'star') return S.star.map(function (c) { return A.byCode[c]; }).filter(Boolean);
    if (scope === 'wrong') return Object.keys(S.wrong).map(function (c) { return A.byCode[c]; }).filter(Boolean);
    if (A.byId[scope]) return A.byId[scope].pts.slice();
    return A.pts.slice();
  }
  function optsFrom(ans, cands, n) {
    var others = pick(cands.filter(function (x) { return x !== ans; }), n - 1);
    if (others.length < n - 1) {
      var pool = A.pts.filter(function (x) { return x !== ans && others.indexOf(x) < 0 && x.m === ans.m; });
      others = others.concat(pick(pool, n - 1 - others.length));
    }
    if (others.length < n - 1) {
      var pool2 = A.pts.filter(function (x) { return x !== ans && others.indexOf(x) < 0; });
      others = others.concat(pick(pool2, n - 1 - others.length));
    }
    return shuffle([ans].concat(others));
  }
  function tagFacts(pool) {
    var facts = [];
    pool.forEach(function (p) {
      var m = mOf(p);
      p.tags.forEach(function (tg) {
        var k = tg.split(':')[0], v = tg.split(':')[1], zh, en, cands;
        if (!v) {
          if (k === '大络') { zh = '脾之大络是?'; en = 'Which point is the Great Luo of the Spleen?'; cands = withTag('络'); }
          else {
            zh = m.s + '的' + BASIC[k][0] + '是?'; en = 'Which is the ' + BASIC[k][1] + ' point of the ' + m.se + (m.id === 'GV' || m.id === 'CV' ? '' : ' meridian') + '?';
            cands = m.pts.filter(function (x) { return x.tags.indexOf(k) < 0; });
          }
        } else if (k === '郄') { zh = v + '脉的郄穴是?'; en = 'Which is the Xi-Cleft point of the ' + VES[v] + '?'; cands = withTag('郄'); }
        else {
          zh = tagText(tg, 'zh') + '是?';
          if (k === '八脉') zh = '通' + v + '的八脉交会穴是?';
          en = 'Which point is the ' + tagText(tg, 'en').replace(/^Influential point of/, 'Influential point of') + '?';
          cands = A.pts.filter(function (x) { return x !== p && x.tags.some(function (y) { return y.split(':')[0] === k; }); });
        }
        facts.push({ zh: zh, en: en, ans: p, cands: cands });
      });
    });
    return facts;
  }
  function buildQuiz() {
    var pool = scopePool(Q.scope), items = [];
    if (Q.mode === 'tag') {
      var facts = tagFacts(pool);
      if (facts.length < 1) return null;
      items = pick(facts, Q.n).map(function (f) { return { type: 'tag', f: f, ans: f.ans, opts: optsFrom(f.ans, f.cands, 4) }; });
    } else {
      if (Q.mode === 'mer') pool = pool.filter(function (p) { return p.m !== 'EX'; });
      if (Q.mode === 'ind' || Q.mode === 'loc') pool = pool.filter(function (p) { return p.code !== 'ST17'; });
      if (pool.length < (Q.mode === 'card' ? 1 : 4) && !(Q.mode !== 'card' && pool.length >= 1 && (Q.scope === 'star' || Q.scope === 'wrong'))) return null;
      items = pick(pool, Q.n).map(function (p) {
        if (Q.mode === 'card') return { type: 'card', ans: p };
        if (Q.mode === 'mer') {
          var ms = A.list.filter(function (m) { return m.id !== 'EX' && m.id !== p.m; });
          return { type: 'mer', ans: p, opts: shuffle([mOf(p)].concat(pick(ms, 3))) };
        }
        var same = mOf(p).pts.filter(function (x) { return x.code !== 'ST17'; });
        return { type: Q.mode, ans: p, opts: optsFrom(p, same.length >= 4 ? same : A.pts, 4) };
      });
    }
    return { items: items, idx: 0, score: 0, missed: [], answered: false, flipped: false };
  }
  function pageQuizSetup(preScope) {
    shell('q');
    if (preScope) Q.scope = preScope;
    var modes = [['mer', 'mMer', 'mMerD'], ['tag', 'mTag', 'mTagD'], ['loc', 'mLoc', 'mLocD'], ['ind', 'mInd2', 'mInd2D'], ['card', 'mCard', 'mCardD']];
    var scopes = [['all', t('scAll')]].concat(A.list.map(function (m) { return [m.id, m.id + ' · ' + (S.lang === 'en' ? m.se : m.s)]; }))
      .concat([['star', t('scStar') + ' (' + S.star.length + ')'], ['wrong', t('scWrong') + ' (' + Object.keys(S.wrong).length + ')']]);
    app.innerHTML = '<div class="sec-h"><h2>' + esc(t('quizTitle')) + '</h2></div><div class="qset">' +
      '<h3>' + esc(t('mode')) + '</h3><div class="modes">' + modes.map(function (m) {
        return '<button data-mode="' + m[0] + '" class="' + (Q.mode === m[0] ? 'on' : '') + '"><b>' + esc(t(m[1])) + '</b><span>' + esc(t(m[2])) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="qrow"><label><span>' + esc(t('scope')) + '</span><select id="qscope">' + scopes.map(function (s) { return '<option value="' + s[0] + '"' + (Q.scope === s[0] ? ' selected' : '') + '>' + esc(s[1]) + '</option>'; }).join('') + '</select></label>' +
      '<label><span>' + esc(t('count')) + '</span><select id="qn">' + [10, 20, 50].map(function (n) { return '<option' + (Q.n === n ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label></div>' +
      '<p class="warnmsg" id="qwarn" hidden></p><button class="btn" id="qstart">' + esc(t('start')) + ' →</button></div>';
    app.querySelectorAll('[data-mode]').forEach(function (b) { b.onclick = function () { Q.mode = b.getAttribute('data-mode'); app.querySelectorAll('[data-mode]').forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
    document.getElementById('qscope').onchange = function () { Q.scope = this.value; };
    document.getElementById('qn').onchange = function () { Q.n = +this.value; };
    document.getElementById('qstart').onclick = function () {
      var run = buildQuiz();
      if (!run || !run.items.length) { var w = document.getElementById('qwarn'); w.textContent = t('notEnough'); w.hidden = false; return; }
      Q.run = run; renderQ();
    };
  }
  function optLabel(it, o) {
    if (it.type === 'mer') return mName(o);
    return pName(o);
  }
  function revealHtml(p) {
    var m = mOf(p);
    return '<div class="reveal"><div class="rv-h"><span class="code">' + esc(p.code) + '</span> ' + pName(p) + ' · ' + mShort(m) + '</div>' +
      (p.tags.length ? '<div class="chips">' + chips(p) + '</div>' : '') +
      '<p><b>' + esc(t('loc')) + '</b> ' + esc(S.lang === 'en' ? p.locEn : p.loc) + '</p>' +
      '<p><b>' + esc(t('ind')) + '</b> ' + esc(S.lang === 'en' ? p.indEn : p.ind) + '</p>' +
      '<a href="#/p/' + p.code + '" target="_blank" rel="noopener">' + esc(t('viewPt')) + ' ↗</a></div>';
  }
  function renderQ() {
    var R = Q.run, it = R.items[R.idx];
    if (!it) return renderDone();
    var p = it.ans, prompt;
    var prog = '<div class="qprog"><span>' + (R.idx + 1) + ' / ' + R.items.length + '</span><span class="bar"><i style="width:' + Math.round(R.idx / R.items.length * 100) + '%"></i></span><span>✓ ' + R.score + '</span></div>';
    if (it.type === 'card') {
      var m = mOf(p);
      app.innerHTML = prog + '<div class="card' + (R.flipped ? ' flipped' : '') + '" id="card">' +
        (!R.flipped ? '<div class="c-front"><span class="c-name">' + esc(p.zh) + '</span><span class="c-py">' + esc(p.py) + '</span><button class="btn ghost" id="flip">' + esc(t('flip')) + '</button></div>'
          : '<div class="c-back">' + revealHtml(p) + '<p><b>' + esc(t('ndl')) + '</b> ' + esc(S.lang === 'en' ? p.ndlEn : p.ndl) + '</p></div>') + '</div>' +
        (R.flipped ? '<div class="qact"><button class="btn ghost" id="no">' + esc(t('dontKnow')) + '</button><button class="btn" id="yes">' + esc(t('know')) + '</button></div>' : '');
      if (!R.flipped) document.getElementById('flip').onclick = function () { R.flipped = true; renderQ(); };
      else {
        document.getElementById('yes').onclick = function () { R.score++; dec(p.code); R.flipped = false; R.idx++; renderQ(); };
        document.getElementById('no').onclick = function () { inc(p.code); R.missed.push(p); R.flipped = false; R.idx++; renderQ(); };
      }
      return;
    }
    if (it.type === 'mer') prompt = '<div class="qbig">' + esc(p.zh) + '<small>' + esc(p.py) + '</small></div><p class="qask">' + esc(t('qMerAsk')) + '</p>';
    else if (it.type === 'tag') prompt = '<p class="qask big">' + (S.lang === 'en' ? esc(it.f.en) : esc(it.f.zh) + (S.lang === 'bi' ? '<span class="sub-en">' + esc(it.f.en) + '</span>' : '')) + '</p>';
    else if (it.type === 'loc') prompt = '<blockquote class="qtext">' + L(p.loc, p.locEn) + '</blockquote><p class="qask">' + esc(t('qLocAsk')) + '</p>';
    else prompt = '<blockquote class="qtext">' + L(p.ind, p.indEn) + '</blockquote><p class="qask">' + esc(t('qIndAsk')) + '</p>';
    var correct = it.type === 'mer' ? mOf(p) : p;
    app.innerHTML = prog + '<div class="qbox">' + prompt + '<div class="opts">' + it.opts.map(function (o, i) {
      var cls = '';
      if (R.answered) { if (o === correct) cls = 'ok'; else if (i === R.choice) cls = 'bad'; }
      return '<button data-i="' + i + '" class="' + cls + '"' + (R.answered ? ' disabled' : '') + '>' + optLabel(it, o) + '</button>';
    }).join('') + '</div>' +
      (R.answered ? '<div class="fb ' + (R.lastOk ? 'ok' : 'bad') + '">' + (R.lastOk ? '✓ ' + esc(t('right')) : '✗ ' + esc(t('wrongA'))) + '</div>' + revealHtml(p) +
        '<div class="qact"><button class="btn" id="nextq">' + esc(R.idx + 1 < R.items.length ? t('nextQ') : t('finish')) + ' →</button></div>' : '') + '</div>';
    if (!R.answered) {
      app.querySelectorAll('.opts button').forEach(function (b) {
        b.onclick = function () {
          var i = +b.getAttribute('data-i');
          R.answered = true; R.choice = i; R.lastOk = it.opts[i] === correct;
          if (R.lastOk) { R.score++; dec(p.code); } else { inc(p.code); R.missed.push(p); }
          renderQ();
        };
      });
    } else {
      var nb = document.getElementById('nextq'); nb.focus({ preventScroll: true });
      nb.onclick = function () { R.answered = false; R.idx++; renderQ(); window.scrollTo(0, 0); };
    }
  }
  function inc(c) { S.wrong[c] = (S.wrong[c] || 0) + 1; save(); }
  function dec(c) { if (S.wrong[c]) { S.wrong[c]--; if (!S.wrong[c]) delete S.wrong[c]; save(); } }
  function renderDone() {
    var R = Q.run, uniq = [];
    R.missed.forEach(function (p) { if (uniq.indexOf(p) < 0) uniq.push(p); });
    app.innerHTML = '<div class="done"><h2>' + esc(t('done')) + '</h2><div class="score">' + R.score + '<small> / ' + R.items.length + '</small></div>' +
      '<div class="qact"><button class="btn ghost" id="back">' + esc(t('back')) + '</button><button class="btn" id="again">' + esc(t('again')) + ' →</button></div></div>' +
      (uniq.length ? '<div class="sec-h"><h2>' + esc(t('reviewWrong')) + '</h2></div><div class="plist">' + uniq.map(function (p) { return pRow(p); }).join('') + '</div>' : '');
    document.getElementById('again').onclick = function () { var r = buildQuiz(); if (r && r.items.length) { Q.run = r; renderQ(); } else pageQuizSetup(); };
    document.getElementById('back').onclick = function () { Q.run = null; pageQuizSetup(); };
  }

  /* ---------- 我的 ---------- */
  function pageMe() {
    shell('me');
    var stars = S.star.map(function (c) { return A.byCode[c]; }).filter(Boolean);
    var wrongs = Object.keys(S.wrong).map(function (c) { return A.byCode[c]; }).filter(Boolean)
      .sort(function (a, b) { return S.wrong[b.code] - S.wrong[a.code]; });
    var seenN = Object.keys(S.seen).length;
    app.innerHTML = '<div class="sec-h"><h2>' + esc(t('me')) + '</h2><span class="muted">' + esc(t('store')) + '</span></div>' +
      '<div class="mestat"><div><b>' + seenN + '</b><span>' + esc(t('seenN')) + ' / ' + A.pts.length + '</span></div><div><b>' + stars.length + '</b><span>' + esc(t('starList')) + '</span></div><div><b>' + wrongs.length + '</b><span>' + esc(t('wrongList')) + '</span></div></div>' +
      '<div class="sec-h"><h2>' + esc(t('starList')) + '</h2>' + (stars.length >= 1 ? '<a class="btn ghost sm" href="#/q/star">' + esc(t('navQuiz')) + ' →</a>' : '') + '</div>' +
      (stars.length ? '<div class="plist">' + stars.map(function (p) { return pRow(p); }).join('') + '</div>' : '<p class="empty">' + esc(t('noStar')) + '</p>') +
      '<div class="sec-h"><h2>' + esc(t('wrongList')) + '</h2>' + (wrongs.length ? '<a class="btn ghost sm" href="#/q/wrong">' + esc(t('practiceWrong')) + ' →</a>' : '') + '</div>' +
      (wrongs.length ? '<div class="plist">' + wrongs.map(function (p) { return pRow(p, brief(p) + ' <span class="cnt">' + S.wrong[p.code] + esc(t('times')) + '</span>'); }).join('') + '</div>' : '<p class="empty">' + esc(t('noWrong')) + '</p>') +
      '<div class="clears"><button class="btn ghost sm" id="cw">' + esc(t('clearWrong')) + '</button><button class="btn ghost sm" id="cs">' + esc(t('clearSeen')) + '</button></div>';
    document.getElementById('cw').onclick = function () { if (confirm(t('confirmClear'))) { S.wrong = {}; save(); pageMe(); } };
    document.getElementById('cs').onclick = function () { if (confirm(t('confirmClear'))) { S.seen = {}; save(); pageMe(); } };
  }

  /* ---------- 路由 ---------- */
  function route() {
    var h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    var parts = h.split('/'), r = parts[0];
    if (r !== 's') window.scrollTo(0, 0);
    if (r === 'm') pageMeridian(parts[1]);
    else if (r === 'p') pagePoint(parts[1]);
    else if (r === 's') pageSearch(parts.slice(1).join('/'));
    else if (r === 't') pageTables(parts[1]);
    else if (r === 'q') { if (parts[1]) { Q.scope = parts[1]; } Q.run = null; pageQuizSetup(); }
    else if (r === 'me') pageMe();
    else if (r === 'b') pageBody(parts[1]);
    else pageHome();
  }
  window.addEventListener('hashchange', route);

  var qi = document.getElementById('q'), timer;
  qi.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var v = qi.value;
      var target = '#/s/' + encodeURIComponent(v);
      if (location.hash.indexOf('#/s/') === 0) { history.replaceState(null, '', target); pageSearch(v); }
      else if (v.trim()) location.hash = target;
    }, 180);
  });
  qi.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { var r = search(qi.value); if (r.length === 1 || (r[0] && (r[0].code === qi.value.trim().toUpperCase() || r[0].zh === qi.value.trim()))) { location.hash = '#/p/' + r[0].code; qi.blur(); } }
  });
  document.getElementById('lang').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    S.lang = b.getAttribute('data-lang'); save();
    if (Q.run && location.hash.indexOf('#/q') === 0) { shell('q'); renderQ(); } else route();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== qi && !/input|select|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); qi.focus(); }
  });

  route();
})();
