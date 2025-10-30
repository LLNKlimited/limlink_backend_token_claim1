require('dotenv').config();
const { ethers } = require('ethers');

// ✅ Correct path to ABI file (in /contracts)
const abi = require('../contracts/abi.json');

// ✅ Correct path to logger service (in /services/logger.js)
const { log } = require('../services/logger');

const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.TOKEN_CONTRACT, abi, wallet);

async function sendToken(to, amount) {
  try {
    const decimals = await contract.decimals();
    const value = ethers.parseUnits(amount.toString(), decimals);

    const tx = await contract.transfer(to, value);
    await tx.wait();

    log(`✅ Tokens sent: ${amount} → ${to} | txHash: ${tx.hash}`);
    return { success: true, hash: tx.hash };
  } catch (err) {
    log(`❌ Token send failed to ${to}: ${err.message}`);
    return { success: false, error: err.message };
  }
}

module.exports = { sendToken };
