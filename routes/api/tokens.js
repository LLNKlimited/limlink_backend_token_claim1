const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { sendToken } = require('../../services/tokenSender');

// POST /api/token/purchase
router.post('/purchase', async (req, res) => {
  const { email, song, promo, wallet_address, amount } = req.body;

  if (!wallet_address || !amount) {
    return res.status(400).json({ success: false, error: 'Missing wallet address or amount' });
  }

  try {
    // Send LLNK tokens using your service
    const result = await sendToken(wallet_address, amount);

    if (!result.success) {
      throw new Error(result.error || 'Token transfer failed');
    }

    // Log the purchase to purchases.json
    const purchasesPath = path.join(__dirname, '../../data/purchases.json');
    const purchases = fs.existsSync(purchasesPath)
      ? JSON.parse(fs.readFileSync(purchasesPath))
      : [];

    purchases.push({
      email,
      song,
      promo,
      wallet_address,
      amount,
      txHash: result.hash,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(purchasesPath, JSON.stringify(purchases, null, 2));

    console.log(`✅ LLNK Purchase recorded for ${email}: ${song}`);

    res.json({
      success: true,
      txHash: result.hash,
      message: `LLNK tokens sent successfully for ${song}`,
    });

  } catch (err) {
    console.error('❌ LLNK purchase error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
