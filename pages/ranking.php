<?php
require "../force_authenticate.php";
require "../db_functions.php";

$conn = connect();

function getRankingGlobal($conn, $page = 1, $limit = 20) {
    $offset = ($page - 1) * $limit;
    $sql = "SELECT u.name as usuario, 
                   COALESCE(SUM(g.score), 0) as total_pontos,
                   l.name as liga
            FROM users u
            LEFT JOIN games g ON u.id = g.user_id
            LEFT JOIN leagues l ON u.league_id = l.id
            GROUP BY u.id, u.name, l.name
            ORDER BY total_pontos DESC
            LIMIT $limit OFFSET $offset";
    
    $result = mysqli_query($conn, $sql);
    if (!$result) {
        return [];
    }
    return mysqli_fetch_all($result, MYSQLI_ASSOC);
}

function getRankingSemanal($conn, $page = 1, $limit = 20) {
    $offset = ($page - 1) * $limit;
    $sql = "SELECT u.name as usuario, 
                   COALESCE(SUM(g.score), 0) as total_pontos,
                   l.name as liga
            FROM users u
            LEFT JOIN games g ON u.id = g.user_id AND g.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            LEFT JOIN leagues l ON u.league_id = l.id
            GROUP BY u.id, u.name, l.name
            ORDER BY total_pontos DESC
            LIMIT $limit OFFSET $offset";
    
    $result = mysqli_query($conn, $sql);
    if (!$result) {
        return [];
    }
    return mysqli_fetch_all($result, MYSQLI_ASSOC);
}

function getTotalPlayers($conn, $type = 'global') {
    if ($type === 'semanal') {
        $sql = "SELECT COUNT(DISTINCT u.id) as total
                FROM users u
                LEFT JOIN games g ON u.id = g.user_id AND g.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    } else {
        $sql = "SELECT COUNT(DISTINCT u.id) as total FROM users u";
    }
    
    $result = mysqli_query($conn, $sql);
    if (!$result) {
        return 0;
    }
    $row = mysqli_fetch_assoc($result);
    return (int)$row['total'];
}

$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit = 20;

$rankingGlobal = getRankingGlobal($conn, $page, $limit);
$rankingSemanal = getRankingSemanal($conn, $page, $limit);
$totalGlobal = getTotalPlayers($conn, 'global');
$totalSemanal = getTotalPlayers($conn, 'semanal');

$totalPagesGlobal = ceil($totalGlobal / $limit);
$totalPagesSemanal = ceil($totalSemanal / $limit);

close($conn);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="description" content="Termads - Ranking de jogadores">
    <meta name="theme-color" content="#121212">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/termads/assets/css/style.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="/termads/assets/css/ranking.css?v=<?php echo time(); ?>">
    <title>Termads - Ranking</title>
</head>
<body>
    <nav class="nav">
        <ul>
            <li><a href="game.php">Jogar</a></li>
            <li><a href="ligas.php">Ligas</a></li>
            <li><a href="ranking.php" class="nav-active">Classificação</a></li>
            <li><a href="historico.php">Histórico</a></li>
        </ul>
        <ul>
            <li><a href="perfil.php"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg><?= htmlspecialchars($user_name) ?></a></li>
        </ul>
    </nav>

    <div class="ranking-container">
        <header class="ranking-header">
            <h1>Classificação</h1>
        </header>

        <div class="ranking-controls">
            <div class="ranking-tabs">
                <button class="ranking-tab active" data-tab="global" data-total="<?= $totalGlobal ?>" data-pages="<?= $totalPagesGlobal ?>">
                    Global
                </button>
                <button class="ranking-tab" data-tab="semanal" data-total="<?= $totalSemanal ?>" data-pages="<?= $totalPagesSemanal ?>">
                    Semanal
                </button>
            </div>
            <div class="ranking-info">
                <span id="ranking-count"></span>
            </div>
        </div>

        <div class="ranking-content">
            <div id="ranking-global" class="ranking-table-container active">
                <div class="table-wrapper">
                    <table class="ranking-table">
                        <thead>
                            <tr>
                                <th class="rank-col">#</th>
                                <th class="player-col">Jogador</th>
                                <th class="points-col">Pontos</th>
                                <th class="league-col">Liga</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($rankingGlobal)): ?>
                                <tr class="empty-state">
                                    <td colspan="4">
                                        <div class="empty-message">
                                            <p>Nenhum jogador encontrado</p>
                                        </div>
                                    </td>
                                </tr>
                            <?php else: ?>
                                <?php 
                                $startRank = ($page - 1) * $limit + 1;
                                $foundCurrentUser = false;
                                foreach ($rankingGlobal as $index => $player): 
                                    $currentRank = $startRank + $index;
                                    $isCurrentUser = ($player['usuario'] === $user_name && !$foundCurrentUser);
                                    if ($isCurrentUser) $foundCurrentUser = true;
                                ?>
                                    <tr class="ranking-row <?= $isCurrentUser ? 'current-user' : '' ?>">
                                        <td class="rank-cell">
                                            <span class="rank-number"><?= $currentRank ?></span>
                                        </td>
                                        <td class="player-cell">
                                            <span class="player-name"><?= htmlspecialchars($player['usuario']) ?></span>
                                        </td>
                                        <td class="points-cell">
                                            <span class="points-value"><?= number_format($player['total_pontos']) ?></span>
                                        </td>
                                        <td class="league-cell">
                                            <?php if ($player['liga']): ?>
                                                <?= htmlspecialchars($player['liga']) ?>
                                            <?php else: ?>
                                                <span class="no-league">-</span>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="ranking-semanal" class="ranking-table-container">
                <div class="table-wrapper">
                    <table class="ranking-table">
                        <thead>
                            <tr>
                                <th class="rank-col">#</th>
                                <th class="player-col">Jogador</th>
                                <th class="points-col">Pontos</th>
                                <th class="league-col">Liga</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($rankingSemanal)): ?>
                                <tr class="empty-state">
                                    <td colspan="4">
                                        <div class="empty-message">
                                            <p>Nenhuma atividade esta semana</p>
                                        </div>
                                    </td>
                                </tr>
                            <?php else: ?>
                                <?php 
                                $startRank = ($page - 1) * $limit + 1;
                                $foundCurrentUserWeekly = false;
                                foreach ($rankingSemanal as $index => $player): 
                                    $currentRank = $startRank + $index;
                                    $isCurrentUser = ($player['usuario'] === $user_name && !$foundCurrentUserWeekly);
                                    if ($isCurrentUser) $foundCurrentUserWeekly = true;
                                ?>
                                    <tr class="ranking-row <?= $isCurrentUser ? 'current-user' : '' ?>">
                                        <td class="rank-cell">
                                            <span class="rank-number"><?= $currentRank ?></span>
                                        </td>
                                        <td class="player-cell">
                                            <span class="player-name"><?= htmlspecialchars($player['usuario']) ?></span>
                                        </td>
                                        <td class="points-cell">
                                            <span class="points-value"><?= number_format($player['total_pontos']) ?></span>
                                        </td>
                                        <td class="league-cell">
                                            <?php if ($player['liga']): ?>
                                                <?= htmlspecialchars($player['liga']) ?>
                                            <?php else: ?>
                                                <span class="no-league">-</span>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="pagination-container">
            <div class="pagination" id="pagination"></div>
            <div class="pagination-info">
                <span id="pagination-details"></span>
            </div>
        </div>
    </div>

    <script src="/termads/assets/js/ranking.js?t=<?= time() ?>"></script>
</body>
</html>