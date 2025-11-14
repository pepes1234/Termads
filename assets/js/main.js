(function () {
	const TOTAL_ROWS = 6;
	const COLS = 5;
	
	let gameWords = [];
	let validWords = new Set();
	let targetWord = "";
	let gameOver = false;
	let currentRow = 0;
	let gameGuesses = [];

	function normalizeWord(word) {
		return word.trim().toLowerCase()
			.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z]/g, '');
	}

	// Sistema APENAS com API de dicionário - SEM palavras locais
	async function loadWords() {
		try {
			console.log('Carregando da API do Dicionario Aberto...');
			
			showMessage('Conectando com API do Dicionario...', 2000);
			
			const response = await fetch('https://api.dicionario-aberto.net/words', {
				signal: AbortSignal.timeout(15000),
				headers: {
					'Accept': 'application/json',
					'User-Agent': 'Mozilla/5.0 (compatible; TermadsBR/1.0)'
				}
			});
			
			if (!response.ok) {
				throw new Error(`API falhou: ${response.status}`);
			}
			
			const data = await response.json();
			console.log('Dados recebidos:', data);
			
			if (!data || !Array.isArray(data)) {
				throw new Error('Formato invalido da API');
			}
			
			const palavrasCincoLetras = data
				.map(item => {
					const word = item.word || item.termo || item.palavra || item;
					return String(word).trim();
				})
				.filter(word => {
					return word && 
						   word.length === 5 && 
						   /^[a-záàâãäéèêëíìîïóòôõöúùûüç]+$/i.test(word) &&
						   !/[0-9]/.test(word);
				})
				.map(word => normalizeWord(word));
			
			console.log(`Encontradas ${palavrasCincoLetras.length} palavras de 5 letras`);
			console.log('Primeiras 10:', palavrasCincoLetras.slice(0, 10));
			
			if (palavrasCincoLetras.length < 50) {
				throw new Error(`Muito poucas palavras: ${palavrasCincoLetras.length}`);
			}
			
			validWords = new Set(palavrasCincoLetras);
			gameWords = palavrasCincoLetras;
			targetWord = palavrasCincoLetras[Math.floor(Math.random() * palavrasCincoLetras.length)].toUpperCase();
			
			console.log(`${palavrasCincoLetras.length} palavras carregadas da API`);
			console.log(`Palavra selecionada: ${targetWord}`);
			
			showMessage(`${palavrasCincoLetras.length} palavras carregadas da API`);
			
			return true;
			
		} catch (error) {
			console.error('Erro na API:', error.message);
			showMessage('Falha na API. Nao foi possivel carregar palavras.', 8000, 'error');
			return false;
		}
	}

	function isValidWord(word) {
		const normalized = normalizeWord(word);
		return validWords.has(normalized);
	}

	async function validateGuess(guess) {
		const normalized = normalizeWord(guess);
		
		if (normalized.length !== 5) {
			return false;
		}
		
		return validWords.has(normalized);
	}

	function initializeBoard() {
		const grid = document.querySelector('.grid');
		if (!grid) return;

		grid.innerHTML = '';
		
		for (let i = 0; i < TOTAL_ROWS; i++) {
			const row = document.createElement('div');
			row.className = 'row';
			row.setAttribute('role', 'row');
			row.setAttribute('aria-label', `Tentativa ${i + 1}`);

			for (let j = 0; j < COLS; j++) {
				const tile = document.createElement('div');
				tile.className = 'tile';
				tile.setAttribute('role', 'gridcell');
				tile.setAttribute('data-row', i);
				tile.setAttribute('data-col', j);
				tile.setAttribute('tabindex', '-1');
				row.appendChild(tile);
			}
			
			grid.appendChild(row);
		}
	}

	function showMessage(text, duration = 3000, type = 'info') {
		const existing = document.querySelector('.game-message');
		if (existing) {
			existing.remove();
		}

		const message = document.createElement('div');
		message.className = `game-message ${type}`;
		message.textContent = text;
		message.setAttribute('role', 'alert');
		message.setAttribute('aria-live', 'polite');
		
		document.body.appendChild(message);

		setTimeout(() => {
			if (message.parentNode) {
				message.remove();
			}
		}, duration);
	}

	function getCurrentGuess() {
		const currentRowElement = document.querySelector(`.row:nth-child(${currentRow + 1})`);
		if (!currentRowElement) return '';

		const tiles = currentRowElement.querySelectorAll('.tile');
		return Array.from(tiles).map(tile => tile.textContent || '').join('');
	}

	function updateTile(row, col, letter) {
		const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
		if (tile) {
			tile.textContent = letter.toUpperCase();
			if (letter) {
				tile.classList.add('typed');
			} else {
				tile.classList.remove('typed');
			}
		}
	}

	function addLetter(letter) {
		if (gameOver) return;
		
		const guess = getCurrentGuess();
		if (guess.length >= COLS) return;

		updateTile(currentRow, guess.length, letter);
	}

	function removeLetter() {
		if (gameOver) return;
		
		const guess = getCurrentGuess();
		if (guess.length === 0) return;

		updateTile(currentRow, guess.length - 1, '');
	}

	async function submitGuess() {
		if (gameOver) return;

		const guess = getCurrentGuess();
		if (guess.length !== COLS) {
			showMessage('Palavra incompleta!');
			return;
		}

		// Mostrar indicador de carregamento
		showMessage('Verificando palavra...');
		
		const isValid = await validateGuess(guess);
		if (!isValid) {
			showMessage('Palavra não encontrada no dicionário brasileiro!');
			
			const currentRowElement = document.querySelector(`.row:nth-child(${currentRow + 1})`);
			if (currentRowElement) {
				currentRowElement.classList.add('shake-row');
				setTimeout(() => currentRowElement.classList.remove('shake-row'), 600);
			}
			return;
		}

		gameGuesses.push(guess);
		checkGuess(guess);
		updateKeyboard(guess);
		currentRow++;

		if (guess === targetWord) {
			showMessage(`Parabéns! A palavra era ${targetWord}! 🎉`, 5000);
			gameOver = true;
		} else if (currentRow >= TOTAL_ROWS) {
			showMessage(`Fim de jogo! A palavra era ${targetWord}.`, 5000);
			gameOver = true;
		} else {
			showMessage(`Tentativa ${currentRow} de ${TOTAL_ROWS}`);
		}
	}

	function checkGuess(guess) {
		const currentRowElement = document.querySelector(`.row:nth-child(${currentRow + 1})`);
		if (!currentRowElement) return;

		const tiles = currentRowElement.querySelectorAll('.tile');
		const targetArray = targetWord.split('');
		const guessArray = guess.split('');

		const used = Array(COLS).fill(false);
		for (let i = 0; i < COLS; i++) {
			if (guessArray[i] === targetArray[i]) {
				tiles[i].classList.add('correct');
				used[i] = true;
			}
		}

		for (let i = 0; i < COLS; i++) {
			if (guessArray[i] !== targetArray[i]) {
				let found = false;
				for (let j = 0; j < COLS; j++) {
					if (!used[j] && guessArray[i] === targetArray[j]) {
						tiles[i].classList.add('wrong-position');
						used[j] = true;
						found = true;
						break;
					}
				}
				if (!found) {
					tiles[i].classList.add('incorrect');
				}
			}
		}
	}

	function updateKeyboard(guess) {
		const keys = document.querySelectorAll('.key');
		const targetArray = targetWord.split('');
		
		for (let i = 0; i < guess.length; i++) {
			const letter = guess[i].toLowerCase();
			const key = document.querySelector(`[data-key="${letter}"]`);
			
			if (!key) continue;

			if (letter === targetArray[i].toLowerCase()) {
				key.classList.remove('wrong-position', 'incorrect');
				key.classList.add('correct');
			} else if (targetWord.toLowerCase().includes(letter)) {
				if (!key.classList.contains('correct')) {
					key.classList.add('wrong-position');
				}
			} else {
				key.classList.remove('correct', 'wrong-position');
				key.classList.add('incorrect');
			}
		}
	}

	function handleKeyPress(event) {
		if (gameOver) return;

		const key = event.key.toLowerCase();
		
		if (key === 'enter') {
			submitGuess();
		} else if (key === 'backspace') {
			removeLetter();
		} else if (/^[a-záàâãäéèêëíìîïóòôõöúùûüç]$/i.test(key)) {
			addLetter(key);
		}
	}

	function handleKeyClick(event) {
		if (gameOver) return;
		
		const keyElement = event.target.closest('.key');
		if (!keyElement) return;

		const key = keyElement.getAttribute('data-key');
		
		keyElement.classList.add('key-clicked');
		setTimeout(() => keyElement.classList.remove('key-clicked'), 150);

		if (key === 'enter') {
			submitGuess();
		} else if (key === 'backspace') {
			removeLetter();
		} else {
			addLetter(key);
		}
	}

	document.addEventListener('DOMContentLoaded', async function() {
		console.log('Inicializando Termads...');
		
		initializeBoard();
		
		document.addEventListener('keydown', handleKeyPress);
		document.addEventListener('click', handleKeyClick);
		
		showMessage('Carregando dicionario brasileiro...', 2000);
		
		const success = await loadWords();
		if (!success) {
			showMessage('Falha ao carregar dicionario. Recarregue a pagina.', 10000, 'error');
			return;
		}
		
		console.log('Jogo pronto!');
	});

	window.testConnectivity = async function() {
		return true;
	};

	window.testWordValidation = function() {
		const testWords = ['carro', 'morte', 'corte', 'porte', 'mundo', 'teste'];
		testWords.forEach(word => {
			console.log(`${word}: ${isValidWord(word) ? 'valido' : 'invalido'}`);
		});
	};

})();