const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post('/confirm', (req, res) => {
  const { txn_id, payer_email, payer_name, amount, currency, partner } = req.body;
  if (!txn_id) return res.status(400).json({ error: 'Missing txn_id' });

  const file = './data/purchases.json';
  const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  data.push({
    method: 'PayPal',
    txn_id,
    payer_email,
    payer_name,
    amount,
    currency,
    partner,
    timestamp: new Date().toISOString()
  });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

module.exports = router;
