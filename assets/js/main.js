document.addEventListener('DOMContentLoaded', function() {
    let wordList = [];
    let originalWordList = [];
    let targetWord = '';
    let targetWordOriginal = '';
    let currentRow = 0;
    let currentCol = 0;
    const maxRows = 6;
    const wordLength = 5;

    function normalizeWord(word) {
        return word.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function findOriginalWord(normalizedWord) {
        const index = wordList.indexOf(normalizedWord);
        return index !== -1 ? originalWordList[index] : normalizedWord;
    }

    async function loadWords() {
        try {
            const response = await fetch('../palavras.txt?t=' + Date.now());
            if (!response.ok) {
                throw new Error('Erro ao carregar arquivo');
            }
            
            const text = await response.text();
            const rawWords = text.split('\n')
                .map(word => word.trim())
                .filter(word => word.length === wordLength);
            
            originalWordList = [];
            wordList = [];
            
            rawWords.forEach(word => {
                const normalized = normalizeWord(word);
                if (/^[a-z]+$/.test(normalized)) {
                    originalWordList.push(word.toLowerCase());
                    wordList.push(normalized);
                }
            });
            
            if (wordList.length === 0) {
                throw new Error('Nenhuma palavra válida encontrada');
            }
            
            const randomIndex = Math.floor(Math.random() * wordList.length);
            targetWord = wordList[randomIndex].toUpperCase();
            targetWordOriginal = originalWordList[randomIndex].toUpperCase();
            
            console.log(targetWordOriginal);
			console.log(targetWord);
            
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
        
        if (existingTiles.length === 0) {
            for (let row = 0; row < maxRows; row++) {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'row';
                rowDiv.setAttribute('data-row', row);
                
                for (let col = 0; col < wordLength; col++) {
                    const tile = document.createElement('div');
                    tile.className = 'tile';
                    tile.setAttribute('data-row', row);
                    tile.setAttribute('data-col', col);
                    tile.setAttribute('tabindex', '-1');
                    rowDiv.appendChild(tile);
                }
                
                grid.appendChild(rowDiv);
            }
        }
        
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
        
        moveCursor(1);
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

    function showMessage(message) {
        const existingMessage = document.querySelector('.game-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = 'game-message';
        messageElement.textContent = message;
        document.body.appendChild(messageElement);

        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 2000);
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
        // Remove cursor visual antes de processar o resultado
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
        const originalGuess = findOriginalWord(guessNormalized);
        
        const originalGuessArray = originalGuess.toUpperCase().split('');
        cells.forEach((cell, index) => {
            cell.textContent = originalGuessArray[index];
        });

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
                showMessage(`Parabéns! Você acertou: ${targetWordOriginal}`);
            }, wordLength * 100 + 500);
        } else {
            currentRow++;
            currentCol = 0;
            
            updateRowStates();
            updateCursorVisual();
            
            if (currentRow >= maxRows) {
                setTimeout(() => {
                    showMessage(`Fim de jogo! A palavra era: ${targetWordOriginal}`);
                }, wordLength * 100 + 500);
            }
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
                clickedElement.blur(); // Remove foco da célula
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

    async function initGame() {
        initBoard();
        
        const wordsLoaded = await loadWords();
        if (!wordsLoaded) {
            return;
        }
        
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('click', handleKeyClick);
    }

    initGame();
});