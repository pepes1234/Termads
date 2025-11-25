<?php
// Endpoint to save a game result
require '../force_authenticate.php';
require '../db_functions.php';
header('Content-Type: application/json');

$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Usuário não autenticado.']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Dados inválidos.']);
    exit();
}

$score = isset($input['score']) ? max(0, intval($input['score'])) : 0;
$won = isset($input['won']) ? (int)$input['won'] : 0;
$attempts_count = isset($input['attempts_count']) ? max(0, intval($input['attempts_count'])) : 0;
$attempts_list = isset($input['attempts_list']) && is_array($input['attempts_list']) ? $input['attempts_list'] : null;
$target_word = isset($input['target_word']) ? $input['target_word'] : null;
$league_id = isset($input['league_id']) ? intval($input['league_id']) : null;

$result = record_game($user_id, $score, $won, $attempts_count, $attempts_list, $target_word, $league_id);

if (!empty($result['success'])) {
    echo json_encode(['success' => true, 'game_id' => $result['game_id']]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $result['error'] ?? 'Erro ao salvar o jogo.']);
}