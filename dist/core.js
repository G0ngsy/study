(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QuizCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCHEMA='concept-cards/v1', KEY='concept-cards:v1', RATINGS=['correct','partial','wrong'];
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
    const v=clone(value);assert(v&&v.schema===SCHEMA,'이 앱에서 내보낸 백업 파일이 아닙니다.');
    assert(Number.isInteger(v.revision)&&v.revision>=0);
    assert(Array.isArray(v.sessions)&&v.sessions.length<=1000);
    const ids=new Set();
    v.sessions.forEach(s=>{
      assert(s&&str(s.id,100)&&!ids.has(s.id));ids.add(s.id);
      assert(date(s.startedAt)&&date(s.updatedAt)&&['active','completed'].includes(s.status));
      assert(Number.isInteger(s.index)&&s.index>=0&&s.index<30);
      assert(Array.isArray(s.items)&&s.items.length===30);
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
    return v;
  }
  function empty(){return {schema:SCHEMA,revision:0,activeSessionId:null,sessions:[]};}
  function sample(bank,n=30,rng=Math.random){
    assert(bank.length>=n,'문제가 30개 이상 필요합니다.');
    assert(new Set(bank.map(q=>q.id)).size===bank.length,'문제 ID가 중복되었습니다.');
    const a=[...bank];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));assert(j>=0&&j<=i);[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,n);
  }
  function createSession(bank,id,now=new Date().toISOString(),rng=Math.random){
    return {id,startedAt:now,updatedAt:now,completedAt:null,status:'active',index:0,items:sample(bank,30,rng).map(q=>({question:clone(question(q)),draft:'',revealed:false,rating:null}))};
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
    return validateState({schema:SCHEMA,revision:a.revision+1,activeSessionId:active,sessions});
  }
  return {SCHEMA,KEY,RATINGS,clone,question,empty,validateState,sample,createSession,grade,counts,mergeStates};
});
