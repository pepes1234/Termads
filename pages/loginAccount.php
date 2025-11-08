<?php 

$erros = [];
if(isset($_POST["email"],$_POST["senha"])){


    if(empty($_POST["email"])){
        $erros["email"] = "Insira seu email!";
    }
    elseif (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
        $erros["email"] = "Email inválido!";
    }
    else {
        $email = tratarForm($_POST["email"]);
    }


    if(empty($_POST["senha"])){
        $erros["senha"] = "Insira sua senha!";
    }
    elseif (strlen($_POST["senha"]) < 7) {
        $erros["senha"] = "Senha de no mínimo 8 caracteres!";
    }
    else {
        $senha = tratarForm($_POST["senha"]);
    }


    
}


function tratarForm($dado){
    $dado = trim($dado);
    $dado = htmlspecialchars($dado);
    $dado = stripslashes($dado);
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
    <title>CreateAccount</title>
</head>
<body>
    
    <div class="main-container">
        <div class="title">
            <h2>Login</h2>  
        </div>
        <div class="social-media">
            <ul class="list-social-media">
                <li class="item-social-media">
                    <a href="#"><i class="fa-brands fa-instagram" aria-hidden="true"></i><span class="sr-only">Instagram</span></a>
                </li>
                <li class="item-social-media">
                    <a href="#"><i class="fa-brands fa-google"></i></a>
                </li>
                <li class="item-social-media">
                    <a href="#"><i class="fa-brands fa-facebook"></i></a>
                </li>
            </ul>
        </div>
    
        <p class="description description-primary">or use your email for registration</p>
            <form class="form" action="#" method="post" novalidate>
               

                <label class="label-input <?php if(isset($erros["email"])){ echo 'input-erro'; } ?>" for="email">
                    <i class="fa-solid fa-envelope icon-modify" aria-hidden="true"></i>
                    <input id="email" name="email" type="email" placeholder="<?php if(isset($erros["email"])){ echo $erros["email"] ; } else { echo "Email"; } ?>" required>
                </label>

                <label class="label-input <?php if(isset($erros["senha"])){ echo 'input-erro'; } ?>" for="password">
                    <i class="fa-solid fa-lock icon-modify" aria-hidden="true"></i>
                    <input id="password" name="senha" type="password" placeholder="<?php if(isset($erros["senha"])){ echo $erros["senha"] ; } else { echo "Senha"; } ?>" required>
                </label>    

                <button type="submit" class="btn btn-primary">Sign Up</button>
            </form>
              
    <p class="description">Doesn't have an account?</p>
    <button class="btn btn-secondary" onclick="location.href='createAccount.php'">Sign Up</button>



    </div>
</body>
</html>