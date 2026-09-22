import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const fixtures = process.argv.includes('--fixtures');
const port = fixtures ? 4174 : 4173;
const root = path.resolve(import.meta.dirname, '..');
const source = await readFile(path.join(root,'assets/instruments.js'),'utf8');
const context = {window:{}};
vm.runInNewContext(source,context);
const registry = context.window.PolaPikirInstruments;
const records = [null,'A','B','C'].map((phase,index) => {
  const instrument = registry.instrument(index ? 'student':'teacher',phase);
  const answers = instrument.items.map((item,i) => item.reverse ? instrument.answers.length-1 : 0);
  const result = registry.evaluate(index ? 'student':'teacher',phase,answers);
  return {
  id:`00000000-0000-4000-8000-00000000000${index}`,participant_name:index ? `MURID UJI FASE ${'ABC'[index-1]}` : 'GURU UJI LOKAL',
  school_normalized:'MI CONTOH PENGUJIAN',school_raw:'MI Contoh Pengujian',participant_type:index ? 'student':'teacher',
  grade:index ? index*2:null,phase,score:100,raw_score:result.rawScore,raw_max_score:result.rawMaxScore,max_score:100,
  instrument_version:registry.version,category:'Profil enam mindset',created_at:'2026-09-23T01:00:00Z',
  answers:instrument.items.map((item,i) => ({number:i+1,question:item.text,dimension:item.dimension,answerIndex:answers[i],answerLabel:instrument.answers[answers[i]]}))
};});
let scenario = 'ok';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
http.createServer(async(req,res) => {
  const url = new URL(req.url,`http://127.0.0.1:${port}`);
  const json = (status,data) => {res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  if(fixtures && url.pathname === '/config.js'){
    res.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});
    return res.end(`window.APP_CONFIG={supabaseUrl:'http://127.0.0.1:${port}/test-api',supabaseAnonKey:'local-test-only',adminUsername:'test',adminLoginEmail:'test@example.invalid'};`);
  }
  if(fixtures && url.pathname === '/test-scenario' && req.method === 'POST'){
    scenario = url.searchParams.get('mode') || 'ok'; return json(200,{scenario});
  }
  if(fixtures && url.pathname.startsWith('/test-api/')){
    if(url.pathname.includes('/token')) return json(200,{access_token:'local-fixture-token',expires_in:3600});
    if(url.pathname.includes('/logout')){res.writeHead(204);return res.end();}
    if(scenario === 'error') return json(503,{message:'Local test: service unavailable'});
    if(req.method === 'POST'){res.writeHead(201);return res.end();}
    if(scenario === 'loading') await new Promise(resolve => setTimeout(resolve,4000));
    return json(200,scenario === 'empty' ? [] : records);
  }
  try{
    let file = path.resolve(root,'.' + decodeURIComponent(url.pathname));
    if(!file.startsWith(root+path.sep) && file !== root) return json(403,{error:'Forbidden'});
    if((await stat(file)).isDirectory()) file = path.join(file,'index.html');
    const data = await readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
  }catch{json(404,{error:'Not found'});}
}).listen(port,'127.0.0.1',() => console.log(`Local ${fixtures ? 'fixture test':'preview'} server: http://127.0.0.1:${port}`));
