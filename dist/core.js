(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QuizCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCHEMA='concept-cards/v3', KEY='concept-cards:v1', RATINGS=['correct','partial','wrong'];
  const clone=x=>JSON.parse(JSON.stringify(x));
  function assert(ok,message){if(!ok)throw new Error(message||'기록 형식이 올바르지 않습니다.');}
  function str(v,max=30000){return typeof v==='string'&&v.length<=max;}
  function date(v){return str(v,40)&&Number.isFinite(Date.parse(v));}
  function question(q){
    assert(q&&str(q.id,100)&&q.id.length>0&&Number.isInteger(q.version)&&q.version>0);
    for(const k of ['category','prompt','answer','explanation'])assert(str(q[k])&&q[k].length>0);
    assert(Array.isArray(q.keywords)&&q.keywords.length>0&&q.keywords.length<40&&q.keywords.every(x=>str(x,200)));
    assert(Array.isArray(q.sources)&&q.sources.length>0&&q.sources.length<15);
    q.sources.forEach(s=>assert(s&&str(s.name,300)&&Number.isInteger(s.page)&&s.page>0));
    assert(Array.isArray(q.badges)&&q.badges.length<=3);
    q.badges.forEach(b=>assert(b&&['핵심','기출','빈출'].includes(b.label)&&str(b.reason,1000)&&b.reason.length>0));
    return q;
  }
  function validateState(value){
    const v=clone(value);assert(v&&[SCHEMA,'concept-cards/v2','concept-cards/v1'].includes(v.schema),'이 앱에서 내보낸 백업 파일이 아닙니다.');
    const legacy=v.schema==='concept-cards/v1';
    assert(Number.isInteger(v.revision)&&v.revision>=0);
    assert(Array.isArray(v.sessions)&&v.sessions.length<=1000);
    const ids=new Set();
    v.sessions.forEach(s=>{
      assert(s&&str(s.id,100)&&!ids.has(s.id));ids.add(s.id);
      assert(date(s.startedAt)&&date(s.updatedAt)&&['active','completed'].includes(s.status));
      if(legacy){s.mode='random';s.bundle=null;}
      assert(['random','bundle','part-random'].includes(s.mode));
      assert(Array.isArray(s.items)&&(s.mode==='random'?s.items.length===30:s.items.length>=1&&s.items.length<=(s.mode==='part-random'?10:5)));
      if(s.mode==='part-random')assert(str(s.part,100)&&s.part.length>0);
      assert(Number.isInteger(s.index)&&s.index>=0&&s.index<s.items.length);
      if(s.mode==='bundle'){
        const b=s.bundle;assert(b&&str(b.id,100)&&b.id.length>0&&Number.isInteger(b.version)&&b.version>0&&str(b.category,100)&&str(b.title,200));
        assert(Array.isArray(b.questionIds)&&b.questionIds.length===s.items.length&&new Set(b.questionIds).size===b.questionIds.length);
        assert(b.questionIds.every(id=>str(id,100)&&s.items.some(a=>a.question?.id===id)));
      }else assert(s.bundle===null);
      const qids=new Set();s.items.forEach(a=>{
        assert(a&&a.question);question(a.question);assert(!qids.has(a.question.id));qids.add(a.question.id);
        assert(str(a.draft,20000)&&typeof a.revealed==='boolean'&&(a.rating===null||RATINGS.includes(a.rating)));
        assert(a.rating===null||a.revealed);
      });
      const done=s.items.every(a=>a.rating!==null);
      assert((s.status==='completed')===done);
      assert(s.status!=='completed'||date(s.completedAt));
    });
    assert(v.activeSessionId===null||(str(v.activeSessionId,100)&&v.sessions.some(s=>s.id===v.activeSessionId&&s.status==='active')));
    if(legacy)v.learning={read:[],cursor:null};
    assert(v.learning&&Array.isArray(v.learning.read)&&v.learning.read.length<=5000);
    const readIds=new Set();v.learning.read.forEach(r=>{assert(r&&str(r.id,100)&&r.id.length>0&&!readIds.has(r.id)&&date(r.at));readIds.add(r.id);});
    const p=v.learning.cursor;assert(p===null||(p&&str(p.bundleId,100)&&str(p.questionId,100)&&date(p.at)));
    v.schema=SCHEMA;return v;
  }
  function empty(){return {schema:SCHEMA,revision:0,activeSessionId:null,sessions:[],learning:{read:[],cursor:null}};}
  function sample(bank,n=30,rng=Math.random){
    assert(Number.isInteger(n)&&n>0&&bank.length>=n,'출제할 문제가 충분하지 않습니다.');
    assert(new Set(bank.map(q=>q.id)).size===bank.length,'문제 ID가 중복되었습니다.');
    const a=[...bank];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));assert(j>=0&&j<=i);[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,n);
  }
  function createSession(bank,id,now=new Date().toISOString(),rng=Math.random){
    return {id,mode:'random',bundle:null,startedAt:now,updatedAt:now,completedAt:null,status:'active',index:0,items:sample(bank,30,rng).map(q=>({question:clone(question(q)),draft:'',revealed:false,rating:null}))};
  }
  function createBundleSession(bank,bundle,id,now=new Date().toISOString(),rng=Math.random){
    assert(bundle.questionIds.length>=1&&bundle.questionIds.length<=5);
    const selected=bundle.questionIds.map(id=>bank.find(q=>q.id===id));assert(selected.every(Boolean));
    return {id,mode:'bundle',bundle:clone(bundle),startedAt:now,updatedAt:now,completedAt:null,status:'active',index:0,items:sample(selected,selected.length,rng).map(q=>({question:clone(question(q)),draft:'',revealed:false,rating:null}))};
  }
  function createPartSession(bank,part,id,now=new Date().toISOString(),rng=Math.random){
    assert(str(part,100)&&part.length>0);
    return {id,mode:'part-random',part,bundle:null,startedAt:now,updatedAt:now,completedAt:null,status:'active',index:0,items:sample(bank,Math.min(10,bank.length),rng).map(q=>({question:clone(question(q)),draft:'',revealed:false,rating:null}))};
  }
  function grade(s,index,rating,now=new Date().toISOString()){
    assert(RATINGS.includes(rating)&&s.items[index]?.revealed,'답을 확인한 뒤 평가해 주세요.');
    s.items[index].rating=rating;s.updatedAt=now;
    if(s.items.every(x=>x.rating)){s.status='completed';s.completedAt=now;}
    return s;
  }
  function counts(s){return s.items.reduce((r,x)=>{r[x.rating||'ungraded']++;return r;},{correct:0,partial:0,wrong:0,ungraded:0});}
  function mergeStates(current,incoming){
    const a=validateState(current),b=validateState(incoming),map=new Map(a.sessions.map(s=>[s.id,s]));
    b.sessions.forEach(s=>{const old=map.get(s.id);if(!old||Date.parse(s.updatedAt)>Date.parse(old.updatedAt))map.set(s.id,s);});
    const sessions=[...map.values()].sort((x,y)=>Date.parse(y.startedAt)-Date.parse(x.startedAt));
    let active=a.activeSessionId||b.activeSessionId;
    if(!sessions.some(s=>s.id===active&&s.status==='active'))active=null;
    const read=new Map(a.learning.read.map(r=>[r.id,r]));b.learning.read.forEach(r=>{if(!read.has(r.id)||Date.parse(r.at)>Date.parse(read.get(r.id).at))read.set(r.id,r);});
    const cursors=[a.learning.cursor,b.learning.cursor].filter(Boolean).sort((x,y)=>Date.parse(y.at)-Date.parse(x.at));
    return validateState({schema:SCHEMA,revision:a.revision+1,activeSessionId:active,sessions,learning:{read:[...read.values()],cursor:cursors[0]||null}});
  }
  return {SCHEMA,KEY,RATINGS,clone,question,empty,validateState,sample,createSession,createBundleSession,createPartSession,grade,counts,mergeStates};
});
