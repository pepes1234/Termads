<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);

require '../force_authenticate.php';
require '../db_functions.php';

$user_id = $_SESSION['user_id'] ?? null;

$league_id = isset($_GET['league_id']) ? intval($_GET['league_id']) : 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'leave') {
    if ($user_id) {
        $res = leave_league($user_id);
        ob_end_clean();
        header('Location: ligas.php');
        exit();
    } else {
        ob_end_clean();
        header('Location: ligas.php');
        exit();
    }
}
if ($league_id <= 0) {
    ob_end_clean();
    die('Liga inválida.');
}

$conn = connect();
$sql = "SELECT id, name, description, created_by FROM leagues WHERE id = " . $league_id . " LIMIT 1";
$res = mysqli_query($conn, $sql);
if (!$res || mysqli_num_rows($res) === 0) {
    close($conn);
    die('Liga não encontrada.');
}
$league = mysqli_fetch_assoc($res);

$sql_total = "SELECT u.id AS user_id, u.name AS user_name, lr.total_points, lr.games_played
              FROM league_rankings lr
              JOIN users u ON u.id = lr.user_id
              WHERE lr.league_id = " . $league_id . "
              ORDER BY lr.total_points DESC, lr.games_played DESC
              LIMIT 100";
$total_res = mysqli_query($conn, $sql_total);

$week_key = get_week_key();
$wk = mysqli_real_escape_string($conn, $week_key);
$sql_week = "SELECT u.id AS user_id, u.name AS user_name, lwr.total_points, lwr.games_played
             FROM league_weekly_rankings lwr
             JOIN users u ON u.id = lwr.user_id
             WHERE lwr.league_id = " . $league_id . " AND lwr.week_key = '" . $wk . "'
             ORDER BY lwr.total_points DESC, lwr.games_played DESC
             LIMIT 100";
$week_res = mysqli_query($conn, $sql_week);

close($conn);

$buffer = ob_get_clean();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="description" content="Termads - Ranking da Liga">
    <meta name="theme-color" content="#121212">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/termads/assets/css/style.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="/termads/assets/css/ranking.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="/termads/assets/css/liga.css?v=<?php echo time(); ?>">
    <title>Termads - <?= htmlspecialchars($league['name']) ?></title>
</head>
<body>
    <nav class="nav">
        <ul>
            <li><a href="game.php">Jogar</a></li>
            <li><a href="ligas.php" class="nav-active">Ligas</a></li>
            <li><a href="ranking.php">Classificação</a></li>
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
            <h1><?= htmlspecialchars($league['name']) ?></h1>
        </header>
        <?php if (!empty($league['description'])): ?>
            <p class="header-subtitle"><?= nl2br(htmlspecialchars($league['description'])) ?></p>
        <?php endif; ?>

        <div class="ranking-controls">
            <div class="ranking-tabs">
                <button class="ranking-tab active" data-tab="total">
                    Total
                </button>
                <button class="ranking-tab" data-tab="semanal">
                    Semanal
                </button>
            </div>
            <form method="post" action="">
                <input type="hidden" name="action" value="leave">
                <button type="submit" class="btn-leave">Sair da Liga</button>
            </form>
        </div>

        <div class="ranking-content">
            <div id="ranking-total" class="ranking-table-container active">
                <?php if ($total_res && mysqli_num_rows($total_res) > 0): ?>
                <div class="table-wrapper">
                    <table class="ranking-table">
                        <thead>
                            <tr>
                                <th class="rank-col">#</th>
                                <th class="player-col">Jogador</th>
                                <th class="points-col">Pontos</th>
                                <th class="league-col">Jogos</th>
                            </tr>
                        </thead>
                        <tbody>
                        <?php $pos = 1; while ($row = mysqli_fetch_assoc($total_res)): 
                            $isCurrentUser = ($row['user_id'] == $user_id);
                        ?>
                            <tr class="ranking-row <?= $isCurrentUser ? 'current-user' : '' ?>">
                                <td class="rank-cell">
                                    <span class="rank-number"><?= $pos++ ?></span>
                                </td>
                                <td class="player-cell">
                                    <span class="player-name"><?= htmlspecialchars($row['user_name']) ?></span>
                                </td>
                                <td class="points-cell">
                                    <span class="points-value"><?= number_format($row['total_points']) ?></span>
                                </td>
                                <td class="league-cell"><?= $row['games_played'] ?></td>
                            </tr>
                        <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
                <?php else: ?>
                    <tr class="empty-state">
                        <td colspan="4">
                            <div class="empty-message">
                                <p>Nenhum registro de pontos nesta liga ainda.</p>
                            </div>
                        </td>
                    </tr>
                <?php endif; ?>
            </div>

            <div id="ranking-semanal" class="ranking-table-container">
                <?php if ($week_res && mysqli_num_rows($week_res) > 0): ?>
                <div class="table-wrapper">
                    <table class="ranking-table">
                        <thead>
                            <tr>
                                <th class="rank-col">#</th>
                                <th class="player-col">Jogador</th>
                                <th class="points-col">Pontos</th>
                                <th class="league-col">Jogos</th>
                            </tr>
                        </thead>
                        <tbody>
                        <?php $pos = 1; while ($row = mysqli_fetch_assoc($week_res)): 
                            $isCurrentUser = ($row['user_id'] == $user_id);
                        ?>
                            <tr class="ranking-row <?= $isCurrentUser ? 'current-user' : '' ?>">
                                <td class="rank-cell">
                                    <span class="rank-number"><?= $pos++ ?></span>
                                </td>
                                <td class="player-cell">
                                    <span class="player-name"><?= htmlspecialchars($row['user_name']) ?></span>
                                </td>
                                <td class="points-cell">
                                    <span class="points-value"><?= number_format($row['total_points']) ?></span>
                                </td>
                                <td class="league-cell"><?= $row['games_played'] ?></td>
                            </tr>
                        <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
                <?php else: ?>
                    <tr class="empty-state">
                        <td colspan="4">
                            <div class="empty-message">
                                <p>Nenhuma atividade esta semana</p>
                            </div>
                        </td>
                    </tr>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script>
    document.querySelectorAll('.ranking-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            document.querySelectorAll('.ranking-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.ranking-table-container').forEach(container => {
                container.classList.remove('active');
            });
            document.getElementById('ranking-' + targetTab).classList.add('active');
        });
    });
    </script>
</body>
</html>
