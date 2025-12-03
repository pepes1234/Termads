document.addEventListener('DOMContentLoaded', function() {
    let wordList = [];              
    let targetWord = '';            
    let targetWordOriginal = '';    
    let currentRow = 0;             
    let currentCol = 0;             
    let attemptsHistory = [];       
    const LEAGUE_ID = window.CURRENT_LEAGUE_ID ?? null;  
    const maxRows = 6;              
    const wordLength = 5;           
    function normalizeWord(word) {
        return word.toLowerCase()
            .normalize('NFD')                    
            .replace(/[\u0300-\u036f]/g, '');   
    }
    async function loadWords() {
        try {
            const response = await fetch('../palavras.txt');
            if (!response.ok) {
                throw new Error('Erro ao carregar arquivo');
            }
            const text = await response.text();
            const rawWords = text.split('\n')
                .map(word => word.trim())
                .filter(word => word.length === wordLength);
            wordList = [];
            const validWords = [];  
            rawWords.forEach(word => {
                const normalized = normalizeWord(word);
                if (/^[a-z]+$/.test(normalized)) {
                    wordList.push(normalized);
                    validWords.push(word.trim());  
                }
            });
            if (wordList.length === 0) {
                throw new Error('Nenhuma palavra válida encontrada');
            }
            const randomIndex = Math.floor(Math.random() * wordList.length);
            targetWord = wordList[randomIndex].toUpperCase();                  
            targetWordOriginal = validWords[randomIndex].toUpperCase();        
            console.log(targetWordOriginal);
            return true;
        } catch (error) {
            console.error('Erro ao carregar palavras:', error);
            alert('Erro ao carregar o jogo. Recarregue a página.');
            return false;
        }
    }
    function isValidWord(word) {
        return wordList.includes(word);
    }
    function initBoard() {
        const grid = document.querySelector('.grid');
        if (!grid) return;
        const existingTiles = grid.querySelectorAll('.tile');
        const rows = grid.querySelectorAll('.row');
        rows.forEach((row, index) => {
            row.setAttribute('data-row', index);
            if (index === 0) {
                row.classList.add('row-active');    
            } else {
                row.classList.add('row-future');    
            }
        });
        updateCursorVisual();  
    }
    function getCurrentRowCells() {
        return document.querySelectorAll(`[data-row="${currentRow}"] .tile`);
    }
    function updateRowStates() {
        const rows = document.querySelectorAll('.row');
        rows.forEach((row, index) => {
            row.classList.remove('row-active', 'row-used', 'row-future');
            if (index < currentRow) {
                row.classList.add('row-used');      
            } else if (index === currentRow) {
                row.classList.add('row-active');    
            } else {
                row.classList.add('row-future');    
            }
        });
    }
    function addLetter(letter) {
        const cells = getCurrentRowCells();
        if (cells.length === 0) {
            console.error('Nenhuma célula encontrada!');
            return;
        }
        const cell = cells[currentCol];
        if (!cell) {
            console.error(`Célula na posição ${currentCol} não encontrada!`);
            return;
        }
        cell.textContent = letter.toUpperCase();
        cell.classList.add('filled');  
        cell.classList.add('typed');   
        setTimeout(() => {
            cell.classList.remove('typed');
        }, 100);
        let nextEmptyCol = -1;
        for (let i = currentCol + 1; i < wordLength; i++) {
            if (!cells[i].textContent.trim()) {
                nextEmptyCol = i;
                break;
            }
        }
        if (nextEmptyCol !== -1) {
            currentCol = nextEmptyCol;
        } else {
            const newCol = currentCol + 1;
            if (newCol < wordLength) {
                currentCol = newCol;
            }
        }
        updateCursorVisual();  
    }
    function updateCursorVisual() {
        const cells = getCurrentRowCells();
        cells.forEach((cell, index) => {
            cell.classList.remove('cursor-active');
            if (index === currentCol) {
                cell.classList.add('cursor-active');  
            }
        });
    }
    function moveCursor(direction) {
        const newCol = currentCol + direction;
        if (newCol >= 0 && newCol < wordLength) {
            currentCol = newCol;
        }
        updateCursorVisual();
    }
    function setCursorPosition(position) {
        if (position >= 0 && position < wordLength) {
            currentCol = position;
            updateCursorVisual();
        }
    }
    function deleteLetter() {
        const cells = getCurrentRowCells();
        if (cells[currentCol] && cells[currentCol].textContent) {
            cells[currentCol].textContent = '';
            cells[currentCol].classList.remove('filled');
        } else if (currentCol > 0) {
            moveCursor(-1);
            cells[currentCol].textContent = '';
            cells[currentCol].classList.remove('filled');
        }
        updateCursorVisual();
    }
    function showMessage(message, showPlayAgain = false) {
        const existingMessage = document.querySelector('.game-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        const messageElement = document.createElement('div');
        messageElement.className = 'game-message';
        messageElement.textContent = message;
        if (showPlayAgain) {
            const playAgainBtn = document.createElement('button');
            playAgainBtn.textContent = 'Jogar Novamente';
            playAgainBtn.className = 'play-again-message-btn';
            playAgainBtn.onclick = function() {
                location.reload();  
            };
            messageElement.appendChild(document.createElement('br'));
            messageElement.appendChild(playAgainBtn);
        }
        document.body.appendChild(messageElement);
    }
    function shakeRow() {
        const row = document.querySelector(`[data-row="${currentRow}"]`);
        if (row) {
            row.classList.add('shake-row');
            setTimeout(() => {
                row.classList.remove('shake-row');
            }, 600);
        }
    }
    function submitGuess() {
        const cells = getCurrentRowCells();
        cells.forEach(cell => cell.classList.remove('cursor-active'));
        const filledCells = Array.from(cells).filter(cell => cell.textContent.trim() !== '');
        if (filledCells.length !== wordLength) {
            showMessage('Complete a palavra!');
            shakeRow();
            return;
        }
        const guess = Array.from(cells).map(cell => cell.textContent).join('');
        if (!isValidWord(normalizeWord(guess))) {
            showMessage('Palavra não encontrada!');
            shakeRow();
            return;
        }
        const guessNormalized = normalizeWord(guess);
        attemptsHistory.push(guess.toLowerCase());
        const originalGuessArray = guess.toUpperCase().split('');
        const guessArray = guessNormalized.split('');                    
        const targetArray = normalizeWord(targetWord).split('');         
        const result = new Array(wordLength).fill('absent');             
        for (let i = 0; i < wordLength; i++) {
            if (guessArray[i] === targetArray[i]) {
                result[i] = 'correct';      
                targetArray[i] = null;      
            }
        }
        for (let i = 0; i < wordLength; i++) {
            if (result[i] === 'absent' && targetArray.includes(guessArray[i])) {
                result[i] = 'present';      
                const index = targetArray.indexOf(guessArray[i]);
                targetArray[index] = null;  
            }
        }
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('flip');  
                setTimeout(() => {
                    cell.setAttribute('data-state', result[index]);  
                    cell.classList.add('revealed');                  
                    const originalLetter = originalGuessArray[index];
                    updateKeyboard(normalizeWord(originalLetter), result[index]);
                }, 300);
            }, index * 100);  
        });
        if (normalizeWord(guess) === normalizeWord(targetWord)) {
            setTimeout(() => {
                showMessage(`Parabéns! Você acertou: ${targetWordOriginal}`, true);
                const attempts = attemptsHistory.length;
                const score = Math.max(0, 150 - (attempts - 1) * 20);
                sendGameResult(score, 1, attempts, attemptsHistory, targetWordOriginal, LEAGUE_ID);
                const settings = loadAutoResetSettings();
                if (settings.autoResetWin) {
                    setTimeout(() => {
                        location.reload();
                    }, settings.delayWin * 1000);
                }
            }, wordLength * 100 + 500);  
        } 
        else {
            currentRow++;       
            currentCol = 0;     
            updateRowStates();      
            updateCursorVisual();   
            if (currentRow >= maxRows) {
                setTimeout(() => {
                    showMessage(`Fim de jogo! A palavra era: ${targetWordOriginal}`, true);
                    const attempts = attemptsHistory.length || maxRows;
                    const score = 0;  
                    sendGameResult(score, 0, attempts, attemptsHistory, targetWordOriginal, LEAGUE_ID);
                    const settings = loadAutoResetSettings();
                    if (settings.autoResetLose) {
                        setTimeout(() => {
                            location.reload();
                        }, settings.delayLose * 1000);
                    }
                }, wordLength * 100 + 500);  
            }
        }
    }
    async function sendGameResult(score, won, attemptsCount, attemptsList, targetWord, leagueId = null) {
        try {
            const payload = {
                score: Number(score),                            
                won: Number(won) ? 1 : 0,                        
                attempts_count: Number(attemptsCount),           
                attempts_list: attemptsList || [],               
                target_word: targetWord,                         
                league_id: leagueId ? Number(leagueId) : null    
            };
            const res = await fetch("/Termads/assets/api/save_game.php", {
                method: "POST",
                credentials: "same-origin",                      
                headers: {
                    "Content-Type": "application/json"           
                },
                body: JSON.stringify(payload)                    
            });
            const ct = res.headers.get("Content-Type") || "";
            const text = await res.text();                       
            if (!ct.includes("application/json")) {
                console.error("Resposta inesperada do servidor:", text);
                return { success: false, error: text };
            }
            const json = JSON.parse(text);
            if (json && json.success) {
                console.log("Resultado do jogo enviado com sucesso.");
                return { success: true , game_id: json.game_id };
            } else {
                console.error("Falha ao enviar resultado do jogo:", json?.error || json);
                return { success: false, error: json?.error || "Erro desconhecido" };
            }
        } catch (err) {
            console.error("Erro ao enviar resultado do jogo:", err);
            alert("Erro de erro ao salvar o jogo.");
            return { success: false, error: err.message || err};
        }
    }
    function updateKeyboard(letter, state) {
        const key = document.querySelector(`[data-key="${letter.toLowerCase()}"]`);
        if (key && !key.classList.contains('correct')) {
            key.classList.remove('absent', 'present', 'correct');
            key.classList.add(state);
        }
    }
    function handleKeyPress(event) {
        const key = event.key.toUpperCase();  
        if (key === 'ENTER') {
            submitGuess();
        } else if (key === 'BACKSPACE') {
            deleteLetter();
        } else if (key === 'ARROWLEFT') {
            event.preventDefault();  
            moveCursor(-1);          
        } else if (key === 'ARROWRIGHT') {
            event.preventDefault();
            moveCursor(1);           
        } else if (key === 'HOME') {
            event.preventDefault();
            setCursorPosition(0);    
        } else if (key === 'END') {
            event.preventDefault();
            setCursorPosition(wordLength - 1);  
        } else if (/^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]$/.test(key)) {
            addLetter(key);
        }
    }
    function handleKeyClick(event) {
        const clickedElement = event.target;
        if (clickedElement.classList.contains('tile') && clickedElement.closest(`[data-row="${currentRow}"]`)) {
            const col = parseInt(clickedElement.getAttribute('data-col'));
            if (!isNaN(col)) {
                setCursorPosition(col);        
                clickedElement.blur();         
                return;
            }
        }
        const key = clickedElement.getAttribute('data-key');
        if (!key) return;  
        if (key === 'enter') {
            submitGuess();
        } else if (key === 'backspace') {
            deleteLetter();
        } else {
            addLetter(key);  
        }
    }
    function loadAutoResetSettings() {
        const autoResetWin = localStorage.getItem('autoResetWin') === 'true';    
        const autoResetLose = localStorage.getItem('autoResetLose') === 'true';
        const delayWin = parseFloat(localStorage.getItem('delayWin')) || 1;      
        const delayLose = parseFloat(localStorage.getItem('delayLose')) || 1;
        const autoResetWinCheckbox = document.getElementById('autoResetWin');
        const autoResetLoseCheckbox = document.getElementById('autoResetLose');
        const delayWinInput = document.getElementById('delayWinInput');
        const delayLoseInput = document.getElementById('delayLoseInput');
        if (autoResetWinCheckbox) autoResetWinCheckbox.checked = autoResetWin;
        if (autoResetLoseCheckbox) autoResetLoseCheckbox.checked = autoResetLose;
        if (delayWinInput) delayWinInput.value = delayWin;
        if (delayLoseInput) delayLoseInput.value = delayLose;
        return { autoResetWin, autoResetLose, delayWin, delayLose };
    }
    function saveAutoResetSettings() {
        const autoResetWinCheckbox = document.getElementById('autoResetWin');
        const autoResetLoseCheckbox = document.getElementById('autoResetLose');
        const delayWinInput = document.getElementById('delayWinInput');
        const delayLoseInput = document.getElementById('delayLoseInput');
        if (autoResetWinCheckbox) {
            localStorage.setItem('autoResetWin', autoResetWinCheckbox.checked);
        }
        if (autoResetLoseCheckbox) {
            localStorage.setItem('autoResetLose', autoResetLoseCheckbox.checked);
        }
        if (delayWinInput) {
            localStorage.setItem('delayWin', delayWinInput.value);
        }
        if (delayLoseInput) {
            localStorage.setItem('delayLose', delayLoseInput.value);
        }
    }
    async function initGame() {
        initBoard();
        const wordsLoaded = await loadWords();
        if (!wordsLoaded) {
            return;  
        }
        document.addEventListener('keydown', handleKeyPress);     
        document.addEventListener('click', handleKeyClick);       
        loadAutoResetSettings();
        const autoResetWinCheckbox = document.getElementById('autoResetWin');
        const autoResetLoseCheckbox = document.getElementById('autoResetLose');
        const delayWinInput = document.getElementById('delayWinInput');
        const delayLoseInput = document.getElementById('delayLoseInput');
        if (autoResetWinCheckbox) {
            autoResetWinCheckbox.addEventListener('change', saveAutoResetSettings);
        }
        if (autoResetLoseCheckbox) {
            autoResetLoseCheckbox.addEventListener('change', saveAutoResetSettings);
        }
        if (delayWinInput) {
            delayWinInput.addEventListener('change', saveAutoResetSettings);
        }
        if (delayLoseInput) {
            delayLoseInput.addEventListener('change', saveAutoResetSettings);
        }
    }
    initGame();
});

