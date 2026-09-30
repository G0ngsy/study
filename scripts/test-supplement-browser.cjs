const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const root=path.resolve('dist');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+(req.url==='/'?'/index.html':req.url.split('?')[0]));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(data)});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.locator('[data-part="테스트"]').click();await page.locator('[data-lesson="test-lesson-01"]').click();
  await page.locator('[data-action="concept-next"]').click();await page.locator('.related-lessons summary').click();
  await page.locator('[data-related-lesson="extra-white-1"]').click();assert.equal(await page.locator('.concept-card h1').textContent(),'기초 경로 검사');
  assert((await page.locator('.english-term').textContent()).includes('Basis Path Testing'));
  await page.screenshot({path:'output/audit/new-learning.png',fullPage:true});
  await page.locator('[data-nav="part"]').click();await page.locator('[data-bundle-quiz="extra-white-1"]').click();
  assert.equal(await page.locator('.english-term').count(),0);await page.locator('#answer').fill('기초 경로 검사');
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem(QuizCore.KEY)).sessions.length);
  await page.reload();await page.locator('[data-action="resume"]').click();assert.equal(await page.locator('#answer').inputValue(),'기초 경로 검사');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem(QuizCore.KEY)).sessions.length),before);
  for(let i=0;i<5;i++){await page.locator('[data-action="reveal"]').click();assert.equal(await page.locator('.english-term').count(),1);await page.locator('[data-rating="correct"]').click();if(i<4)await page.locator('[data-action="next"]').click();}
  await page.locator('[data-nav="history"]').first().click();await page.locator('#history-part').selectOption('테스트');assert((await page.locator('.record-count').textContent()).includes('5개의'));
  await page.locator('[data-nav="home"]').first().click();await page.locator('[data-part="SQL 개념"]').click();await page.locator('[data-bundle-quiz="extra-sql-write-1"]').click();
  assert((await page.locator('.answer-label').textContent()).includes('영어 SQL 명령어로 전체 구문'));await page.locator('#answer').fill('SELECT NAME, SCORE FROM STUDENT ORDER BY SCORE DESC;');
  await page.locator('[data-action="reveal"]').click();assert(await page.locator('.answer-panel').isVisible());
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
  console.log('PASS: related lessons, English after reveal, new quiz resume without duplicate, completion/history, SQL instructions, mobile layout');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
