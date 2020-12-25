const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
// console.log(dev);
const app = next({ dev });
const http = require('http');
const setupWS = require('./setupSocket');

const handle = app.getRequestHandler();
const port = process.env.PORT ?? 3000;
const wsRouter = require('./routes/websocket');

(async () => {
  try {
    await app.prepare();
  } catch (err) {
    process.exit(1);
  }
  const server = express();
  server.use(wsRouter);
  server.get('*', (req, res) => handle(req, res));
  const httpserver = http.createServer(server);
  setupWS(httpserver);

  httpserver.listen(port, (err) => {
    if (err) throw err;
  });
})();
