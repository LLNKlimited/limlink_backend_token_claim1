const webpush = require('web-push');
const fs = require('fs');
const subscriptionsFile = './subscriptions.json';

// Load subscriptions
function getSubscriptions() {
  return fs.existsSync(subscriptionsFile)
    ? JSON.parse(fs.readFileSync(subscriptionsFile))
    : [];
}

// Save subscriptions
function saveSubscription(subscription) {
  const subscriptions = getSubscriptions();
  subscriptions.push(subscription);
  fs.writeFileSync(subscriptionsFile, JSON.stringify(subscriptions, null, 2));
}

webpush.setVapidDetails(
  'mailto:rick@llnklimited.com',
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

async function sendPushNotification(message, url = '/') {
  const subscriptions = getSubscriptions();
  const payload = JSON.stringify({ title: 'LimLink', body: message, url });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error('Push error:', err);
    }
  }
}

module.exports = { saveSubscription, sendPushNotification };
