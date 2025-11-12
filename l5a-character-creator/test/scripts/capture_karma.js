const puppeteer = require('puppeteer');
const http = require('http');
const url = 'http://localhost:9876/debug.html';

async function waitForServer(retries = 40, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise((res, rej) => {
        const req = http.get(url, (r) => {
          res();
          r.resume();
        });
        req.on('error', rej);
      });
      return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, delay));
    }
  }
  return false;
}

(async () => {
  const ok = await waitForServer();
  if (!ok) {
    console.error('Karma debug page not reachable');
    process.exit(2);
  }

  const executablePath = puppeteer.executablePath ? puppeteer.executablePath() : undefined;
  const launchArgs = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process'];
  const browser = await puppeteer.launch({
    headless: 'new',
    args: launchArgs,
    executablePath: executablePath
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  // small delay to let the test UI render
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'test/karma_debug_real.png', fullPage: true });
  console.log('Saved screenshot to test/karma_debug_real.png');
  await browser.close();
  process.exit(0);
})();
