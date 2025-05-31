const express = require('express');
const router = express.Router();
const { sendToOtherService } = require('../utils/api');

router.post('/test-post', async (req, res) => {
  try {
    const result = await sendToOtherService(req.body);
    res.status(200).json({ message: '성공', result });
  } catch (err) {
    res.status(500).json({ message: '실패', error: err.message });
  }
});

module.exports = router;
