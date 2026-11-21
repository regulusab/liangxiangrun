// QA：排盤口徑、規則檢索、頁面無錯誤、手機與桌機截圖（輸出 /workspace/fig/liangxiangrun/）
import fs from 'fs';
import {chart} from './src/engine.js';
import {natal, dayunRows, liunian, liuyue, tenGod} from './src/liang.js';
let bad = 0; const ok = (c, m) => { console.log((c ? 'OK  ' : 'NG  ') + m); if (!c) bad++; };
const gz = x => ['year', 'month', 'day', 'hour'].map(k => x.pillars[k].ganZhi).join(' ');
const A = chart({date: '2026-10-07', time: '22:10', gender: '1', lon: -122.68, lat: 45.52, zone: 'America/Los_Angeles', mode: 'clock'});
ok(gz(A) === '丙午 丁酉 乙卯 丁亥', '西經 122.68° 2026-10-07 22:10 → ' + gz(A) + '（日柱干支進一位、日期不動）');
const B = chart({date: '1988-06-15', time: '09:30', gender: '1', lon: 121.56, lat: 25.04, zone: 'Asia/Taipei', mode: 'clock'});
ok(gz(B) === '戊辰 戊午 辛丑 癸巳', '台北虛構例 → ' + gz(B));
const C = chart({date: '1990-05-10', time: '23:30', gender: '0', lon: -74.01, lat: 40.71, zone: 'America/New_York', mode: 'clock'});
ok(C.pillars.hour.ganZhi === '庚子', '紐約 1990-05-10 23:30 晚子時時干依進位後次日日干 → ' + C.pillars.hour.ganZhi);
const D = chart({date: '1988-06-15', time: '09:30', gender: '1', lon: 121.56, lat: 25.04, tzHours: 8, mode: 'clock'});
ok(gz(D) === gz(B), '自訂時差 +8 與 Asia/Taipei 同盤');
ok(tenGod('甲', '庚') === '七殺' && tenGod('甲', '辛') === '正官' && tenGod('丙', '戊') === '食神' && tenGod('丙', '己') === '傷官', '十神');
const n = natal(B);
ok(n.steps.length === 9 && n.steps[8].k.startsWith('日主強弱'), '論命次第九步、強弱最後');
ok(n.tiaohou.join('') === '壬己癸' && n.winterSummer, '辛日午月調候壬己癸、夏生');
const kid = n.liuqin.find(r => r[0] === '子女');
ok(/子：癸/.test(kid[2]) === false && /女：癸食神/.test(kid[2]), '子女：癸（陰干）食神為女 → ' + kid[2]);
const ds = dayunRows(B); ok(ds.length >= 8, '大運 ' + ds.length + ' 步');
// 十干敗亡：甲日、四柱無寅卯、行申運
const E = chart({date: '1984-08-20', time: '12:00', gender: '1', lon: 121.56, lat: 25.04, zone: 'Asia/Taipei', mode: 'clock'});
console.log('    E', gz(E), E.fortune.dayun.map(d => d.ganZhi).join(','));
const ln = liunian(B, 2026); ok(ln.gz === '丙午', '2026 流年丙午');
const lm = liuyue(B, 2026); ok(lm[0].gz === '庚寅' && lm[11].gz === '辛丑', '2026 流月：寅月庚寅…丑月辛丑');
const L1 = liunian(B, 2027); console.log('    2027', L1.gz, L1.dayun, L1.notes.map(x => x.t).join('；'));
// 原始碼不得含換日比對
const src = fs.readdirSync('src').map(f => fs.readFileSync('src/' + f, 'utf8')).join('\n');
ok(!/computeStability|alternateDayChange|dayChange\s*:\s*'local'/.test(src), '程式不含換日比對（不呼叫 computeStability、不切 dayChange）');
ok(!/何棰鑨|研習會館/.test(src), '無排除的人名或廠商名');
// 頁面
const url = process.env.URL || 'http://127.0.0.1:4175/liangxiangrun/';
const {chromium} = await import('./qa-pw.mjs');
const out = '/workspace/fig/liangxiangrun'; fs.mkdirSync(out, {recursive: true});
const br = await chromium.launch({executablePath: process.env.CHROME || '/usr/bin/google-chrome'});
for (const [nm, vp] of [['desktop', {width: 1280, height: 900}], ['mobile', {width: 390, height: 844}]]) {
  const pg = await br.newPage({viewport: vp, deviceScaleFactor: nm === 'mobile' ? 2 : 1});
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto(url + '?d=2026-10-07&t=22:10&lon=-122.68&lat=45.52&g=1', {waitUntil: 'networkidle'});
  await pg.fill('#tz', '-8'); await pg.click('#calc'); await pg.waitForTimeout(300);
  const g = await pg.$$eval('.pillars .gz', es => es.map(e => e.textContent).join(''));
  ok(g === '丙丁乙丁午酉卯亥', `${nm} 頁面排盤（自訂經度、UTC−8）→ ${g}`);
  await pg.goto(url, {waitUntil: 'networkidle'}); await pg.waitForTimeout(300);
  ok(errs.filter(e => !/nav\.js|sites\.json|ERR_|Failed to load resource/.test(e)).length === 0, `${nm} 無頁面錯誤 ${errs.join(' | ')}`);
  for (const t of ['chart', 'yun', 'method', 'bio', 'refs']) {
    await pg.click(`#tabs button[data-t="${t}"]`); await pg.waitForTimeout(150);
    const ov = await pg.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(ov <= 1, `${nm} ${t} 無橫向溢出（${ov}px）`);
    const small = await pg.evaluate(() => [...document.querySelectorAll('.pane.on *')].filter(e => e.childElementCount === 0 && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 11).length);
    ok(small === 0, `${nm} ${t} 字級 ≥ 11px（${small} 處過小）`);
    await pg.screenshot({path: `${out}/${nm}-${t}.png`, fullPage: true});
  }
  await pg.click('#tabs button[data-t="method"]'); await pg.click('a.cite[data-src="S2"]'); await pg.waitForTimeout(200);
  ok(await pg.evaluate(() => document.querySelector('#refs').classList.contains('on') && location.hash === '#src-S2'), `${nm} 引用連結跳到參考資料`);
  await pg.close();
}
await br.close();
console.log(bad ? `\n${bad} 項未通過` : '\n全部通過'); process.exit(bad ? 1 : 0);
