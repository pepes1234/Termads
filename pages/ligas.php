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
    <link rel="stylesheet" href="../assets/css/ligas.css">
    <title>Ligas - Termads</title>
</head>
<body>
    <nav class="nav">
        <ul>
            <li><a href="game.php">Jogar</a></li>
            <li><a href="ligas.php">Ligas</a></li>
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
            <h1 class="page-title">Ligas</h1>
        </div>
        <form class="form" action="#" method="post" novalidate>
            <label class="label-input" for="name">
                <input id="name" name="nome" type="text" placeholder="Nome da Liga" required>
            </label>

            <label class="label-input" for="description">
                <input id="description" name="descricao" type="text" placeholder="Descrição" required>
            </label>

            <label class="label-input " for="keyword">
                <input id="keyword" name="keyword" type="text" placeholder="Palavra-chave" required>
            </label>    

            <button type="submit" class="btn btn-primary">Criar</button>
        </form>
        <form class="form" action="#" method="post" novalidate>
            <p class="description">ou entre em uma Liga usando uma palavra-chave </p>
            <label class="label-input" for="keyword">
                <input id="keyword" name="keyword" type="text" placeholder="Palavra-chave" required>
            </label>   

            <button type="submit" class="btn btn-primary">Entrar</button>
    </div>

    <script src="../assets/js/historico.js"></script>
</body>
</html>
