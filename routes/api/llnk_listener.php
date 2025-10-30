<?php
// ==============================
// LLNK Token Payment Listener
// ==============================

header('Content-Type: application/json');

// 1️⃣ Capture request data from frontend
$input = json_decode(file_get_contents('php://input'), true);
$wallet = $input['wallet'] ?? '';
$txn_hash = $input['txn_hash'] ?? '';
$email = $input['email'] ?? '';
$amount = $input['amount'] ?? 0;
$item_name = $input['item_name'] ?? '';
$partner = $input['partner'] ?? '';

if (!$wallet || !$txn_hash) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing wallet or txn hash']);
    exit;
}

// 2️⃣ Call your Node backend to verify the transaction
// (Node backend will check blockchain for actual token transfer)
$payload = json_encode([
    'txn_hash' => $txn_hash,
    'wallet' => $wallet,
    'email' => $email,
    'amount' => $amount,
    'item_name' => $item_name,
    'partner' => $partner
]);

$ch = curl_init('http://localhost:4000/api/llnk/verify'); // Change port/URL as needed
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);

// 3️⃣ If verified, log locally like PayPal IPN
if ($result && $result['success'] === true) {
    $jsonPath = __DIR__ . '/purchases.json';
    $purchases = file_exists($jsonPath)
        ? json_decode(file_get_contents($jsonPath), true)
        : [];

    $purchases[$txn_hash] = [
        'payment_status' => 'LLNK_CONFIRMED',
        'email' => $email,
        'wallet' => $wallet,
        'amount' => $amount,
        'partner' => $partner,
        'item_name' => $item_name,
        'timestamp' => date('c')
    ];

    file_put_contents($jsonPath, json_encode($purchases, JSON_PRETTY_PRINT));

    echo json_encode(['success' => true, 'message' => 'LLNK payment verified and logged']);
    exit;
} else {
    http_response_code(400);
    echo json_encode(['error' => 'LLNK verification failed']);
    exit;
}
?>
