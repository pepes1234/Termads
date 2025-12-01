<?php
// Endpoint to get user's game history
require '../../db_functions.php';
header('Content-Type: application/json; charset=utf-8');

if (session_status() === PHP_SESSION_NONE) session_start();
$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Usuário não autenticado.']);
    exit();
}

$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
$limit = ($limit <= 0 || $limit > 100) ? 50 : $limit;

$history = get_user_history($user_id, $limit);

$totalGames = count($history);
$wins = 0;
$totalScore = 0;
$currentStreak = 0;
$maxStreak = 0;
$streak = 0;

foreach ($history as $idx => $game) {
    $won = !empty($game['won']) ? 1 : 0;
    $wins += $won;
    $totalScore += intval($game['score']);
    if ($won) {
        $streak++;
        if ($streak > $maxStreak) {
            $maxStreak = $streak;
        }
        if ($idx === 0) {
            $currentStreak = $streak;
        }
    } else {
        if ($idx === 0) {
            $currentStreak = 0;
        }
        $streak = 0;
    }
}

$currentStreak = 0;
for ($i = 0; $i < $totalGames; $i++) {
    if (!empty($history[$i]['won'])) {
        $currentStreak++;
    } else {
        break;
    }
}

$winRate = $totalGames > 0 ? round(($wins / $totalGames) * 100, 1) : 0.0;

echo json_encode([
    'success' => true,
    'stats' => [
        'total_games' => $totalGames,
        'wins' => $wins,
        'win_rate' => $winRate,
        'current_streak' => $currentStreak,
        'max_streak' => $maxStreak,
        'total_score' => $totalScore
    ],
    'history' => $history
]);