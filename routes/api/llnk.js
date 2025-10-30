const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const fs = require('fs');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC);
const tokenAbi = require('../../contracts/abi/ERC20.json').abi;
const tokenContract = new ethers.Contract(process.env.TOKEN_CONTRACT, tokenAbi, provider);

router.post('/verify', async (req, res) => {
  const { txn_hash, wallet, amount, partner } = req.body;

  if (!txn_hash || !wallet) {
    return res.status(400).json({ success: false, error: 'Missing data' });
  }

  try {
    const tx = await provider.getTransactionReceipt(txn_hash);
    if (!tx || tx.status !== 1) return res.json({ success: false, error: 'Transaction not found or failed' });

    let verified = false;
    for (const log of tx.logs) {
      try {
        const parsed = tokenContract.interface.parseLog(log);
        if (
          parsed.name === 'Transfer' &&
          parsed.args.to.toLowerCase() === process.env.HOTWALLET_ADDRESS.toLowerCase() &&
          parsed.args.from.toLowerCase() === wallet.toLowerCase()
        ) {
          verified = true;
          break;
        }
      } catch {}
    }

    if (!verified) return res.json({ success: false, error: 'No matching transfer' });

    const purchasesPath = './data/purchases.json';
    const purchases = fs.existsSync(purchasesPath)
      ? JSON.parse(fs.readFileSync(purchasesPath))
      : [];
    purchases.push({
      method: 'LLNK',
      txn_hash,
      wallet,
      amount,
      partner,
      timestamp: new Date().toISOString()
    });
    fs.writeFileSync(purchasesPath, JSON.stringify(purchases, null, 2));

    res.json({ success: true, message: 'LLNK verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

