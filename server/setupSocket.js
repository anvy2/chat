const WebSocket = require('ws');
const url = require('url');
const broadcast = require('./pipeline');
const { videoMap, userMap } = require('./store');

const parseMessage = (data) => {
  try {
    const d = JSON.parse(data);
    return d;
  } catch (err) {
    return null;
  }
};

const parseUrl = (URL) => {
  const data = url.parse(URL);
  let query = data.pathname;
  if (!query) {
    query = undefined;
  } else if (query[0] === '/') {
    query = query.substr(1, query.length).split('/');
  } else {
    query = query.split('/');
  }
  return query;
};

const setup = (server) => {
  const wss = new WebSocket.Server({ noServer: true });
  server.on('upgrade', (req, socket, head) => {
    try {
      const [userId, videoId] = parseUrl(req.url);
      wss.handleUpgrade(req, socket, head, (ws) => {
        if (videoMap.get(videoId) === undefined) {
          videoMap.set(videoId, new Set());
        }
        if (userMap.get(userId) === undefined) {
          userMap.set(userId, new Set());
        }
        videoMap.get(videoId).add(ws);
        userMap.get(userId).add({ videoId, ws });
        wss.emit('connection', ws, req);
      });
    } catch (err) {
      // console.log('upgrade error', err);
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
  });

  wss.on('connection', (ctx) => {
    ctx.on('message', (msg) => {
      const data = parseMessage(msg);
      if (!(data.userId && data.videoId)) {
        ctx.send('Cannot deliver the message! Login required');
      }
      if (data.videoId !== null) {
        broadcast(data);
      }
    });

    ctx.on('close', () => {});
  });
};

module.exports = setup;
