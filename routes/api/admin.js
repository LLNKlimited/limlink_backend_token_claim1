const express = require('express');
const router = express.Router();
const { sendPushNotification } = require('./services/push');

// POST /api/admin/send-update
router.post('/send-update', async (req, res) => {
  const { message, url, admin_key } = req.body;

  // Simple security check
  if (admin_key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    await sendPushNotification(message, url || '/');
    console.log(`📢 Broadcast sent: "${message}"`);
    res.json({ success: true, message: 'Push notification sent to all subscribers.' });
  } catch (err) {
    console.error('Push broadcast failed:', err);
    res.status(500).json({ error: 'Failed to send push notification' });
  }
});

module.exports = router;
