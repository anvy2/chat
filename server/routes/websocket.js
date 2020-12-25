const router = require('express').Router();
const { videoMap, userMap } = require('../store');

router.post('/ws/remove', (req, res) => {
  const { userId, videoId } = req.body;
  let conn = null;
  userMap.get(userId).forEach((e) => {
    if (e.videoId === videoId) {
      conn = e.ws;
    }
  });
  if (conn !== null) {
    userMap.delete({ videoId, ws: conn });
  }
  videoMap.get(videoId).delete(conn);
  conn.close();
  return res.status(200).end();
});

module.exports = router;
