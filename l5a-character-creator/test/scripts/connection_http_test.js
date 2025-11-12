const http = require('http');
const https = require('https');

function testHttp(url, timeout = 5000) {
  return new Promise((resolve) => {
    try {
      const lib = url.startsWith('https') ? https : http;
      const req = lib.get(url, { timeout }, (res) => {
        const ok = res.statusCode >= 200 && res.statusCode < 400;
        resolve({ ok, statusCode: res.statusCode, url });
        res.resume();
      });
      req.on('error', (err) => resolve({ ok: false, error: err.message, url }));
      req.on('timeout', () => { req.destroy(); resolve({ ok: false, error: 'timeout', url }); });
    } catch (e) {
      resolve({ ok: false, error: e.message, url });
    }
  });
}

if (require.main === module) {
  const url = process.argv[2] || 'http://localhost:9876/debug.html';
  testHttp(url, 5000).then(result => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 2);
  });
}

module.exports = { testHttp };
