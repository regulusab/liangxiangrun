// 以 /workspace/shared/mingpan-facts/facts.mjs 排盤（不修改該模組）。
// 打包時把它的 Node 專用行（fs/path/url/module、createRequire、CLI 判斷）換成瀏覽器可用的寫法。
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
const ROOT = dirname(fileURLToPath(import.meta.url));
const FACTS = resolve(ROOT, '../shared/mingpan-facts/facts.mjs');
const RULES = [
  [/^import\s*\{\s*readFileSync\s*\}\s*from\s*'node:fs';?\s*$/m, "const readFileSync=()=>{throw new Error('瀏覽器不支援讀檔');};"],
  [/^import\s*\{\s*resolve\s*\}\s*from\s*'node:path';?\s*$/m, 'const resolve=p=>p;'],
  [/^import\s*\{\s*pathToFileURL\s*\}\s*from\s*'node:url';?\s*$/m, 'const pathToFileURL=p=>({href:String(p)});'],
  [/^import\s*\{\s*createRequire\s*\}\s*from\s*'node:module';?\s*$/m, ''],
  [/^\s*const require\s*=\s*createRequire\(.*\);?\s*$/m, ''],
  [/^\s*const tzlookup\s*=\s*require\('tz-lookup'\);?\s*$/m, "import tzlookup from 'tz-lookup';"],
  [/^const isCli\s*=.*$/m, 'const isCli = false;'],
];
const factsBrowser = {
  name: 'mingpan-facts-browser',
  enforce: 'pre',
  transform(code, id) {
    if (id.split('?')[0] !== FACTS) return null;
    let s = code;
    for (const [re, to] of RULES) {
      if (!re.test(s)) throw new Error('mingpan-facts 打包修補失敗（模組可能已改版）：' + re);
      s = s.replace(re, to);
    }
    return {code: s, map: null};
  },
};
export default {
  base: '/liangxiangrun/',
  plugins: [factsBrowser],
  resolve: {alias: {'tz-lookup': resolve(ROOT, 'node_modules/tz-lookup/tz.js'), 'lunar-javascript': resolve(ROOT, 'node_modules/lunar-javascript/index.js')}},
  build: {target: ['es2017', 'safari12']},
  server: {allowedHosts: true, fs: {allow: ['/workspace']}},
  preview: {allowedHosts: true},
};
