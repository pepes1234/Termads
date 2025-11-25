<?php
require '../force_authenticate.php';
require '../db_functions.php';

$user_id = $_SESSION['user_id'] ?? null;

$league_id = isset($_GET['league_id']) ? intval($_GET['league_id']) : 0;

// Handle leave action (button/form)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'leave') {
    if ($user_id) {
        $res = leave_league($user_id);
        // ignore result for now, redirect back to ligas list for testing
        header('Location: ligas.php');
        exit();
    } else {
        header('Location: ligas.php');
        exit();
    }
}
if ($league_id <= 0) {
    die('Liga inválida.');
}

$conn = connect();
// get league info
$sql = "SELECT id, name, description, created_by FROM leagues WHERE id = " . $league_id . " LIMIT 1";
$res = mysqli_query($conn, $sql);
if (!$res || mysqli_num_rows($res) === 0) {
    close($conn);
    die('Liga não encontrada.');
}
$league = mysqli_fetch_assoc($res);

// total ranking for league
$sql_total = "SELECT u.id AS user_id, u.name AS user_name, lr.total_points, lr.games_played
              FROM league_rankings lr
              JOIN users u ON u.id = lr.user_id
              WHERE lr.league_id = " . $league_id . "
              ORDER BY lr.total_points DESC, lr.games_played DESC
              LIMIT 100";
$total_res = mysqli_query($conn, $sql_total);

// weekly ranking for current week
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
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Ranking da Liga - <?= htmlspecialchars($league['name']) ?></title>
    <link rel="stylesheet" href="../assets/css/ligas.css">
    <style>table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #ddd;text-align:left}</style>
</head>
<body>
    <nav class="nav">
        <ul>
            <li><a href="game.php">Jogar</a></li>
            <li><a href="ligas.php">Ligas</a></li>
            <li><a href="historico.php">Histórico</a></li>
        </ul>
    </nav>
    <main class="main-container">
        <a href="ligas.php" class="back-button">← Voltar</a>
        <h1>Liga: <?= htmlspecialchars($league['name']) ?></h1>
        <?php if (!empty($league['description'])): ?>
            <p><?= nl2br(htmlspecialchars($league['description'])) ?></p>
        <?php endif; ?>

        <!-- Simple leave button (POST) -->
        <form method="post" action="" style="margin:12px 0;">
            <input type="hidden" name="action" value="leave">
            <button type="submit" class="btn btn-danger">Sair da Liga</button>
        </form>

        <section>
            <h2>Ranking - desde a criação da liga</h2>
            <?php if ($total_res && mysqli_num_rows($total_res) > 0): ?>
            <table>
                <thead><tr><th>#</th><th>Usuário</th><th>Pontos</th><th>Jogos</th></tr></thead>
                <tbody>
                <?php $pos = 1; while ($row = mysqli_fetch_assoc($total_res)): ?>
                    <tr>
                        <td><?= $pos++ ?></td>
                        <td><?= htmlspecialchars($row['user_name']) ?></td>
                        <td><?= intval($row['total_points']) ?></td>
                        <td><?= intval($row['games_played']) ?></td>
                    </tr>
                <?php endwhile; ?>
                </tbody>
            </table>
            <?php else: ?>
                <p>Nenhum registro de pontos nesta liga ainda.</p>
            <?php endif; ?>
        </section>

        <section>
            <h2>Ranking Semanal (<?= htmlspecialchars($week_key) ?>)</h2>
            <?php if ($week_res && mysqli_num_rows($week_res) > 0): ?>
            <table>
                <thead><tr><th>#</th><th>Usuário</th><th>Pontos (semana)</th><th>Jogos</th></tr></thead>
                <tbody>
                <?php $pos = 1; while ($row = mysqli_fetch_assoc($week_res)): ?>
                    <tr>
                        <td><?= $pos++ ?></td>
                        <td><?= htmlspecialchars($row['user_name']) ?></td>
                        <td><?= intval($row['total_points']) ?></td>
                        <td><?= intval($row['games_played']) ?></td>
                    </tr>
                <?php endwhile; ?>
                </tbody>
            </table>
            <?php else: ?>
                <p>Nenhum registro nesta semana.</p>
            <?php endif; ?>
        </section>
    </main>
</body>
</html>
