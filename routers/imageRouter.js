// routers/imageRouter.js
const express = require('express');
const router = express.Router();
const { sendImageUploadMessage } = require('../utils/rabbitmq');

router.post('/upload-image', async (req, res) => {
  const { filename, user } = req.body;
  if (!filename || !user) {
    return res.status(400).json({ error: 'filename and user are required' });
  }

  try {
    await sendImageUploadMessage({ filename, user });
    res.status(200).json({ message: 'Image upload message sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message to RabbitMQ' });
  }
});

module.exports = router;

