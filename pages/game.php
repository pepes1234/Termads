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
    <link rel="stylesheet" href="/termads/assets/css/style.css?v=<?php echo time(); ?>">
    <title>Termads - Jogo de Palavras</title>
</head>
<body>
    <nav class="nav">
        <ul>
            <li><a href="game.php">Jogar</a></li>
            <li><a href="ligaController.php">Ligas</a></li>
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
    
    <div class="game-controls">
        <button id="playAgainBtn" class="control-btn">Jogar Novamente</button>
        <div class="toggle-controls">
            <div class="control-group">
                <label class="toggle-container">
                    <input type="checkbox" id="autoResetWin">
                    <span class="toggle-slider"></span>
                    <span class="toggle-label">Auto-reset ao ganhar</span>
                </label>
                <div class="delay-input-container">
                    <label for="delayWinInput" class="delay-label">Delay vitória:</label>
                    <input type="number" id="delayWinInput" class="delay-input" min="0.1" max="10" step="0.1" value="1">
                    <span class="delay-unit">s</span>
                </div>
            </div>
            <div class="control-group">
                <label class="toggle-container">
                    <input type="checkbox" id="autoResetLose">
                    <span class="toggle-slider"></span>
                    <span class="toggle-label">Auto-reset ao perder</span>
                </label>
                <div class="delay-input-container">
                    <label for="delayLoseInput" class="delay-label">Delay derrota:</label>
                    <input type="number" id="delayLoseInput" class="delay-input" min="0.1" max="10" step="0.1" value="1">
                    <span class="delay-unit">s</span>
                </div>
            </div>
        </div>
    </div>
    <div class="game-container">
        <header>
            <div class="header-section">
                <h1>Termads</h1>
            </div>
        </header>
        
        <section class="game-board">
            <div class="grid">
                <div class="row line-1">
                    <div class="tile" data-row="0" data-col="0"></div>
                    <div class="tile" data-row="0" data-col="1"></div>
                    <div class="tile" data-row="0" data-col="2"></div>
                    <div class="tile" data-row="0" data-col="3"></div>
                    <div class="tile" data-row="0" data-col="4"></div>
                </div>
                <div class="row line-2">
                    <div class="tile" data-row="1" data-col="0"></div>
                    <div class="tile" data-row="1" data-col="1"></div>
                    <div class="tile" data-row="1" data-col="2"></div>
                    <div class="tile" data-row="1" data-col="3"></div>
                    <div class="tile" data-row="1" data-col="4"></div>
                </div>
                <div class="row line-3">
                    <div class="tile" data-row="2" data-col="0"></div>
                    <div class="tile" data-row="2" data-col="1"></div>
                    <div class="tile" data-row="2" data-col="2"></div>
                    <div class="tile" data-row="2" data-col="3"></div>
                    <div class="tile" data-row="2" data-col="4"></div>
                </div>
                <div class="row line-4">
                    <div class="tile" data-row="3" data-col="0"></div>
                    <div class="tile" data-row="3" data-col="1"></div>
                    <div class="tile" data-row="3" data-col="2"></div>
                    <div class="tile" data-row="3" data-col="3"></div>
                    <div class="tile" data-row="3" data-col="4"></div>
                </div>
                <div class="row line-5">
                    <div class="tile" data-row="4" data-col="0"></div>
                    <div class="tile" data-row="4" data-col="1"></div>
                    <div class="tile" data-row="4" data-col="2"></div>
                    <div class="tile" data-row="4" data-col="3"></div>
                    <div class="tile" data-row="4" data-col="4"></div>
                </div>
                <div class="row line-6">
                    <div class="tile" data-row="5" data-col="0"></div>
                    <div class="tile" data-row="5" data-col="1"></div>
                    <div class="tile" data-row="5" data-col="2"></div>
                    <div class="tile" data-row="5" data-col="3"></div>
                    <div class="tile" data-row="5" data-col="4"></div>
                </div>
            </div>
        </section>

        <section class="keyboard">
            <div class="kbd-row">
                <button class="key" data-key="q">Q</button>
                <button class="key" data-key="w">W</button>
                <button class="key" data-key="e">E</button>
                <button class="key" data-key="r">R</button>
                <button class="key" data-key="t">T</button>
                <button class="key" data-key="y">Y</button>
                <button class="key" data-key="u">U</button>
                <button class="key" data-key="i">I</button>
                <button class="key" data-key="o">O</button>
                <button class="key" data-key="p">P</button>
            </div>
            <div class="kbd-row">
                <button class="key" data-key="a">A</button>
                <button class="key" data-key="s">S</button>
                <button class="key" data-key="d">D</button>
                <button class="key" data-key="f">F</button>
                <button class="key" data-key="g">G</button>
                <button class="key" data-key="h">H</button>
                <button class="key" data-key="j">J</button>
                <button class="key" data-key="k">K</button>
                <button class="key" data-key="l">L</button>
            </div>
            <div class="kbd-row">
                <button class="key key--action" data-key="enter">ENTER</button>
                <button class="key" data-key="z">Z</button>
                <button class="key" data-key="x">X</button>
                <button class="key" data-key="c">C</button>
                <button class="key" data-key="v">V</button>
                <button class="key" data-key="b">B</button>
                <button class="key" data-key="n">N</button>
                <button class="key" data-key="m">M</button>
                <button class="key key--action" data-key="backspace">BACK</button>
            </div>
        </section>
    </div>
    <script src="/termads/assets/js/main.js?v=<?php echo time() . '.' . rand(1000, 9999); ?>"></script>
</body>
</html>