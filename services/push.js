const webpush = require('web-push');
const fs = require('fs');
const subscriptionsFile = './data/subscriptions.json';

function getSubs() {
  return fs.existsSync(subscriptionsFile)
    ? JSON.parse(fs.readFileSync(subscriptionsFile))
    : [];
}

function saveSubscription(sub) {
  const subs = getSubs();
  subs.push(sub);
  fs.writeFileSync(subscriptionsFile, JSON.stringify(subs, null, 2));
}

webpush.setVapidDetails(
  'mailto:admin@limlink.tv',
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

async function sendPushNotification(message, url = '/') {
  const subs = getSubs();
  const payload = JSON.stringify({ title: 'LimLink', body: message, url });

  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error('Push failed:', err);
    }
  }
}

module.exports = { saveSubscription, sendPushNotification };


