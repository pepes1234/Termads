<?php
require '../force_authenticate.php';
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/historico.css">
    <title>Histórico - Termads</title>
</head>
<body>
    <nav class="nav">
        <ul>
            <li><a href="game.php">Jogar</a></li>
            <li><a href="ligaController.php">Ligas</a></li>
            <li><a href="#">Classificação</a></li>
            <li><a href="historico.php">Histórico</a></li>
        </ul>
        <ul>
            <li><a href="perfil.php"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg><?= htmlspecialchars($user_name) ?></a></li>
        </ul>
    </nav>
    <div class="main-container">
        <div class="header">
            <a href="game.php" class="back-button">← Voltar</a>
            <h1 class="page-title">Histórico de Partidas</h1>
        </div>

        <div class="stats-summary">
            <div class="stat-item">
                <span class="stat-number" id="total-games">0</span>
                <span class="stat-label">Jogos</span>
            </div>
            <div class="stat-item">
                <span class="stat-number" id="win-rate">0%</span>
                <span class="stat-label">Taxa de Vitória</span>
            </div>
            <div class="stat-item">
                <span class="stat-number" id="current-streak">0</span>
                <span class="stat-label">Sequência Atual</span>
            </div>
            <div class="stat-item">
                <span class="stat-number" id="max-streak">0</span>
                <span class="stat-label">Melhor Sequência</span>
            </div>
        </div>

        <div class="games-section">
            <h2 class="section-title">Partidas Recentes</h2>
            <div class="games-list" id="games-list">
            </div>

            <div class="no-games" id="no-games" style="display: none;">
                <p>Nenhuma partida registrada ainda.</p>
                <a href="./game.php" class="play-button">Jogar Agora</a>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="modal-overlay">
        <div class="modal">
            <div class="modal-header">
                <h2 id="modal-title">Detalhes da Partida</h2>
                <button class="close-button" id="close-modal">×</button>
            </div>
            <div class="modal-content">
                <div class="game-info">
                    <div class="info-item">
                        <span class="info-value" id="game-date"></span>
                        <span class="info-label">Data</span>
                    </div>
                    <div class="info-item">
                        <span class="info-value" id="target-word"></span>
                        <span class="info-label">Palavra</span>
                    </div>
                    <div class="info-item">
                        <span class="info-value" id="game-result"></span>
                        <span class="info-label">Resultado</span>
                    </div>
                    <div class="info-item">
                        <span class="info-value" id="attempts-count"></span>
                        <span class="info-label">Tentativas</span>
                    </div>
                </div>
                
                <div class="attempts-grid" id="attempts-grid">
                </div>
            </div>
        </div>
    </div>

    <script src="../assets/js/historico.js"></script>
</body>
</html>
