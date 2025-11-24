<?php
require '../force_authenticate.php';
require '../db_functions.php';


$erros = [];
if($_SERVER["REQUEST_METHOD"] === "POST"){
    if(isset($_POST["nome"],$_POST["descricao"],$_POST["keyword"])){
        $conn = connect();
        $nomeLiga = $_POST["nome"];
        $descricaoLiga = $_POST["descricao"];
        $keywordLiga = $_POST["keyword"];

        if(empty($_POST["nome"])){
            $erros["nome"] = "Insira o nome da Liga";
        } else {
            $nomeLiga = tratarForm($_POST["nome"], $conn);
        }

        if (empty($_POST["descricao"])) {
            $erros["descricao"] = "Insira a descrição da Liga";
        } else {
            $descricaoLiga = tratarForm($_POST["descricao"], $conn);
        }

        if (empty($_POST["keyword"])) {
            $erros["keyword"] = "Insira sua palavra-chave!";
        } else {
            $keywordLiga = tratarForm($_POST["keyword"], $conn);
        }


        close($conn);  
    }
}
function tratarForm($dado, $conn) {
    $dado = trim($dado);
    $dado = htmlspecialchars($dado);
    $dado = stripslashes($dado);
    $dado = mysqli_real_escape_string($conn, $dado);
    return $dado;
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
            <label class="label-input <?php if(isset($erros["nome"])){ echo 'input-erro'; } ?>" for="name">
                <input id="name" name="nome" type="text" placeholder="<?php if(isset($erros["nome"])){ echo $erros["nome"] ; } else { echo "Nome da Liga"; } ?>" required>
            </label>

            <label class="label-input <?php if(isset($erros["descricao"])){ echo 'input-erro'; } ?>" for="description">
                <input id="description" name="descricao" type="text" placeholder="<?php if(isset($erros["descricao"])){ echo $erros["descricao"] ; } else { echo "Descrição"; } ?>" required>
            </label>

            <label class="label-input <?php if(isset($erros["keyword"])){ echo 'input-erro'; } ?>" for="keyword">
                <input id="keyword" name="keyword" type="text" placeholder="<?php if(isset($erros["keyword"])){ echo $erros["keyword"] ; } else { echo "Palavra-chave"; } ?>" required>
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
