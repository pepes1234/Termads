<?php 
require '../db_functions.php';
require '../authenticate.php';

$erros = [];
$login = isLoggedIn();

if(!$login && $_SERVER["REQUEST_METHOD"] === "POST"){
    if(isset($_POST["email"],$_POST["senha"])){
        $conn = connect();

        if(empty($_POST["email"])){
            $erros["email"] = "Insira seu email!";
        }
        elseif (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
            $erros["email"] = "Email inválido!";
        }
        else {
            $email = tratarForm($_POST["email"], $conn);
        }

        if(empty($_POST["senha"])){
            $erros["senha"] = "Insira sua senha!";
        }
        elseif (strlen($_POST["senha"]) < 7) {
            $erros["senha"] = "Senha de no mínimo 8 caracteres!";
        }
        else {
            $senha = tratarForm($_POST["senha"], $conn);
        }

        if (empty($erros)) {
            $senhaHash = md5($senha);

            $sql = "SELECT * FROM $table_users WHERE email = '$email' AND password = '$senhaHash';";
            $result = mysqli_query($conn, $sql);

            if (mysqli_num_rows($result) === 1) {
                $user = mysqli_fetch_assoc($result);
                session_start();
                $_SESSION["user_id"] = $user["id"];
                $_SESSION["user_name"] = $user["name"];
                $_SESSION["user_email"] = $user["email"];
                close($conn);
                header("Location: ./game.php");
                exit();
            } else {
                $erros["login"] = "Email ou senha incorretos!";
            }
        }
    }
}

if ($login) {
    header("Location: ./game.php");
    exit();
}

function tratarForm($dado, $conn){
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
    <title>Login</title>
</head>
<body>
    
    <div class="main-container">
        <div class="title">
            <h2>Login</h2>  
        </div>
            <form class="form" action="#" method="post" novalidate>
               

                <label class="label-input <?php if(isset($erros["email"]) || isset($erros["login"])){ echo 'input-erro'; } ?>" for="email">
                    <i class="fa-solid fa-envelope icon-modify" aria-hidden="true"></i>
                    <input id="email" name="email" type="email" 
                    placeholder="<?php if(isset($erros["email"])){ echo $erros["email"] ; } 
                    elseif(isset($erros["login"])){ echo $erros["login"] ; }
                    else { echo "Email"; } ?>" 
                    required>
                </label>

                <label class="label-input <?php if(isset($erros["senha"]) || isset($erros["login"])){ echo 'input-erro'; } ?>" for="password">
                    <i class="fa-solid fa-lock icon-modify" aria-hidden="true"></i>
                    <input id="password" name="senha" type="password" 
                    placeholder="<?php if(isset($erros["senha"])){ echo $erros["senha"] ; } 
                    elseif(isset($erros["login"])){ echo $erros["login"] ; }
                    else { echo "Senha"; } ?>" 
                    required>
                </label>

                <button type="submit" class="btn btn-primary">Entrar</button>
            </form>
              
    <p class="description">Não tem uma conta?</p>
    <button class="btn btn-secondary" onclick="location.href='createAccount.php'">Criar Conta</button>



    </div>
</body>
</html>