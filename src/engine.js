// 排盤：只呼叫共用模組 mingpan-facts（與各站同一份事實檔）。
import {computeFacts, SCHEMA_VERSION} from '../../shared/mingpan-facts/facts.mjs';
export {SCHEMA_VERSION};
/**
 * f: {date:'YYYY-MM-DD', time:'HH:MM', gender:'1'|'0', lon, lat, zone|null, tzHours, mode:'clock'|'solar', name}
 * 出生時間視為地方平時，照輸入使用；節氣換成出生地地方平時比較；東經 70° 以西日柱干支進一位（日期不動）；0:00 換日。
 * 以上皆為 mingpan-facts 預設口徑，本站不另做換算或比對。
 */
export function chart(f) {
  const birth = {date: f.date, time: f.time};
  if (f.zone) birth.zone = f.zone; else birth.utcOffsetMinutes = Math.round(f.tzHours * 60);
  const y = +f.date.slice(0, 4);
  return computeFacts({
    birth,
    place: {name: f.place || '', longitude: f.lon, latitude: f.lat},
    gender: f.gender === '0' ? 'female' : 'male',
    options: {timeConvention: f.mode === 'solar' ? 'trueSolar' : 'clock', yearFrom: y, yearTo: y + 100},
  });
}
