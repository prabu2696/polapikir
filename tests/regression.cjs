const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {jsPDF} = require('../assets/vendor/jspdf.umd.min.js');
require('../assets/vendor/jspdf.plugin.autotable.min.js').applyPlugin(jsPDF);

const root = path.resolve(__dirname,'..');
const context = vm.createContext({window:{},URL,document:{currentScript:{src:'http://localhost/assets/report.js'}}});
vm.runInContext(fs.readFileSync(path.join(root,'assets/instruments.js'),'utf8'),context);
context.window.jspdf = {jsPDF};
vm.runInContext(fs.readFileSync(path.join(root,'assets/report.js'),'utf8'),context);
const registry = context.window.PolaPikirInstruments;
const report = context.window.PolaPikirReport;
const sql = fs.readFileSync(path.join(root,'supabase/schema.sql'),'utf8');
const v4 = sql.slice(sql.indexOf("if new.instrument_version = '2026.09-v4' then",sql.indexOf('for i in')),sql.indexOf("elsif new.participant_type = 'teacher'",sql.indexOf('for i in')));
const inverse = [[9,14],[],[8,15],[14]];
const legacyInverse = [[1,4,7,8,11,12,14,16,17,20],[4,7],[4,8,12],[6,11,14,18]];
const output = path.join(root,'tests/results');
fs.mkdirSync(output,{recursive:true});
let scoringCases = 0;

for(const [index,phase] of [null,'A','B','C'].entries()){
  const type = phase ? 'student':'teacher';
  const instrument = registry.instrument(type,phase);
  const count = [20,10,15,20][index];
  assert.equal(instrument.items.length,count);
  assert.equal(report.itemWeight(type,phase),100/count);
  assert.deepEqual([...new Set(Array.from(instrument.items,item=>item.dimension))].sort(),Array.from(registry.dimensions,item=>item.id).sort());
  assert.deepEqual(Array.from(instrument.items).flatMap((item,i)=>item.reverse ? [i+1]:[]),inverse[index]);
  for(const q of inverse[index]) assert.match(v4,new RegExp(`\\b${q}\\b`));
  for(let q=0;q<count;q++) for(let answer=0;answer<instrument.answers.length;answer++){
    const item = instrument.items[q];
    const expected = item.reverse ? answer : instrument.answers.length-1-answer;
    assert.equal(registry.rawPoint(item,answer,instrument.answers.length),expected);
    assert.equal(report.itemScore(type,phase,q,answer,registry.version),expected);
    assert.equal(report.itemScore(type,phase,q,answer,'2026.09-v3'),legacyInverse[index].includes(q+1) ? answer : instrument.answers.length-1-answer);
    assert.ok(Math.abs(report.itemPoints(type,phase,q,answer,registry.version)-expected/(instrument.answers.length-1)*100/count)<1e-10);
    scoringCases++;
  }
  const focused = instrument.items.map(item => item.dimension === 'growth' ? (item.reverse ? instrument.answers.length-1 : 0) : (item.reverse ? 0 : instrument.answers.length-1));
  assert.deepEqual(Array.from(registry.evaluate(type,phase,focused).leading,item=>item.id),['growth']);
  for(const target of [0,50,100]){
    const answers = instrument.items.map(item => target === 50 ? 1 : target === 100 ? (item.reverse ? instrument.answers.length-1 : 0) : (item.reverse ? 0 : instrument.answers.length-1));
    const result = registry.evaluate(type,phase,answers);
    assert.equal(result.score,Math.round(result.rawScore*100/result.rawMaxScore));
    const points = answers.reduce((sum,answer,q)=>sum+report.itemPoints(type,phase,q,answer,registry.version),0);
    assert.ok(Math.abs(points-result.rawScore*100/result.rawMaxScore)<1e-9);
    assert.equal(result.tendencies.length,6);
    if(target !== 50) assert.equal(result.score,target);
    if(target === 100){
      const data={instrumentVersion:registry.version,participantType:type,participantName:('PESERTA UJI NAMA PANJANG ').repeat(4).slice(0,100),school:('MI CONTOH MADRASAH NAMA PANJANG ').repeat(5).slice(0,150),grade:phase ? index*2:null,phase,score:result.score,rawScore:result.rawScore,rawMaxScore:result.rawMaxScore,category:'Profil enam mindset',createdAt:'2026-09-23T01:00:00Z',answers:instrument.items.map((item,i)=>({number:i+1,question:item.text,dimension:item.dimension,answerIndex:answers[i],answerLabel:instrument.answers[answers[i]]}))};
      const {doc}=report.buildDoc(data);
      assert.ok(doc.internal.getNumberOfPages()>=1);
      assert.equal(report.normalize(data).profile.tendencies.length,6);
      fs.writeFileSync(path.join(output,`report-${phase||'teacher'}.pdf`),Buffer.from(doc.output('arraybuffer')));
    }
  }
}

const contrastPairs=[['#2D2D2D','#F7F5F0',4.5],['#68645D','#F7F5F0',4.5],['#68645D','#FFFDFC',4.5],['#0D3B23','#E9F0EB',4.5],['#FFFFFF','#0D3B23',4.5]];
function luminance(hex){const c=hex.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
for(const [a,b,min] of contrastPairs){const x=luminance(a),y=luminance(b);assert.ok((Math.max(x,y)+.05)/(Math.min(x,y)+.05)>=min);}
const summary={scoringCases,pdfReports:4,counts:[20,10,15,20],dimensions:registry.dimensions.map(item=>item.label)};
fs.writeFileSync(path.join(output,'regression.json'),JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
