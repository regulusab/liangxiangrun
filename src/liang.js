// 梁湘潤論法：規則式論斷（本站整理，文字為白話原創）。
// 盤面事實一律取自 mingpan-facts（computeFacts），本檔只做依梁氏論命次第的檢索與排列。
// 注意：本檔不做任何換日口徑的比對，只用 mingpan-facts 預設口徑排出的一張盤。
export const GAN = '甲乙丙丁戊己庚辛壬癸'.split('');
export const ZHI = '子丑寅卯辰巳午未申酉戌亥'.split('');
const GW = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
const ZW = {子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};
export const HIDE = {子:['癸'],丑:['己','癸','辛'],寅:['甲','丙','戊'],卯:['乙'],辰:['戊','乙','癸'],巳:['丙','庚','戊'],午:['丁','己'],未:['己','丁','乙'],申:['庚','壬','戊'],酉:['辛'],戌:['戊','辛','丁'],亥:['壬','甲']};
const SHENG = {木:'火',火:'土',土:'金',金:'水',水:'木'};
const KE = {木:'土',土:'水',水:'火',火:'金',金:'木'};
export const yang = g => GAN.indexOf(g) % 2 === 0;
export const ganWx = g => GW[g];
export const zhiWx = z => ZW[z];
export function tenGod(dm, g) {
  const a = GW[dm], b = GW[g], same = yang(dm) === yang(g);
  if (a === b) return same ? '比肩' : '劫財';
  if (SHENG[a] === b) return same ? '食神' : '傷官';
  if (KE[a] === b) return same ? '偏財' : '正財';
  if (KE[b] === a) return same ? '七殺' : '正官';
  return same ? '偏印' : '正印';
}
export const zhiGod = (dm, z) => tenGod(dm, HIDE[z][0]);
export const gz60 = i => GAN[((i % 10) + 10) % 10] + ZHI[((i % 12) + 12) % 12];
export const yearGz = y => gz60(y - 4);
const STEM_CHONG = {甲:'庚',庚:'甲',乙:'辛',辛:'乙',丙:'壬',壬:'丙',丁:'癸',癸:'丁'};
const CHONG = {子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳'};
const LIUHE = {子:'丑',丑:'子',寅:'亥',亥:'寅',卯:'戌',戌:'卯',辰:'酉',酉:'辰',巳:'申',申:'巳',午:'未',未:'午'};
const GANHE = {甲:'己',己:'甲',乙:'庚',庚:'乙',丙:'辛',辛:'丙',丁:'壬',壬:'丁',戊:'癸',癸:'戊'};
const SANXING = [['寅','巳','申'],['丑','戌','未']];
const XING2 = [['子','卯']];
const ZIXING = ['辰','午','酉','亥'];
const SANHE = [['申','子','辰','水'],['寅','午','戌','火'],['巳','酉','丑','金'],['亥','卯','未','木']];
export const isChong = (a, b) => CHONG[a] === b;
export const isStemChong = (a, b) => STEM_CHONG[a] === b;
export const isTkdc = (p, q) => isStemChong(p[0], q[0]) && isChong(p[1], q[1]); // 天剋地沖（干支雙沖）
export const isHe = (a, b) => LIUHE[a] === b;
export const isGanHe = (a, b) => GANHE[a] === b;
export function xingPair(a, b) {
  if (a === b && ZIXING.includes(a)) return '自刑';
  if (XING2.some(([x, y]) => (a === x && b === y) || (a === y && b === x))) return '子卯刑';
  for (const g of SANXING) if (a !== b && g.includes(a) && g.includes(b)) return g.join('') + '刑';
  return '';
}
const PN = ['年', '月', '日', '時'];
const PK = ['year', 'month', 'day', 'hour'];
// 用神五層面（《子平基礎概要》前言所列；本站白話）
export const YONG_LAYERS = [
  ['格局用神', '依格局順用或逆用而取'],
  ['通關用神', '格局受破時用來調節的那一個五行'],
  ['病藥用神', '針對命局之病（如調候之忌）的對治'],
  ['專旺用神', '從旺、從勢等特別格所取'],
  ['調候用神', '十干生於十二月令所需的寒暖燥濕調節'],
];
// 《窮通寶鑑》調候用神（坊間通行整理表；每格大致依先後排列，首字為首選）。欄序：寅卯辰巳午未申酉戌亥子丑
const TH = {
  甲:['丙癸','庚丙丁戊己','庚丁壬','癸丁庚','癸丁庚','丁庚癸','庚丁壬','丁丙庚','庚甲丁壬癸','庚丁丙戊','丁庚丙','丁庚丙'],
  乙:['丙癸','丙癸','癸丙戊','癸','癸丙','癸丙','丙癸己','癸丙丁','癸辛','丙戊','丙','丙'],
  丙:['壬庚','壬己','壬甲','壬癸庚','壬庚','壬庚','壬戊','壬癸','甲壬','甲戊庚壬','壬戊己','壬甲'],
  丁:['甲庚','庚甲','甲庚','甲庚','壬庚癸','甲壬庚','甲庚丙戊','甲庚丙戊','甲庚戊','甲庚','甲庚','甲庚'],
  戊:['丙甲癸','丙甲癸','甲丙癸','甲丙癸','壬甲丙','癸丙甲','丙癸甲','丙癸','甲丙癸','甲丙','丙甲','丙甲'],
  己:['丙庚甲','甲癸丙','丙癸甲','癸丙','癸丙','癸丙','丙癸','丙癸','甲丙癸','丙甲戊','丙甲戊','丙甲戊'],
  庚:['戊甲壬丙丁','丁甲庚丙','甲丁壬癸','壬戊丙丁','壬癸','丁甲','丁甲','丁甲丙','甲壬','丁丙','丁甲丙','丙丁甲'],
  辛:['己壬庚','壬甲','壬甲','壬甲癸','壬己癸','壬庚甲','壬甲戊','壬甲','壬甲','壬丙','丙戊壬甲','丙壬戊己'],
  壬:['庚丙戊','戊辛庚','甲庚','壬辛庚癸','癸庚辛','辛甲','戊丁','甲庚','甲丙','戊丙庚','戊丙','丙丁甲'],
  癸:['辛丙','庚辛','丙辛甲','辛','庚辛壬癸','庚辛壬癸','丁','辛丙','辛甲壬癸','庚辛戊丁','丙辛','丙丁'],
};
export const TIAOHOU_TABLE = TH;
export const MONTH_ORDER = '寅卯辰巳午未申酉戌亥子丑'.split('');
export function tiaohou(dm, mz) { return TH[dm][MONTH_ORDER.indexOf(mz)].split(''); }
// 十干敗亡運（網路整理稿所載口訣，來源待核）：日主＋大運地支，四柱地支不帶祿旺者為凶。
export const BAIWANG = {甲:[['申'],'寅卯'],乙:[['酉'],'寅卯'],丙:[['子'],'巳午'],丁:[['亥'],'巳午'],戊:[['寅'],'巳午'],己:[['卯'],'巳午'],庚:[['午'],'申酉'],辛:[['巳'],'申酉'],壬:[['辰','戌'],'亥子'],癸:[['丑','未'],'亥子']};
// 月支本庫：辰戌丑未月，大運天干逢癸丁辛乙（同一網路整理稿，來源待核）
const MONTH_KU = {辰:'癸',戌:'丁',丑:'辛',未:'乙'};
// 陰干入墓：乙未、丁戌、辛丑、癸辰
const YIN_MU = {乙:'未',丁:'戌',辛:'丑',癸:'辰'};
// 《子平真詮》順用、逆用（「財官印食…順用」「殺傷劫刃…逆用」）
const NI = ['七殺', '傷官', '劫財', '羊刃', '比肩'];
export const LU = {甲:'寅',乙:'卯',丙:'巳',丁:'午',戊:'巳',己:'午',庚:'申',辛:'酉',壬:'亥',癸:'子'};

// ───────── 原局：依論命次第逐項檢索 ─────────
export function natal(f) {
  const P = PK.map(k => f.pillars[k]);
  const gz = P.map(p => p.ganZhi);
  const dm = f.dayMaster, mz = f.monthCommand, male = f.input.gender === 'male';
  const stems = P.map(p => p.stem), brs = P.map(p => p.branch);
  const steps = [];
  // 1 五行缺一
  const miss = f.elements.missing || [];
  const groupOf = w => tenGod(dm, Object.keys(GW).find(g => GW[g] === w)).replace(/^(比肩|劫財)$/, '比劫').replace(/^(食神|傷官)$/, '食傷').replace(/^(偏財|正財)$/, '財').replace(/^(七殺|正官)$/, '官殺').replace(/^(偏印|正印)$/, '印');
  const th = tiaohou(dm, mz);
  if (!miss.length) steps.push({k: '五行缺一', t: '五行俱全，此項不立。'});
  else {
    const det = miss.map(w => {
      const g = groupOf(w); const tags = [];
      if (g === '財') tags.push(male ? '財星（男命妻星）' : '財星');
      if (g === '官殺') tags.push(male ? '官殺' : '官殺（女命夫星）');
      if (th.some(s => GW[s] === w)) tags.push('調候所需之五行');
      return `缺${w}（${g}${tags.length ? '，' + tags.join('、') : ''}）`;
    }).join('；');
    steps.push({k: '五行缺一', t: (miss.length === 1 ? '列為第一優先。' : `缺${miss.length}行（缺二以上較常見，重點仍看所缺者是否為財官或調候）。`) + det, hit: true});
  }
  // 2 月支財官旺絕
  const wx = f.strength.wangXiang || {};
  const caiW = SHENG[SHENG[GW[dm]]], guanW = Object.keys(KE).find(w => KE[w] === GW[dm]);
  const st = w => wx[w] || '—';
  const ok = s => (s === '旺' || s === '相') ? '得令' : '失令';
  steps.push({k: '月令財官', t: `生於${mz}月：財星${caiW}為「${st(caiW)}」（${ok(st(caiW))}），官殺${guanW}為「${st(guanW)}」（${ok(st(guanW))}）。${male ? '男命以財為妻星' : '女命以官殺為夫星'}，先看其在月令的旺衰。`});
  // 3 雙沖、三刑、全陽全陰
  const hits3 = [];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (isTkdc(gz[i], gz[j])) hits3.push(`${PN[i]}${PN[j]}干支雙沖（${gz[i]}、${gz[j]}）`);
  for (const g of SANXING) if (g.every(b => brs.includes(b))) hits3.push(`地支${g.join('')}三刑俱全`);
  if (brs.includes('子') && brs.includes('卯')) hits3.push('子卯相刑');
  const allYang = [...stems, ...brs].every(c => (GAN.includes(c) ? GAN.indexOf(c) : ZHI.indexOf(c)) % 2 === 0);
  const allYin = [...stems, ...brs].every(c => (GAN.includes(c) ? GAN.indexOf(c) : ZHI.indexOf(c)) % 2 === 1);
  if (allYang) hits3.push('八字全陽'); if (allYin) hits3.push('八字全陰');
  steps.push({k: '雙沖、三刑、全陽全陰', t: hits3.length ? hits3.join('；') + '。再以所沖刑的十神（六親）與格局、調候相對照。' : '四柱無干支雙沖、三刑，亦非全陽全陰。', hit: hits3.length > 0});
  // 4 拱、夾
  const gj = [];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
    for (const [a, mid, b] of SANHE) if ((brs[i] === a && brs[j] === b) || (brs[i] === b && brs[j] === a)) if (!brs.includes(mid)) gj.push(`${PN[i]}${PN[j]}支${brs[i]}${brs[j]}拱${mid}`);
    if (j === i + 1) { const d = (ZHI.indexOf(brs[j]) - ZHI.indexOf(brs[i]) + 12) % 12; if (d === 2 || d === 10) { const m = ZHI[(ZHI.indexOf(brs[i]) + (d === 2 ? 1 : 11)) % 12]; if (!brs.includes(m)) gj.push(`${PN[i]}${PN[j]}支${brs[i]}${brs[j]}夾${m}`); } }
  }
  steps.push({k: '拱、夾', t: gj.length ? gj.join('；') + '。拱夾之字為虛神，看它是哪一種十神：' + gj.map(s => s.slice(-1)).map(z => `${z}為${zhiGod(dm, z)}`).join('、') + '。' : '四柱無明顯拱、夾。', hit: gj.length > 0});
  // 5 隔柱雙沖、伏吟
  const GE = {'年日': '年日雙沖：與根基、祖業不甚相合，縱有成就也宜防不久。', '年時': '年時雙沖：多為離鄉、另立根基之人。', '月時': '月時雙沖：一生起落較多，宜防反覆。', '月日': '月日雙沖：屬常見之沖，主自身與家庭、工作環境多拉扯。', '日時': '日時雙沖：晚景與子女方面宜多留意。', '年月': '年月雙沖：早年家境或與長輩緣分多變動。'};
  const ge = [];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) { if (isTkdc(gz[i], gz[j])) ge.push(GE[PN[i] + PN[j]]); if (gz[i] === gz[j]) ge.push(`${PN[i]}${PN[j]}伏吟（${gz[i]}兩見），主同類之事重複。`); }
  steps.push({k: '各柱雙沖之意', t: ge.length ? ge.join('') : '無。', hit: ge.length > 0});
  // 6 格局順逆
  const pg = f.pattern && f.pattern.god;
  const pname = (f.pattern && f.pattern.name) || '—';
  const ni = pg && (NI.includes(pg) || /刃|建祿|月劫/.test(pname));
  steps.push({k: '格局順逆', t: `${pname}。${pg ? (ni ? '屬「逆用」之格（七殺、傷官、劫刃之類宜制、宜化、宜駕）。' : '屬「順用」之格（財、官、印、食之類宜生、宜護）。') : ''}大運之取捨，依此順逆而定喜忌。`});
  // 7 調候
  const winterSummer = '亥子丑巳午未'.includes(mz);
  const have = th.map(s => ({s, tou: stems.some((x, i) => x === s && i !== 2), zang: P.some(p => p.hiddenStems.some(h => h.stem === s))}));
  const first = have[0];
  steps.push({k: '調候用神', t: `${dm}日生${mz}月，《窮通寶鑑》所列為「${th.join('、')}」，首選${first.s}（${first.s}為${tenGod(dm, first.s)}）。原局${first.tou ? first.s + '透干' : first.zang ? first.s + '只藏於支' : '不見' + first.s}。` + (winterSummer ? '生於冬、夏，依梁氏論法以調候為第一優先，暫不論身強身弱。' : '生於春、秋，調候不是最急，仍以格局為主、調候為輔。'), hit: winterSummer});
  // 8 特別格
  const sp = f.pattern && f.pattern.special;
  const spn = sp && (sp.names || []).length ? sp.names.join('、') : '';
  steps.push({k: '特別格', t: spn ? `可能成立：${spn}（依 mingpan-facts 從嚴判定），應另依專旺用神論。` : '未見從格、化氣等特別格（依 mingpan-facts 從嚴判定）。'});
  // 9 日主強弱（最後才論）
  steps.push({k: '日主強弱（最後）', t: `${f.strength.level}。依梁氏次第，強弱是在前述各項都沒有嚴重失衡時才用的入門法則，${winterSummer ? '本造生於冬夏，以調候為先，強弱只作參考。' : '本造可再依扶抑參酌。'}`});

  // 十神定位與分限
  const AGES = ['約 1–15 歲', '約 16–30 歲', '約 31–45 歲', '約 46 歲以後'];
  const fen = P.map((p, i) => ({pillar: PN[i] + '柱', gz: p.ganZhi, age: AGES[i], stemGod: i === 2 ? '日主' : p.stemGod, branchGod: p.hiddenStems[0].god, note: fenNote(i, i === 2 ? null : p.stemGod, p.hiddenStems[0].god)}));
  // 六親
  const liuqin = sixKin(f, P, dm, male);
  const stars = (f.stars || []).map(s => ({name: s.name, pillar: PN[PK.indexOf(s.pillar)] + '柱'}));
  return {gz, dm, mz, male, steps, fen, liuqin, stars, tiaohou: th, have, winterSummer, pattern: pname, patternNi: ni, strength: f.strength.level};
}
const GOD_LINE = {
  比肩: '同輩、自我主張', 劫財: '競爭、花費與是非', 食神: '才藝、口福與安穩', 傷官: '才華外露、言語鋒利', 偏財: '流動之財、父緣', 正財: '正當收入、男命妻緣',
  七殺: '壓力、權柄與災險', 正官: '名分、規範、女命夫緣', 偏印: '偏門學問、孤僻', 正印: '庇蔭、學業與母緣',
};
function fenNote(i, sg, bg) {
  const where = ['早年家境與祖上', '青年求學與出社會', '中年自身與婚姻', '晚年與子女'][i];
  const a = sg ? `天干${sg}（${GOD_LINE[sg]}）` : '天干為日主本身';
  return `${where}：${a}，地支本氣${bg}（${GOD_LINE[bg]}）。`;
}
function sixKin(f, P, dm, male) {
  const all = [];
  P.forEach((p, i) => { if (i !== 2) all.push({g: p.stem, god: p.stemGod, at: PN[i] + '干', tou: true}); p.hiddenStems.forEach(h => all.push({g: h.stem, god: h.god, at: PN[i] + '支藏', tou: false})); });
  const find = (...gods) => all.filter(x => gods.includes(x.god));
  const fmt = arr => arr.length ? arr.map(x => `${x.g}（${x.at}）`).join('、') : '四柱不見';
  const rows = [
    ['父', '偏財', fmt(find('偏財'))],
    ['母', '正印', fmt(find('正印'))],
    male ? ['妻', '正財（偏財為輔）', fmt(find('正財', '偏財'))] : ['夫', '正官（七殺為輔）', fmt(find('正官', '七殺'))],
  ];
  const kids = find('食神', '傷官');
  const son = kids.filter(x => yang(x.g)), dau = kids.filter(x => !yang(x.g));
  rows.push(['子女', '食神、傷官：陽干為子、陰干為女', kids.length ? `子：${son.length ? son.map(x => `${x.g}${x.god}（${x.at}）`).join('、') : '無'}；女：${dau.length ? dau.map(x => `${x.g}${x.god}（${x.at}）`).join('、') : '無'}` : '四柱不見食傷']);
  rows.push(['兄弟', '比肩、劫財', fmt(find('比肩', '劫財'))]);
  return rows;
}

// ───────── 大運：金不換「平衡點在大運」＋敗亡、墓庫、雙沖 ─────────
// 八格喜忌（依《子平真詮》大意，本站簡化：只看運干十神）
const GE_XIJI = {
  正官: [['正財', '偏財', '正印', '偏印'], ['傷官', '七殺']],
  財: [['食神', '傷官', '正官'], ['比肩', '劫財']],
  印: [['正官', '七殺'], ['正財', '偏財']],
  食神: [['正財', '偏財'], ['偏印']],
  七殺: [['食神', '正印', '偏印'], ['正財', '偏財']],
  傷官: [['正印', '偏印', '正財', '偏財'], ['正官']],
  劫財: [['正官', '七殺'], []], 比肩: [['正官', '七殺', '正財', '偏財'], []],
};
export const GE_XIJI_TABLE = GE_XIJI;
export function dayunRows(f) {
  const P = PK.map(k => f.pillars[k]);
  const dm = f.dayMaster, mz = f.monthCommand, brs = P.map(p => p.branch);
  const th = tiaohou(dm, mz);
  const pg = f.pattern && f.pattern.god;
  return (f.fortune.dayun || []).map(d => {
    const notes = [];
    const [bad, need] = BAIWANG[dm];
    if (bad.includes(d.branch) && !brs.some(b => need.includes(b))) notes.push({c: 'x', t: `十干敗亡運：${dm}日入${d.branch}運，四柱地支無${need.split('').join('、')}可依`});
    if (MONTH_KU[mz] && MONTH_KU[mz] === d.stem) notes.push({c: 'x', t: `墓庫運：${mz}月見${d.stem}運，運干歸月支本庫，主停滯`});
    const yinMu = P.filter((p, i) => i !== 2 && ['正官', '正印'].includes(p.stemGod) && YIN_MU[p.stem] === d.branch).map(p => `${p.stem}${p.stemGod}`);
    if (yinMu.length) notes.push({c: 'x', t: `${yinMu.join('、')}入墓（${d.branch}運）`});
    P.forEach((p, i) => { if (isTkdc(d.ganZhi, p.ganZhi)) notes.push({c: 'x', t: `運與${PN[i]}柱干支雙沖`}); if (d.ganZhi === p.ganZhi) notes.push({c: 'w', t: `運與${PN[i]}柱伏吟`}); });
    if (isChong(d.branch, mz)) notes.push({c: 'w', t: '運支沖提綱（月令）'});
    if (isChong(d.branch, brs[2])) notes.push({c: 'w', t: '運支沖日支（配偶宮）'});
    if (isHe(d.branch, brs[2])) notes.push({c: 'o', t: '運支合日支'});
    if (th[0] === d.stem) notes.push({c: 'o', t: `運干${d.stem}為調候首選`}); else if (th.includes(d.stem)) notes.push({c: 'o', t: `運干${d.stem}在調候所列之中`});
    const sg = tenGod(dm, d.stem), bg = zhiGod(dm, d.branch);
    let lean = '';
    const rule = pg && GE_XIJI[grp(pg) === '財' ? '財' : grp(pg) === '印' ? '印' : pg];
    if (rule) { if (rule[0].includes(sg)) lean = '運干順格局之喜'; else if (rule[1].includes(sg)) lean = '運干犯格局之忌'; }
    if (lean) notes.push({c: lean.includes('忌') ? 'x' : 'o', t: lean});
    return {...d, sg, bg, notes};
  });
}
export function dayunAt(f, year) {
  const ds = f.fortune.dayun || [];
  let cur = null;
  for (const d of ds) if (+d.startTradLocal.slice(0, 4) <= year) cur = d;
  return cur;
}

// ───────── 流年與流月：歲運柱刑沖合會 ─────────
const LN_LINE = {
  比劫: '人緣與競爭並起，心性轉強；為喜則得友助，為忌則防破財是非。',
  食傷: '才華外放、奔走較多；為喜則財源有路，為忌則防口舌、女命留意子女之事。',
  財: '錢財與異性緣入命；為喜則有進財，為忌則為財所累，並防長輩欠安。',
  官殺: '名分、規範或壓力入命；為喜則升遷有名，為忌則防官非、降職；女命主夫緣之事。',
  印: '長輩、文書、學業入命；為喜則得助、利考試，為忌則為長上付出、財源略減。',
};
const grp = g => ({比肩: '比劫', 劫財: '比劫', 食神: '食傷', 傷官: '食傷', 偏財: '財', 正財: '財', 七殺: '官殺', 正官: '官殺', 偏印: '印', 正印: '印'})[g];
export function liunian(f, year) {
  const P = PK.map(k => f.pillars[k]);
  const dm = f.dayMaster, brs = P.map(p => p.branch);
  const ln = yearGz(year), d = dayunAt(f, year);
  const notes = [];
  if (d && d.ganZhi === ln) notes.push({c: 'x', t: '歲運並臨（流年與大運同一干支）'});
  if (d && isTkdc(ln, d.ganZhi)) notes.push({c: 'x', t: '歲運干支雙沖'});
  P.forEach((p, i) => {
    if (isTkdc(ln, p.ganZhi)) notes.push({c: 'x', t: `流年與${PN[i]}柱天剋地沖`});
    if (ln === p.ganZhi) notes.push({c: 'w', t: `流年與${PN[i]}柱伏吟`});
  });
  if (isChong(ln[1], brs[1])) notes.push({c: 'w', t: '流年沖月令'});
  if (isChong(ln[1], brs[2])) notes.push({c: 'w', t: '流年沖日支（配偶宮）'});
  if (isHe(ln[1], brs[2])) notes.push({c: 'o', t: '流年合日支'});
  if (isGanHe(ln[0], dm)) notes.push({c: 'o', t: '流年天干合日主'});
  const all = d ? [...brs, d.branch, ln[1]] : [...brs, ln[1]];
  for (const g of SANXING) if (g.every(b => all.includes(b)) && !g.every(b => brs.includes(b))) notes.push({c: 'x', t: `歲運與原局湊成${g.join('')}三刑`});
  for (const [a, b, c, w] of SANHE) if ([a, b, c].every(x => all.includes(x)) && ![a, b, c].every(x => brs.includes(x))) notes.push({c: 'o', t: `歲運與原局會成${a}${b}${c}${w}局`});
  const sg = tenGod(dm, ln[0]);
  return {year, gz: ln, dayun: d && d.ganZhi, sg, bg: zhiGod(dm, ln[1]), line: LN_LINE[grp(sg)], notes};
}
const JIE12 = ['立春', '驚蟄', '清明', '立夏', '芒種', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];
export function liuyue(f, year) {
  const P = PK.map(k => f.pillars[k]);
  const dm = f.dayMaster, brs = P.map(p => p.branch);
  const yg = GAN.indexOf(yearGz(year)[0]);
  const startStem = [2, 4, 6, 8, 0][yg % 5]; // 五虎遁：甲己丙寅、乙庚戊寅…
  const ln = yearGz(year), d = dayunAt(f, year);
  return MONTH_ORDER.map((z, i) => {
    const g = GAN[(startStem + i) % 10], m = g + z;
    const n = [];
    if (isChong(z, brs[2])) n.push('沖日支'); if (isHe(z, brs[2])) n.push('合日支');
    if (isChong(z, brs[1])) n.push('沖月令'); if (isChong(z, ln[1])) n.push('沖太歲');
    if (d && isChong(z, d.branch)) n.push('沖運支');
    if (isTkdc(m, P[2].ganZhi)) n.push('與日柱天剋地沖');
    const x = xingPair(z, brs[2]); if (x) n.push(`與日支${x}`);
    return {jie: JIE12[i], gz: m, sg: tenGod(dm, g), bg: zhiGod(dm, z), notes: n};
  });
}
