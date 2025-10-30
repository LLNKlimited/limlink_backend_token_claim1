document.getElementById('claimBtn').addEventListener('click', async () => {
  const txn_id = document.getElementById('txn_id').value.trim();
  const wallet_address = document.getElementById('wallet_address').value.trim();
  const email = document.getElementById('email').value.trim();
  const resultEl = document.getElementById('result');

  if (!txn_id || !wallet_address) {
    resultEl.textContent = '❌ Transaction ID and Wallet Address are required.';
    return;
  }

  try {
    const res = await fetch('/api/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txn_id, wallet_address, email })
    });
    const data = await res.json();

    if (data.success) {
      resultEl.textContent = `✅ Tokens claimed! TX Hash: ${data.txHash}`;
      document.getElementById('txn_id').value = '';
      document.getElementById('wallet_address').value = '';
      document.getElementById('email').value = '';
    } else {
      resultEl.textContent = `❌ ${data.error || 'Claim failed'}`;
    }
  } catch (err) {
    resultEl.textContent = `❌ ${err.message}`;
  }
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    console.log('Service Worker registered');
  });
}
