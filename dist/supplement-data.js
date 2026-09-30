/* Original concise lessons and exercises. Topic coverage checked against the
   Ryan review note and its 251124 errata; examples are newly authored. */
(()=>{
const bank=window.QUIZ_BANK,notes=window.LEARNING_NOTES,english=window.LEARNING_ENGLISH;
const variants=window.SUPPLEMENT_VARIANTS=[];
const source=page=>[{name:'(복습용) [꿈꾸는라이언] 정보처리기사 실기 요약노트 (이론편).pdf',page:page+2}];
function group(key,category,title,page,rows){
 const ids=[];
 for(const [slug,name,en,definition,example,answer=name,format='term',prompt] of rows){
  const id='extra-'+key+'-'+slug;ids.push(id);
  bank.push({id,version:1,category,prompt:prompt||'다음 설명에 해당하는 용어를 쓰시오.\n'+definition,
   answer:definition,keywords:[name],explanation:example,sources:source(page),badges:[]});
  notes[id]={id,version:1,title:name,easy:definition,example};english[id]=en;
  variants.push({id:'exam-'+id,conceptId:id,version:1,category,
   prompt:prompt||'다음 설명에 해당하는 용어를'+(format==='english-abbreviation'?' 영문 약어로':format==='english-either'?' 영문 전체 이름 또는 약어로':'')+' 쓰시오.\n'+definition,
   answer,keywords:[answer],responseFormat:format,quizType:'term',sources:source(page),badges:[],explanation:definition+' '+example});
 }
 for(let i=0;i<ids.length;i+=5)window.LEARNING_BUNDLES.push({id:'extra-'+key+'-'+(i/5+1),version:1,category,title:title+(ids.length>5?' '+(i/5+1):''),questionIds:ids.slice(i,i+5)});
 return ids;
}
const sw='소프트웨어 설계',test='테스트',db='데이터베이스',os='운영체제',net='네트워크',sec='정보보안',it='인터페이스·IT 용어',sql='SQL 개념';
group('white',test,'화이트박스 검사 기법',4,[
 ['basis','기초 경로 검사','Basis Path Testing','제어 흐름의 논리적 복잡도를 이용해 독립적인 실행 경로를 선정하는 구조 기반 검사이다.','분기 수로 복잡도를 구하고 각 독립 경로를 실행할 입력을 정한다.'],
 ['control','제어 구조 검사','Control Structure Testing','프로그램의 조건, 반복 구조, 변수의 정의와 사용을 기준으로 시험하는 검사 기법의 묶음이다.','조건 검사·루프 검사·자료 흐름 검사를 포함한다.'],
 ['condition','조건 검사','Condition Testing','프로그램의 논리 조건에 오류가 있는지 확인하는 구조 기반 검사이다.','A와 B의 조합으로 조건식의 결과를 확인한다.'],
 ['loop','루프 검사','Loop Testing','반복문의 실행 횟수와 반복 구조의 오류를 확인하는 검사이다.','반복을 하지 않는 경우, 한 번 하는 경우, 최대 횟수 주변을 시험한다.'],
 ['dataflow','자료 흐름 검사','Data Flow Testing','변수가 정의되는 위치와 사용되는 위치의 연결을 기준으로 실행 경로를 시험한다.','값을 넣지 않은 변수를 사용하는 경로가 있는지 확인한다.']
]);
group('black',test,'블랙박스와 경험 기반 기법',4,[
 ['cause','원인-효과 그래프 검사','Cause-Effect Graphing','입력 조건과 결과 사이의 논리 관계를 그래프로 표현해 테스트 조합을 정한다.','회원 여부와 쿠폰 여부를 원인으로 두고 할인 결과를 분석한다.'],
 ['comparison','비교 검사','Comparison Testing','동일한 입력을 여러 구현이나 버전에 적용해 출력 결과를 비교한다.','기존 계산기와 새 계산기에 같은 값을 넣어 결과를 비교한다.'],
 ['guess','오류 예측','Error Guessing','테스터의 경험과 과거 결함을 바탕으로 오류가 발생할 만한 사례를 선정한다.','빈 입력이나 중복 클릭을 예상해 시험한다. 요약노트에서는 블랙박스 종류에도 묶지만, 경험 기반이라는 기준을 함께 기억한다.'],
 ['table','결정 테이블 테스트','Decision Table Testing','조건과 행동의 조합을 표로 정리하고 각 규칙에 맞는 시험을 설계한다.','가입 여부와 결제 여부의 조합마다 접근 허용 결과를 확인한다.'],
 ['transition','상태 전이 테스트','State Transition Testing','상태와 이벤트에 따른 전이 및 동작을 기준으로 시험을 설계한다.','잠금 상태에서는 올바른 비밀번호를 입력해도 바로 로그인되지 않는 규칙을 시험한다.']
]);
// The final two black-box topics are standard supplementary techniques,
// rather than claims that they occur in the Ryan page.
for(const slug of ['table','transition']){
 const q=bank.find(q=>q.id==='extra-black-'+slug);q.sources=[{name:'ISTQB CTFL Syllabus v4.0.1 · 4.2.3~4.2.4',page:41}];
 variants.find(v=>v.conceptId===q.id).sources=q.sources;
}
group('coverage',test,'커버리지 기준 확장',4,[
 ['combined','조건/결정 커버리지','Condition/Decision Coverage','각 개별 조건과 전체 결정이 모두 참·거짓으로 평가되도록 하는 기준이다.','개별 조건을 바꿨더라도 전체 결정이 항상 참이면 이 기준을 충족하지 못한다.'],
 ['multiple','다중 조건 커버리지','Multiple Condition Coverage','결정에 포함된 개별 조건들의 가능한 참·거짓 조합을 모두 시험하는 기준이다.','독립적인 조건 A·B라면 TT·TF·FT·FF의 네 조합을 고려한다.']
]);
group('reviews',test,'검토와 테스트 관점',4,[
 ['peer','동료 검토','Peer Review','작성자가 산출물을 설명하고 동료들이 결함을 검토하는 방식이다.','명세서를 작성한 사람이 내용을 설명하고 동료들이 누락된 요구를 찾는다.'],
 ['walk','워크스루','Walkthrough','산출물을 사전에 배포하고 작성자의 안내에 따라 내용을 따라가며 검토한다.','회의 전에 문서를 읽고 대표 시나리오를 단계별로 살펴본다.'],
 ['inspection','인스펙션','Inspection','정해진 역할과 절차에 따라 산출물의 결함을 공식적으로 검토한다.','검토자들이 체크리스트로 결함을 찾고 결과를 기록한다.'],
 ['verify','검증','Verification','산출물이 명세와 정해진 요구에 맞게 만들어졌는지 확인한다.','설계대로 모듈을 구현했는지 점검한다.'],
 ['validate','확인','Validation','제품이 사용자의 실제 목적과 요구를 충족하는지 확인한다.','완성된 예약 시스템이 사용자의 예약 업무에 적합한지 확인한다.']
]);
group('purposes',test,'목적에 따른 테스트',4,[
 ['recovery','회복 테스트','Recovery Testing','장애를 발생시킨 뒤 시스템이 정상 상태로 복구되는지 시험한다.','서버를 중단한 뒤 재시작했을 때 주문 데이터가 복구되는지 확인한다.'],
 ['security','보안 테스트','Security Testing','인가되지 않은 접근이나 공격으로부터 시스템을 보호할 수 있는지 시험한다.','권한 없는 사용자의 관리자 기능 접근을 시험한다.'],
 ['stress','강도 테스트','Stress Testing','정상 처리 한계를 넘는 부하나 자원 부족에서 시스템의 동작을 확인한다.','예상보다 많은 동시 요청을 주고 실패와 복구 동작을 확인한다.'],
 ['performance','성능 테스트','Performance Testing','응답 시간과 처리량 등의 지표로 시스템의 처리 성능을 확인한다.','초당 요청 수와 응답 지연을 측정한다.'],
 ['parallel','병행 테스트','Parallel Testing','기존 시스템과 새 시스템에 같은 데이터를 넣어 결과를 비교한다.','같은 급여 자료를 두 시스템에서 계산한다. DB 병행 제어와 구별한다.']
]);
group('harness',test,'테스트 도구와 산출물',5,[
 ['harness','테스트 하네스','Test Harness','시험 실행과 결과 확인을 지원하는 드라이버·스텁 등의 환경과 도구 모음이다.','미완성 연동 모듈을 대체해 대상 모듈을 실행한다.'],
 ['suite','테스트 슈트','Test Suite','함께 실행하거나 관리하는 테스트 케이스들의 집합이다.','로그인 성공·실패·잠금 케이스를 한 묶음으로 관리한다.'],
 ['script','테스트 스크립트','Test Script','테스트를 실행할 구체적인 절차를 기술한 것이다.','화면 열기, 값 입력, 제출, 결과 비교의 절차를 자동화한다.'],
 ['mock','목 객체','Mock Object','실제 의존 객체를 대신하며 예상한 호출과 상호작용을 검증하는 시험용 객체이다.','알림 서비스가 한 번 호출됐는지 확인한다.'],
 ['scenario','테스트 시나리오','Test Scenario','사용 흐름이나 테스트 목적에 따라 시험할 동작과 순서를 정리한 것이다.','장바구니 추가부터 결제와 취소까지의 흐름을 정한다.']
]);
group('metrics',test,'성능 측정 지표',5,[
 ['throughput','처리량','Throughput','일정 시간 동안 시스템이 처리한 작업의 양이다.','1초에 주문 200건을 처리하면 초당 처리량은 200건이다.'],
 ['response','응답 시간','Response Time','요청을 보낸 시점부터 응답을 받을 때까지 걸린 시간이다.','검색을 요청하고 결과가 표시될 때까지 측정한다.'],
 ['turnaround','경과 시간','Turnaround Time','작업을 요청한 시점부터 해당 작업이 완료될 때까지의 전체 시간이다.','배치 작업의 대기 시간과 실행 시간을 모두 포함한다.'],
 ['resource','자원 사용률','Resource Utilization','작업 처리 동안 CPU·메모리 등의 자원을 사용하는 비율이다.','CPU 사용률이 95%인지 측정해 병목을 조사한다.']
]);
group('uml-structure',sw,'UML 구조 다이어그램 확장',2,[
 ['component','컴포넌트 다이어그램','Component Diagram','구현 단위와 제공·요구 인터페이스 및 의존 관계를 나타낸다.','주문 컴포넌트와 결제 컴포넌트의 연결을 표현한다.'],
 ['package','패키지 다이어그램','Package Diagram','모델 요소를 그룹으로 묶고 그룹 간 의존 관계를 나타낸다.','주문 패키지가 회원 패키지를 사용하는 관계를 표시한다.'],
 ['composite','복합체 구조 다이어그램','Composite Structure Diagram','클래스나 컴포넌트 내부의 부분 요소와 연결 구조를 나타낸다.','결제 컴포넌트 내부의 승인부와 기록부 연결을 표현한다.']
]);
group('uml-behavior',sw,'UML 행위 다이어그램 확장',2,[
 ['communication','커뮤니케이션 다이어그램','Communication Diagram','객체 사이의 연결 관계와 주고받는 메시지를 함께 나타낸다.','연결선에 번호를 붙여 메시지 순서를 표시한다.'],
 ['state','상태 다이어그램','State Machine Diagram','이벤트에 따른 객체의 상태 변화와 전이를 나타낸다.','주문이 대기·결제·취소 상태로 바뀌는 과정을 표시한다.'],
 ['activity','활동 다이어그램','Activity Diagram','활동의 실행 흐름과 분기·병렬 처리를 나타낸다.','주문 승인 후 포장과 송장 생성을 병렬로 수행한다.'],
 ['timing','타이밍 다이어그램','Timing Diagram','시간에 따른 상태 변화와 시간 제약을 나타낸다.','신호의 상태가 정해진 시간 구간마다 바뀌는 모습을 표현한다.'],
 ['overview','상호작용 개요 다이어그램','Interaction Overview Diagram','여러 상호작용 사이의 제어 흐름을 높은 수준에서 나타낸다.','로그인 상호작용 이후 결제 또는 재시도 흐름을 연결한다.']
]);
group('uml-relations',sw,'UML 관계 구별',2,[
 ['association','연관 관계','Association','객체들이 서로 연결되거나 관련되어 있음을 나타내는 관계이다.','고객과 주문의 연결을 실선으로 표현한다.'],
 ['aggregation','집합 관계','Aggregation','전체와 부분의 관계이며 부분이 전체와 독립적으로 존재할 수 있다.','전체 쪽에 빈 마름모를 둔다. 팀이 없어져도 팀원은 존재할 수 있다.'],
 ['composition','합성 관계','Composition','전체가 부분의 생명주기를 소유하는 강한 전체-부분 관계이다.','전체 쪽에 채운 마름모를 둔다. 요약노트의 포함 관계라는 명칭과 연결한다.'],
 ['generalization','일반화 관계','Generalization','구체적인 하위 타입과 공통적인 상위 타입 사이의 관계이다.','상위 타입 쪽에 빈 삼각형과 실선을 표시한다.'],
 ['dependency','의존 관계','Dependency','한 요소의 변경이 이를 사용하는 다른 요소에 영향을 줄 수 있는 관계이다.','사용 대상 쪽으로 점선 화살표를 표시한다.'],
 ['realization','실체화 관계','Realization','인터페이스 등이 정한 계약을 구현 요소가 실현하는 관계이다.','인터페이스 쪽에 빈 삼각형과 점선을 표시한다.']
]);
group('cohesion',sw,'응집도 종류별 특징',3,[
 ['coincidental','우연적 응집도','Coincidental Cohesion','관련 없는 작업들이 한 모듈에 함께 들어 있는 경우이다.','환율 계산과 파일 삭제를 이유 없이 같은 모듈에 둔다.'],
 ['logical','논리적 응집도','Logical Cohesion','성격이 비슷한 작업들을 모으고 선택값에 따라 하나를 수행한다.','읽기 종류를 선택하는 플래그로 파일·키보드 입력 중 하나를 실행한다.'],
 ['temporal','시간적 응집도','Temporal Cohesion','같은 시점에 수행되는 작업들을 한 모듈에 묶는다.','시작할 때 수행할 로그 초기화와 캐시 초기화를 묶는다.'],
 ['procedural','절차적 응집도','Procedural Cohesion','정해진 실행 순서를 따르는 작업들을 묶지만 결과 데이터가 이어질 필요는 없다.','첫 작업의 출력이 다음 입력이 되는 순차적 응집도와 구별한다.'],
 ['communicational','통신적 응집도','Communicational Cohesion','같은 입력이나 출력 데이터를 사용하는 작업들을 한 모듈에 묶는다.','같은 고객 레코드로 주소와 등급을 갱신한다.'],
 ['sequential','순차적 응집도','Sequential Cohesion','한 작업의 출력이 다음 작업의 입력으로 이어진다.','원문을 읽고 그 결과를 변환한 뒤 변환 결과를 저장한다.'],
 ['functional','기능적 응집도','Functional Cohesion','모듈의 모든 요소가 하나의 명확한 기능을 수행하는 데 집중한다.','세금 계산만 수행하는 모듈이다. 응집도 순서에서 가장 높다.']
]);
group('coupling',sw,'결합도 종류별 특징',3,[
 ['data','자료 결합도','Data Coupling','모듈들이 필요한 개별 데이터 값만 인자로 주고받는다.','계산 함수에 금액과 세율만 전달한다.'],
 ['stamp','스탬프 결합도','Stamp Coupling','복합 자료구조를 통째로 전달해 일부 필드를 사용하는 방식으로 연결된다.','이름만 필요하지만 전체 회원 객체를 전달한다.'],
 ['control','제어 결합도','Control Coupling','다른 모듈의 처리 방법을 선택하는 제어값을 전달한다.','동작 모드를 나타내는 플래그로 호출 대상의 분기를 결정한다.'],
 ['external','외부 결합도','External Coupling','외부에서 정한 파일 형식·프로토콜·장치 인터페이스 등에 함께 의존한다.','두 모듈이 같은 외부 파일 규격에 맞춰 동작한다.'],
 ['common','공통 결합도','Common Coupling','여러 모듈이 같은 전역 데이터나 공통 데이터 영역에 접근한다.','전역 설정 변수를 여러 모듈에서 읽고 바꾼다.'],
 ['content','내용 결합도','Content Coupling','한 모듈이 다른 모듈의 내부 코드나 데이터를 직접 참조·변경한다.','다른 모듈의 내부 변수를 직접 수정한다. 결합도 순서에서 가장 높다.']
]);
group('planning',sw,'비용과 일정 산정',1,[
 ['loc','LOC','Lines of Code (LOC)','예상 소스 코드 줄 수를 바탕으로 개발 규모와 비용을 추정한다.','낙관치 a, 기대치 m, 비관치 b이면 예상치는 (a+4m+b)/6이다.','LOC','english-abbreviation'],
 ['cocomo','COCOMO','Constructive Cost Model (COCOMO)','보헴이 제안한 소스 코드 규모 기반의 비용 추정 모형이다.','조직형·반분리형·내장형을 구별한다.','COCOMO','english-abbreviation'],
 ['putnam','Putnam 모형','Putnam Model','개발 노력의 시간별 분포를 이용해 소프트웨어 비용을 추정한다.','Rayleigh-Norden 곡선과 SLIM 도구를 연결한다.','Putnam'],
 ['fp','기능 점수','Function Point (FP)','입력·출력·질의·파일·외부 인터페이스 등 제공 기능의 크기를 가중치로 산정한다.','코드 줄 수 대신 사용자에게 제공하는 기능을 기준으로 한다.','FP','english-abbreviation'],
 ['cpm','CPM','Critical Path Method (CPM)','의존 관계가 있는 작업들 중 가장 오래 걸리는 경로로 최소 완료 기간을 구한다.','임계 경로의 작업이 지연되면 프로젝트 완료도 지연될 수 있다.','CPM','english-abbreviation'],
 ['pert','PERT','Program Evaluation and Review Technique (PERT)','작업 기간이 불확실할 때 여러 시간 추정치를 사용해 일정을 분석한다.','낙관·최빈·비관 시간으로 기대 작업 시간을 구한다.','PERT','english-abbreviation'],
 ['gantt','간트 차트','Gantt Chart','작업별 시작·종료와 기간을 시간축의 막대로 표시한다.','작업 기간은 보기 쉽지만 의존 관계 표현은 별도로 고려한다.'],
 ['wbs','WBS','Work Breakdown Structure (WBS)','프로젝트 범위를 관리 가능한 산출물과 작업으로 계층적으로 나눈다.','쇼핑몰 작업을 주문·결제·배송으로 나누고 더 세분화한다.','WBS','english-abbreviation']
]);
group('analysis',sw,'분석과 설계 도구',1,[
 ['dfd','자료 흐름도','Data Flow Diagram (DFD)','처리 과정 사이에서 데이터가 이동하고 저장되는 흐름을 표현한다.','처리·자료 흐름·자료 저장소·외부 개체를 구별한다.','DFD','english-abbreviation'],
 ['dd','자료 사전','Data Dictionary','데이터 항목의 의미와 구성·반복·선택 등을 정의한다.','=는 정의, +는 구성, []는 선택, {}는 반복, ()는 생략을 나타낸다.'],
 ['hipo','HIPO','Hierarchy plus Input-Process-Output (HIPO)','기능의 계층 구조와 각 기능의 입력·처리·출력을 표현한다.','하향식 설계에서 전체 기능을 단계별로 세분화한다.','HIPO','english-abbreviation'],
 ['formal','정형 명세','Formal Specification','수학적 표기와 논리를 이용해 요구사항을 정확히 기술한다.','Z나 VDM 같은 표기법을 사용하며 자연어 설명과 구별한다.'],
 ['xp-practices','XP 실천 방법','XP Practices','짝 프로그래밍·테스트 주도 개발·지속적 통합·리팩터링 등을 통해 짧은 개발 반복을 지원한다.','두 사람이 함께 코드를 작성하는 방법의 명칭을 떠올린다.','짝 프로그래밍','term','두 개발자가 한 작업 공간에서 역할을 나누어 코드를 함께 작성하는 XP 실천 방법의 명칭을 쓰시오.']
]);
group('architectures',sw,'아키텍처와 추상화',2,[
 ['layer','계층 패턴','Layered Architecture','시스템을 역할별 계층으로 나누고 계층 간 인터페이스로 연결한다.','화면·업무·데이터 접근 계층을 나눈다.'],
 ['client','클라이언트-서버 패턴','Client-Server Architecture','서비스 요청자와 서비스 제공자를 분리한다.','브라우저가 서버에 요청하고 서버가 응답한다.'],
 ['pipe','파이프-필터 패턴','Pipe-and-Filter Architecture','여러 처리 단계를 필터로 나누고 데이터 흐름으로 연결한다.','읽기 → 변환 → 집계 필터를 연결한다.'],
 ['abstraction','추상화','Abstraction','필요한 특징을 강조하고 불필요한 세부사항을 숨겨 모델을 단순화한다.','과정·자료·제어 추상화라는 관점을 구별한다.'],
 ['ioc','제어의 역흐름','Inversion of Control (IoC)','애플리케이션 대신 프레임워크가 실행 흐름과 호출을 관리한다.','프레임워크가 등록된 처리 함수를 필요한 시점에 호출한다.','IoC','english-either']
]);
group('quality',sw,'품질과 변경 관리',5,[
 ['smell','코드 스멜','Code Smell','중복 코드나 긴 메서드처럼 설계·유지보수 문제를 의심하게 하는 징후이다.','당장 오류가 없어도 수정이 어려운 구조일 수 있다.'],
 ['refactor','리팩터링','Refactoring','외부 동작을 유지하면서 코드 내부 구조를 개선한다.','중복 코드를 공통 함수로 정리한다.'],
 ['git','Git','Git','개발자의 지역 저장소가 이력을 보유하는 분산 버전 관리 도구이다.','지역 커밋과 원격 반영을 구별한다.'],
 ['svn','SVN','Subversion (SVN)','중앙 저장소를 기준으로 변경 이력을 관리하는 버전 관리 도구이다.','Git의 분산 저장소 방식과 비교한다.','SVN','english-abbreviation'],
 ['spice','SPICE','Software Process Improvement and Capability Determination (SPICE)','프로세스 수행 능력을 불완전부터 최적화까지 평가하는 체계이다.','능력 수준은 0~5이며 불완전·수행·관리·확립·예측 가능·최적화 순서이다.','SPICE','english-abbreviation']
]);
group('db-model',db,'데이터 모델과 추가 무결성',6,[
 ['entity','개체','Entity','현실에서 독립적으로 구별할 수 있는 대상이다.','ER 그림에서 보통 사각형으로 표시한다.'],
 ['relationship','관계','Relationship','개체 사이의 의미 있는 연관을 나타낸다.','고객이 주문을 생성하는 연결을 표현한다.'],
 ['domain-integrity','도메인 무결성','Domain Integrity','속성 값이 정해진 자료형·범위·허용 값에 맞아야 한다는 제약이다.','점수는 0~100 범위의 정수로 제한한다.'],
 ['user-integrity','사용자 정의 무결성','User-defined Integrity','업무에서 정한 추가 규칙을 데이터가 충족하도록 한다.','종료일이 시작일보다 이르지 않도록 제한한다.'],
 ['model-elements','데이터 모델 구성 요소','Structure / Operation / Constraint','데이터의 구조, 데이터를 처리하는 연산, 지켜야 할 제약 조건으로 이루어진다.','시험에서 구성 요소 세 가지를 구별한다.','① 구조\n② 연산\n③ 제약 조건','term','데이터 모델에서 ① 정적 데이터 관계 ② 데이터 처리 작업 ③ 허용 값과 규칙을 나타내는 구성 요소의 명칭을 각각 쓰시오.']
]);
group('normal-more',db,'함수 종속과 고급 정규형',7,[
 ['full','완전 함수 종속','Full Functional Dependency','속성 집합 전체에는 종속되지만 그 집합의 어떤 진부분집합에도 종속되지 않는다.','학번과 과목의 조합 전체로 성적이 결정되는 경우이다.'],
 ['partial','부분 함수 종속','Partial Functional Dependency','복합 결정자의 일부만으로도 다른 속성의 값이 결정된다.','학번·과목으로 구성된 키 중 학번만으로 학생 이름이 결정된다.'],
 ['transitive','이행적 함수 종속','Transitive Functional Dependency','다른 속성을 거쳐 간접적으로 종속되는 관계이다.','학번으로 학과가, 학과로 학과 사무실이 결정되는 구조를 분석한다.'],
 ['fourth','제4정규형','Fourth Normal Form (4NF)','비자명한 다치 종속에서 결정자가 슈퍼키가 되도록 하는 정규형이다.','학생의 독립적인 취미 목록과 언어 목록을 별도 표로 분리한다.'],
 ['fifth','제5정규형','Fifth Normal Form (5NF)','후보키로부터 유도되지 않는 비자명한 조인 종속을 제거한 정규형이다.','여러 표로 분해하고 다시 조인해도 정보 손실이나 허위 행이 없는지 고려한다.']
]);
group('recovery',db,'데이터 회복 기법',8,[
 ['immediate','즉시 갱신','Immediate Update','커밋 전에 DB를 갱신할 수 있어 장애 회복에 REDO와 UNDO가 필요할 수 있다.','커밋된 변경을 다시 반영하고 미완료 변경을 되돌린다.'],
 ['deferred','지연 갱신','Deferred Update','커밋까지 실제 DB 반영을 미뤄 미완료 변경의 UNDO가 필요하지 않는 방식이다.','로그에 기록한 확정 변경을 REDO로 반영한다.'],
 ['checkpoint','체크포인트','Checkpoint','회복 시 확인할 로그 범위를 줄이기 위해 복구 기준 지점을 기록한다.','장애 뒤 전체 로그를 처음부터 처리하는 부담을 줄인다.'],
 ['shadow','그림자 페이징','Shadow Paging','기존 페이지 맵을 보존하고 변경 페이지를 새 위치에 기록해 복구한다.','확정 전 장애가 나면 보존한 페이지 맵을 사용한다.']
]);
group('concurrency',db,'병행 제어와 분산 투명성',8,[
 ['optimistic','낙관적 병행 제어','Optimistic Concurrency Control','실행 중 잠금을 최소화하고 확정 전에 충돌을 검사한다.','충돌이 드문 작업에서 검증 단계로 변경 충돌을 찾는다.'],
 ['timestamp','타임스탬프 순서 제어','Timestamp Ordering','트랜잭션의 시간표시 순서에 따라 충돌 연산을 제어한다.','나중 작업이 먼저 처리한 값을 오래된 작업이 덮지 않도록 검사한다.'],
 ['mvcc','MVCC','Multiversion Concurrency Control (MVCC)','여러 데이터 버전을 유지해 읽는 작업에 적절한 버전을 제공한다.','쓰는 동안 읽기는 이전의 일관된 버전을 볼 수 있다.','MVCC','english-abbreviation'],
 ['transparency','분산 데이터베이스 투명성','Distributed Database Transparency','위치·복제·분할·동시 처리·장애의 분산 특성을 사용자가 의식하지 않도록 한다.','복제본 존재를 몰라도 이용하면 중복 투명성이다.','① 중복 투명성\n② 분할 투명성\n③ 병행 투명성','term','분산 DB에서 ① 복제 여부 ② 데이터의 분할 여부 ③ 다른 사용자와의 동시 처리를 의식하지 않아도 되는 투명성의 명칭을 각각 쓰시오.'],
 ['partition','합성 분할','Composite Partitioning','한 기준으로 분할한 부분을 다른 기준으로 다시 분할한다.','연도 범위로 나눈 주문을 고객 번호의 해시로 다시 나눈다.']
]);
group('algebra',db,'관계 연산 확장',8,[
 ['division','디비전','Division','다른 릴레이션의 모든 값에 대응하는 튜플의 나머지 속성을 구한다.','모든 필수 과목을 수강한 학생을 찾는다.'],
 ['theta','세타 조인','Theta Join','두 릴레이션의 속성 값을 비교 조건으로 결합한다.','같음뿐 아니라 크다·작다 같은 비교 조건도 사용할 수 있다.'],
 ['union','합집합','Union','합병 가능한 두 릴레이션의 튜플을 합하고 중복을 제거한다.','속성 개수와 대응 도메인이 호환되어야 한다.'],
 ['cartesian','카티션 곱','Cartesian Product','두 릴레이션의 튜플을 가능한 모든 조합으로 연결한다.','3행과 2행을 교차곱하면 6행이다.'],
 ['replication','데이터베이스 이중화','Database Replication','장애 대응 등을 위해 데이터 복제본을 관리한다.','즉시 동기화하는 방식과 나중에 변경을 전달하는 방식을 구별한다.']
]);
group('placement',os,'메모리 배치와 종류',9,[
 ['first','최초 적합','First Fit','요청 크기를 수용하는 첫 번째 빈 영역에 메모리를 배치한다.','빈 영역을 순서대로 보며 처음 가능한 영역을 선택한다.'],
 ['best','최적 적합','Best Fit','요청 크기를 수용하는 빈 영역 중 가장 작은 곳을 선택한다.','배치 직후 남는 공간이 가장 작은 곳을 선택한다.'],
 ['worst','최악 적합','Worst Fit','요청 크기를 수용하는 빈 영역 중 가장 큰 곳을 선택한다.','배치 후 큰 잔여 영역을 남기는 방식이다.'],
 ['ram','SRAM·DRAM','Static RAM / Dynamic RAM','재충전 없이 상태를 유지하는 정적 RAM과 주기적인 재충전이 필요한 동적 RAM을 구별한다.','일반적으로 캐시는 SRAM, 주기억장치는 DRAM을 사용한다.','① SRAM\n② DRAM','term','RAM 중 ① 주기적 재충전 없이 유지하는 종류 ② 재충전이 필요한 종류의 영문 약어를 각각 쓰시오.'],
 ['fetch','요구 반입·예상 반입','Demand Fetch / Prefetch','실제 참조 요청 때 가져오는 방식과 참조 전에 미리 가져오는 방식을 구별한다.','필요한 페이지가 없을 때 읽어 들이면 요구 반입이다.','① 요구 반입\n② 예상 반입','term','① 실제 참조 요청 시 적재하는 전략 ② 앞으로 참조할 것을 예상해 미리 적재하는 전략의 명칭을 각각 쓰시오.']
]);
group('scheduling',os,'스케줄링 확장',10,[
 ['fcfs','FCFS','First-Come, First-Served (FCFS)','준비 큐에 먼저 도착한 작업부터 CPU를 배정하는 비선점형 방식이다.','긴 작업 뒤에 짧은 작업들이 기다리는 호위 효과가 생길 수 있다.','FCFS','english-abbreviation'],
 ['multilevel','다단계 큐','Multilevel Queue','프로세스를 종류별 준비 큐로 나누고 큐마다 스케줄링 규칙을 적용한다.','대화형 작업과 배치 작업을 별도 큐에 둔다.'],
 ['feedback','다단계 피드백 큐','Multilevel Feedback Queue','실행 특성과 대기 등에 따라 프로세스가 여러 우선순위 큐 사이를 이동한다.','CPU를 오래 사용하는 작업의 우선순위를 조정할 수 있다.'],
 ['hrn-formula','HRN 우선순위','Highest Response Ratio Next','대기 시간과 서비스 시간으로 응답비율을 구해 가장 높은 작업을 선택한다.','우선순위=(대기 시간+서비스 시간)/서비스 시간이다.','5','numeric','HRN에서 대기 시간이 12, 서비스 시간이 3인 작업의 우선순위를 계산하시오.'],
 ['deadlock-recover','교착 탐지·회복','Deadlock Detection / Recovery','교착이 발생했는지 검사하고 프로세스 종료나 자원 회수로 해소한다.','예방·회피는 발생 전의 대응이고 탐지·회복은 발생 후의 대응이다.','① 탐지\n② 회복','term','교착상태에 대해 ① 이미 발생한 교착을 검사하는 대응 ② 종료·자원 회수로 해소하는 대응의 명칭을 각각 쓰시오.']
]);
group('network-more',net,'추가 프로토콜과 계층',12,[
 ['rarp','RARP','Reverse Address Resolution Protocol (RARP)','MAC 주소를 바탕으로 IPv4 주소를 알아내는 과거의 주소 결정 프로토콜이다.','IP→MAC인 ARP와 방향을 구별한다.','RARP','english-abbreviation'],
 ['igmp','IGMP','Internet Group Management Protocol (IGMP)','IPv4 호스트와 라우터 사이에서 멀티캐스트 그룹 참여를 관리한다.','특정 그룹을 수신하려는 호스트의 가입 정보를 전달한다.','IGMP','english-abbreviation'],
 ['rtcp','RTCP','RTP Control Protocol (RTCP)','RTP 통신의 품질과 수신 상태 등을 제어 메시지로 보고한다.','음성 데이터 자체를 전송하는 RTP와 구별한다.','RTCP','english-abbreviation'],
 ['tcpip','TCP/IP 4계층','TCP/IP Model','응용·전송·인터넷·네트워크 접근 계층으로 통신 기능을 구분한다.','OSI의 응용·표현·세션 기능을 TCP/IP 응용 계층으로 묶어 이해한다.','① 응용\n② 전송\n③ 인터넷\n④ 네트워크 접근','term','TCP/IP 4계층을 상위 계층부터 순서대로 쓰시오.'],
 ['igp-egp','IGP·EGP','Interior / Exterior Gateway Protocol','자율 시스템 내부의 경로 교환과 서로 다른 자율 시스템 사이의 경로 교환을 구별한다.','RIP·OSPF는 IGP이고 BGP는 AS 간 경로 교환에 사용한다.','① IGP\n② EGP','term','라우팅 프로토콜의 분류 중 ① AS 내부 ② AS 사이에서 경로를 교환하는 분류의 영문 약어를 각각 쓰시오.']
]);
group('transmission',net,'전송과 오류 제어',11,[
 ['duplex','단방향·반이중·전이중','Simplex / Half-duplex / Full-duplex','한쪽만 전송, 양쪽이 번갈아 전송, 양쪽이 동시에 전송하는 방식으로 구별한다.','라디오·무전기·전화의 통신 방식에 연결한다.','① 단방향\n② 반이중\n③ 전이중','term','① 한 방향만 전송 ② 양방향 교대로 전송 ③ 양방향 동시에 전송하는 방식의 명칭을 각각 쓰시오.'],
 ['crc','CRC','Cyclic Redundancy Check (CRC)','데이터를 다항식으로 보고 나눗셈의 나머지를 이용해 전송 오류를 검출한다.','수신 측이 검사값을 비교하며 오류를 자동 수정하는 기능과는 구별한다.','CRC','english-abbreviation'],
 ['hamming','해밍 코드','Hamming Code','검사 비트를 추가해 오류 위치를 찾아 정정할 수 있도록 한 부호이다.','일반적인 해밍 코드는 단일 비트 오류 정정에 활용한다.'],
 ['fec','전진 오류 수정','Forward Error Correction (FEC)','수신 측이 추가 정보를 이용해 재전송 요청 없이 오류를 정정한다.','재전송으로 복구하는 방식과 구별한다.','FEC','english-abbreviation'],
 ['adhoc','애드혹 네트워크','Ad hoc Network','고정 기지국이나 접근점 없이 단말들이 직접 연결해 구성하는 네트워크이다.','재난 현장에서 단말들이 멀티 홉으로 연결할 수 있다.']
]);
group('headers',net,'헤더와 연결 제어',13,[
 ['syn','SYN','Synchronize (SYN)','TCP 연결 수립에서 순서 번호 동기화를 요청하는 플래그이다.','연결 시작의 SYN과 연결 종료의 FIN을 구별한다.','SYN','english-abbreviation'],
 ['fin','FIN','Finish (FIN)','TCP 송신자가 더 보낼 데이터가 없음을 알려 해당 방향의 종료를 요청한다.','상대 방향의 종료는 별도로 이루어질 수 있다.','FIN','english-abbreviation'],
 ['ttl','TTL','Time to Live (TTL)','IP 패킷이 네트워크를 무한히 돌지 않도록 전달 횟수를 제한하는 필드이다.','라우터를 지날 때 감소하며 0이 되면 폐기된다.','TTL','english-abbreviation'],
 ['hdlc','HDLC','High-Level Data Link Control (HDLC)','비트 지향 방식의 데이터 링크 제어 프로토콜이다.','정보·감독·비번호 프레임과 NRM·ABM·ARM을 구별한다.','HDLC','english-abbreviation'],
 ['oauth','OAuth','OAuth','비밀번호를 제3자 앱에 주지 않고 제한된 자원 접근 권한을 위임하는 체계이다.','인증 자체와 권한 위임을 구별한다.','OAuth']
]);
group('crypto',sec,'대칭키 암호 종류',14,[
 ['des','DES','Data Encryption Standard (DES)','64비트 블록과 유효 56비트 키를 사용하는 과거의 대칭키 블록 암호이다.','현재의 안전한 암호 선택 안내가 아니라 시험 용어 구별이다.','DES','english-abbreviation'],
 ['aes','AES','Advanced Encryption Standard (AES)','128비트 블록과 128·192·256비트 키를 사용하는 대칭키 블록 암호이다.','Rijndael을 기반으로 하며 구조는 SPN으로 설명한다.','AES','english-abbreviation'],
 ['idea','IDEA','International Data Encryption Algorithm (IDEA)','스위스에서 개발된 64비트 블록·128비트 키의 대칭키 암호이다.','DES·AES와 블록·키 길이를 구별한다.','IDEA','english-abbreviation'],
 ['skipjack','Skipjack','Skipjack','미국 NSA가 개발한 64비트 블록·80비트 키의 암호 알고리즘이다.','클리퍼 칩과 연결해 명칭을 기억한다.','Skipjack'],
 ['seed','SEED','SEED','국내에서 개발된 대칭키 블록 암호이며 대표적인 SEED-128은 128비트 블록·키를 사용한다.','국내 개발이라는 단서만으로 ARIA와 혼동하지 않도록 비교한다.','SEED','english-abbreviation'],
 ['aria','ARIA','ARIA','국내에서 개발된 128비트 블록과 128·192·256비트 키의 대칭키 암호이다.','키 길이만 보면 AES와 같으므로 개발 배경도 구별한다.','ARIA','english-abbreviation'],
 ['lea','LEA','Lightweight Encryption Algorithm (LEA)','국내에서 개발된 128비트 블록의 경량 대칭키 암호이다.','소프트웨어 구현의 효율성과 경량이라는 단서를 기억한다.','LEA','english-abbreviation'],
 ['rc4','RC4','RC4','Ron Rivest가 설계한 스트림 암호 알고리즘이다.','블록 암호 DES·AES와 종류를 구별한다.','RC4','english-abbreviation']
]);
group('security-solutions',sec,'보안 솔루션 약어',14,[
 ['dlp','DLP','Data Loss Prevention (DLP)','민감한 데이터가 외부로 유출되는 것을 탐지하고 통제한다.','기밀 파일의 메일 첨부나 외부 복사를 통제한다.','DLP','english-abbreviation'],
 ['nac','NAC','Network Access Control (NAC)','장치의 신원과 보안 상태에 따라 네트워크 접속을 통제한다.','보안 조건을 만족하지 않는 장치를 격리한다.','NAC','english-abbreviation'],
 ['siem','SIEM','Security Information and Event Management (SIEM)','여러 시스템의 보안 로그와 이벤트를 모아 상관 분석한다.','로그인 실패와 비정상 접근을 연결해 경고한다.','SIEM','english-abbreviation'],
 ['fds','FDS','Fraud Detection System (FDS)','금융 거래의 이상 징후를 분석해 사기 거래를 탐지한다.','평소와 다른 장소에서 갑자기 발생한 고액 거래를 분석한다.','FDS','english-abbreviation'],
 ['trustzone','TrustZone','Arm TrustZone','실행 환경을 일반 영역과 보안 영역으로 분리하는 하드웨어 기반 기술이다.','Normal World와 Secure World를 구별한다.','TrustZone'],
 ['otp','OTP','One-Time Password (OTP)','한 번의 인증에 사용하는 일회용 비밀번호이다.','시간이나 카운터에 따라 값이 바뀌는 방식을 활용한다.','OTP','english-abbreviation'],
 ['sandbox','샌드박스','Sandbox','프로그램을 격리된 환경에서 실행해 시스템에 미치는 영향을 제한한다.','의심 파일을 별도 환경에서 실행해 관찰한다.'],
 ['hids-nids','HIDS·NIDS','Host / Network Intrusion Detection System','호스트 내부 활동을 감시하는 방식과 네트워크 트래픽을 감시하는 방식을 구별한다.','파일 변경 감시는 호스트, 패킷 분석은 네트워크 관점이다.','① HIDS\n② NIDS','term','침입 탐지에서 ① 호스트 내부 활동 감시 ② 네트워크 트래픽 감시를 하는 방식의 약어를 각각 쓰시오.']
]);
group('attacks-more',sec,'추가 보안 공격 용어',15,[
 ['hijacking','세션 하이재킹','Session Hijacking','유효한 세션 정보 등을 가로채 다른 사용자의 세션을 탈취한다.','로그인 이후의 인증 상태를 악용한다.'],
 ['pharming','파밍','Pharming','이름 해석이나 접속 경로를 조작해 사용자를 가짜 사이트로 유도한다.','주소를 올바르게 입력해도 위장 사이트로 이동할 수 있다.'],
 ['typo','타이포스쿼팅','Typosquatting','유명 주소와 비슷한 오타 도메인을 이용해 잘못 접속한 사용자를 노린다.','철자가 한 글자 다른 주소를 미리 등록한다.'],
 ['social','사회 공학','Social Engineering','사람의 신뢰나 심리를 이용해 정보 제공 또는 보안 절차 위반을 유도한다.','담당자를 사칭해 비밀번호를 알려 달라고 요구한다.'],
 ['zero','제로데이 공격','Zero-day Attack','알려지지 않았거나 대응 패치가 없는 취약점을 악용하는 공격이다.','공개 전 취약점 공격과 패치 이후의 알려진 취약점 공격을 구별한다.'],
 ['rootkit','루트킷','Rootkit','침입 흔적이나 악성 활동을 숨기고 지속적인 접근을 돕는 도구 모음이다.','프로세스나 파일을 숨겨 탐지를 회피할 수 있다.'],
 ['scare','스캐어웨어','Scareware','가짜 보안 경고로 사용자를 겁줘 결제나 프로그램 설치를 유도한다.','실제로 확인되지 않은 감염 메시지를 띄우고 치료비를 요구한다.'],
 ['isms','ISMS','Information Security Management System (ISMS)','조직의 정보보호 정책·위험 관리·보호 대책을 체계적으로 운영하는 관리 체계이다.','개별 보안 장비의 명칭과 구별한다.','ISMS','english-abbreviation'],
 ['dark','다크 데이터','Dark Data','수집·보관했지만 실제 분석이나 활용에 사용하지 않는 데이터이다.','오래 저장된 로그가 활용되지 않은 채 공간과 관리 부담을 차지한다.']
]);
group('secure-protocols',sec,'보안 통신과 추가 공격',15,[
 ['ssh','SSH','Secure Shell (SSH)','암호화된 원격 접속과 명령 실행을 제공하는 프로토콜이다.','기본 포트는 22이며 평문 Telnet과 구별한다.','SSH','english-abbreviation'],
 ['tls','TLS','Transport Layer Security (TLS)','통신 상대와 데이터를 보호하기 위한 암호화·무결성 등의 기능을 제공한다.','HTTPS에서 사용하며 SSL의 후속 프로토콜이다.','TLS','english-abbreviation'],
 ['tkip','TKIP','Temporal Key Integrity Protocol (TKIP)','WEP의 취약성을 보완하기 위해 도입된 무선 보안 프로토콜이다.','임시 키 무결성이라는 영문 표현과 연결한다.','TKIP','english-abbreviation'],
 ['evil','이블 트윈 공격','Evil Twin Attack','정상 무선 접근점처럼 위장한 가짜 접근점으로 사용자를 유도한다.','같은 Wi-Fi 이름을 가진 공격자의 접근점에 접속하게 만든다.'],
 ['pod','죽음의 핑','Ping of Death','비정상적으로 큰 ICMP 패킷 등을 이용해 취약한 시스템 처리를 방해하는 공격이다.','패킷을 많이 보내는 Ping Flooding과 크기·재조립 단서를 구별한다.']
]);
group('it-more',it,'웹과 인터페이스 용어 확장',16,[
 ['xml','XML','Extensible Markup Language (XML)','데이터의 구조를 태그로 표현하는 확장 가능한 마크업 언어이다.','문서 표시 중심의 HTML과 데이터 구조 표현을 비교한다.','XML','english-abbreviation'],
 ['html','HTML','Hypertext Markup Language (HTML)','웹 문서의 구조를 표현하는 마크업 언어이다.','제목·문단·링크 같은 문서 요소를 기술한다.','HTML','english-abbreviation'],
 ['hypertext','하이퍼텍스트','Hypertext','다른 문서나 위치로 이동하는 링크를 포함한 텍스트이다.','연결을 따라 비선형적으로 문서를 탐색한다.'],
 ['mime','MIME','Multipurpose Internet Mail Extensions (MIME)','이메일에서 다양한 내용 유형을 표현하도록 확장한 규약이다.','텍스트뿐 아니라 이미지와 파일 첨부의 유형을 표현한다.','MIME','english-abbreviation'],
 ['fep','FEP','Front-End Processor (FEP)','주 처리 장치의 부담을 줄이도록 통신과 입력 등의 처리를 먼저 수행한다.','입력 자료를 전처리해 주 처리 과정의 부담을 줄인다.','FEP','english-abbreviation']
]);
group('ui-tools',it,'UI 종류와 설계 도구',2,[
 ['wire','와이어프레임','Wireframe','화면 요소의 배치와 구조를 단순하게 그린 초기 설계이다.','색과 이미지보다 위치와 정보 구조에 집중한다.'],
 ['mockup','목업','Mockup','실제 화면과 유사하게 만든 정적인 시각 모형이다.','외관은 상세하지만 실제 상호작용이 없는 경우를 구별한다.'],
 ['prototype','UI 프로토타입','UI Prototype','화면의 상호작용을 시험할 수 있도록 만든 모형이다.','클릭하면 다음 화면으로 이동하는 흐름을 시험한다.'],
 ['storyboard','스토리보드','Storyboard','화면 구성과 동작·콘텐츠·처리 흐름을 설명하는 설계 문서이다.','화면마다 버튼 동작과 오류 처리 설명을 붙인다.'],
 ['types','UI 유형','CLI / GUI / NUI / VUI','명령어·그래픽·자연스러운 동작·음성 등 상호작용 방식으로 구별한다.','명령 입력과 음성 입력의 인터페이스 명칭을 구별한다.','① CLI\n② GUI\n③ VUI','term','UI 중 ① 문자 명령 입력 ② 그래픽 요소 조작 ③ 음성 상호작용 방식의 영문 약어를 각각 쓰시오.']
]);
group('platforms',it,'클라우드와 저장 확장',16,[
 ['faas','FaaS','Function as a Service (FaaS)','함수 단위의 코드를 실행하며 서버 운영 부담을 제공자가 맡는 서비스이다.','이벤트가 발생했을 때 필요한 함수를 실행한다.','FaaS','english-abbreviation'],
 ['daas','DaaS','Desktop as a Service (DaaS)','데스크톱 실행 환경을 원격 서비스로 제공한다.','접속 장치에서 가상 업무 데스크톱을 이용한다.','DaaS','english-abbreviation'],
 ['secaas','SECaaS','Security as a Service (SECaaS)','보안 기능을 클라우드 서비스 형태로 제공한다.','보안 분석이나 보호 기능을 서비스로 이용한다.','SECaaS','english-abbreviation'],
 ['baas','BaaS','Blockchain as a Service (BaaS)','블록체인 기반 시스템의 개발과 운영을 지원하는 서비스이다.','이 자료에서는 Blockchain을 뜻하며 Backend as a Service라는 다른 용례와 구별한다.','BaaS','english-abbreviation'],
 ['raid234','RAID 2·3·4','RAID 2 / RAID 3 / RAID 4','해밍 코드 기반 RAID 2, 바이트 단위와 전용 패리티의 RAID 3, 블록 단위와 전용 패리티의 RAID 4를 구별한다.','RAID 5는 패리티를 여러 디스크에 분산한다.','① RAID 2\n② RAID 3\n③ RAID 4','term','RAID 중 ① 해밍 코드 사용 ② 바이트 단위와 전용 패리티 ③ 블록 단위와 전용 패리티에 해당하는 수준을 각각 쓰시오.']
]);
group('tools',it,'개발·검증 도구와 IT 용어',17,[
 ['docker','Docker','Docker','애플리케이션을 컨테이너 이미지로 묶고 컨테이너 실행을 관리하는 도구이다.','필요한 실행 환경을 함께 담아 배포한다.'],
 ['soa','SOA','Service-Oriented Architecture (SOA)','재사용 가능한 서비스를 조합해 시스템의 업무 기능을 구성한다.','서비스 인터페이스로 주문과 결제를 연계한다.','SOA','english-abbreviation'],
 ['mashup','매시업','Mashup','여러 서비스의 데이터나 기능을 결합해 새로운 서비스를 만든다.','지도와 매장 정보를 결합해 주변 매장 검색을 만든다.'],
 ['junit','JUnit','JUnit','Java 코드의 단위 테스트를 작성하고 실행하는 프레임워크이다.','여러 테스트 메서드의 결과를 반복 확인한다.'],
 ['selenium','Selenium','Selenium','브라우저의 동작을 자동화해 웹 애플리케이션을 시험하는 도구이다.','여러 브라우저에서 로그인 동작을 실행한다.']
]);
group('unix',os,'UNIX·Linux 명령과 함수',16,[
 ['chmod','chmod','chmod','파일의 접근 권한을 변경하는 명령이다.','읽기·쓰기·실행 권한을 설정한다.','chmod','english-either'],
 ['chown','chown','chown','파일의 소유자나 소유 그룹을 변경하는 명령이다.','접근 권한을 바꾸는 chmod와 구별한다.','chown','english-either'],
 ['pwd','pwd','pwd','현재 작업 디렉터리의 경로를 출력하는 명령이다.','디렉터리를 이동하는 cd와 구별한다.','pwd','english-either'],
 ['ls','ls','ls','디렉터리의 파일 목록을 출력하는 명령이다.','영문 소문자 l과 s로 쓰며 is가 아니다.','ls','english-either'],
 ['fork','fork','fork()','호출 프로세스를 바탕으로 자식 프로세스를 생성하는 함수이다.','새 프로그램으로 실행 이미지를 바꾸는 exec와 구별한다.','fork','english-either']
]);
group('algorithms',sw,'검색·정렬과 알고리즘',7,[
 ['binary','이진 검색','Binary Search','정렬된 자료의 가운데 값을 비교하며 검색 범위를 절반씩 줄인다.','자료를 미리 정렬해야 하며 일반적인 검색 시간은 O(log n)이다.'],
 ['bubble','버블 정렬','Bubble Sort','인접한 두 값을 비교해 순서가 어긋나면 교환하는 과정을 반복한다.','한 순회가 끝나면 큰 값이 뒤쪽으로 이동한다.'],
 ['selection','선택 정렬','Selection Sort','미정렬 구간의 최솟값을 선택해 앞쪽 위치에 놓는 과정을 반복한다.','매번 전체 남은 구간에서 최솟값을 찾는다.'],
 ['insertion','삽입 정렬','Insertion Sort','앞서 정렬된 구간의 알맞은 위치에 다음 값을 삽입한다.','카드를 하나씩 정렬된 손패에 끼워 넣는 방식과 비슷하다.'],
 ['greedy','탐욕 알고리즘','Greedy Algorithm','각 단계에서 현재 가장 유리한 선택을 한다.','현재 최선의 선택이 항상 전체 최적해를 보장하는 것은 아니다.'],
 ['dp','동적 계획법','Dynamic Programming','중복되는 부분 문제의 결과를 저장해 재사용한다.','같은 부분 문제를 여러 번 계산하지 않는다.'],
 ['divide','분할 정복','Divide and Conquer','문제를 작은 문제로 나눠 해결하고 결과를 결합한다.','병합 정렬은 구간을 나눈 뒤 정렬된 결과를 병합한다.'],
 ['backtrack','백트래킹','Backtracking','후보 해를 탐색하다 조건을 만족할 수 없으면 되돌아가 다른 후보를 탐색한다.','불가능한 가지를 일찍 제외한다.']
]);
group('calculations',os,'페이지와 스케줄링 계산',10,[
 ['fifo','FIFO 페이지 부재 계산','FIFO Page Replacement','가장 먼저 적재된 페이지를 교체하며 참조 성공은 적재 순서를 바꾸지 않는다.','프레임이 비어 있을 때의 첫 적재도 페이지 부재로 센다.','4','numeric','프레임 3개가 처음 비어 있다. 페이지 참조가 1, 2, 3, 1, 4일 때 FIFO의 페이지 부재 횟수를 쓰시오.'],
 ['lru','LRU 페이지 부재 계산','LRU Page Replacement','가장 오래 참조하지 않은 페이지를 교체한다.','참조 성공일 때도 최근 사용 시점을 갱신한다.','5','numeric','프레임 3개가 처음 비어 있다. 페이지 참조가 1, 2, 3, 1, 4, 2일 때 LRU의 페이지 부재 횟수를 쓰시오.'],
 ['fcfs','FCFS 대기 시간 계산','FCFS Waiting Time','앞 작업이 완료된 뒤 다음 작업을 시작하며 도착 시점과 시작 시점의 차이가 대기 시간이다.','세 작업이 모두 시각 0에 도착하면 앞 작업들의 실행 시간을 누적한다.','3','numeric','A, B, C가 시각 0에 이 순서로 도착한다. 실행 시간은 각각 3, 2, 1이다. FCFS에서 B의 대기 시간을 쓰시오.'],
 ['rr','라운드 로빈 실행 추적','Round Robin Trace','시간 할당량만큼 실행한 미완료 작업은 준비 큐의 뒤로 이동한다.','종료한 작업은 큐에 다시 넣지 않는다.','A','term','A와 B가 시각 0에 이 순서로 도착하고 실행 시간은 각각 3과 2이다. 시간 할당량 2인 RR에서 첫 A(2), B(2) 실행 후 다음 실행할 프로세스의 이름을 쓰시오.']
]);
group('subnet',net,'서브넷 주소 계산',13,[
 ['mask','서브넷 마스크','Subnet Mask','IP 주소에서 네트워크 부분과 호스트 부분을 구분하는 비트 마스크이다.','/26은 앞 26비트가 1이며 마지막 옥텟은 192이다.','255.255.255.192','numeric','IPv4의 /26에 해당하는 서브넷 마스크를 점으로 구분한 십진수로 쓰시오.'],
 ['network','네트워크 주소','Network Address','일반적인 IPv4 서브넷에서 호스트 비트를 모두 0으로 둔 주소이다.','/26의 마지막 옥텟 구간은 0~63, 64~127, 128~191, 192~255이다.','192.168.10.128','numeric','192.168.10.150/26이 속한 네트워크 주소를 쓰시오.'],
 ['broadcast','브로드캐스트 주소','Broadcast Address','일반적인 IPv4 서브넷에서 호스트 비트를 모두 1로 둔 주소이다.','/26에서 150이 속한 구간의 마지막은 191이다.','192.168.10.191','numeric','192.168.10.150/26이 속한 서브넷의 브로드캐스트 주소를 쓰시오.'],
 ['hosts','사용 가능한 호스트 수','Usable Host Count','일반적인 IPv4 서브넷은 전체 주소 수에서 네트워크와 브로드캐스트 주소를 제외한다.','/31의 점대점 링크와 /32 등의 예외에 같은 공식을 무조건 적용하지 않는다.','62','numeric','일반적인 IPv4 /26 서브넷에서 네트워크·브로드캐스트 주소를 제외한 호스트 주소 수를 쓰시오.']
]);
group('sql-results',sql,'SQL 실행 결과 읽기',18,[
 ['count','COUNT와 NULL','COUNT / NULL','COUNT(*)는 행 수를, COUNT(열)은 해당 열의 NULL이 아닌 값 수를 센다.','열 값이 10, NULL, 10이면 전체는 3행, 해당 열의 값 개수는 2이다.','① 3\n② 2','numeric','T의 SCORE 값은 10, NULL, 10으로 총 3행이다. ① SELECT COUNT(*) FROM T; ② SELECT COUNT(SCORE) FROM T; 의 결과를 각각 쓰시오.'],
 ['distinct','DISTINCT 결과','DISTINCT','선택한 열 조합이 같은 결과 행을 한 번만 남긴다.','DISTINCT는 COUNT 앞에 놓는 것과 COUNT 안에 놓는 것의 의미가 다르다.','2','numeric','T의 DEPT 값은 A, A, B이다. SELECT COUNT(DISTINCT DEPT) FROM T; 의 결과를 쓰시오.'],
 ['union','UNION 결과','UNION / UNION ALL','UNION은 두 질의 결과를 합치고 중복을 제거하며 UNION ALL은 중복을 유지한다.','정렬은 별도 ORDER BY로 지정한다.','① 3\n② 4','numeric','A의 N은 1, 2이고 B의 N은 2, 3이다. ① SELECT N FROM A UNION SELECT N FROM B; ② SELECT N FROM A UNION ALL SELECT N FROM B; 각 결과의 행 수를 쓰시오.'],
 ['like','LIKE 조건','LIKE','%는 0개 이상의 문자, _는 정확히 한 문자를 나타내는 패턴이다.','SQL 문자 리터럴은 작은따옴표로 감싼다.','이수, 이수민','result','T의 NAME은 이수, 이수민, 김이수이다. SELECT NAME FROM T WHERE NAME LIKE \'이%\' ORDER BY NAME; 이 반환하는 이름을 모두 쓰시오.'],
 ['all','ALL 조건','ALL','부질의가 반환한 모든 값에 비교 조건이 성립해야 한다.','40과 60보다 모두 큰 값은 60을 초과해야 한다.','80','numeric','상품 가격이 30, 50, 80이고 부질의 가격 결과가 40, 60이다. PRICE > ALL (부질의)를 만족하는 가격을 쓰시오.']
]);
group('sql-write',sql,'SQL 구문 작성',18,[
 ['insert','INSERT 작성','INSERT INTO / VALUES','대상 테이블과 열을 지정하고 추가할 값을 작성한다.','열 순서와 값 순서를 맞추고 문자열은 작은따옴표로 감싼다.',"INSERT INTO STUDENT (ID, NAME) VALUES (7, '하늘');",'sql','STUDENT(ID, NAME)에 학번 7, 이름 하늘인 행을 추가하는 SQL 문을 쓰시오.'],
 ['update','UPDATE 작성','UPDATE / SET / WHERE','변경할 열과 값을 SET에 지정하고 WHERE로 대상 행을 제한한다.','WHERE를 생략하면 모든 행이 변경될 수 있다.',"UPDATE STUDENT SET NAME = '바다' WHERE ID = 7;",'sql','STUDENT에서 ID가 7인 행의 NAME을 바다로 변경하는 SQL 문을 쓰시오.'],
 ['delete','DELETE 작성','DELETE FROM / WHERE','DELETE FROM에 테이블을 쓰고 WHERE로 삭제할 행을 제한한다.','테이블 정의 자체를 지우는 DROP과 구별한다.','DELETE FROM STUDENT WHERE ID = 7;','sql','STUDENT에서 ID가 7인 행만 삭제하는 SQL 문을 쓰시오.'],
 ['group','집계 SQL 작성','GROUP BY / HAVING','행을 묶은 후 그룹의 집계 결과를 HAVING으로 제한한다.','그룹 조건을 개별 행의 WHERE 조건과 구별한다.','SELECT DEPT, COUNT(*) FROM EMPLOYEE GROUP BY DEPT HAVING COUNT(*) >= 2;','sql','EMPLOYEE의 부서별 직원 수를 조회하되 2명 이상인 부서만 출력하시오. DEPT와 COUNT(*)를 조회하는 SQL 문을 쓰시오.'],
 ['order','정렬 SQL 작성','ORDER BY / DESC','ORDER BY에 정렬 열과 방향을 지정한다.','ASC는 오름차순, DESC는 내림차순이다.','SELECT NAME, SCORE FROM STUDENT ORDER BY SCORE DESC;','sql','STUDENT의 NAME과 SCORE를 점수 내림차순으로 조회하는 SQL 문을 쓰시오.']
]);
group('sql-relations',sql,'SQL 조인과 참조 제약',19,[
 ['join','JOIN 결과','JOIN / ON','ON 조건을 만족하는 두 테이블의 행을 연결한다.','같은 키가 여러 번 있으면 조인 결과도 여러 행이 될 수 있다.','2','numeric','A의 ID는 1, 2이고 B의 ID는 2, 2, 3이다. SELECT COUNT(*) FROM A JOIN B ON A.ID = B.ID; 의 결과를 쓰시오.'],
 ['subquery','부질의 결과','Subquery / IN','다른 질의의 결과를 조건이나 자료로 사용하는 중첩된 질의이다.','IN은 목록에 같은 값이 존재하는지 검사한다.','A, C','result','T의 (NAME, DEPT)는 (A, 10), (B, 20), (C, 10)이다. 부질의 SELECT DEPT FROM D의 결과가 10일 때 SELECT NAME FROM T WHERE DEPT IN (SELECT DEPT FROM D) ORDER BY NAME; 의 결과를 쓰시오.'],
 ['cascade','CASCADE','ON DELETE CASCADE','참조 대상 행이 삭제될 때 연결된 참조 행도 삭제하도록 하는 제약 동작이다.','부서 삭제 시 해당 부서를 가리키는 직원 행이 삭제되는 경우이다.','CASCADE','english-either'],
 ['savepoint','SAVEPOINT','SAVEPOINT','트랜잭션 안에서 일부 변경을 되돌릴 기준 위치를 설정한다.','전체 취소 대신 지정한 위치로 ROLLBACK할 수 있다.','SAVEPOINT','english-either'],
 ['cross','CROSS JOIN 결과','CROSS JOIN','두 테이블의 모든 행 조합을 만든다.','조건 없이 3행과 4행을 결합하면 12행이다.','12','numeric','A가 3행, B가 4행일 때 SELECT COUNT(*) FROM A CROSS JOIN B; 의 결과를 쓰시오.']
]);
// Multi-part prompts use the existing numbered-answer UI. Calculation and SQL
// formats retain a large answer field and their own clear instructions.
for(const v of variants){
 if(v.answer.includes('\n')&&v.responseFormat==='term')v.quizType='multi-term';
 if(['numeric','result','sql'].includes(v.responseFormat))v.quizType='written';
}
// Page-specific corrections when a mixed group spans more than one source page.
for(const [id,page] of [['extra-analysis-formal',2],['extra-quality-spice',17],['extra-headers-hdlc',12],['extra-headers-oauth',11],['extra-tools-junit',16],['extra-tools-selenium',16],['extra-calculations-fifo',9],['extra-calculations-lru',9],['extra-sql-results-all',19]]){
 bank.find(q=>q.id===id).sources=source(page);variants.find(v=>v.conceptId===id).sources=source(page);
}
// Related summaries expose the taxonomy while keeping detailed definitions
// in separate lessons. Existing IDs and bundle question lists are preserved.
group('analysis-tools',sw,'분석 도구와 설계 원리 보완',2,[
 ['case','CASE','Computer-Aided Software Engineering (CASE)','소프트웨어 분석·설계·개발의 작업을 자동화하는 도구와 환경이다.','SADT·SREM·PSL/PSA 등 분석 지원 도구의 명칭을 함께 구별한다.','CASE','english-abbreviation'],
 ['hiding','정보 은닉','Information Hiding','변경될 수 있는 내부 설계 결정을 외부에서 직접 의존하지 못하도록 숨긴다.','모듈의 내부 저장 방식이 달라져도 외부 인터페이스를 유지한다.'],
 ['refinement','단계적 분해','Stepwise Refinement','높은 수준의 해결 절차를 반복적으로 더 구체적인 단계로 세분화한다.','전체 처리부터 시작해 세부 동작을 나중에 정한다.'],
 ['delphi','델파이 기법','Delphi Method','전문가 의견을 반복적으로 수집하고 조정해 추정치의 합의를 구한다.','비용 산정에서 전문가 개인의 편견을 줄이는 데 활용한다.'],
 ['api','API','Application Programming Interface (API)','소프트웨어의 기능과 데이터를 다른 프로그램이 이용하도록 정한 인터페이스이다.','호출 방법과 입력·출력의 약속을 따른다.','API','english-abbreviation']
]);
group('architecture-more',sw,'아키텍처 패턴 보완',2,[
 ['master','마스터-슬레이브 패턴','Master-Slave Architecture','중앙 역할이 작업을 나누고 여러 작업자가 처리한 결과를 모은다.','요약노트의 명칭이며 마스터-워커로도 설명할 수 있다.'],
 ['broker','브로커 패턴','Broker Architecture','분산된 서비스 제공자와 요청자 사이의 통신을 중개한다.','요청 대상 탐색과 메시지 전달을 중개 요소에 맡긴다.'],
 ['peer','피어 투 피어 패턴','Peer-to-Peer Architecture','참여 노드가 서비스를 요청하는 역할과 제공하는 역할을 함께 수행한다.','중앙 서버에 모든 역할을 집중하지 않는다.'],
 ['event','이벤트 버스 패턴','Event Bus Architecture','발행한 이벤트를 공통 통로를 통해 관심 있는 구독자에게 전달한다.','주문 생성 이벤트를 배송과 알림 서비스가 각각 구독한다.'],
 ['blackboard','블랙보드 패턴','Blackboard Architecture','여러 구성 요소가 공통 지식 저장소에 결과를 기록하고 활용해 문제를 해결한다.','문제 풀이의 중간 결과를 공유 공간에서 교환한다.']
]);
group('frameworks',sw,'프레임워크와 분석 모델',3,[
 ['spring','Spring Framework','Spring Framework','Java 애플리케이션 개발을 지원하며 의존성 주입 등의 기능을 제공하는 프레임워크이다.','전자정부 표준프레임워크의 관련 기반 기술과 연결한다.'],
 ['dotnet','.NET','.NET','Microsoft의 실행 환경과 라이브러리를 바탕으로 여러 언어의 애플리케이션 개발을 지원한다.','공통 언어 런타임 CLR이라는 용어를 구별한다.'],
 ['booch','Booch 방법','Booch Method','미시적·거시적 개발 과정을 활용하며 클래스와 객체를 분석하는 객체지향 방법이다.','럼바우의 객체·동적·기능 모델과 비교한다.'],
 ['jacobson','Jacobson 방법','Jacobson Method','유스케이스를 중심으로 사용자와 시스템의 상호작용을 분석하는 방법이다.','사용자 관점의 기능 요구를 모델링한다.'],
 ['iso','ISO 12207','ISO/IEC 12207','소프트웨어 생명주기 프로세스에 관한 표준이다.','요약노트는 기본·지원·조직 생명주기 프로세스의 구분으로 설명한다.','ISO 12207']
]);
group('memory-more',os,'기억장치와 실행 환경 보완',9,[
 ['prom','PROM','Programmable Read-Only Memory (PROM)','제조 후 한 번 기록할 수 있는 비휘발성 읽기 전용 메모리이다.','다시 지워 기록할 수 있는 종류와 구별한다.','PROM','english-abbreviation'],
 ['eprom','EPROM','Erasable Programmable Read-Only Memory (EPROM)','자외선으로 내용을 지우고 다시 기록할 수 있는 비휘발성 메모리이다.','전기적으로 지우는 EEPROM과 구별한다.','EPROM','english-abbreviation'],
 ['eeprom','EEPROM','Electrically Erasable Programmable Read-Only Memory (EEPROM)','전기적으로 내용을 지우고 다시 기록할 수 있는 비휘발성 메모리이다.','전원 없이도 저장 내용이 유지된다.','EEPROM','english-abbreviation'],
 ['unix','UNIX','UNIX','AT&T 벨 연구소에서 개발된 다중 사용자·다중 작업 운영체제 계열이다.','커널과 셸의 역할을 함께 구별한다.','UNIX'],
 ['android','Android','Android','Linux 커널을 기반으로 하는 모바일 운영체제이다.','Linux 커널 기반과 Java·Kotlin 앱 개발 환경이라는 단서를 연결한다.','Android']
]);
group('network-control',net,'네트워크 구성과 제어 보완',11,[
 ['topology','네트워크 토폴로지','Network Topology','장치와 회선의 연결 구조를 성형·버스형·링형·트리형·망형 등으로 구별한다.','중앙 장치에 연결하면 성형, 모든 지점을 연결하면 망형이다.','① 성형\n② 망형','term','① 각 단말이 중앙 장치와 연결된 구조 ② 모든 단말을 서로 연결한 구조의 명칭을 각각 쓰시오.'],
 ['atm','ATM','Asynchronous Transfer Mode (ATM)','고정 길이 53바이트 셀을 사용하는 전송 기술이다.','헤더 5바이트와 페이로드 48바이트로 이루어진다.','ATM','english-abbreviation'],
 ['parity','패리티 검사','Parity Check','비트 수의 홀짝이 정한 규칙에 맞는지 추가 비트로 검사한다.','기본 패리티로는 모든 짝수 개 비트 오류를 검출할 수 없다.'],
 ['slowstart','슬로 스타트','Slow Start','TCP에서 확인 응답에 따라 혼잡 윈도우를 증가시키며 전송량을 조절한다.','흐름 제어는 수신자, 혼잡 제어는 네트워크 과부하를 고려한다.'],
 ['ieee','IEEE 802 표준','IEEE 802','LAN 등의 통신 기술을 규정하는 표준 계열이다.','802.3은 Ethernet, 802.11은 무선 LAN과 연결한다.','① 802.3\n② 802.11','term','IEEE 802에서 ① Ethernet ② 무선 LAN에 해당하는 표준 번호를 각각 쓰시오.']
]);
group('application-protocols',net,'응용 프로토콜과 포트',12,[
 ['ftp','FTP','File Transfer Protocol (FTP)','파일 전송을 제공하며 기본 제어 연결에 TCP 21번 포트를 사용한다.','제어 연결과 데이터 연결을 구별한다.','FTP','english-abbreviation'],
 ['smtp','SMTP','Simple Mail Transfer Protocol (SMTP)','전자우편을 보내고 전달하는 프로토콜이다.','대표 서버 간 전달 포트는 25이며 메일 수신 방식과 구별한다.','SMTP','english-abbreviation'],
 ['http','HTTP','Hypertext Transfer Protocol (HTTP)','웹 자원의 요청과 응답을 교환하는 응용 계층 프로토콜이다.','평문 HTTP의 기본 포트는 80이다.','HTTP','english-abbreviation'],
 ['snmp','SNMP','Simple Network Management Protocol (SNMP)','네트워크 장치의 상태를 조회하고 관리하는 프로토콜이다.','관리자가 에이전트를 통해 상태 정보를 수집한다.','SNMP','english-abbreviation'],
 ['l2tp','L2TP','Layer Two Tunneling Protocol (L2TP)','두 지점 사이에서 링크 계층 트래픽을 터널로 전달하는 프로토콜이다.','터널링 자체가 암호화를 보장하는 것은 아니며 IPsec 등과 함께 사용할 수 있다.','L2TP','english-abbreviation']
]);
group('security-more',sec,'암호와 공격 보완',14,[
 ['ecc','ECC','Elliptic Curve Cryptography (ECC)','타원곡선의 수학적 문제를 기반으로 하는 공개키 암호 기술이다.','소인수분해를 이용하는 RSA와 기반 문제를 구별한다.','ECC','english-abbreviation'],
 ['dsa','DSA','Digital Signature Algorithm (DSA)','이산대수 문제를 기반으로 하는 디지털 서명 알고리즘이다.','문서를 암호화하는 기능과 서명 생성·검증을 구별한다.','DSA','english-abbreviation'],
 ['esm','ESM','Enterprise Security Management (ESM)','여러 보안 시스템을 연계해 통합 관리하는 체계이다.','개별 솔루션의 경고와 운영을 함께 관리한다.','ESM','english-abbreviation'],
 ['sdp','SDP','Software-Defined Perimeter (SDP)','인증과 정책에 따라 자원 접근 경계를 소프트웨어로 제어한다.','인가 전에 보호 자원의 노출을 제한한다.','SDP','english-abbreviation'],
 ['udp','UDP 플러딩','UDP Flooding','대량의 UDP 트래픽으로 대상의 네트워크나 처리 자원을 소모시키는 공격이다.','TCP 연결 대기를 악용하는 SYN 공격과 구별한다.']
]);
group('drm-more',it,'DRM·URL·통신 기술 보완',16,[
 ['packager','패키저','Packager','디지털 콘텐츠를 암호화하고 배포 가능한 보호 형식으로 구성한다.','라이선스를 관리하는 클리어링 하우스와 구별한다.'],
 ['controller','DRM 컨트롤러','DRM Controller','배포된 콘텐츠의 이용 권한과 조건을 확인하고 사용을 통제한다.','재생 횟수나 사용 기간 조건을 적용한다.'],
 ['container','보안 컨테이너','Secure Container','콘텐츠와 관련 보호 정보를 안전하게 유통하기 위한 구조이다.','보호된 콘텐츠를 전자적 포장에 담는 관점으로 이해한다.'],
 ['url','URL 구성','Uniform Resource Locator (URL)','자원 접근 방식과 호스트·경로·질의·프레그먼트 등을 나타내는 주소이다.','https://example.com/book?id=3#top에서 id=3은 질의이고 top은 프레그먼트이다.','① 질의\n② 프레그먼트','term','URL https://example.com/book?id=3#top에서 ① id=3 ② top에 해당하는 구성 요소 명칭을 각각 쓰시오.'],
 ['mesh','메시 네트워크','Mesh Network','여러 노드가 연결되어 다른 노드를 통해 데이터를 전달할 수 있는 네트워크이다.','한 경로에 문제가 생기면 다른 경로를 활용할 수 있다.']
]);
const reminders={
 'test-white-black':'화이트박스의 기초 경로·제어 구조 검사와 블랙박스의 동등 분할·경계값·원인-효과·비교 검사를 구별한다. 종류별 설명은 이 파트의 보완 묶음에서 학습한다.',
 'test-coverage':'구문·결정 외에 조건/결정과 다중 조건 커버리지를 함께 구별한다. MC/DC는 개별 조건의 독립적인 영향을 확인한다.',
 'sw-uml':'구조·행위 다이어그램의 종류와 UML 관계를 이 파트의 보완 묶음에서 구별한다.',
 'sw-cohesion-order':'순서를 외운 뒤 종류별 특징을 학습한다. 절차적은 실행 순서, 순차적은 출력→입력 연결이 단서이다.',
 'sw-coupling-order':'순서를 외운 뒤 자료·스탬프·제어·외부·공통·내용의 연결 방식을 구별한다.',
 'db-normalforms':'부분·이행적 함수 종속의 사례와 제4·제5정규형을 추가 묶음에서 학습한다.',
 'sec-symmetric':'대칭키의 블록 암호 DES·AES·SEED·ARIA와 스트림 암호 RC4를 종류별로 구별한다.'
};
for(const [id,text] of Object.entries(reminders))bank.find(q=>q.id===id).explanation+=' '+text;
for(const v of variants){
 if(v.answer.includes('\n')&&v.responseFormat==='term')v.quizType='multi-term';
 if(v.prompt.includes('약어를 각각'))v.responseFormat='english-abbreviation';
}
for(const [id,page] of [['extra-analysis-tools-case',1],['extra-analysis-tools-delphi',1],['extra-frameworks-booch',2],['extra-frameworks-jacobson',2],['extra-frameworks-iso',5],['extra-application-protocols-l2tp',13],['extra-drm-more-url',17],['extra-drm-more-mesh',17]]){
 bank.find(q=>q.id===id).sources=source(page);variants.find(v=>v.conceptId===id).sources=source(page);
}
})();
