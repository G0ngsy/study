(()=>{
'use strict';
const C=QuizCore,BANK=window.QUIZ_BANK,app=document.getElementById('app');
const NOTES=window.LEARNING_NOTES,BUNDLES=window.LEARNING_BUNDLES;
const labels={correct:'정답',partial:'부분정답',wrong:'오답',ungraded:'미평가'};
const SQL_BUNDLE_ID='sql-spelling';
const SQL_SPELLING=[
 ['CREATE','테이블 등 데이터베이스 객체를 새로 만드는 SQL 명령어를 영어로 쓰세요.','새 객체의 구조를 정의하는 DDL 명령어예요.','sql-language'],
 ['ALTER','기존 테이블의 구조를 변경하는 SQL 명령어를 영어로 쓰세요.','기존 객체의 정의를 변경하는 DDL 명령어예요.','sql-language'],
 ['DROP','테이블 등 데이터베이스 객체 자체를 삭제하는 SQL 명령어를 영어로 쓰세요.','행만 지우는 DELETE와 구분하세요.','sql-delete'],
 ['SELECT','테이블의 데이터를 조회하는 SQL 명령어를 영어로 쓰세요.','조회에 사용하는 DML 명령어예요.','sql-language'],
 ['INSERT','테이블에 새 행을 추가하는 SQL 명령어를 영어로 쓰세요.','새 데이터를 넣는 DML 명령어예요.','sql-language'],
 ['UPDATE','기존 행의 값을 수정하는 SQL 명령어를 영어로 쓰세요.','기존 데이터를 변경하는 DML 명령어예요.','sql-language'],
 ['DELETE','테이블의 행을 삭제하는 SQL 명령어를 영어로 쓰세요.','테이블의 구조는 남는 DML 명령어예요.','sql-delete'],
 ['GRANT','사용자에게 데이터베이스 권한을 부여하는 SQL 명령어를 영어로 쓰세요.','권한을 주는 DCL 명령어예요.','sql-language'],
 ['REVOKE','사용자에게 부여한 데이터베이스 권한을 회수하는 SQL 명령어를 영어로 쓰세요.','부여한 권한을 거두는 DCL 명령어예요.','sql-language'],
 ['COMMIT','트랜잭션의 변경을 확정하는 SQL 명령어를 영어로 쓰세요.','트랜잭션을 확정해 변경 사항을 반영해요.','sql-language'],
 ['ROLLBACK','트랜잭션의 변경을 취소하는 SQL 명령어를 영어로 쓰세요.','트랜잭션을 되돌리는 명령어예요.','sql-language'],
 ['WHERE','그룹화 전에 개별 행에 조건을 거는 SQL 키워드를 영어로 쓰세요.','개별 행을 먼저 걸러요.','sql-having'],
 ['GROUP BY','같은 값의 행을 그룹으로 묶는 SQL 절을 영어로 쓰세요.','집계할 그룹을 만들 때 사용해요.','sql-having'],
 ['HAVING','집계한 그룹에 조건을 거는 SQL 키워드를 영어로 쓰세요.','GROUP BY로 만든 그룹을 걸러요.','sql-having'],
 ['DISTINCT','조회 결과의 중복을 제거하는 SQL 키워드를 영어로 쓰세요.','선택한 열 조합의 중복을 제거해요.','sql-distinct']
].map(([answer,prompt,explanation,sourceId])=>({
 id:'sql-spell-'+answer.toLowerCase().replaceAll(' ','-'),version:1,
 category:'SQL 영문 쓰기',prompt,answer,keywords:[answer],explanation,
 sources:BANK.find(q=>q.id===sourceId).sources,badges:[]
}));
const isSqlSpelling=q=>q?.id?.startsWith('sql-spell-');

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state=C.empty(),page='home',filter='all',recordId='all',notice='',blocked=false,toastTimer,lessonId=null,conceptIndex=0,returnToQuiz=false,installPrompt=null;
try{const raw=localStorage.getItem(C.KEY);if(raw)state=C.validateState(JSON.parse(raw));}catch{notice='저장된 기록을 읽을 수 없습니다. 원본을 보존하고 있습니다. 백업 · 복원에서 기록을 복구하세요.';blocked=true;}
function toast(message){const t=document.getElementById('toast');t.textContent=message;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.hidden=true,4500);}
function active(){return state.sessions.find(s=>s.id===state.activeSessionId&&s.status==='active');}
function stamp(s){s.updatedAt=new Date().toISOString();}
function persist(next=state,{restore=false}={}){
  if(blocked&&!restore){toast('기록을 먼저 복구해 주세요.');return false;}
  try{
    const disk=localStorage.getItem(C.KEY);
    if(disk&&!restore){const existing=JSON.parse(disk);if(existing.revision!==state.revision){blocked=true;notice='다른 탭에서 기록이 변경되었습니다. 새로고침해 최신 기록을 불러오세요. 현재 입력은 백업할 수 있습니다.';render();return false;}}
    const candidate=C.validateState({...next,revision:state.revision+1});localStorage.setItem(C.KEY,JSON.stringify(candidate));state=candidate;notice='';blocked=false;return true;
  }catch{notice='기기에 저장하지 못했습니다. 저장 공간 또는 브라우저 설정을 확인하고 지금 기록을 백업하세요. 이 창을 닫으면 최근 입력이 사라질 수 있습니다.';return false;}
}
function fmt(value){return new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value));}
function badges(q){return q.badges.map(b=>`<span class="badge" title="${esc(b.reason)}">★ ${esc(b.label)}</span>`).join('');}
function sources(q){return `<details class="sources"><summary>출처${q.badges.length?' · 별표 근거':''}</summary>${q.badges.map(b=>`<p><strong>★ ${esc(b.label)}</strong> ${esc(b.reason)}</p>`).join('')}<ul>${q.sources.map(s=>`<li>${esc(s.name)} · PDF ${s.page}쪽</li>`).join('')}</ul><small>페이지는 PDF 뷰어의 페이지 번호 기준입니다. 학습용으로 재구성한 문제입니다.</small></details>`;}
function stats(s){const c=C.counts(s);return `<div class="score-row">${['correct','partial','wrong'].map(k=>`<div class="score ${k}"><strong>${c[k]}</strong><span>${labels[k]}</span></div>`).join('')}</div>`;}
function sessionLabel(s){return s.mode==='bundle'?s.bundle.category+' · '+s.bundle.title:'전체 랜덤 30문제';}
function lesson(){return BUNDLES.find(b=>b.id===lessonId);}
function completed(b){return state.sessions.some(s=>s.mode==='bundle'&&s.bundle.id===b.id&&s.bundle.version===b.version&&s.status==='completed');}
function isRead(id){return state.learning.read.some(r=>r.id===id);}
function installPanel(){
 if(window.matchMedia('(display-mode: standalone)').matches)return '';
 return `<aside class="install-panel"><div><strong>휴대폰 홈 화면에 설치</strong><p>한 번 설치하면 인터넷이 없어도 학습할 수 있어요. PC 기록은 백업 · 복원으로 옮겨 주세요.</p></div><button class="secondary" data-action="install-app">${installPrompt?'앱 설치':'설치 방법 보기'}</button></aside>`;
}
function home(){
 const current=active(),cursor=state.learning.cursor;
 return `<section class="wide-section study-home"><span class="eyebrow">조금씩 읽고, 내 말로 기억하기</span><h1>개념부터, 한 장씩.</h1><p class="lead">원하는 파트를 골라 개념 5개를 읽고 바로 퀴즈로 확인해요.<br>읽음 표시는 학습 흔적이에요. 이해했는지는 퀴즈로 확인해 보세요.</p>
 <div class="study-actions">${cursor&&BUNDLES.some(b=>b.id===cursor.bundleId)?'<button class="primary" data-action="continue-study">읽던 개념 이어 보기</button>':''}${current?`<button class="secondary" data-action="resume">퀴즈 이어 풀기 · ${current.items.length-C.counts(current).ungraded}/${current.items.length}</button>`:''}<button class="secondary" data-action="start">전체 랜덤 30문제</button><button class="secondary" data-action="start-sql">SQL 영문 5개 쓰기</button></div>
 <div class="part-grid">${[...new Set(BUNDLES.map(b=>b.category))].map((category,i)=>{
 const bundles=BUNDLES.filter(b=>b.category===category),ids=bundles.flatMap(b=>b.questionIds),read=ids.filter(isRead).length,done=bundles.filter(completed).length;
 return `<article class="part-card"><span class="eyebrow">PART ${String(i+1).padStart(2,'0')}</span><h2>${esc(category)}</h2><p>읽은 개념 ${read} / ${ids.length}<br>퀴즈 완료 ${done} / ${bundles.length}묶음</p><progress value="${read}" max="${ids.length}" aria-label="${esc(category)} 읽은 개념"></progress><button class="secondary" data-part="${esc(category)}">파트 공부하기 →</button></article>`;
 }).join('')}</div>${installPanel()}<p class="local-note">학습 진도와 풀이 기록은 이 기기의 같은 브라우저에만 저장돼요. <button class="inline-button" data-nav="backup">백업 · 복원</button></p></section>`;
}
let selectedPart=BUNDLES[0].category;
function part(){
 const bundles=BUNDLES.filter(b=>b.category===selectedPart);
 return `<section class="wide-section"><button class="text-button" data-nav="home">← 전체 파트</button><span class="eyebrow">개념 읽기 → 묶음 퀴즈</span><h1>${esc(selectedPart)}</h1><p class="lead">순서대로 시작해도, 필요한 묶음부터 골라도 좋아요.</p>${selectedPart==='SQL 개념'?'<div class="study-actions"><button class="primary" data-action="start-sql">SQL 영문 명령어 직접 쓰기 →</button></div>':''}<div class="lesson-list">${bundles.map((b,i)=>`<article class="panel"><span class="eyebrow">묶음 ${i+1} · ${b.questionIds.length}개 개념</span><h2>${esc(b.title)}</h2><p>${b.questionIds.map(id=>esc(NOTES[id].title)).join(' · ')}</p><p class="lesson-status">읽음 ${b.questionIds.filter(isRead).length}/${b.questionIds.length} · ${completed(b)?'퀴즈 완료':'퀴즈 미완료'}</p><div class="study-actions"><button class="primary" data-lesson="${b.id}">개념 보기</button><button class="secondary" data-bundle-quiz="${b.id}">묶음 퀴즈</button></div></article>`).join('')}</div></section>`;
}
function saveCursor(){
 const b=lesson();if(!b||blocked)return;
 state.learning.cursor={bundleId:b.id,questionId:b.questionIds[conceptIndex],at:new Date().toISOString()};persist();
}
function openLesson(id,index=0,fromQuiz=false){
 const b=BUNDLES.find(b=>b.id===id);if(!b)return;
 lessonId=id;conceptIndex=Math.max(0,Math.min(index,b.questionIds.length-1));selectedPart=b.category;returnToQuiz=fromQuiz;saveCursor();go('concept');
}
function concept(){
 const b=lesson();if(!b)return home();
 const id=b.questionIds[conceptIndex],q=BANK.find(q=>q.id===id),n=NOTES[id];
 return `<section class="quiz-shell"><div class="section-heading"><button class="text-button" data-nav="part">← ${esc(b.category)}</button>${returnToQuiz&&active()?'<button class="secondary" data-action="back-quiz">작성하던 퀴즈로</button>':''}</div>
 <div class="progress-meta"><strong>${esc(b.title)}</strong><span>${conceptIndex+1} / ${b.questionIds.length}</span></div>
 <article class="question-card concept-card"><div class="card-top"><span class="category-label">개념 읽기</span><div>${badges(q)}</div></div><h1>${esc(n.title)}</h1><h2>쉽게 이해하기</h2><p>${esc(n.easy)}</p><h2>기억할 키워드</h2><div class="keywords">${q.keywords.map(k=>`<span>${esc(k)}</span>`).join('')}</div><h2>시험에서는 이렇게 써요</h2><p class="exam-answer">${esc(q.answer)}</p><details class="concept-more"><summary>예시와 추가 설명 보기</summary><section class="example-box"><h2>이해용 예시 <small>실제 기출 아님</small></h2><p>${esc(n.example)}</p></section><h2>추가 설명</h2><p class="explanation">${esc(q.explanation)}</p></details>
 <button class="secondary read-toggle" data-action="mark-read" ${isRead(id)||blocked?'disabled':''}>${isRead(id)?'✓ 읽음 표시됨':'읽음 표시하기'}</button><p class="local-note">읽음은 이해 완료나 정답을 의미하지 않아요.</p>${sources(q)}</article>
 <div class="quiz-controls"><button class="secondary" data-action="concept-prev" ${conceptIndex===0?'disabled':''}>이전 개념</button>${conceptIndex<b.questionIds.length-1?'<button class="primary" data-action="concept-next">다음 개념 →</button>':`<button class="primary" data-bundle-quiz="${b.id}">이 묶음 ${b.questionIds.length}문제 풀기 →</button>`}</div>
 <div class="concept-links" aria-label="묶음의 개념">${b.questionIds.map((id,i)=>`<button class="text-button" data-concept-index="${i}" ${i===conceptIndex?'aria-current="step"':''}>${isRead(id)?'✓ ':''}${esc(NOTES[id].title)}</button>`).join('')}</div></section>`;
}
function bundleResultActions(s){
 if(s.bundle?.id===SQL_BUNDLE_ID)return '<button class="primary" data-action="start-sql">SQL 영문 다시 연습</button><button class="secondary" data-nav="history">풀이 기록</button>';
 if(s.mode!=='bundle')return '<button class="secondary" data-action="start">새로운 30문제</button>';
 const b=BUNDLES.find(b=>b.id===s.bundle.id);if(!b)return '';
 const same=BUNDLES.filter(x=>x.category===b.category),next=same[same.indexOf(b)+1];
 return `<button class="secondary" data-lesson="${b.id}">개념 다시 보기</button><button class="secondary" data-bundle-quiz="${b.id}">같은 묶음 다시 풀기</button>${next?`<button class="primary" data-lesson="${next.id}">다음 묶음 →</button>`:'<button class="secondary" data-nav="home">다른 파트 공부하기</button>'}`;
}
function sqlQuiz(s,a,q){
 const i=s.index,done=s.items.length-C.counts(s).ungraded;
 const feedback=a.rating==='correct'?'한 번에 맞혔어요.':a.rating==='partial'?'다시 써서 맞혔어요. 다음 연습에도 나옵니다.':'두 번 틀렸어요. 다음 연습에서 다시 써 보세요.';
 return `<section class="quiz-shell sql-drill-shell"><div class="section-heading"><div><span class="eyebrow">SQL 영문 쓰기 · ${fmt(s.startedAt)}</span><h1>뜻을 보고, 영어로.</h1></div><button class="text-button" data-nav="home">잠시 쉬기</button></div>
 <div class="progress-meta"><strong>명령어 ${i+1} / ${s.items.length}</strong><span>${done}개 확인 완료</span></div><progress value="${done}" max="${s.items.length}" aria-label="확인 완료한 명령어 수"></progress>
 <article class="question-card sql-drill-card"><div class="card-top"><span class="category-label">SQL 영문 쓰기</span></div><h2 id="question-title">${esc(q.prompt)}</h2>
 <label class="answer-label" for="answer">영문 명령어 <small>대소문자는 구분하지 않고 철자와 띄어쓰기를 확인해요.</small></label>
 <input id="answer" class="sql-answer" type="text" inputmode="text" maxlength="40" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" placeholder="영어로 직접 입력하세요" value="${esc(a.draft)}" ${a.revealed?'readonly':''}>
 <div class="input-foot"><span id="save-state">${notice?'저장 상태를 확인해 주세요.':'이 브라우저에 자동 저장'}</span><span id="char-count">${a.draft.length} / 40자</span></div>
 ${a.spellingAttempts&&!a.revealed?`<p class="sql-hint" role="status">아직 달라요. 첫 글자 <strong>${esc(q.answer[0])}</strong>를 보고 한 번 더 써 보세요.</p>`:''}
 ${a.revealed?`<section class="answer-panel"><span class="eyebrow">철자 확인</span><p class="sql-feedback ${a.rating}">${feedback}</p><p class="sql-correct-answer">${esc(q.answer)}</p><p class="explanation">${esc(q.explanation)}</p></section>`:`<div class="reveal-row"><p>먼저 직접 입력해 보세요. 두 번 틀리면 정답을 보여 줍니다.</p><button class="primary" data-action="reveal" ${blocked?'disabled':''}>철자 확인</button></div>`}
 ${sources(q)}</article>
 <div class="quiz-controls"><button class="secondary" data-action="prev" ${i===0?'disabled':''}>이전 명령어</button><span>${a.rating?`결과: ${labels[a.rating]}`:'철자를 입력하고 확인해 주세요.'}</span><button class="primary" data-action="next" ${!a.rating||blocked?'disabled':''}>다음 명령어 →</button></div>
 <div class="question-dots" aria-label="명령어 이동">${s.items.map((x,j)=>`<button data-index="${j}" class="${x.rating||''} ${i===j?'current':''}" aria-label="${j+1}번 명령어, ${labels[x.rating||'ungraded']}" ${i===j?'aria-current="step"':''}>${j+1}</button>`).join('')}</div></section>`;
}
function quiz(){
  const s=active();if(!s){page='home';return home();}const i=s.index,a=s.items[i],q=a.question,c=C.counts(s),done=s.items.length-c.ungraded;
  if(isSqlSpelling(q))return sqlQuiz(s,a,q);
  return `<section class="quiz-shell"><div class="section-heading"><div><span class="eyebrow">${fmt(s.startedAt)} · ${esc(sessionLabel(s))}</span><h1>한 장씩, 내 답으로.</h1></div><button class="text-button" data-nav="home">잠시 쉬기</button></div><div class="progress-meta"><strong>문제 ${String(i+1).padStart(2,'0')} <span>/ ${s.items.length}</span></strong><span>${done}개 평가 완료</span></div><progress value="${done}" max="${s.items.length}" aria-label="평가 완료한 문제 수"></progress><article class="question-card"><div class="card-top"><span class="category-label">${esc(q.category)}</span><div>${badges(q)}</div></div><h2 id="question-title">${esc(q.prompt)}</h2><label class="answer-label" for="answer">내 답안 <small>핵심 단어부터 차근차근 써 보세요.</small></label><textarea id="answer" maxlength="20000" rows="5" placeholder="여기에 답을 작성하세요." ${a.revealed?'readonly':''}>${esc(a.draft)}</textarea><div class="input-foot"><span id="save-state">${notice?'저장 상태를 확인해 주세요.':'이 브라우저에 자동 저장'}</span><span id="char-count">${a.draft.length.toLocaleString()} / 20,000자</span></div>${a.revealed?`<section class="answer-panel"><span class="eyebrow">모범답안</span><p>${esc(q.answer)}</p><div class="keywords">${q.keywords.map(k=>`<span>${esc(k)}</span>`).join('')}</div><p class="explanation">${esc(q.explanation)}</p></section><div class="self-rating"><h3>내 답을 평가해 보세요.</h3><p>핵심 의미를 담았다면 표현이 달라도 괜찮아요.</p><div class="rating-buttons">${C.RATINGS.map(k=>`<button class="rating ${k} ${a.rating===k?'selected':''}" aria-pressed="${a.rating===k}" data-rating="${k}" ${blocked?'disabled':''}>${k==='correct'?'✓':k==='partial'?'△':'×'} ${labels[k]}</button>`).join('')}</div></div>`:`<div class="reveal-row"><p>빈 답안으로 확인해도 괜찮아요.</p><button class="primary" data-action="reveal" ${blocked?'disabled':''}>정답 확인</button></div>`}${s.mode==='bundle'&&BUNDLES.some(b=>b.id===s.bundle.id)?'<button class="text-button" data-action="quiz-concept">이 문제 개념 다시 보기</button>':''}${sources(q)}</article><div class="quiz-controls"><button class="secondary" data-action="prev" ${i===0?'disabled':''}>이전 문제</button><span>${a.rating?`내 평가: ${labels[a.rating]}`:'정답을 확인하고 평가해 주세요.'}</span><button class="primary" data-action="next" ${!a.rating||blocked?'disabled':''}>${i===s.items.length-1?'미평가 문제로':'다음 문제 →'}</button></div><div class="question-dots" aria-label="문제 이동">${s.items.map((x,j)=>`<button data-index="${j}" class="${x.rating||''} ${i===j?'current':''}" aria-label="${j+1}번 문제, ${labels[x.rating||'ungraded']}" ${i===j?'aria-current="step"':''}>${j+1}</button>`).join('')}</div></section>`;
}
function result(){const s=state.sessions.find(s=>s.id===recordId);if(!s){page='history';return history();}return `<section class="wide-section"><div class="result-heading"><span class="eyebrow">${s.items.length}장의 기록이 쌓였어요</span><h1>${s.bundle?.id===SQL_BUNDLE_ID?'SQL 영문 쓰기 완료.':'오늘의 개념 학습 완료.'}</h1><p>${fmt(s.startedAt)} · ${s.bundle?.id===SQL_BUNDLE_ID?'철자와 띄어쓰기를 확인한 연습 결과입니다. 틀리거나 두 번째에 맞힌 명령어는 다음 연습에서 우선 나와요.':'실제 시험 점수가 아닌 자기평가 결과입니다.'}</p></div>${stats(s)}<div class="result-actions"><button class="primary" data-action="review-result">이번 회차 복습</button>${bundleResultActions(s)}</div><div class="result-preview">${s.items.filter(a=>a.rating!=='correct').slice(0,5).map(a=>`<p><span class="result-label ${a.rating}">${labels[a.rating]}</span>${esc(a.question.prompt)}</p>`).join('')||'<p>모든 문제를 정답으로 평가했어요. 시간이 지난 뒤 다시 떠올려 보세요.</p>'}</div></section>`;}
function history(){
  const sorted=[...state.sessions].sort((a,b)=>Date.parse(b.startedAt)-Date.parse(a.startedAt));
  const selected=recordId==='all'?sorted:sorted.filter(s=>s.id===recordId);
  const records=selected.flatMap(s=>s.items.map((a,i)=>({s,a,i}))).filter(({a})=>a.revealed||a.rating||a.draft).filter(({a})=>filter==='all'||(filter==='star'?a.question.badges.length>0:a.rating===filter));
  return `<section class="wide-section"><div class="section-heading"><div><span class="eyebrow">차곡차곡 쌓인 나의 답</span><h1>풀이 기록</h1></div><button class="secondary" data-action="export">기록 백업</button></div>${!sorted.length?`<div class="empty-state"><span class="empty-icon">▤</span><h2>아직 풀어본 문제가 없어요.</h2><p>퀴즈를 풀면 내 답과 모범답안이 이곳에 모입니다.</p><button class="primary" data-action="start">첫 학습 시작</button></div>`:`<div class="history-toolbar"><label for="session-filter">회차</label><select id="session-filter"><option value="all">모든 회차 (${sorted.length})</option>${sorted.map((s,i)=>`<option value="${esc(s.id)}" ${recordId===s.id?'selected':''}>${fmt(s.startedAt)} · ${esc(sessionLabel(s))} · ${s.status==='completed'?'완료':`${s.items.length-C.counts(s).ungraded}/${s.items.length} 진행 중`}</option>`).join('')}</select></div><div class="filter-tabs" role="group" aria-label="복습 필터">${[['all','전체'],['wrong','오답'],['partial','부분정답'],['star','★ 별표']].map(([v,t])=>`<button data-filter="${v}" class="${v===filter?'active':''}" aria-pressed="${v===filter}">${t}</button>`).join('')}</div>${selected.length===1?`<div class="session-overview">${stats(selected[0])}${selected[0].status==='active'?`<button class="secondary" data-resume="${esc(selected[0].id)}">이 회차 이어 풀기</button>`:''}</div>`:''}<p class="record-count">${records.length}개의 풀이 기록 · 문제를 펼치면 내 답과 해설을 볼 수 있어요.</p><div class="record-list">${records.length?records.map(({s,a,i})=>`<details class="record"><summary><div class="record-title"><span class="record-meta">${esc(sessionLabel(s))} · ${esc(a.question.category)} · ${fmt(s.startedAt)} · ${i+1}번</span><strong>${esc(a.question.prompt)}</strong><div>${badges(a.question)}</div></div><span class="result-label ${a.rating||'ungraded'}">${labels[a.rating||'ungraded']}</span></summary><div class="record-body"><h3>내 답안</h3><p class="my-answer">${esc(a.draft)||'작성한 답안이 없습니다.'}</p>${a.revealed?`<h3>모범답안</h3><p>${esc(a.question.answer)}</p><div class="keywords">${a.question.keywords.map(k=>`<span>${esc(k)}</span>`).join('')}</div><p class="explanation">${esc(a.question.explanation)}</p>${sources(a.question)}`:`<p>아직 정답을 확인하지 않은 문제입니다.</p><button class="secondary" data-resume="${esc(s.id)}" data-position="${i}">이 문제 이어 풀기</button>`}</div></details>`).join(''):'<div class="empty-state compact"><h2>해당하는 풀이 기록이 없어요.</h2><p>다른 필터를 선택하거나 학습을 이어가세요.</p></div>'}</div>`}</section>`;
}
function backup(){return `<section class="wide-section backup-section"><span class="eyebrow">나의 학습 기록을 안전하게</span><h1>백업 · 복원</h1><p class="lead">기록은 현재 기기의 같은 브라우저에만 저장됩니다.<br>브라우저 데이터를 지우거나 기기를 바꾸기 전에 백업해 주세요.</p><div class="backup-grid"><article class="panel"><span class="panel-symbol">↓</span><h2>기록 내보내기</h2><p>개념 학습 진도와 모든 회차의 답안을<br>하나의 JSON 파일로 저장합니다.</p><button class="primary" data-action="export">백업 파일 다운로드</button><small>${state.sessions.length}개 회차 저장 중</small>${blocked?'<button class="text-button" data-action="export-raw">복구용 원본 내려받기</button>':''}</article><article class="panel"><span class="panel-symbol">↑</span><h2>백업 불러오기</h2><p>기존 기록에 백업을 합칩니다.<br>같은 회차는 더 최근 기록을 유지합니다.</p><label class="file-picker" for="import-file">백업 파일 선택<input id="import-file" type="file" accept=".json,application/json"></label><small>이 앱에서 내려받은 JSON 파일 · 최대 20MB</small></article></div><div class="info-note"><strong>알아두세요</strong><p>다른 기기와 자동으로 동기화되지는 않습니다. 다른 기기에서도 백업 파일을 불러오면 기록을 이어 볼 수 있어요. 앱 주소나 브라우저가 달라질 때도 백업을 먼저 저장해 주세요.</p></div><div id="import-message" role="status"></div></section>`;}
function render(){
  app.className='single-view';app.innerHTML=(notice?`<div class="storage-warning" role="alert">${esc(notice)} <button data-action="export">지금 백업</button>${blocked?'<button data-action="reload">새로고침</button>':''}</div>`:'')+({home,part,concept,quiz,history,backup,result}[page]||home)();
  document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===(['quiz','part','concept'].includes(page)?'home':page==='result'?'history':page)));
}
function go(view){page=view;render();window.scrollTo({top:0,behavior:'instant'});}
function start(bundleId=null){
  if(blocked){toast('백업 · 복원에서 기록을 복구해 주세요.');return;}
  if(active()&&!confirm('진행 중인 회차는 풀이 기록에 남겨두고 새 퀴즈를 시작할까요?'))return;
  const id=crypto.randomUUID?crypto.randomUUID():`s-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const bundle=bundleId?BUNDLES.find(b=>b.id===bundleId):null;if(bundleId&&!bundle)return;
  const s=bundle?C.createBundleSession(BANK,bundle,id):C.createSession(BANK,id);state.sessions.unshift(s);state.activeSessionId=s.id;persist();go('quiz');
}
function startSqlDrill(){
 if(blocked){toast('백업 · 복원에서 기록을 복구해 주세요.');return;}
 if(active()&&!confirm('진행 중인 회차는 풀이 기록에 남겨두고 새 연습을 시작할까요?'))return;
 const latest=new Map();
 [...state.sessions].sort((a,b)=>Date.parse(b.updatedAt)-Date.parse(a.updatedAt)).forEach(s=>{
   if(s.bundle?.id!==SQL_BUNDLE_ID)return;
   s.items.forEach(a=>{if(a.rating&&!latest.has(a.question.id))latest.set(a.question.id,a.rating);});
 });
 const missed=SQL_SPELLING.filter(q=>['wrong','partial'].includes(latest.get(q.id)));
 const chosen=missed.length?C.sample(missed,Math.min(5,missed.length)):[];
 const pool=SQL_SPELLING.filter(q=>!chosen.some(x=>x.id===q.id));
 if(chosen.length<5)chosen.push(...C.sample(pool,5-chosen.length));
 const bundle={id:SQL_BUNDLE_ID,version:1,category:'SQL 영문 쓰기',title:'명령어 철자 연습',questionIds:chosen.map(q=>q.id)};
 const id=crypto.randomUUID?crypto.randomUUID():`s-${Date.now()}-${Math.random().toString(16).slice(2)}`;
 const s=C.createBundleSession(SQL_SPELLING,bundle,id);
 s.items.forEach(a=>a.spellingAttempts=0);
 state.sessions.unshift(s);state.activeSessionId=s.id;persist();go('quiz');
}
function download(data,name){const blob=new Blob([typeof data==='string'?data:JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportData(){download({...state,exportedAt:new Date().toISOString()},`개념한장_백업_${new Date().toISOString().slice(0,10)}.json`);toast('백업 파일을 내려받았습니다.');}
app.addEventListener('input',e=>{if(e.target.id==='answer'){const s=active();if(!s||s.items[s.index].revealed||blocked)return;s.items[s.index].draft=e.target.value;stamp(s);const ok=persist();document.getElementById('char-count').textContent=`${e.target.value.length.toLocaleString()} / ${isSqlSpelling(s.items[s.index].question)?'40':'20,000'}자`;const status=document.getElementById('save-state');if(status){status.textContent=ok?'자동 저장됨':'저장 실패 · 지금 백업해 주세요';status.classList.toggle('save-error',!ok);}if(!ok&&!document.querySelector('.storage-warning'))render();}});
app.addEventListener('keydown',e=>{
 if(e.target.id==='answer'&&e.key==='Enter'&&isSqlSpelling(active()?.items[active().index]?.question)){
   e.preventDefault();app.querySelector('[data-action="reveal"]')?.click();
 }
});
document.addEventListener('click',e=>{
  const b=e.target.closest('button,a.brand');if(!b||b.disabled)return;
  if(b.matches('a.brand')){e.preventDefault();go('home');return;}
  if(b.dataset.nav){go(b.dataset.nav);return;}
  if(b.dataset.filter){filter=b.dataset.filter;render();return;}
  if(b.dataset.resume){const s=state.sessions.find(s=>s.id===b.dataset.resume);if(!s||s.status!=='active'||blocked)return;state.activeSessionId=s.id;if(b.dataset.position)s.index=Number(b.dataset.position);persist();go('quiz');return;}
  if(b.dataset.part){selectedPart=b.dataset.part;go('part');return;}
  if(b.dataset.lesson){openLesson(b.dataset.lesson);return;}
  if(b.dataset.bundleQuiz){start(b.dataset.bundleQuiz);return;}
  if(b.dataset.conceptIndex!==undefined){conceptIndex=Number(b.dataset.conceptIndex);saveCursor();go('concept');return;}
  const s=active();
  if(b.dataset.index!==undefined&&s){s.index=Number(b.dataset.index);stamp(s);persist();render();return;}
  if(b.dataset.rating&&s&&!blocked){C.grade(s,s.index,b.dataset.rating);if(s.status==='completed'){state.activeSessionId=null;recordId=s.id;persist();go('result');}else{persist();render();}return;}
  switch(b.dataset.action){
    case 'continue-study':{const p=state.learning.cursor,b=BUNDLES.find(b=>b.id===p?.bundleId);if(b)openLesson(b.id,b.questionIds.indexOf(p.questionId));break;}
    case 'mark-read':{const b=lesson();if(b&&!blocked){const id=b.questionIds[conceptIndex];if(!isRead(id))state.learning.read.push({id,at:new Date().toISOString()});persist();render();}break;}
    case 'concept-prev':if(conceptIndex>0){conceptIndex--;saveCursor();go('concept');}break;
    case 'concept-next':if(lesson()&&conceptIndex<lesson().questionIds.length-1){conceptIndex++;saveCursor();go('concept');}break;
    case 'back-quiz':returnToQuiz=false;go('quiz');break;
    case 'quiz-concept':if(s?.mode==='bundle'){const b=BUNDLES.find(b=>b.id===s.bundle.id);if(b)openLesson(b.id,b.questionIds.indexOf(s.items[s.index].question.id),true);}break;
    case 'start':start();break;case 'start-sql':startSqlDrill();break;case 'resume':go('quiz');break;case 'export':exportData();break;
    case 'install-app':{
      if(installPrompt){const prompt=installPrompt;installPrompt=null;prompt.prompt();Promise.resolve(prompt.userChoice).then(choice=>{if(choice?.outcome==='dismissed')toast('Chrome 메뉴에서도 앱을 설치할 수 있어요.');}).catch(()=>{});}
      else if(/iPhone|iPad|iPod/.test(navigator.userAgent))toast('Safari 공유 버튼에서 홈 화면에 추가를 선택하세요.');
      else toast('Chrome 메뉴(⋮)에서 앱 설치 또는 홈 화면에 추가를 선택하세요.');
      break;
    }
    case 'export-raw':try{download(localStorage.getItem(C.KEY)||'{}','개념한장_복구용원본.json');}catch{toast('원본을 읽지 못했습니다.');}break;
    case 'reload':location.reload();break;
    case 'reveal':if(s&&!blocked){
      const a=s.items[s.index],q=a.question;
      if(isSqlSpelling(q)){
        const typed=a.draft.trim().replace(/;$/,'').trim().replace(/\s+/g,' ').toUpperCase();
        if(!typed){toast('명령어를 영어로 입력해 주세요.');break;}
        if(a.spellingAttempts&&typed===a.lastSpellingAttempt){toast('다른 철자로 다시 입력해 보세요.');break;}
        if(typed===q.answer||a.spellingAttempts>=1){
          a.revealed=true;
          C.grade(s,s.index,typed===q.answer?(a.spellingAttempts?'partial':'correct'):'wrong');
          if(s.status==='completed'){state.activeSessionId=null;recordId=s.id;persist();go('result');}
          else{persist();render();document.querySelector('.answer-panel')?.scrollIntoView({block:'nearest',behavior:'smooth'});}
        }else{a.spellingAttempts=1;a.lastSpellingAttempt=typed;stamp(s);persist();render();document.getElementById('answer')?.select();}
      }else{a.revealed=true;stamp(s);persist();render();document.querySelector('.answer-panel')?.scrollIntoView({block:'nearest',behavior:'smooth'});}
    }break;
    case 'prev':if(s&&s.index>0){s.index--;stamp(s);persist();render();}break;
    case 'next':if(s&&s.items[s.index].rating){s.index=s.index<s.items.length-1?s.index+1:s.items.findIndex(a=>!a.rating);stamp(s);persist();render();window.scrollTo({top:0,behavior:'smooth'});}break;
    case 'review-result':filter='all';go('history');break;
  }
});
app.addEventListener('change',async e=>{
  if(e.target.id==='session-filter'){recordId=e.target.value;render();return;}
  if(e.target.id==='import-file'){
    const f=e.target.files[0];if(!f)return;
    try{
      if(f.size>20*1024*1024)throw new Error('20MB 이하의 백업 파일을 선택해 주세요.');
      const incoming=C.validateState(JSON.parse(await f.text()));
      if(blocked&&!confirm('현재 읽을 수 없는 기록을 백업 파일로 복구합니다. 필요하면 먼저 복구용 원본을 내려받으세요. 계속할까요?'))return;
      const next=C.mergeStates(state,incoming);
      if(!persist(next,{restore:blocked}))throw new Error('저장 공간 또는 브라우저 설정으로 복원하지 못했습니다. 기존 기록은 유지됩니다.');
      render();toast(`${incoming.sessions.length}개 회차를 확인하고 기록을 합쳤습니다.`);
    }catch(err){const m=document.getElementById('import-message');if(m){m.className='storage-warning';m.textContent=`복원하지 않았습니다. ${err instanceof SyntaxError?'올바른 JSON 파일이 아닙니다.':err.message}`;}toast('백업 파일을 확인해 주세요. 기존 기록은 그대로입니다.');}finally{e.target.value='';}
  }
});
window.addEventListener('storage',e=>{if(e.key===C.KEY){blocked=true;notice='다른 탭에서 기록이 변경되었습니다. 새로고침해 최신 기록을 불러오세요.';render();}});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;if(page==='home')render();});
window.addEventListener('appinstalled',()=>{installPrompt=null;if(page==='home')render();});
if('serviceWorker' in navigator){window.addEventListener('load',()=>{
  let hadController=Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(hadController)toast('새 버전이 준비됐어요. 앱을 다시 열어 적용하세요.');hadController=true;});
  navigator.serviceWorker.register('./sw.js').catch(()=>{});
});}
const context=document.modelContext;
if(context?.registerTool){const life=new AbortController();try{Promise.resolve(context.registerTool({name:'get_quiz_progress',title:'학습 진행 상황 확인',description:'현재 회차의 평가 개수와 누적 회차 수를 확인합니다. 답안을 노출하거나 기록을 변경하지 않습니다.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(!input||typeof input!=='object'||Object.keys(input).length)throw new Error('빈 객체를 입력하세요.');const s=active();return {questionCount:BANK.length,sessionCount:state.sessions.length,current:s?{position:s.index+1,total:s.items.length,...C.counts(s)}:null};}},{signal:life.signal})).catch(()=>{});window.addEventListener('pagehide',()=>life.abort(),{once:true});}catch{}}
render();
})();
