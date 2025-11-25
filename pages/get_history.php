<?php
// Endpoint to get user's game history
require '../force_authenticate.php';
require '../db_functions.php';
header('Content-Type: application/json');

$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Usuário não autenticado.']);
    exit();
}

$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
$limit = ($limit <= 0 || $limit > 100) ? 50 : $limit;

$history = get_user_history($user_id, $limit);
echo json_encode(['success' => true, 'history' => $history]);