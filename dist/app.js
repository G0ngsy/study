(()=>{
'use strict';
const C=QuizCore,BANK=window.QUIZ_BANK,app=document.getElementById('app');
const NOTES=window.LEARNING_NOTES,BUNDLES=window.LEARNING_BUNDLES,ENGLISH=window.LEARNING_ENGLISH||{};
const TERM_IDS=["sw-waterfall","sw-prototype","sw-spiral","sw-agile","sw-scrum-master","sw-uml","sw-usecase","sw-sequence","sw-deployment","sw-encapsulation","sw-inheritance","sw-polymorphism","sw-srp","sw-ocp","sw-lsp","sw-isp","sw-dip","sw-mvc","sw-scm","test-case","test-equivalence","test-boundary","test-pesticide","test-absence","test-regression","test-oracle","db-domain","db-candidate","db-normalization","db-denormalization","db-index","db-partition","db-independence","db-distributed","db-bcnf","os-pcb","os-context","os-rr","os-deadlock","os-working-set","os-thrashing","os-ipc","os-opt","net-osi","net-arp","net-dns","net-dhcp","net-icmp","net-nat","net-bgp","net-vlan","sec-hash","sec-salt","sec-rsa","sec-dh","sec-syn","sec-smurf","sec-land","sec-teardrop","sec-waf","sec-vpn","sec-ransomware","sec-apt","sec-watering","sec-credential","sec-backdoor","sec-aslr","sec-canary","it-eai","it-ajax","it-json","it-drm","it-sso","it-mqtt","it-digital-twin","pattern-abstract-factory","pattern-builder","pattern-factory-method","pattern-prototype","pattern-singleton","pattern-adapter","pattern-decorator","pattern-facade","pattern-flyweight","pattern-proxy","pattern-chain","pattern-observer","pattern-strategy","pattern-template-method","pattern-visitor"];
function termPrompt(note,original){
 const prompt=original.prompt.trim();
 if(prompt.endsWith('무엇인가?')&&!prompt.includes(note.title))return prompt;
 const pattern=prompt.match(/^다음 설명에 해당하는 디자인 패턴의 이름과 분류를 쓰시오\.\s+([\s\S]+)$/);
 if(pattern)return pattern[1].trim()+' 이 설명에 해당하는 디자인 패턴은 무엇인가?';
 const nameOnly=prompt.match(/^(.+?)(?:의 이름과.*|의 이름을 쓰시오\.)$/);
 if(nameOnly&&!nameOnly[1].includes(note.title))return nameOnly[1]+'은 무엇인가?';
 const first=note.easy.match(/^[^.]+\.?/)?.[0]||note.easy;
 return first+' 이를 가리키는 명칭은 무엇인가?';
}
const SIMPLE_TERM_BANK=TERM_IDS.map(id=>{
 const n=NOTES[id],original=BANK.find(q=>q.id===id);
 return {id:'term-'+id,version:1,category:original.category,
   prompt:termPrompt(n,original),
   answer:n.title,keywords:[n.title],explanation:original.answer,
   sources:original.sources,badges:[]};
});
const MULTI_TERM_BANK=[{"id":"multi-term-cohesion","category":"소프트웨어 설계","prompt":"다음 모듈의 특징에 맞는 응집도 명칭을 ①~③에 쓰시오.\n① 여러 작업을 정해진 실행 순서에 따라 묶었지만, 앞 작업의 출력이 다음 작업의 입력은 아니다.\n② 앞 작업의 출력이 다음 작업의 입력으로 이어진다.\n③ 모듈의 모든 요소가 하나의 기능을 수행하는 데 집중한다.","answer":"① 절차적 응집도\n② 순차적 응집도\n③ 기능적 응집도","keywords":["절차적","순차적","기능적"],"explanation":"실행 순서만 연결되면 절차적, 데이터 흐름이 이어지면 순차적, 하나의 기능에 집중하면 기능적 응집도입니다.","sourceIds":["sw-cohesion-order"]},{"id":"multi-term-patterns","category":"디자인 패턴","prompt":"각 상황에 알맞은 디자인 패턴의 이름을 ①~③에 쓰시오.\n① 추상적인 기능과 실제 구현을 나눠 각각 독립적으로 확장한다.\n② 한 객체의 상태 변화가 등록된 여러 객체에 자동으로 전달된다.\n③ 같은 목적의 알고리즘 여러 개를 교체해 사용한다.","answer":"① 브리지\n② 옵서버\n③ 전략","keywords":["브리지","옵서버","전략"],"explanation":"브리지는 구조 패턴, 옵서버와 전략은 행위 패턴입니다.","sourceIds":["pattern-bridge","pattern-observer","pattern-strategy"]},{"id":"multi-term-db-design","category":"데이터베이스","prompt":"데이터베이스 설계 단계의 이름을 ①~③에 쓰시오.\n① 업무의 대상과 관계를 DBMS와 무관한 모델로 표현한다.\n② 선택한 데이터 모델에 맞춰 테이블과 키를 정한다.\n③ 저장 구조와 접근 경로, 인덱스 등을 정한다.","answer":"① 개념적 설계\n② 논리적 설계\n③ 물리적 설계","keywords":["개념적 설계","논리적 설계","물리적 설계"],"explanation":"현실의 의미 → 데이터 모델 → 실제 저장 방법의 순서로 구분합니다.","sourceIds":["db-design"]},{"id":"multi-term-web-service","category":"인터페이스·IT 용어","prompt":"웹 서비스 기술의 이름을 ①~③에 쓰시오.\n① XML 기반 메시지를 교환할 때 쓰는 프로토콜이다.\n② 서비스의 위치와 호출 방법, 메시지 형식을 기술한다.\n③ 서비스를 등록하고 검색할 수 있는 저장소 역할을 한다.","answer":"① SOAP\n② WSDL\n③ UDDI","keywords":["SOAP","WSDL","UDDI"],"explanation":"메시지 교환, 서비스 설명, 서비스 등록·검색으로 역할을 나눠 기억하세요.","sourceIds":["it-soap-wsdl-uddi"]},{"id":"multi-term-network","category":"네트워크","prompt":"다음 네트워크 기술의 명칭을 ①~③에 쓰시오.\n① IPv4 주소에 대응하는 MAC 주소를 같은 링크에서 알아낸다.\n② 도메인 이름으로 IP 주소 등을 찾는다.\n③ 장치에 IP 주소 등 네트워크 설정을 자동으로 제공한다.","answer":"① ARP\n② DNS\n③ DHCP","keywords":["ARP","DNS","DHCP"],"explanation":"주소 변환, 이름 조회, 자동 설정을 각각 구분합니다.","sourceIds":["net-arp","net-dns","net-dhcp"]},{"id":"multi-term-test","category":"테스트","prompt":"설명에 해당하는 테스트 기법 또는 테스트의 이름을 ①~③에 쓰시오.\n① 비슷하게 처리될 입력을 집합으로 나누고 대표값을 시험한다.\n② 입력 범위가 바뀌는 지점 주변의 값을 집중적으로 시험한다.\n③ 수정 후 기존 기능이 여전히 동작하는지 다시 확인한다.","answer":"① 동등 분할\n② 경계값 분석\n③ 회귀 테스트","keywords":["동등 분할","경계값 분석","회귀 테스트"],"explanation":"동등 분할과 경계값 분석은 입력 설계 기법이고 회귀 테스트는 변경 후 재확인입니다.","sourceIds":["test-equivalence","test-boundary","test-regression"]},{"id":"multi-term-security","category":"정보보안","prompt":"다음 공격의 명칭을 ①~③에 쓰시오.\n① 연결 요청만 대량으로 보내 연결 대기 자원을 소모시킨다.\n② 피해자의 주소로 위장한 요청에 여러 장치가 응답하게 만든다.\n③ 패킷의 출발지와 목적지 주소를 모두 피해자 주소로 조작한다.","answer":"① SYN 플러딩\n② 스머프 공격\n③ LAND 공격","keywords":["SYN 플러딩","스머프 공격","LAND 공격"],"explanation":"각 공격은 연결 대기, 증폭 응답, 동일한 출발지·목적지 주소가 단서입니다.","sourceIds":["sec-syn","sec-smurf","sec-land"]},{"id":"multi-term-os","category":"운영체제","prompt":"다음 운영체제 현상의 이름을 ①~③에 쓰시오.\n① 실행 중이던 프로세스의 상태를 저장하고 다른 프로세스의 상태를 불러온다.\n② 둘 이상의 프로세스가 서로 자원을 기다리며 진행하지 못한다.\n③ 실제 처리보다 페이지 교체에 더 많은 시간을 쓰게 된다.","answer":"① 문맥 교환\n② 교착상태\n③ 스래싱","keywords":["문맥 교환","교착상태","스래싱"],"explanation":"프로세스 전환, 자원 대기, 과도한 페이지 교체를 구분합니다.","sourceIds":["os-context","os-deadlock","os-thrashing"]},{"id":"multi-term-db-keys","category":"데이터베이스","prompt":"관계형 데이터베이스의 키 이름을 ①~③에 쓰시오.\n① 행을 유일하게 식별하지만 최소성은 요구하지 않는 속성 집합이다.\n② 유일성과 최소성을 모두 만족하는 키 후보이다.\n③ 후보키 중에서 대표로 선택한 키이다.","answer":"① 슈퍼키\n② 후보키\n③ 기본키","keywords":["슈퍼키","후보키","기본키"],"explanation":"슈퍼키는 유일성, 후보키는 유일성+최소성, 기본키는 선택된 후보키입니다.","sourceIds":["db-key-types","db-candidate"]},{"id":"multi-term-solid","category":"소프트웨어 설계","prompt":"설계 원칙의 이름을 ①~③에 쓰시오.\n① 한 클래스의 책임을 한 가지로 집중한다.\n② 기능 확장은 쉽게 하되 기존 코드는 가능한 수정하지 않는다.\n③ 사용하지 않는 기능에 의존하지 않도록 인터페이스를 작게 나눈다.","answer":"① 단일 책임 원칙\n② 개방 폐쇄 원칙\n③ 인터페이스 분리 원칙","keywords":["단일 책임","개방 폐쇄","인터페이스 분리"],"explanation":"SOLID의 SRP, OCP, ISP에 각각 해당합니다.","sourceIds":["sw-srp","sw-ocp","sw-isp"]}].map(({sourceIds,...q})=>{
 const sources=sourceIds.flatMap(id=>BANK.find(x=>x.id===id).sources);
 return {...q,version:1,sourceIds,sources:[...new Map(sources.map(s=>[s.name+':'+s.page,s])).values()],badges:[]};
});
MULTI_TERM_BANK.push({...{"id":"multi-term-ui-principles","version":1,"category":"인터페이스·IT 용어","prompt":"UI 설계 원칙의 명칭을 ①~④에 쓰시오.\n① 처음 보는 사용자도 화면의 의미와 조작 방법을 쉽게 알아차린다.\n② 사용자가 하려는 작업을 정확하게 수행할 수 있다.\n③ 사용 방법을 어렵지 않게 익힐 수 있다.\n④ 상황과 요구에 맞게 사용 방식을 조정할 수 있다.","answer":"① 직관성\n② 유효성\n③ 학습성\n④ 유연성","keywords":["직관성","유효성","학습성","유연성"],"explanation":"UI 설계의 네 원칙은 직관성, 유효성, 학습성, 유연성입니다.","sourceIds":["it-ui"]},sources:BANK.find(q=>q.id==='it-ui').sources,badges:[]});
const TERM_BANK=[...SIMPLE_TERM_BANK,...MULTI_TERM_BANK];
const TERM_BY_CONCEPT=new Map(TERM_IDS.map((id,i)=>[id,SIMPLE_TERM_BANK[i]]));
const isMultiTerm=q=>q?.quizType==='multi-term'||q?.id?.startsWith('multi-term-');
const isTermRecall=q=>q?.quizType==='term'||isMultiTerm(q)||q?.id?.startsWith('term-');

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
const isSqlSpelling=q=>q?.quizType==='sql-spell'||q?.id?.startsWith('sql-spell-');
const SQL_CODE_BUNDLE_ID='sql-code';
const SQL_CODE_BANK=[{"id":"sql-code-foreign-key","prompt":"ENROLLMENT 테이블의 외래 키 제약을 완성하세요. ①·②에 들어갈 영어 SQL 키워드를 적으세요.","code":"CREATE TABLE ENROLLMENT (\n  ENROLL_ID INTEGER PRIMARY KEY,\n  STUDENT_ID INTEGER NOT NULL,\n  CONSTRAINT FK_ENROLL_STUDENT ① KEY (STUDENT_ID)\n    ② STUDENT(STUDENT_ID)\n);","answer":"① FOREIGN\n② REFERENCES","keywords":["FOREIGN","REFERENCES"],"explanation":"FOREIGN KEY는 참조하는 열을 지정하고 REFERENCES는 참조 대상 테이블·열을 지정합니다.","sourceIds":["db-integrity"]},{"id":"sql-code-group","prompt":"부서별 직원 수가 3명 이상인 부서만 조회하려고 합니다. ①·②에 들어갈 영어 SQL 절을 적으세요.","code":"SELECT DEPT_ID, COUNT(*) AS CNT\nFROM EMPLOYEE\n① DEPT_ID\n② COUNT(*) >= 3;","answer":"① GROUP BY\n② HAVING","keywords":["GROUP BY","HAVING"],"explanation":"GROUP BY로 부서별 그룹을 만들고 HAVING으로 집계 결과에 조건을 겁니다.","sourceIds":["sql-having"]},{"id":"sql-code-distinct","prompt":"한국 학생의 거주 도시를 중복 없이 조회하려고 합니다. ①·②에 들어갈 영어 SQL 키워드를 적으세요.","code":"SELECT ① CITY\nFROM STUDENT\n② COUNTRY = 'KR';","answer":"① DISTINCT\n② WHERE","keywords":["DISTINCT","WHERE"],"explanation":"DISTINCT는 조회 결과의 중복을 제거하고 WHERE는 개별 행을 거릅니다.","sourceIds":["sql-distinct","sql-having"]},{"id":"sql-code-insert","prompt":"학생 한 명을 새로 추가하려고 합니다. ①·②에 들어갈 영어 SQL 키워드를 적으세요.","code":"① INTO STUDENT (STUDENT_ID, NAME)\n② (101, '민수');","answer":"① INSERT\n② VALUES","keywords":["INSERT","VALUES"],"explanation":"INSERT INTO 다음에 대상 테이블과 열을 쓰고 VALUES로 넣을 값을 지정합니다.","sourceIds":["sql-language"]},{"id":"sql-code-update","prompt":"학번이 101인 학생의 이름만 변경하려고 합니다. ①·②에 들어갈 영어 SQL 키워드를 적으세요.","code":"① STUDENT\nSET NAME = '지수'\n② STUDENT_ID = 101;","answer":"① UPDATE\n② WHERE","keywords":["UPDATE","WHERE"],"explanation":"UPDATE로 대상 테이블을 정하고 WHERE로 변경할 행을 제한합니다.","sourceIds":["sql-language","sql-having"]}].map(({sourceIds,...q})=>{
 const sources=sourceIds.flatMap(id=>BANK.find(x=>x.id===id).sources);
 return {...q,version:1,sourceIds,category:'SQL 구문 빈칸',sources:[...new Map(sources.map(s=>[s.name+':'+s.page,s])).values()],badges:[]};
});
const isSqlCode=q=>q?.quizType==='sql-code'||q?.id?.startsWith('sql-code-');
const SQL_CODE_BY_CONCEPT=new Map([['db-integrity',SQL_CODE_BANK[0]],['sql-having',SQL_CODE_BANK[1]],['sql-distinct',SQL_CODE_BANK[2]],['sql-language',SQL_CODE_BANK[3]]]);
const MULTI_BY_CONCEPT=new Map(MULTI_TERM_BANK.map(q=>[q.sourceIds[0],q]));
const SQL_SPELLING_BY_CONCEPT=new Map();
for(const q of SQL_SPELLING){
 const sourceId=({'sql-spell-drop':'sql-delete','sql-spell-delete':'sql-delete','sql-spell-where':'sql-having','sql-spell-group-by':'sql-having','sql-spell-having':'sql-having','sql-spell-distinct':'sql-distinct'})[q.id]||'sql-language';
 if(!SQL_SPELLING_BY_CONCEPT.has(sourceId))SQL_SPELLING_BY_CONCEPT.set(sourceId,[]);
 SQL_SPELLING_BY_CONCEPT.get(sourceId).push(q);
}
function conceptVariant(original,variant,quizType){
 return {...variant,id:original.id,version:original.version+1,category:original.category,
   badges:variant.badges,quizType,conceptId:original.id};
}
function questionForConcept(original,allowedIds=null){
 const id=original.id,multi=MULTI_BY_CONCEPT.get(id);
 if(multi&&(!allowedIds||multi.sourceIds.every(source=>allowedIds.includes(source))))
   return conceptVariant(original,multi,'multi-term');
 const code=SQL_CODE_BY_CONCEPT.get(id),spell=SQL_SPELLING_BY_CONCEPT.get(id);
 if(code&&(!allowedIds||code.sourceIds.every(source=>allowedIds.includes(source)))&&
   (!spell?.length||id==='sql-having'||Math.random()<0.5))
   return conceptVariant(original,code,'sql-code');
 if(spell?.length)return conceptVariant(original,C.sample(spell,1)[0],'sql-spell');
 const term=TERM_BY_CONCEPT.get(id);
 return term?conceptVariant(original,term,'term'):original;
}



const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function englishLine(q){
 const ids=q?.sourceIds?.length?q.sourceIds:[q?.conceptId||q?.id?.replace(/^term-/,'')];
 const terms=[...new Set(ids.map(id=>ENGLISH[id]).filter(Boolean))];
 return terms.length?`<p class="english-term"><span>영어 표현</span><strong lang="en">${esc(terms.join(' · '))}</strong></p>`:'';
}

let state=C.empty(),page='home',filter='all',recordId='all',notice='',blocked=false,toastTimer,lessonId=null,conceptIndex=0,returnToQuiz=false,installPrompt=null;
try{const raw=localStorage.getItem(C.KEY);if(raw)state=C.validateState(JSON.parse(raw));}catch{notice='저장된 기록을 읽을 수 없습니다. 원본을 보존하고 있습니다. 백업 · 복원에서 기록을 복구하세요.';blocked=true;}
function toast(message){const t=document.getElementById('toast');t.textContent=message;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.hidden=true,4500);}
function active(){return state.sessions.find(s=>s.id===state.activeSessionId&&s.status==='active');}
function hasWork(s){return s.items.some(a=>a.rating||a.revealed||a.draft?.trim());}
function resumable(bundleId=null){
 const matches=state.sessions.filter(s=>s.status==='active'&&
   (bundleId?s.mode==='bundle'&&s.bundle?.id===bundleId:s.mode==='random'));
 return matches.sort((a,b)=>{
   const progress=x=>x.items.reduce((n,item)=>n+(item.rating?3:item.revealed?2:item.draft?.trim()?1:0),0);
   return progress(b)-progress(a)||Date.parse(b.updatedAt)-Date.parse(a.updatedAt);
 })[0]||null;
}

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
 <div class="study-actions">${cursor&&BUNDLES.some(b=>b.id===cursor.bundleId)?'<button class="primary" data-action="continue-study">읽던 개념 이어 보기</button>':''}${current?`<button class="secondary" data-action="resume">${esc(sessionLabel(current))} 이어 풀기 · ${current.items.length-C.counts(current).ungraded}/${current.items.length}</button>`:''}<button class="secondary" data-action="start">전체 랜덤 30문제</button></div>
 <div class="part-grid">${[...new Set(BUNDLES.map(b=>b.category))].map((category,i)=>{
 const bundles=BUNDLES.filter(b=>b.category===category),ids=bundles.flatMap(b=>b.questionIds),read=ids.filter(isRead).length,done=bundles.filter(completed).length;
 return `<article class="part-card"><span class="eyebrow">PART ${String(i+1).padStart(2,'0')}</span><h2>${esc(category)}</h2><p>읽은 개념 ${read} / ${ids.length}<br>퀴즈 완료 ${done} / ${bundles.length}묶음</p><progress value="${read}" max="${ids.length}" aria-label="${esc(category)} 읽은 개념"></progress><button class="secondary" data-part="${esc(category)}">파트 공부하기 →</button></article>`;
 }).join('')}</div>${installPanel()}<p class="local-note">학습 진도와 풀이 기록은 이 기기의 같은 브라우저에만 저장돼요. <button class="inline-button" data-nav="backup">백업 · 복원</button></p></section>`;
}
let selectedPart=BUNDLES[0].category;
function part(){
 const bundles=BUNDLES.filter(b=>b.category===selectedPart);
 return `<section class="wide-section"><button class="text-button" data-nav="home">← 전체 파트</button><span class="eyebrow">개념 읽기 → 묶음 퀴즈</span><h1>${esc(selectedPart)}</h1><p class="lead">순서대로 시작해도, 필요한 묶음부터 골라도 좋아요.</p><div class="lesson-list">${bundles.map((b,i)=>`<article class="panel"><span class="eyebrow">묶음 ${i+1} · ${b.questionIds.length}개 개념</span><h2>${esc(b.title)}</h2><p>${b.questionIds.map(id=>esc(NOTES[id].title)).join(' · ')}</p><p class="lesson-status">읽음 ${b.questionIds.filter(isRead).length}/${b.questionIds.length} · ${resumable(b.id)?`퀴즈 ${resumable(b.id).items.length-C.counts(resumable(b.id)).ungraded}/${resumable(b.id).items.length} 진행 중`:completed(b)?'퀴즈 완료':'퀴즈 미완료'}</p><div class="study-actions"><button class="primary" data-lesson="${b.id}">개념 보기</button><button class="secondary" data-bundle-quiz="${b.id}">${resumable(b.id)?'퀴즈 이어 풀기':'묶음 퀴즈'}</button></div></article>`).join('')}</div></section>`;
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
 <article class="question-card concept-card"><div class="card-top"><span class="category-label">개념 읽기</span><div>${badges(q)}</div></div><h1>${esc(n.title)}</h1>${englishLine({id})}<h2>쉽게 이해하기</h2><p>${esc(n.easy)}</p><h2>기억할 키워드</h2><div class="keywords">${q.keywords.map(k=>`<span>${esc(k)}</span>`).join('')}</div><h2>시험에서는 이렇게 써요</h2><p class="exam-answer">${esc(q.answer)}</p><details class="concept-more"><summary>예시와 추가 설명 보기</summary><section class="example-box"><h2>이해용 예시 <small>실제 기출 아님</small></h2><p>${esc(n.example)}</p></section><h2>추가 설명</h2><p class="explanation">${esc(q.explanation)}</p></details>
 <button class="secondary read-toggle" data-action="mark-read" ${isRead(id)||blocked?'disabled':''}>${isRead(id)?'✓ 읽음 표시됨':'읽음 표시하기'}</button><p class="local-note">읽음은 이해 완료나 정답을 의미하지 않아요.</p>${sources(q)}</article>
 <div class="quiz-controls"><button class="secondary" data-action="concept-prev" ${conceptIndex===0?'disabled':''}>이전 개념</button>${conceptIndex<b.questionIds.length-1?'<button class="primary" data-action="concept-next">다음 개념 →</button>':`<button class="primary" data-bundle-quiz="${b.id}">${resumable(b.id)?'진행 중인 퀴즈 이어 풀기 →':`이 묶음 ${b.questionIds.length}문제 풀기 →`}</button>`}</div>
 <div class="concept-links" aria-label="묶음의 개념">${b.questionIds.map((id,i)=>`<button class="text-button" data-concept-index="${i}" ${i===conceptIndex?'aria-current="step"':''}>${isRead(id)?'✓ ':''}${esc(NOTES[id].title)}</button>`).join('')}</div></section>`;
}
function bundleResultActions(s){
 if(s.bundle?.id===SQL_BUNDLE_ID)return '<button class="primary" data-part="SQL 개념">SQL 파트 공부하기</button><button class="secondary" data-nav="history">풀이 기록</button>';
 if(s.bundle?.id===SQL_CODE_BUNDLE_ID)return '<button class="primary" data-part="SQL 개념">SQL 파트 공부하기</button><button class="secondary" data-nav="history">풀이 기록</button>';
 if(s.bundle?.id?.startsWith('term-recall:'))return `<button class="primary" ${s.bundle.category==='전체'?'data-nav="home"':`data-part="${esc(s.bundle.category)}"`}>파트 공부하기</button><button class="secondary" data-nav="history">풀이 기록</button>`;
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
 ${a.revealed?`<section class="answer-panel"><span class="eyebrow">철자 확인</span><p class="sql-feedback ${a.rating}">${feedback}</p><p class="sql-correct-answer">${esc(q.answer)}</p>${englishLine(q)}<p class="explanation">${esc(q.explanation)}</p></section>`:`<div class="reveal-row"><p>먼저 직접 입력해 보세요. 두 번 틀리면 정답을 보여 줍니다.</p><button class="primary" data-action="reveal" ${blocked?'disabled':''}>철자 확인</button></div>`}
 ${s.mode==='bundle'&&BUNDLES.some(b=>b.id===s.bundle.id)?'<button class="text-button" data-action="quiz-concept">이 문제 개념 다시 보기</button>':''}${sources(q)}</article>
 <div class="quiz-controls"><button class="secondary" data-action="prev" ${i===0?'disabled':''}>이전 명령어</button><span>${a.rating?`결과: ${labels[a.rating]}`:'철자를 입력하고 확인해 주세요.'}</span><button class="primary" data-action="next" ${!a.rating||blocked?'disabled':''}>다음 명령어 →</button></div>
 <div class="question-dots" aria-label="명령어 이동">${s.items.map((x,j)=>`<button data-index="${j}" class="${x.rating||''} ${i===j?'current':''}" aria-label="${j+1}번 명령어, ${labels[x.rating||'ungraded']}" ${i===j?'aria-current="step"':''}>${j+1}</button>`).join('')}</div></section>`;
}
function quiz(){
  const s=active();if(!s){page='home';return home();}const i=s.index,a=s.items[i],q=a.question,c=C.counts(s),done=s.items.length-c.ungraded;
  if(isSqlSpelling(q))return sqlQuiz(s,a,q);
  const term=isTermRecall(q);
  return `<section class="quiz-shell"><div class="section-heading"><div><span class="eyebrow">${fmt(s.startedAt)} · ${esc(sessionLabel(s))}</span><h1>한 장씩, 내 답으로.</h1></div><button class="text-button" data-nav="home">잠시 쉬기</button></div><div class="progress-meta"><strong>문제 ${String(i+1).padStart(2,'0')} <span>/ ${s.items.length}</span></strong><span>${done}개 평가 완료</span></div><progress value="${done}" max="${s.items.length}" aria-label="평가 완료한 문제 수"></progress><article class="question-card ${term?'term-question':isSqlCode(q)?'sql-code-question':''}"><div class="card-top"><span class="category-label">${term?'용어 맞히기 · ':''}${esc(q.category)}</span><div>${badges(q)}</div></div><h2 id="question-title">${esc(q.prompt)}</h2>${isSqlCode(q)?`<pre class="sql-code">${esc(q.code)}</pre>`:''}<label class="answer-label" for="answer">${isSqlCode(q)?'빈칸 답안':term?'용어·명칭':'내 답안'} <small>${isSqlCode(q)?'①·②에 들어갈 영어 키워드를 줄마다 적으세요.':isMultiTerm(q)?'번호별 명칭을 줄마다 적어 보세요.':term?'짧은 명칭을 직접 적어 보세요.':'핵심 단어부터 차근차근 써 보세요.'}</small></label><textarea id="answer" class="${term||isSqlCode(q)?'term-answer':''}" maxlength="${isMultiTerm(q)||isSqlCode(q)?300:term?120:20000}" rows="${isMultiTerm(q)?5:isSqlCode(q)?3:term?2:5}" placeholder="여기에 답을 작성하세요." ${a.revealed?'readonly':''}>${esc(a.draft)}</textarea><div class="input-foot"><span id="save-state">${notice?'저장 상태를 확인해 주세요.':'이 브라우저에 자동 저장'}</span><span id="char-count">${a.draft.length.toLocaleString()} / ${isMultiTerm(q)||isSqlCode(q)?'300':term?'120':'20,000'}자</span></div>${a.revealed?`<section class="answer-panel"><span class="eyebrow">${isSqlCode(q)?'정답 SQL 키워드':term?'정답 용어':'모범답안'}</span><p>${esc(q.answer)}</p>${englishLine(q)}${term?`<details class="concept-more"><summary>설명 다시 보기</summary><p class="explanation">${esc(q.explanation)}</p></details>`:`<div class="keywords">${q.keywords.map(k=>`<span>${esc(k)}</span>`).join('')}</div><p class="explanation">${esc(q.explanation)}</p>`}</section><div class="self-rating"><h3>${term?'명칭을 맞혔나요?':'내 답을 평가해 보세요.'}</h3><p>${isSqlCode(q)?'모든 키워드의 철자와 위치를 맞히면 정답, 일부만 맞히면 부분정답으로 표시하세요.':isMultiTerm(q)?'모든 빈칸을 맞히면 정답, 일부만 맞히면 부분정답으로 표시하세요.':term?'정답과 같은 용어를 썼다면 정답으로 표시하세요. 통용되는 다른 명칭은 해설을 보고 판단하세요.':'핵심 의미를 담았다면 표현이 달라도 괜찮아요.'}</p><div class="rating-buttons">${C.RATINGS.map(k=>`<button class="rating ${k} ${a.rating===k?'selected':''}" aria-pressed="${a.rating===k}" data-rating="${k}" ${blocked?'disabled':''}>${k==='correct'?'✓':k==='partial'?'△':'×'} ${labels[k]}</button>`).join('')}</div></div>`:`<div class="reveal-row"><p>${isSqlCode(q)?'코드의 빈칸을 직접 채운 뒤 확인해 보세요.':term?'명칭을 먼저 떠올려 적어 보세요.':'빈 답안으로 확인해도 괜찮아요.'}</p><button class="primary" data-action="reveal" ${blocked?'disabled':''}>정답 확인</button></div>`}${s.mode==='bundle'&&BUNDLES.some(b=>b.id===s.bundle.id)?'<button class="text-button" data-action="quiz-concept">이 문제 개념 다시 보기</button>':''}${isTermRecall(q)&&s.mode!=='bundle'?`<button class="text-button" data-term-concept="${esc(q.conceptId||q.id.slice(5))}">이 용어 개념 읽기</button>`:''}${sources(q)}</article><div class="quiz-controls"><button class="secondary" data-action="prev" ${i===0?'disabled':''}>이전 문제</button><span>${a.rating?`내 평가: ${labels[a.rating]}`:'정답을 확인하고 평가해 주세요.'}</span><button class="primary" data-action="next" ${!a.rating||blocked?'disabled':''}>${i===s.items.length-1?'미평가 문제로':'다음 문제 →'}</button></div><div class="question-dots" aria-label="문제 이동">${s.items.map((x,j)=>`<button data-index="${j}" class="${x.rating||''} ${i===j?'current':''}" aria-label="${j+1}번 문제, ${labels[x.rating||'ungraded']}" ${i===j?'aria-current="step"':''}>${j+1}</button>`).join('')}</div></section>`;
}
function result(){const s=state.sessions.find(s=>s.id===recordId);if(!s){page='history';return history();}return `<section class="wide-section"><div class="result-heading"><span class="eyebrow">${s.items.length}장의 기록이 쌓였어요</span><h1>${s.bundle?.id===SQL_BUNDLE_ID?'SQL 영문 쓰기 완료.':s.bundle?.id===SQL_CODE_BUNDLE_ID?'SQL 구문 빈칸 완료.':s.bundle?.id?.startsWith('term-recall:')?'용어 맞히기 완료.':'오늘의 개념 학습 완료.'}</h1><p>${fmt(s.startedAt)} · ${s.bundle?.id===SQL_BUNDLE_ID?'철자와 띄어쓰기를 확인한 연습 결과입니다. 틀리거나 두 번째에 맞힌 명령어는 다음 연습에서 우선 나와요.':s.bundle?.id===SQL_CODE_BUNDLE_ID?'영어 SQL 키워드와 구문을 직접 써 보고 자기평가한 기록입니다.':s.bundle?.id?.startsWith('term-recall:')?'명칭을 직접 적고 자기평가한 기록입니다. 헷갈린 용어는 다음 연습에서 우선 나와요.':'실제 시험 점수가 아닌 자기평가 결과입니다.'}</p></div>${stats(s)}<div class="result-actions"><button class="primary" data-action="review-result">이번 회차 복습</button>${bundleResultActions(s)}</div><div class="result-preview">${s.items.filter(a=>a.rating!=='correct').slice(0,5).map(a=>`<p><span class="result-label ${a.rating}">${labels[a.rating]}</span>${esc(a.question.prompt)}</p>`).join('')||'<p>모든 문제를 정답으로 평가했어요. 시간이 지난 뒤 다시 떠올려 보세요.</p>'}</div></section>`;}
function history(){
  const sorted=state.sessions.filter(s=>s.status==='completed'||hasWork(s)||s.id===state.activeSessionId).sort((a,b)=>Date.parse(b.startedAt)-Date.parse(a.startedAt));
  if(recordId!=='all'&&!sorted.some(s=>s.id===recordId))recordId='all';
  const selected=recordId==='all'?sorted:sorted.filter(s=>s.id===recordId);
  const records=selected.flatMap(s=>s.items.map((a,i)=>({s,a,i}))).filter(({a})=>a.revealed||a.rating||a.draft).filter(({a})=>filter==='all'||(filter==='star'?a.question.badges.length>0:a.rating===filter));
  return `<section class="wide-section"><div class="section-heading"><div><span class="eyebrow">차곡차곡 쌓인 나의 답</span><h1>풀이 기록</h1></div><button class="secondary" data-action="export">기록 백업</button></div>${!sorted.length?`<div class="empty-state"><span class="empty-icon">▤</span><h2>아직 풀어본 문제가 없어요.</h2><p>퀴즈를 풀면 내 답과 모범답안이 이곳에 모입니다.</p><button class="primary" data-action="start">첫 학습 시작</button></div>`:`<div class="history-toolbar"><label for="session-filter">회차</label><select id="session-filter"><option value="all">모든 회차 (${sorted.length})</option>${sorted.map((s,i)=>`<option value="${esc(s.id)}" ${recordId===s.id?'selected':''}>${fmt(s.startedAt)} · ${esc(sessionLabel(s))} · ${s.status==='completed'?'완료':`${s.items.length-C.counts(s).ungraded}/${s.items.length} 진행 중`}</option>`).join('')}</select></div><div class="filter-tabs" role="group" aria-label="복습 필터">${[['all','전체'],['wrong','오답'],['partial','부분정답'],['star','★ 별표']].map(([v,t])=>`<button data-filter="${v}" class="${v===filter?'active':''}" aria-pressed="${v===filter}">${t}</button>`).join('')}</div>${selected.length===1?`<div class="session-overview">${stats(selected[0])}${selected[0].status==='active'?`<button class="secondary" data-resume="${esc(selected[0].id)}">이 회차 이어 풀기</button>`:''}</div>`:''}<p class="record-count">${records.length}개의 풀이 기록 · 문제를 펼치면 내 답과 해설을 볼 수 있어요.</p><div class="record-list">${records.length?records.map(({s,a,i})=>`<details class="record"><summary><div class="record-title"><span class="record-meta">${esc(sessionLabel(s))} · ${esc(a.question.category)} · ${fmt(s.startedAt)} · ${i+1}번</span><strong>${esc(a.question.prompt)}</strong><div>${badges(a.question)}</div></div><span class="result-label ${a.rating||'ungraded'}">${labels[a.rating||'ungraded']}</span></summary><div class="record-body">${isSqlCode(a.question)?`<h3>문제 SQL</h3><pre class="sql-code">${esc(a.question.code)}</pre>`:''}<h3>내 답안</h3><p class="my-answer">${esc(a.draft)||'작성한 답안이 없습니다.'}</p>${a.revealed?`<h3>모범답안</h3><p>${esc(a.question.answer)}</p>${englishLine(a.question)}<div class="keywords">${a.question.keywords.map(k=>`<span>${esc(k)}</span>`).join('')}</div><p class="explanation">${esc(a.question.explanation)}</p>${sources(a.question)}`:`<p>아직 정답을 확인하지 않은 문제입니다.</p><button class="secondary" data-resume="${esc(s.id)}" data-position="${i}">이 문제 이어 풀기</button>`}</div></details>`).join(''):'<div class="empty-state compact"><h2>해당하는 풀이 기록이 없어요.</h2><p>다른 필터를 선택하거나 학습을 이어가세요.</p></div>'}</div>`}</section>`;
}
function backup(){return `<section class="wide-section backup-section"><span class="eyebrow">나의 학습 기록을 안전하게</span><h1>백업 · 복원</h1><p class="lead">기록은 현재 기기의 같은 브라우저에만 저장됩니다.<br>브라우저 데이터를 지우거나 기기를 바꾸기 전에 백업해 주세요.</p><div class="backup-grid"><article class="panel"><span class="panel-symbol">↓</span><h2>기록 내보내기</h2><p>개념 학습 진도와 모든 회차의 답안을<br>하나의 JSON 파일로 저장합니다.</p><button class="primary" data-action="export">백업 파일 다운로드</button><small>${state.sessions.length}개 회차 저장 중</small>${blocked?'<button class="text-button" data-action="export-raw">복구용 원본 내려받기</button>':''}</article><article class="panel"><span class="panel-symbol">↑</span><h2>백업 불러오기</h2><p>기존 기록에 백업을 합칩니다.<br>같은 회차는 더 최근 기록을 유지합니다.</p><label class="file-picker" for="import-file">백업 파일 선택<input id="import-file" type="file" accept=".json,application/json"></label><small>이 앱에서 내려받은 JSON 파일 · 최대 20MB</small></article></div><div class="info-note"><strong>알아두세요</strong><p>다른 기기와 자동으로 동기화되지는 않습니다. 다른 기기에서도 백업 파일을 불러오면 기록을 이어 볼 수 있어요. 앱 주소나 브라우저가 달라질 때도 백업을 먼저 저장해 주세요.</p></div><div id="import-message" role="status"></div></section>`;}
function render(){
  app.className='single-view';app.innerHTML=(notice?`<div class="storage-warning" role="alert">${esc(notice)} <button data-action="export">지금 백업</button>${blocked?'<button data-action="reload">새로고침</button>':''}</div>`:'')+({home,part,concept,quiz,history,backup,result}[page]||home)();
  document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===(['quiz','part','concept'].includes(page)?'home':page==='result'?'history':page)));
}
function go(view){page=view;render();window.scrollTo({top:0,behavior:'instant'});}
function start(bundleId=null){
  if(blocked){toast('백업 · 복원에서 기록을 복구해 주세요.');return;}
  const bundle=bundleId?BUNDLES.find(b=>b.id===bundleId):null;if(bundleId&&!bundle)return;
  const existing=resumable(bundleId);
  if(existing){state.activeSessionId=existing.id;persist();go('quiz');return;}
  if(active()&&hasWork(active())&&!confirm('다른 퀴즈의 풀이가 저장되어 있어요. 새 퀴즈를 시작할까요?'))return;
  const id=crypto.randomUUID?crypto.randomUUID():`s-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const bank=BANK.map(q=>questionForConcept(q,bundle?.questionIds||[q.id]));
  const s=bundle?C.createBundleSession(bank,bundle,id):C.createSession(bank,id);state.sessions.unshift(s);state.activeSessionId=s.id;persist();go('quiz');
}
function download(data,name){const blob=new Blob([typeof data==='string'?data:JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportData(){download({...state,exportedAt:new Date().toISOString()},`개념한장_백업_${new Date().toISOString().slice(0,10)}.json`);toast('백업 파일을 내려받았습니다.');}
app.addEventListener('input',e=>{if(e.target.id==='answer'){const s=active();if(!s||s.items[s.index].revealed||blocked)return;s.items[s.index].draft=e.target.value;stamp(s);const ok=persist();document.getElementById('char-count').textContent=`${e.target.value.length.toLocaleString()} / ${isSqlSpelling(s.items[s.index].question)?'40':isMultiTerm(s.items[s.index].question)||isSqlCode(s.items[s.index].question)?'300':isTermRecall(s.items[s.index].question)?'120':'20,000'}자`;const status=document.getElementById('save-state');if(status){status.textContent=ok?'자동 저장됨':'저장 실패 · 지금 백업해 주세요';status.classList.toggle('save-error',!ok);}if(!ok&&!document.querySelector('.storage-warning'))render();}});
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
  if(b.dataset.termConcept){const target=BUNDLES.find(x=>x.questionIds.includes(b.dataset.termConcept));if(target)openLesson(target.id,target.questionIds.indexOf(b.dataset.termConcept),true);return;}
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
    case 'start':start();break;case 'resume':go('quiz');break;case 'export':exportData();break;
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
