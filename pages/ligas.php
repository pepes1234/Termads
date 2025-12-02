<?php
require '../force_authenticate.php';
require '../db_functions.php';

$erros = [];
$success = null;

$user_id = $user_id ?? $_SESSION['user_id'] ?? null;

if ($user_id) {
    $conn = connect();
    $sql = "SELECT league_id FROM users WHERE id = " . intval($user_id);
    $result = mysqli_query($conn, $sql);
    if ($result && $row = mysqli_fetch_assoc($result)) {
        if (!empty($row['league_id'])) {
            close($conn);
            header("Location: liga.php?league_id=" . intval($row['league_id']));
            exit();
        }
    }
    close($conn);
}

if($_SERVER["REQUEST_METHOD"] === "POST"){
    $action = $_POST["action"] ?? "";

    if(!$user_id){
        $erros["general"] = "Usuário não autenticado.";
    } elseif($action === "create"){
        $nomeLiga = trim($_POST["nome"] ?? "");
        $descricaoLiga = trim($_POST["descricao"] ?? "");
        $keywordLiga = strtoupper(trim($_POST["keyword_create"] ?? ""));

        $result = create_league($nomeLiga, $user_id, $keywordLiga, $descricaoLiga);
        if(!empty($result['success'])){
            $joinRes = join_league($user_id, $keywordLiga);
            $league_id = $result['league_id'] ?? $joinRes['league_id'] ?? null;
            header("Location: liga.php?league_id=" . intval($league_id));
            exit();
        } else {
            $erros[$result['error_key'] ?? 'general'] = $result['error'] ?? 'Erro ao criar a liga.';
        }
    } elseif($action === "join"){
        $keywordLiga = strtoupper(trim($_POST["keyword_join"] ?? ""));

        $result = join_league($user_id, $keywordLiga);
        if(!empty($result['success'])){
            $league_id = $result['league_id'] ?? null;
            header("Location: liga.php?league_id=" . intval($league_id));
            exit();
        } else {
            $erros[$result['error_key'] ?? 'general'] = $result['error'] ?? 'Erro ao entrar na liga.';
        }
    }
}
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
    <div class="main-container">
        <div class="header">
            <a href="game.php" class="back-button">← Voltar</a>
            <h1 class="page-title">Ligas</h1>
        </div>
        <?php if (!empty($erros['general'])): ?>
            <div class="error-message"><?= htmlspecialchars($erros['general']) ?></div>
        <?php endif; ?>
        <form class="form" action="#" method="post" novalidate>
            <input type="hidden" name="action" value="create">    

            <label class="label-input <?php if(isset($erros["nome"])){ echo 'input-erro'; } ?>" for="name">
                <input id="name" name="nome" type="text"
                    value="<?= isset($_POST['nome']) ? htmlspecialchars($_POST['nome']) : '' ?>"
                    placeholder="<?= isset($erros["nome"]) ? $erros["nome"] : "Nome da Liga" ?>" required>
            </label>

            <label class="label-input" for="description">
                <input id="description" name="descricao" type="text" placeholder="Descrição (opcional)"
                    value="<?= isset($_POST['descricao']) ? htmlspecialchars($_POST['descricao']) : '' ?>">
            </label>

            <label class="label-input <?php if(isset($erros["keyword"])){ echo 'input-erro'; } ?>" for="keyword_create">
                <input id="keyword_create" name="keyword_create" type="text"
                    value="<?= isset($_POST['keyword_create']) ? htmlspecialchars($_POST['keyword_create']) : '' ?>"
                    placeholder="<?= isset($erros["keyword"]) ? $erros["keyword"] : 'Palavra-chave (3-8 chars)' ?>" required>
            </label>    

            <button type="submit" class="btn btn-primary">Criar</button>
        </form>

        <form class="form" action="#" method="post" novalidate>
            <input type="hidden" name="action" value="join">
            <p class="description">Ou entre em uma Liga usando uma palavra-chave </p>
            <label class="label-input <?php if(isset($erros["joinKeyword"])){ echo 'input-erro'; } ?>" for="keyword_join">
                <input id="keyword_join" name="keyword_join" type="text"
                    value="<?= isset($_POST['keyword_join']) ? htmlspecialchars($_POST['keyword_join']) : '' ?>"
                    placeholder="<?= isset($erros["joinKeyword"]) ? $erros["joinKeyword"] : 'Palavra-chave' ?>" required>
            </label>

            <button type="submit" class="btn btn-primary">Entrar</button>
        </form>
    </div>

    <script src="../assets/js/historico.js"></script>
</body>
</html>
