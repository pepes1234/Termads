<?php
require "../force_authenticate.php";
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Termads - Jogo de palavras estilo Wordle em português">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
    <title>Termads - Jogo de Palavras</title>
</head>
<body>
    <div class="main-container">
        <div class="header-section">
            <h1>Termads</h1>
            <a href="pages/historico.html" class="history-button">Histórico</a>
        </div>
        
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
    <script src="assets/js/main.js"></script>
</body>
</html>