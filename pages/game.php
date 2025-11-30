<?php
require "../force_authenticate.php";
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="description" content="Termads - Jogo de palavras estilo Wordle em português">
    <meta name="theme-color" content="#121212">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
    <title>Termads - Jogo de Palavras</title>
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
    <div class="game-container">
        <header>
            <div class="header-section">
                <h1>Termads</h1>
            </div>
        </header>
        
        <section class="game-board" aria-label="Tabuleiro do jogo">
            <div class="grid" role="grid" aria-label="Grid de tentativas">
                <div class="row line-1" role="row" aria-label="Tentativa 1">
                    <div class="tile" role="gridcell" data-row="0" data-col="0" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="0" data-col="1" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="0" data-col="2" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="0" data-col="3" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="0" data-col="4" tabindex="-1"></div>
                </div>
                <div class="row line-2" role="row" aria-label="Tentativa 2">
                    <div class="tile" role="gridcell" data-row="1" data-col="0" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="1" data-col="1" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="1" data-col="2" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="1" data-col="3" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="1" data-col="4" tabindex="-1"></div>
                </div>
                <div class="row line-3" role="row" aria-label="Tentativa 3">
                    <div class="tile" role="gridcell" data-row="2" data-col="0" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="2" data-col="1" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="2" data-col="2" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="2" data-col="3" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="2" data-col="4" tabindex="-1"></div>
                </div>
                <div class="row line-4" role="row" aria-label="Tentativa 4">
                    <div class="tile" role="gridcell" data-row="3" data-col="0" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="3" data-col="1" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="3" data-col="2" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="3" data-col="3" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="3" data-col="4" tabindex="-1"></div>
                </div>
                <div class="row line-5" role="row" aria-label="Tentativa 5">
                    <div class="tile" role="gridcell" data-row="4" data-col="0" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="4" data-col="1" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="4" data-col="2" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="4" data-col="3" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="4" data-col="4" tabindex="-1"></div>
                </div>
                <div class="row line-6" role="row" aria-label="Tentativa 6">
                    <div class="tile" role="gridcell" data-row="5" data-col="0" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="5" data-col="1" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="5" data-col="2" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="5" data-col="3" tabindex="-1"></div>
                    <div class="tile" role="gridcell" data-row="5" data-col="4" tabindex="-1"></div>
                </div>
            </div>
        </section>

        <section class="keyboard" aria-label="Teclado virtual">
            <div class="kbd-row">
                <button class="key" data-key="q" aria-label="Tecla Q">Q</button>
                <button class="key" data-key="w" aria-label="Tecla W">W</button>
                <button class="key" data-key="e" aria-label="Tecla E">E</button>
                <button class="key" data-key="r" aria-label="Tecla R">R</button>
                <button class="key" data-key="t" aria-label="Tecla T">T</button>
                <button class="key" data-key="y" aria-label="Tecla Y">Y</button>
                <button class="key" data-key="u" aria-label="Tecla U">U</button>
                <button class="key" data-key="i" aria-label="Tecla I">I</button>
                <button class="key" data-key="o" aria-label="Tecla O">O</button>
                <button class="key" data-key="p" aria-label="Tecla P">P</button>
            </div>
            <div class="kbd-row">
                <button class="key" data-key="a" aria-label="Tecla A">A</button>
                <button class="key" data-key="s" aria-label="Tecla S">S</button>
                <button class="key" data-key="d" aria-label="Tecla D">D</button>
                <button class="key" data-key="f" aria-label="Tecla F">F</button>
                <button class="key" data-key="g" aria-label="Tecla G">G</button>
                <button class="key" data-key="h" aria-label="Tecla H">H</button>
                <button class="key" data-key="j" aria-label="Tecla J">J</button>
                <button class="key" data-key="k" aria-label="Tecla K">K</button>
                <button class="key" data-key="l" aria-label="Tecla L">L</button>
            </div>
            <div class="kbd-row">
                <button class="key key--action" data-key="enter" aria-label="Confirmar palavra">ENTER</button>
                <button class="key" data-key="z" aria-label="Tecla Z">Z</button>
                <button class="key" data-key="x" aria-label="Tecla X">X</button>
                <button class="key" data-key="c" aria-label="Tecla C">C</button>
                <button class="key" data-key="v" aria-label="Tecla V">V</button>
                <button class="key" data-key="b" aria-label="Tecla B">B</button>
                <button class="key" data-key="n" aria-label="Tecla N">N</button>
                <button class="key" data-key="m" aria-label="Tecla M">M</button>
                <button class="key key--action" data-key="backspace" aria-label="Apagar letra">⌫</button>
            </div>
        </section>
    </div>
    <script src="../assets/js/main.js?v=<?php echo time() . '.' . rand(1000, 9999); ?>"></script>
</body>
</html>