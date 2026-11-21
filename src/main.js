import {chart as compute, SCHEMA_VERSION} from './engine.js';
import {natal, dayunRows, liunian, liuyue, ganWx, zhiWx} from './liang.js';
import {METHOD, BIO} from './content.js';
import {SOURCES} from './sources.js';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const r=(...ids)=>ids.map(i=>`<a class="cite" href="#src-${i}" data-src="${i}">[${i}]</a>`).join('');
const CITIES=[['— 自訂 —'],['台北',121.56,25.03,8,'Asia/Taipei'],['新北',121.46,25.01,8,'Asia/Taipei'],['桃園',121.30,24.99,8,'Asia/Taipei'],['新竹',120.97,24.80,8,'Asia/Taipei'],['台中',120.68,24.14,8,'Asia/Taipei'],['台南',120.21,22.99,8,'Asia/Taipei'],['高雄',120.31,22.63,8,'Asia/Taipei'],['花蓮',121.60,23.99,8,'Asia/Taipei'],['台東',121.15,22.76,8,'Asia/Taipei'],['宜蘭',121.75,24.76,8,'Asia/Taipei'],['香港',114.17,22.32,8,'Asia/Hong_Kong'],['北京',116.40,39.90,8,'Asia/Shanghai'],['上海',121.47,31.23,8,'Asia/Shanghai'],['成都',104.07,30.67,8,'Asia/Shanghai'],['烏魯木齊',87.62,43.82,8,'Asia/Shanghai'],['新加坡',103.82,1.35,8,'Asia/Singapore'],['東京',139.69,35.68,9,'Asia/Tokyo'],['新德里',77.21,28.61,5.5,'Asia/Kolkata'],['倫敦',-0.13,51.51,0,'Europe/London'],['巴黎',2.35,48.86,1,'Europe/Paris'],['紐約',-74.01,40.71,-5,'America/New_York'],['波特蘭',-122.68,45.52,-8,'America/Los_Angeles'],['洛杉磯',-118.24,34.05,-8,'America/Los_Angeles'],['雪梨',151.21,-33.87,10,'Australia/Sydney']];
$('#city').innerHTML=CITIES.map((c,i)=>`<option value="${i}"${i===1?' selected':''}>${c[0]}</option>`).join('');
$('#city').onchange=e=>{const c=CITIES[e.target.value];if(c.length>1){$('#lon').value=c[1];$('#lat').value=c[2];$('#tz').value=c[3];}};
$('#year').value=new Date().getFullYear();
function readForm(){const ci=CITIES[+$('#city').value];return {name:$('#name').value.trim()||'命主',date:$('#date').value,time:$('#time').value,gender:$('#gender').value,lon:+$('#lon').value,lat:+$('#lat').value,tzHours:+$('#tz').value,zone:ci?.[4]||null,place:ci?.length>1?ci[0]:'自訂',mode:$('#timeMode').value};}
function check(f){
  if(!/^\d{4}-\d\d-\d\d$/.test(f.date)||!/^\d\d:\d\d$/.test(f.time))throw new Error('請輸入完整出生日期、時間');
  if(+f.date.slice(0,4)<1900||+f.date.slice(0,4)>2100)throw new Error('出生年份請在 1900～2100 之間');
  if(!$('#lon').value||f.lon < -180||f.lon>180||!Number.isFinite(f.lon))throw new Error('經度須在 -180～180 之間');
  if(!$('#lat').value||f.lat < -90||f.lat>90||!Number.isFinite(f.lat))throw new Error('緯度須在 -90～90 之間');
  if(!Number.isFinite(f.tzHours)||f.tzHours < -14||f.tzHours >14)throw new Error('UTC 時差須在 -14～14 之間');
  if(!(+$('#year').value>=1900&&+$('#year').value<=2100))throw new Error('流年請在 1900～2100 之間');
}
function tab(t){document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));document.querySelectorAll('.pane').forEach(p=>p.classList.toggle('on',p.id===t));}
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>tab(b.dataset.t));
const wx=(s,w)=>`<span class="w-${w}">${esc(s)}</span>`;
const notes=ns=>ns.length?ns.map(n=>`<span class="n ${n.c}">${esc(n.t)}</span>`).join(''):'—';
const line=(title,html)=>`<div class="card"><h2>${title}</h2>${html}</div>`;
let facts=null, form=null;
function drawChart(f,x){
  const n=natal(x), P=['year','month','day','hour'].map(k=>x.pillars[k]);
  const row=(h,ds,cls='')=>`<div class="h">${h}</div>${ds.map(d=>`<div class="${cls}">${d}</div>`).join('')}`;
  const ph=row('四柱',P.map(p=>p.label),'h')+row('天干',P.map(p=>wx(p.stem,p.stemElement)),'gz')+row('十神',P.map(p=>esc(p.stemGod)))+row('地支',P.map(p=>wx(p.branch,p.branchElement)),'gz')+row('藏干',P.map(p=>p.hiddenStems.map(h=>`${wx(h.stem,h.element)}<small>${h.god}</small>`).join('')))+row('納音',P.map(p=>esc(p.nayin)));
  $('#chart').innerHTML=line('命盤',`<p><b>${esc(f.name)}</b>　${n.male?'乾造':'坤造'}　${esc(f.date)} ${esc(f.time)}　${esc(f.place)}</p><div class="pillars">${ph}</div>
  <div class="kv"><div><b>日主</b>${n.dm}${x.dayMasterElement}</div><div><b>月令</b>${n.mz}</div><div><b>格局</b>${esc(n.pattern)}</div><div><b>起運</b>${x.fortune.forward?'順行':'逆行'}　${esc(x.fortune.startText)}</div></div>
  <p class="muted">地方平時節氣：前節 ${esc(x.time.prevJie?.name)} ${esc(x.time.prevJie?.lmt)}；後節 ${esc(x.time.nextJie?.name)} ${esc(x.time.nextJie?.lmt)}。${f.lon<70?'東經 70° 以西日柱干支進一位（日期不動）。':''}排盤口徑：${f.mode==='solar'?'真太陽時（只影響日、時柱；年、月與起運仍以地方平時）':'地方平時（出生時間照輸入使用，不另換算）'}。${esc((x.time.warnings||[]).join('；'))}</p>`)
  +line('原局檢索：依梁氏論命次第',`<p class="muted">次第依網路整理稿${r('S16')}，來源待核；規則與文字為本站整理，未經原書逐條核對。部分盤面事實（格局、旺衰、神煞等）沿用共用引擎，不等同梁氏完整判斷。</p><ol class="steps">${n.steps.map(s=>`<li class="${s.hit?'hit':''}"><span class="k">${esc(s.k)}</span>${esc(s.t)}</li>`).join('')}</ol>`)
  +line('十神定位與分限',`<p class="muted">年約 1–15 歲、月約 16–30 歲、日約 31–45 歲、時約 46 歲以後${r('S15')}（來源待核）。此處依十神先談其象，吉凶仍須看格局、調候的喜忌。</p><div class="scroll"><table class="t"><tr><th>柱</th><th>干支</th><th>分限</th><th>十神定位</th></tr>${n.fen.map(z=>`<tr><td>${z.pillar}</td><td>${z.gz}</td><td>${z.age}</td><td>${z.note}</td></tr>`).join('')}</table></div>`)
  +line('六親星',`<table class="t"><tr><th>六親</th><th>星</th><th>原局所見</th></tr>${n.liuqin.map(row=>`<tr>${row.map(a=>`<td>${esc(a)}</td>`).join('')}</tr>`).join('')}</table><p class="muted">子女依本站採用的規則：食神、傷官以天干陰陽分子女，陽干為子、陰干為女（不是以食神、傷官區分）；只列星，不推子女人數。</p>`)
  +line('神煞參考',`<p>${n.stars.length?n.stars.map(s=>`${s.pillar}：${esc(s.name)}`).join('；'):'無'}</p><p class="muted">依共用引擎列示；梁氏主張嚴謹研究，不照名稱直接斷吉凶${r('S13','S14')}。</p>`);
}
function drawYun(x,year){
  const ds=dayunRows(x), ln=liunian(x,year), ms=liuyue(x,year);
  $('#yun').innerHTML=line('大運',`<p>順逆：${x.fortune.forward?'順行':'逆行'}。起運：${esc(x.fortune.startTradLocal)}（傳統日曆加法）；天體時差 ×120：${esc(x.fortune.startX120Local)}。本站大運區間依傳統起運年份標示。</p>
  <p class="muted">以金不換大運「先四時、次日主、平衡點在大運」為主線${r('S12')}；下表檢索運干十神的格局喜忌、調候字、雙沖伏吟與敗亡墓庫。敗亡、墓庫規則依網路整理稿${r('S16')}，來源待核。尚不是完整《金不換》逐條判斷。</p>
  <div class="scroll"><table class="t yun"><tr><th>起運年</th><th>起運歲</th><th>大運</th><th>干／支十神</th><th>檢索</th></tr>${ds.map((d,i)=>`<tr class="${ln.dayun===d.ganZhi?'cur':''}"><td>${d.startTradLocal.slice(0,4)}–${(ds[i+1]?+ds[i+1].startTradLocal.slice(0,4):+d.startTradLocal.slice(0,4)+10)-1}</td><td>${d.startAge}</td><td>${wx(d.stem,ganWx(d.stem))}${wx(d.branch,zhiWx(d.branch))}</td><td>${d.sg}／${d.bg}</td><td>${notes(d.notes)}</td></tr>`).join('')}</table></div>`)
  +line(`${year} 年流年：${ln.gz}`,`<p>以立春起算之${ln.gz}年；當年大運按起運年份粗定為<b>${ln.dayun||'尚未起運'}</b>（交運年應再依起運日分前後）。流年干${ln.gz[0]}為${ln.sg}，支${ln.gz[1]}本氣為${ln.bg}。</p><p>${ln.line}</p><p>${notes(ln.notes)}</p><p class="muted">歲運入命之意依網路整理稿${r('S16')}（來源待核）；刑沖合會只是盤面關係，不直接等同事件吉凶。應再對照調候、格局與被沖合之十神。四項推理的架構見${r('S9')}。</p>`)
  +line(`${year} 年流月`, `<p class="muted">月份以節氣起算：寅月自立春、卯月自驚蟄……丑月自次年小寒。下表先做歲運刑沖合會的檢索，不下確定事件判斷。</p><div class="scroll"><table class="t"><tr><th>起節</th><th>月柱</th><th>干／支十神</th><th>關係</th></tr>${ms.map(m=>`<tr><td>${m.jie}</td><td>${m.gz}</td><td>${m.sg}／${m.bg}</td><td>${m.notes.length?m.notes.join('、'):'—'}</td></tr>`).join('')}</table></div>`)
  +line('前後五年提要',`<div class="scroll"><table class="t"><tr><th>流年</th><th>大運</th><th>干十神</th><th>關係</th></tr>${Array.from({length:11},(_,i)=>liunian(x,year-5+i)).map(z=>`<tr class="${z.year===year?'cur':''}"><td>${z.year} ${z.gz}</td><td>${z.dayun||'—'}</td><td>${z.sg}</td><td>${notes(z.notes)}</td></tr>`).join('')}</table></div>`);
}
function calc(){try{form=readForm();check(form);facts=compute(form);drawChart(form,facts);drawYun(facts,+$('#year').value);$('#note').textContent=`排盤完成（mingpan-facts ${SCHEMA_VERSION}）。資料只在瀏覽器內計算，不會上傳；本站不儲存姓名、生辰。`;window.__chartFacts=facts;}catch(e){$('#note').textContent=e.message;console.error(e);}}
$('#calc').onclick=()=>{calc();tab('chart');};
$('#year').addEventListener('change',()=>{const y=+$('#year').value;if(facts&&y>=1900&&y<=2100)drawYun(facts,y);});
$('#method').innerHTML=line('梁湘潤論法整理',`<p>本站依公開書目、序言、書籍介紹與研究文章整理，以自己的文字寫成。原書未讀到的細則不冒充已驗證；網路整理稿標「來源待核」。</p><div class="toc">${METHOD.map(m=>`<a href="#${m.id}">${m.h.split('：')[0]}</a>`).join('')}</div>`)+METHOD.map(m=>`<article class="card" id="${m.id}"><h2>${m.h}</h2>${m.html}</article>`).join('');
$('#bio').innerHTML=line('梁湘潤：生平與著作',BIO);
$('#refs').innerHTML=line('參考資料與依據',`<p>本站論斷文字為原創白話。現代著作只摘要方法，不提供或連結任何未授權全文下載；古籍可短引，均註明出處。查閱日期：2026-11-21（台北時間）。</p><p>排盤由共用模組 <b>mingpan-facts ${SCHEMA_VERSION}</b> 計算；節氣表採 JPL DE421。論斷層與排盤層分開，梁氏論法的歸納並不改寫排盤。</p>
  <ul>${SOURCES.map(s=>`<li id="src-${s.id}"><b>[${s.id}] ${esc(s.t)}</b> <span class="tag ${s.kind==='網路整理稿'?'q':'u'}">${esc(s.kind)}</span><br><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.u)}</a><br><span class="muted">${esc(s.n)}</span></li>`).join('')}</ul>`);
document.addEventListener('click',e=>{const a=e.target.closest('a[data-src]');if(a){e.preventDefault();tab('refs');const id='src-'+a.dataset.src;history.replaceState(null,'','#'+id);requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'center'}));}});
// 可分享的排盤參數（不記錄到伺服器或 localStorage）
{const q=new URLSearchParams(location.search);for(const [p,id] of [['d','date'],['t','time'],['g','gender'],['n','name'],['lon','lon'],['lat','lat'],['y','year']])if(q.has(p))$('#'+id).value=q.get(p);if(q.get('tm')==='solar')$('#timeMode').value='solar';if(q.has('lon'))$('#city').value='0';}
calc();
if(location.hash.startsWith('#src-'))tab('refs');
