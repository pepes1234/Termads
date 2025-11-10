<?php
require '../db_functions.php';

$erros = [];
if($_SERVER["REQUEST_METHOD"] === "POST"){
    if(isset($_POST["nome"],$_POST["email"],$_POST["senha"],$_POST["confirmaSenha"])){
        $conn = connect();

        $nome = $_POST["nome"];
        if(empty($_POST["nome"])){
            $erros["nome"] = "Insira seu nome!";
        } elseif (!preg_match("/^[A-Za-zÀ-ÿ\s]+$/", $_POST["nome"])) {
            $erros["nome"] = "Apenas letras e espaços em branco!";
        } else {
            $nome = tratarForm($_POST["nome"], $conn);
        }

        if (empty($_POST["email"])) {
            $erros["email"] = "Insira seu email!";
        } elseif (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
            $erros["email"] = "Email inválido!";
        } else {
            $email = tratarForm($_POST["email"], $conn);
        }

        if (empty($_POST["senha"])) {
            $erros["senha"] = "Insira sua senha!";
        } elseif (strlen($_POST["senha"]) < 7) {
            $erros["senha"] = "Senha de no mínimo 8 caracteres!";
        } else {
            $senha = tratarForm($_POST["senha"], $conn);
        }

        if (empty($_POST["confirmaSenha"])) {
            $erros["confirmaSenha"] = "Confirme sua senha!";
        } elseif (strlen($_POST["confirmaSenha"]) < 7) {
            $erros["confirmaSenha"] = "Senha de no mínimo 8 caracteres!";
        } else {
            $senha = tratarForm($_POST["senha"], $conn);
        }

        if (empty($_POST["confirmaSenha"])) {
            $erros["confirmaSenha"] = "Confirme sua senha!";
        } elseif ($_POST["confirmaSenha"] !== $_POST["senha"]) {
            $erros["confirmaSenha"] = "As senhas são diferentes!";
        } else {
            $senha = tratarForm($_POST["confirmaSenha"], $conn);
        }
        
        if (empty($erros)) {
            $senhaHash = md5($senha);

            $sql = "INSERT INTO $table_users
            (name, email, password) VALUES
            ('$nome', '$email', '$senhaHash');";

            if(mysqli_query($conn, $sql)){
                close($conn);
                header("Location: loginAccount.php");
                exit();
            } else {
                $erros["geral"] = "Erro ao registrar conta: " . mysqli_error($conn);
            }
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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/createAccount.css">
    <script src="https://kit.fontawesome.com/409ccfe72e.js" crossorigin="anonymous"></script>
    <title>Registrar</title>
</head>
<body>
    
    <div class="main-container">
        <div class="title">
            <h2>Registrar</h2>
        </div>
        <form class="form" action="#" method="post" novalidate>
            <label class="label-input <?php if(isset($erros["nome"])){ echo 'input-erro'; } ?>" for="name">
                <i class="fa-solid fa-user icon-modify" aria-hidden="true"></i>
                <input id="name" name="nome" type="text" placeholder="<?php if(isset($erros["nome"])){ echo $erros["nome"] ; } else { echo "Nome"; } ?>" required>
            </label>

            <label class="label-input <?php if(isset($erros["email"])){ echo 'input-erro'; } ?>" for="email">
                <i class="fa-solid fa-envelope icon-modify" aria-hidden="true"></i>
                <input id="email" name="email" type="email" placeholder="<?php if(isset($erros["email"])){ echo $erros["email"] ; } else { echo "Email"; } ?>" required>
            </label>

            <label class="label-input <?php if(isset($erros["senha"])){ echo 'input-erro'; } ?>" for="password">
                <i class="fa-solid fa-lock icon-modify" aria-hidden="true"></i>
                <input id="password" name="senha" type="password" placeholder="<?php if(isset($erros["senha"])){ echo $erros["senha"] ; } else { echo "Senha"; } ?>" required>
            </label>    

            <label class="label-input <?php if(isset($erros["confirmaSenha"])){ echo 'input-erro'; } ?>" for="confirm-password">
                <i class="fa-solid fa-lock icon-modify" aria-hidden="true"></i>
                <input id="confirm-password" name="confirmaSenha" type="password" placeholder="<?php if(isset($erros["confirmaSenha"])){ echo $erros["confirmaSenha"]; } else { echo "Confirme sua senha"; } ?>" required>
            </label>

            <button type="submit" class="btn btn-primary">Registrar</button>
        </form>

        <p class="description">Já tem uma conta?</p>
        <button class="btn btn-secondary" onclick="location.href='loginAccount.php'">Login</button>
    </div>
</body>
</html>