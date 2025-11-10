(function () {
	const TOTAL_ROWS = 6;
	const COLS = 5;
	
	let gameWords = [];
	let validWords = new Set();
	let targetWord = "";
	let gameOver = false;
	let currentRow = 0;
	let gameGuesses = [];

	window.testConnectivity = async function() {
		const testUrl = 'https://api.github.com/zen';
		try {
			const response = await fetch(testUrl);
			const text = await response.text();
			return true;
		} catch (error) {
			return false;
		}
	}

	window.testWordValidation = function() {
		const testWords = ['carro', 'morte', 'corte', 'porte', 'mundo', 'teste', 'abcde'];
		testWords.forEach(word => {
			const normalized = normalizeWord(word);
			const isValid = isValidWord(word);
		});
	}

	async function loadWords() {
		
		try {
			const apis = [
				'https://raw.githubusercontent.com/fserb/pt-br/master/words.txt',
				'https://api.codetabs.com/v1/proxy?quest=https://raw.githubusercontent.com/fserb/pt-br/master/words.txt',
				'https://api.allorigins.win/raw?url=https://raw.githubusercontent.com/fserb/pt-br/master/words.txt',
				'https://corsproxy.io/?https://raw.githubusercontent.com/fserb/pt-br/master/words.txt',
				'https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/fserb/pt-br/master/words.txt',
				'https://proxy.cors.sh/https://raw.githubusercontent.com/fserb/pt-br/master/words.txt'
			];
			
			let text = '';
			let apiUsed = '';
			
			for (let i = 0; i < apis.length; i++) {
				try {
					const controller = new AbortController();
					const timeoutId = setTimeout(() => {
						controller.abort();
					}, 15000);
					
					const response = await fetch(apis[i], { 
						signal: controller.signal,
						method: 'GET',
						headers: {
							'Accept': 'text/plain',
							'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
						}
					});
					clearTimeout(timeoutId);
					
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
					}
					
					text = await response.text();
					apiUsed = apis[i];
					break;
				} catch (apiError) {
					if (i === apis.length - 1) {
						throw new Error(`All ${apis.length} APIs failed`);
					}
				}
			}
			
			if (!text || text.length < 100) {
				throw new Error('API response too small or empty');
			}
			
			const allWords = text.split('\n')
				.map(word => word.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
				.filter(word => word.length === 5 && /^[a-z]+$/.test(word));
			
			if (allWords.length === 0) {
				throw new Error('No valid 5-letter words found in API');
			}
			
			const testWords = ['carro', 'morte', 'corte', 'porte', 'mundo'];
			const foundTestWords = testWords.filter(word => allWords.includes(word));
			
			validWords = new Set(allWords);
			gameWords = allWords;
			
			targetWord = gameWords[Math.floor(Math.random() * gameWords.length)].toUpperCase();
			
			setTimeout(() => testWordValidation(), 1000);
			
			return true;
		} catch (error) {
			
			const emergencyWords = [
				'mundo', 'tempo', 'lugar', 'forma', 'parte', 'fazer', 'outro', 'pessoa', 'grande', 
				'olhar', 'falar', 'saber', 'poder', 'estar', 'dizer', 'ficar', 'viver', 'final',
				'grupo', 'ponto', 'ordem', 'nivel', 'valor', 'razao', 'linha', 'vista', 'coisa',
				'casas', 'vidas', 'terra', 'tomar', 'levar', 'partir', 'certo', 'curso', 'banco',
				'campo', 'carta', 'chave', 'cinco', 'claro', 'corpo', 'costa', 'criar', 'dente',
				'desde', 'entre', 'epoca', 'escola', 'etapa', 'feliz', 'festa', 'forte', 'fraco',
				'fundo', 'geral', 'gosto', 'grama', 'grave', 'hotel', 'igual', 'junto', 'largo',
				'leite', 'lista', 'livro', 'maior', 'marca', 'massa', 'menor', 'mesmo', 'metro',
				'norte', 'novas', 'nunca', 'obras', 'papel', 'passo', 'pedra', 'perto',
				'plano', 'pobre', 'porta', 'posto', 'praia', 'prato', 'primo', 'prova', 'quase',
				'radio', 'regra', 'resto', 'risco', 'rosto', 'saida', 'senhor', 'serio', 'silva',
				'sobre', 'suave', 'tecla', 'texto', 'tipos', 'trade', 'tumor', 'turno', 'verde',
				'virus', 'vista', 'volume', 'zebra', 'bravo', 'breve', 'calma', 'carne', 'cheio',
				'ainda', 'amigo', 'andar', 'antes', 'areia', 'assim', 'baixo',
				'beber', 'bicho', 'bolsa', 'borda', 'caixa', 'doido', 'durar', 'errar',
				'carro', 'morte', 'corte', 'porte', 'sorte', 'forte'
			];
			
			const validEmergencyWords = emergencyWords.filter(word => word.length === 5);
			const invalidWords = emergencyWords.filter(word => word.length !== 5);
			
			validWords = new Set(validEmergencyWords);
			gameWords = validEmergencyWords;
			targetWord = validEmergencyWords[Math.floor(Math.random() * validEmergencyWords.length)].toUpperCase();
			
			showMessage('No internet - using local dictionary', 3000);
			
			setTimeout(() => testWordValidation(), 1000);
			
			return true;
		}
	}

	function saveGameToHistory(won, attempts) {
		const gameData = {
			targetWord: targetWord,
			won: won,
			attempts: attempts,
			guesses: gameGuesses.map(guess => ({
				word: guess.word,
				result: guess.result
			}))
		};

		const history = JSON.parse(localStorage.getItem('termads-history') || '[]');
		gameData.id = Date.now();
		gameData.date = new Date().toISOString();
		history.unshift(gameData);
		localStorage.setItem('termads-history', JSON.stringify(history));
	}

	function normalizeWord(word) {
		return word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	}

	function isValidWord(word) {
		const normalized = normalizeWord(word);
		return validWords.has(normalized);
	}

	function getRowEls() {
		const els = [];
		for (let r = 1; r <= TOTAL_ROWS; r++) {
			const rowEl = document.querySelector(`.line-${r}`);
			if (rowEl) els.push(rowEl);
		}
		return els;
	}

	const rowEls = getRowEls();
	const rows = rowEls.map((rowEl) => Array.from(rowEl.children).slice(0, COLS));

	function isTileEmpty(tile) {
		return tile && tile.textContent.trim() === "";
	}

	function rowFilled(rowTiles) {
		return rowTiles.every((t) => !isTileEmpty(t));
	}

	function firstEmptyIndex(rowTiles) {
		return rowTiles.findIndex((t) => isTileEmpty(t));
	}

	function lastFilledIndex(rowTiles) {
		for (let c = COLS - 1; c >= 0; c--) {
			if (!isTileEmpty(rowTiles[c])) return c;
		}
		return -1;
	}

	function findCurrentRowIndex() {
		for (let r = 0; r < rows.length; r++) {
			if (!rowFilled(rows[r])) return r;
		}
		return rows.length - 1;
	}

	currentRow = 0;

	function updateRowStates() {
		for (let r = 0; r < rowEls.length; r++) {
			const el = rowEls[r];
			el.classList.remove("row-active", "row-inactive", "row-used");
			if (r < currentRow) {
				el.classList.add("row-used");
			} else if (r === currentRow) {
				el.classList.add("row-active");
			} else {
				el.classList.add("row-inactive");
			}
		}
	}

	function setTile(rowIdx, colIdx, char) {
		const tile = rows[rowIdx]?.[colIdx];
		if (!tile) return;
		tile.textContent = char.toUpperCase();
		tile.classList.remove("incorrect", "wrong-position", "correct");
		tile.classList.add("typed");
		setTimeout(() => tile.classList.remove("typed"), 120);
	}

	function clearTile(rowIdx, colIdx) {
		const tile = rows[rowIdx]?.[colIdx];
		if (!tile) return;
		tile.textContent = "";
		tile.classList.remove("typed");
	}

	function checkWord(word) {
		const result = [];
		const target = targetWord.toUpperCase();
		const guess = word.toUpperCase();
		
		const targetCount = {};
		for (let letter of target) {
			targetCount[letter] = (targetCount[letter] || 0) + 1;
		}
		
		for (let i = 0; i < COLS; i++) {
			if (guess[i] === target[i]) {
				result[i] = 'correct';
				targetCount[guess[i]]--;
			} else {
				result[i] = 'none';
			}
		}
		
		for (let i = 0; i < COLS; i++) {
			if (result[i] === 'none') {
				if (targetCount[guess[i]] > 0) {
					result[i] = 'wrong-position';
					targetCount[guess[i]]--;
				} else {
					result[i] = 'incorrect';
				}
			}
		}
		
		return result;
	}

	function updateKeyboard(word, results) {
		for (let i = 0; i < word.length; i++) {
			const letter = word[i].toLowerCase();
			const keyElement = document.querySelector(`.key[data-key="${letter}"]`);
			if (keyElement) {
				const currentClass = keyElement.classList;
				if (!currentClass.contains('correct') && results[i] === 'correct') {
					keyElement.classList.remove('wrong-position', 'incorrect');
					keyElement.classList.add('correct');
				} else if (!currentClass.contains('correct') && !currentClass.contains('wrong-position') && results[i] === 'wrong-position') {
					keyElement.classList.remove('incorrect');
					keyElement.classList.add('wrong-position');
				} else if (!currentClass.contains('correct') && !currentClass.contains('wrong-position') && results[i] === 'incorrect') {
					keyElement.classList.add('incorrect');
				}
			}
		}
	}

	function showMessage(text, duration = 2000) {
		const existingMessage = document.querySelector('.game-message');
		if (existingMessage) {
			existingMessage.remove();
		}
		
		const message = document.createElement('div');
		message.className = 'game-message';
		message.textContent = text;
		document.body.appendChild(message);
		
		setTimeout(() => {
			if (message.parentNode) {
				message.remove();
			}
		}, duration);
	}

	function getCurrentWord() {
		const rowTiles = rows[currentRow];
		if (!rowTiles) return '';
		return rowTiles.map(tile => tile.textContent).join('');
	}

	function animateRow(rowIndex, results) {
		const rowTiles = rows[rowIndex];
		if (!rowTiles) return;
		
		rowTiles.forEach((tile, index) => {
			setTimeout(() => {
				tile.classList.add(results[index]);
			}, index * 200);
		});
	}

	function animateKey(key) {
		const keyElement = document.querySelector(`.key[data-key="${key.toLowerCase()}"]`);
		if (keyElement) {
			keyElement.classList.add("key-clicked");
			setTimeout(() => {
				keyElement.classList.remove("key-clicked");
			}, 150);
		}
	}

	function handleLetter(letter) {
		if (gameOver) return;
		
		const rowTiles = rows[currentRow];
		if (!rowTiles) return;
		if (rowFilled(rowTiles)) return;
		const col = firstEmptyIndex(rowTiles);
		if (col === -1) return;
		
		animateKey(letter);
		
		setTile(currentRow, col, letter);
	}

	function handleBackspace() {
		if (gameOver) return;
		
		const rowTiles = rows[currentRow];
		if (!rowTiles) return;
		const col = lastFilledIndex(rowTiles);
		if (col === -1) return;
		
		animateKey("backspace");
		
		clearTile(currentRow, col);
	}

	function handleEnter() {
		if (gameOver) return;
		
		const rowTiles = rows[currentRow];
		if (rowTiles && rowFilled(rowTiles)) {
			const word = getCurrentWord();
			
			if (!isValidWord(word)) {
				showMessage("Palavra não encontrada no dicionário!");
				rowEls[currentRow].classList.add('shake-row');
				setTimeout(() => {
					rowEls[currentRow].classList.remove('shake-row');
				}, 600);
				return;
			}
			
			animateKey("enter");
			
			const results = checkWord(word);
			
			gameGuesses.push({
				word: word.toUpperCase(),
				result: results
			});
			
			animateRow(currentRow, results);
			updateKeyboard(word, results);
			
			if (word.toUpperCase() === targetWord) {
				gameOver = true;
				setTimeout(() => {
					showMessage(`Parabéns! Você acertou em ${currentRow + 1} tentativas!`, 5000);
					saveGameToHistory(true, currentRow + 1);
				}, 1000);
				return;
			}
			
			if (currentRow < rows.length - 1) {
				currentRow += 1;
				updateRowStates();
			} else {
				gameOver = true;
				setTimeout(() => {
					showMessage(`Fim de jogo! A palavra era: ${targetWord}`, 5000);
					saveGameToHistory(false, 6);
				}, 1000);
			}
		}
	}

	function isLetterKey(k) {
		return /^[a-zA-Z]$/.test(k);
	}

	window.addEventListener("keydown", (ev) => {
		const k = ev.key;
		if (isLetterKey(k) || k === "Backspace" || k === "Enter") {
			ev.preventDefault();
		}
		
		if (isLetterKey(k)) {
			handleLetter(k);
			return;
		}
		if (k === "Backspace") {
			handleBackspace();
			return;
		}
		if (k === "Enter") {
			handleEnter();
			return;
		}
	});

	function handleKeyAction(dataKey) {
		if (!dataKey) return;
		const key = String(dataKey).toLowerCase();
		if (key === "enter") return handleEnter();
		if (key === "backspace") return handleBackspace();
		if (/^[a-z]$/.test(key)) return handleLetter(key);
	}

	document.addEventListener("click", (e) => {
		const btn = e.target.closest(".key[data-key]");
		if (!btn) return;
		
		e.preventDefault();
		btn.blur();
		document.getSelection().removeAllRanges();
		
		const dataKey = btn.getAttribute("data-key");
		handleKeyAction(dataKey);
	});

	rows.forEach((tiles, rIdx) => {
		tiles.forEach((tile) => {
			tile.addEventListener("click", () => {
				if (rIdx !== currentRow) return;
			});
		});
	});

	async function initGame() {
		gameGuesses = [];
		gameOver = false;
		currentRow = 0;
		
		try {
			await loadWords();
			
			if (!targetWord || targetWord.length !== 5) {
				throw new Error('Invalid target word generated');
			}
			
			updateRowStates();
			showMessage("Bem-vindo ao Termads! Adivinhe a palavra de 5 letras.", 3000);
			
		} catch (error) {
			showMessage('Falha ao inicializar o jogo. Recarregue a página e verifique sua conexão.', 10000);
		}
	}

	document.addEventListener("focusin", (e) => {
		if (e.target.classList.contains("key")) {
			e.target.blur();
		}
	});
	
	document.addEventListener("mousedown", () => {
		document.getSelection().removeAllRanges();
	});

	initGame();
})();