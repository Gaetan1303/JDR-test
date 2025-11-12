const { io } = require('socket.io-client');

function testWebSocket(url = 'http://localhost:3000', timeout = 5000) {
  return new Promise((resolve) => {
    try {
      const socket = io(url, { reconnectionAttempts: 0, timeout });
      let settled = false;
      const onResult = (res) => { if (!settled) { settled = true; resolve({ ok: true, url }); socket.disconnect(); } };
      const onError = (err) => { if (!settled) { settled = true; resolve({ ok: false, error: err && err.message ? err.message : String(err), url }); socket.disconnect(); } };
      socket.on('connect', onResult);
      socket.on('connect_error', onError);
      socket.on('error', onError);
      setTimeout(() => { if (!settled) { settled = true; resolve({ ok: false, error: 'timeout', url }); socket.disconnect(); } }, timeout + 200);
    } catch (e) {
      resolve({ ok: false, error: e.message, url });
    }
  });
}

if (require.main === module) {
  const url = process.argv[2] || 'http://localhost:3000';
  testWebSocket(url, 5000).then(result => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 2);
  });
}

module.exports = { testWebSocket };
