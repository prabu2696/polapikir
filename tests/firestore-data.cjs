const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const context = vm.createContext({window:{}});
for(const file of ['instruments.js', 'submission.js']) vm.runInContext(fs.readFileSync(`assets/${file}`, 'utf8'), context);
const {PolaPikirInstruments:r, PolaPikirSubmission:s} = context.window;
let cases = 0;
for(const [type, grade, phase] of [['teacher',null,null], ['student',1,'A'], ['student',3,'B'], ['student',5,'C']]){
  const instrument = r.instrument(type, phase);
  for(const high of [false, true]){
    const answers = instrument.items.map(item => (item.reverse === high ? instrument.answers.length - 1 : 0));
    const data = {instrument_version:r.version, participant_type:type, grade, phase, school_raw:'Madrasah Ibtidaiyah Al-Falah', answers, created_at:'2026-09-23T00:00:00Z', score:999};
    const row = s.fromDocument('test', data);
    assert.equal(row.score, high ? 100 : 0);
    assert.equal(row.answers.length, instrument.items.length);
    assert.equal(row.answers[0].question, instrument.items[0].text);
    assert.equal(row.school_normalized, 'MI ALFALAH');
    assert.throws(() => s.fromDocument('bad', {...data, answers:answers.slice(1)}));
    assert.throws(() => s.fromDocument('bad', {...data, answers:answers.map(() => 9)}));
    assert.throws(() => s.fromDocument('bad', {...data, instrument_version:'unknown'}));
    cases++;
  }
}
console.log(`${cases} document cases passed; invalid answers/version rejected; forged scores ignored.`);
