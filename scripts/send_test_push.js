require('dotenv').config();
const { sendPushNotification } = require('../push');

(async () => {
  try {
    const message = '🚀 This is a test broadcast from LimLink!';
    const url = '/';
    await sendPushNotification(message, url);
    console.log('✅ Test push sent successfully.');
  } catch (err) {
    console.error('❌ Failed to send test push:', err);
  }
})();
