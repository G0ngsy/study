const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const C=require('../dist/core.js');
let disk=null,serial=0;
const app={innerHTML:'',addEventListener(){}};
const context={console,Intl,Date,Math,JSON,Map,Set,QuizCore:C,navigator:{},crypto:{randomUUID:()=>`test-${++serial}`},confirm:()=>true,setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>disk,setItem:(k,v)=>{disk=v}},document:{getElementById:()=>app,querySelectorAll:()=>[],addEventListener(){}}};
context.window=context;context.addEventListener=()=>{};context.scrollTo=()=>{};context.matchMedia=()=>({matches:true});
vm.createContext(context);
for(const file of ['bank.js','learn-data.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context);
let source=fs.readFileSync('dist/app.js','utf8').replace(/render\(\);\s*\}\)\(\);\s*$/,`window.T={startPart,partReady,partPending,history,sessionLabel,bundleResultActions,questionForConcept,partPractice,set:x=>{state=x},get:()=>state,filters:(p,m,f)=>{historyPart=p;historyMode=m;filter=f;recordId='all'}};render();})();`);
vm.runInContext(source,context);
const T=context.T,B=context.LEARNING_BUNDLES,bank=context.QUIZ_BANK;
function completed(b,id){const s=C.createBundleSession(bank,b,id);s.items.forEach((a,i)=>{a.revealed=true;C.grade(s,i,'correct')});return s;}
for(const category of new Set(B.map(b=>b.category))){
 disk=null;T.set(C.empty());assert.equal(T.partReady(category),false);T.startPart(category);assert.equal(T.get().sessions.length,0);
 const state=C.empty();state.sessions=B.filter(b=>b.category===category).map((b,i)=>completed(b,'b'+i));T.set(state);assert.equal(T.partReady(category),true);
 T.startPart(category);let s=T.get().sessions[0];const ids=B.filter(b=>b.category===category).flatMap(b=>b.questionIds);
 assert.equal(s.mode,'part-random');assert.equal(s.items.length,Math.min(10,ids.length));assert.equal(new Set(s.items.map(a=>a.question.id)).size,s.items.length);
 s.items.forEach(a=>assert(ids.includes(a.question.id)));
 s.items[0].draft='보존할 답';s.index=1;const count=T.get().sessions.length;T.startPart(category);s=T.get().sessions[0];assert.equal(s.items[0].draft,'보존할 답');assert.equal(s.index,1);assert.equal(T.get().sessions.length,count);
 s.items.forEach((a,i)=>{a.revealed=true;C.grade(s,i,'correct')});T.get().activeSessionId=null;
 assert(T.bundleResultActions(s).includes('다른 랜덤'));T.startPart(category);assert.equal(T.get().sessions.length,count+1);assert.equal(T.partReady(category),true);
 const restored=C.validateState(JSON.parse(JSON.stringify(T.get())));assert.equal(restored.sessions[0].part,category);
}
disk=null;const state=C.empty();const random=C.createSession(bank,'mixed');random.items.forEach((a,i)=>{a.revealed=true;C.grade(random,i,i%2?'wrong':'correct')});state.sessions=[random];T.set(state);
const part=B.find(b=>b.questionIds.includes(random.items[0].question.id)).category;
T.filters(part,'random','all');const html=T.history();
const expected=random.items.filter(a=>B.some(b=>b.category===part&&b.questionIds.includes(a.question.id))).length;
assert(html.includes(expected+'개의 풀이 기록'));assert(html.includes('전체 랜덤'));T.filters(part,'part-random','all');assert(T.history().includes('0개의 풀이 기록'));
const legacy=JSON.parse(JSON.stringify(state));legacy.schema='concept-cards/v2';assert.equal(C.validateState(legacy).schema,C.SCHEMA);
const invalid=C.createPartSession(bank.slice(0,5),'파트','invalid');invalid.items.push(...invalid.items);invalid.items.push(invalid.items[0]);const bad=C.empty();bad.sessions=[invalid];assert.throws(()=>C.validateState(bad));
console.log('PASS: 9 part gates, capped unique samples, resume, repeat, backup, mixed-history filters, v2 compatibility, invalid backup rejection');
