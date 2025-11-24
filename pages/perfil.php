<?php 
require '../db_credentials.php';
require '../force_authenticate.php';

$nomeUsuario = $user_name;
$userEmail = $user_email;
$userSenha = "********"; 

?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/perfil.css">
    <title>Perfil - Termads</title>
</head>
<body>
    <nav class="nav">
        <ul>
            <li><a href="game.php">Jogar</a></li>
            <li><a href="#">Ligas</a></li>
            <li><a href="#">Classificação</a></li>
            <li><a href="historico.php">Histórico</a></li>
        </ul>
        <ul>
            <li><a href=""><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg>Perfil</a></li>
        </ul>
    </nav>
    <div class="main-container">
        <div class="header">
            <a href="game.php" class="back-button">← Voltar</a>
            <h1 class="page-title">Seu Perfil</h1>
        </div>

        <div class="data-summary">
            <div class="data-item">
                <span class="stat-label">Nome:</span>
                <span class="stat-value" id="user-name"><?php echo htmlspecialchars($nomeUsuario); ?></span>
            </div>
            <div class="data-item">
                <span class="stat-label">Email:</span>
                <span class="stat-value" id="user-email"><?php echo htmlspecialchars($userEmail); ?></span>
            </div>
            <div class="data-item">
                <span class="stat-label">Senha:</span>
                <span class="stat-value" id="user-senha"><?php echo htmlspecialchars($userSenha); ?></span>
            </div>
        </div>
        <button class="logout" onclick="location.href='logout.php'">Log Out</button>
    </div>

    <script src="../assets/js/historico.js"></script>
</body>
</html>
