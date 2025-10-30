require('dotenv').config();
const fetch = require('node-fetch'); // Install: npm i node-fetch

async function verifyPayment(txn_id) {
  try {
    const url = `https://api-m.paypal.com/v1/payments/payment/${txn_id}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) return { success: false };

    const data = await res.json();
    // Assuming data.state === 'approved' means success
    const success = data.state === 'approved';
    return { success };
  } catch (err) {
    console.error('❌ PayPal verification error:', err);
    return { success: false, error: err.message };
  }
}

module.exports = { verifyPayment };
