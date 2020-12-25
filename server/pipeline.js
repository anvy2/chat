const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const { videoMap } = require('./store');

const broadcast = (msg) => {
  const { videoId } = msg;
  const temp = msg;
  temp.id = uuidv4();
  const data = JSON.stringify(temp);
  if (videoMap.get(videoId) === undefined) {
    videoMap.set(videoId, new Set());
  }
  videoMap.get(videoId).forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
};

module.exports = broadcast;
