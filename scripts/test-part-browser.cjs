const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const root=path.resolve('dist');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+(req.url==='/'?'/index.html':req.url.split('?')[0]));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(data)});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
 browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}`);
 await page.locator('[data-part="소프트웨어 설계"]').click();assert(await page.locator('[data-part-random]').isDisabled());
 await page.evaluate(()=>{const C=QuizCore,state=C.empty();state.sessions=LEARNING_BUNDLES.filter(b=>b.category==='소프트웨어 설계').map((b,i)=>{const s=C.createBundleSession(QUIZ_BANK,b,'seed-'+i);s.items.forEach((a,j)=>{a.revealed=true;C.grade(s,j,'correct')});return s});localStorage.setItem(C.KEY,JSON.stringify(state));});
 await page.reload();await page.locator('[data-part="소프트웨어 설계"]').click();await page.locator('[data-part-random]').click();await page.locator('#answer').fill('이어 풀기 확인');
 await page.reload();await page.locator('[data-action="resume"]').click();assert.equal(await page.locator('#answer').inputValue(),'이어 풀기 확인');
 for(let i=0;i<10;i++){await page.locator('[data-action="reveal"]').click();await page.locator('[data-rating="correct"]').click();if(i<9)await page.locator('[data-action="next"]').click();}
 assert.equal(await page.locator('[data-part-random]').textContent(),'다른 랜덤 10문제');
 await page.locator('[data-part-random]').click();assert(await page.locator('#question-title').isVisible());
 await page.locator('[data-nav="history"]').first().click();await page.locator('#history-part').selectOption('소프트웨어 설계');await page.locator('#history-mode').selectOption('part-random');assert((await page.locator('.record-count').textContent()).includes('10개의'));await page.locator('[data-filter="wrong"]').click();assert((await page.locator('.record-count').textContent()).includes('0개의'));
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);console.log('PASS: mobile unlock, completion, resume, repeat, filters, no errors/overflow');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
