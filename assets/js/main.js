// ===== CONFIGURAÇÕES =====
const CONFIG = {
    ROWS: 6,
    COLS: 5,
    ANIMATION_DELAY: 200,
    TIMEOUT: 30000,
    // API do dicionário brasileiro open source
    DICTIONARY_API: 'https://api.dicionario-aberto.net/word',
    // Backup com lista mínima apenas se API falhar completamente
    FALLBACK_WORDS: [
        'mundo', 'tempo', 'lugar', 'forma', 'parte', 'fazer', 'outro', 'pessoa', 'grande', 'olhar',
        'falar', 'saber', 'poder', 'estar', 'dizer', 'ficar', 'viver', 'final', 'grupo', 'ponto'
    ]
};

// ===== ESTADO DO JOGO =====
let gameState = {
    words: [],
    validWords: new Set(),
    targetWord: '',
    currentRow: 0,
    gameOver: false
};

// ===== UTILITÁRIOS =====
const Utils = {
    normalizeWord: word => word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    isLetter: key => /^[a-zA-Z]$/.test(key),
    selectRandom: array => array[Math.floor(Math.random() * array.length)],
    delay: ms => new Promise(resolve => setTimeout(resolve, ms))
};

const DOM = {
    getRowElements: () => Array.from({ length: CONFIG.ROWS }, (_, i) => document.querySelector(`.line-${i + 1}`)),
    getTile: (row, col) => document.querySelector(`[data-row="${row}"][data-col="${col}"]`),
    getKeyElement: letter => {
        const byDataKey = document.querySelector(`.key[data-key="${letter}"]`);
        if (byDataKey) return byDataKey;
        
        const allKeys = [...document.querySelectorAll('.key')];
        return allKeys.find(k => k.textContent.trim().toLowerCase() === letter);
    }
};

// ===== CARREGAMENTO DE PALAVRAS =====
const WordLoader = {
    async load() {
        console.log('🇧🇷 Carregando dicionário brasileiro...');
        
        try {
            // Tenta carregar da API principal do dicionário brasileiro
            const words = await this.loadFromBrazilianAPI();
            if (words && words.length > 100) {
                this.setWords(words);
                console.log(`✅ ${words.length} palavras carregadas da API brasileira`);
                return true;
            }
        } catch (error) {
            console.warn('⚠️ API brasileira indisponível:', error.message);
        }
        
        // Se API falhar, usa lista mínima apenas para funcionar
        console.log('🛡️ Usando lista mínima de emergência');
        this.setWords(CONFIG.FALLBACK_WORDS);
        console.log(`✅ ${CONFIG.FALLBACK_WORDS.length} palavras de emergência carregadas`);
        return true;
    },

    async loadFromBrazilianAPI() {
        console.log('🌐 Conectando com dicionário brasileiro...');
        
        // Primeiro, tenta buscar uma lista de palavras com 5 letras
        const searchQueries = [
            'https://significado.herokuapp.com/v2/words/5letters',
            'https://raw.githubusercontent.com/fserb/pt-br/master/words.txt',
            'https://api.github.com/repos/hermitdave/FrequencyWords/contents/content/2018/pt_br/pt_br_50k.txt'
        ];
        
        for (const url of searchQueries) {
            try {
                console.log(`🔍 Tentando: ${url}`);
                const response = await fetch(url, {
                    signal: AbortSignal.timeout(CONFIG.TIMEOUT),
                    headers: {
                        'Accept': 'application/json, text/plain',
                        'User-Agent': 'TermadsBR/1.0'
                    }
                });
                
                if (!response.ok) continue;
                
                const text = await response.text();
                const words = this.extractBrazilianWords(text);
                
                if (words.length > 100) {
                    console.log(`✅ Encontradas ${words.length} palavras brasileiras`);
                    return words;
                }
            } catch (error) {
                console.warn(`❌ Falha em ${url}:`, error.message);
                continue;
            }
        }
        
        throw new Error('Nenhuma API brasileira disponível');
    },

    extractBrazilianWords(text) {
        console.log('🔍 Extraindo palavras do português brasileiro...');
        
        let rawWords = [];
        
        // Tenta JSON primeiro
        try {
            const json = JSON.parse(text);
            if (Array.isArray(json)) {
                rawWords = json.map(item => 
                    typeof item === 'string' ? item : 
                    item.word || item.palavra || item.text || item.toString()
                );
            } else if (json.words) {
                rawWords = json.words;
            } else if (json.content) {
                // GitHub API retorna base64
                const decoded = atob(json.content);
                rawWords = decoded.split(/[\n\r]+/);
            }
        } catch {
            // Se não é JSON, processa como texto
            rawWords = text.split(/[\n\r,;]+/)
                .map(line => line.split(/\s+/)[0])
                .filter(word => word && word.length > 0);
        }

        // Filtra rigorosamente para português brasileiro com 5 letras
        const brazilianWords = rawWords
            .map(word => this.normalizeWord(word))
            .filter(word => word.length === CONFIG.COLS)
            .filter(word => this.isBrazilianPortuguese(word))
            .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicatas

        console.log(`📊 ${rawWords.length} → ${brazilianWords.length} palavras brasileiras válidas`);
        return brazilianWords;
    },

    normalizeWord(word) {
        return word.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')  // Remove acentos
            .replace(/[^a-z]/g, '')           // Apenas letras
            .trim();
    },

    isBrazilianPortuguese(word) {
        // Deve ter exatamente 5 letras
        if (word.length !== CONFIG.COLS) return false;
        
        // Apenas letras minúsculas
        if (!/^[a-z]{5}$/.test(word)) return false;
        
        // Deve ter pelo menos uma vogal
        if (!/[aeiou]/.test(word)) return false;
        
        // Bloqueia palavras claramente estrangeiras
        if (this.isObviouslyForeign(word)) return false;
        
        // Bloqueia padrões não portugueses
        if (this.hasNonPortuguesePattern(word)) return false;
        
        return true;
    },

    isObviouslyForeign(word) {
        // Lista mínima mas efetiva de palavras estrangeiras óbvias
        const obviousForeign = [
            'about', 'being', 'could', 'every', 'first', 'found', 'great', 'house',
            'large', 'light', 'local', 'might', 'never', 'other', 'place', 'point',
            'right', 'small', 'sound', 'state', 'still', 'their', 'there', 'these',
            'think', 'those', 'three', 'under', 'water', 'where', 'which', 'while',
            'world', 'would', 'write', 'young', 'wesen', 'darlo', 'lazlo', 'evers',
            'smith', 'jones', 'brown', 'white', 'isles'
        ];
        
        return obviousForeign.includes(word) || 
               /^(word|test|item|data)\d*$/.test(word) ||
               /xviii|[0-9]/.test(word);
    },

    hasNonPortuguesePattern(word) {
        // Padrões que definitivamente não são portugueses
        return (
            // Letras raras em português (exceto qu)
            (/[qwxy]/.test(word) && !/qu/.test(word)) ||
            
            // Combinações impossíveis em português
            /kk|ww|xx|yy|zz/.test(word) ||
            
            // Muitas consoantes seguidas
            /[bcdfghjklmnpqrstvwxyz]{4}/.test(word) ||
            
            // Termina com muitas consoantes
            /[bcdfghjklmnpqrstvwxyz]{3}$/.test(word) ||
            
            // Sem vogais suficientes (estrutura silábica ruim)
            !/[aeiou].*[aeiou]/.test(word) && word.length === 5
        );
    },

    setWords(words) {
        // Garante que todas as palavras são válidas e únicas
        const validWords = [...new Set(words)]
            .filter(word => word && word.length === CONFIG.COLS)
            .filter(word => /^[a-z]{5}$/.test(word))
            .sort();
            
        gameState.words = validWords;
        gameState.validWords = new Set(validWords);
        gameState.targetWord = Utils.selectRandom(validWords).toUpperCase();
        
        console.log('🎯 Palavra selecionada:', gameState.targetWord);
        console.log('📝 Exemplos:', validWords.slice(0, 5).join(', '));
        
        // Log para debug
        if (validWords.length < 50) {
            console.warn('⚠️ Poucas palavras carregadas. Considere verificar a API.');
        }
    }
};

// ===== INTERFACE =====
const UI = {
    showMessage(text, duration = 2000) {
        const existing = document.querySelector('.game-message');
        if (existing) existing.remove();
        
        const message = document.createElement('div');
        message.className = 'game-message';
        message.textContent = text;
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), duration);
    },

    updateRowStates() {
        DOM.getRowElements().forEach((row, i) => {
            row?.classList.remove('row-active', 'row-inactive', 'row-used');
            
            if (i < gameState.currentRow) row?.classList.add('row-used');
            else if (i === gameState.currentRow) row?.classList.add('row-active');
            else row?.classList.add('row-inactive');
        });
    },

    animateRowResults(row, results) {
        const tiles = Array.from({ length: CONFIG.COLS }, (_, i) => DOM.getTile(row, i));
        
        tiles.forEach((tile, i) => {
            setTimeout(() => tile?.classList.add(results[i]), i * CONFIG.ANIMATION_DELAY);
        });
    },

    shakeRow() {
        const rowElement = DOM.getTile(gameState.currentRow, 0)?.parentElement;
        rowElement?.classList.add('shake-row');
        setTimeout(() => rowElement?.classList.remove('shake-row'), 600);
    }
};

// ===== LÓGICA DO JOGO =====
const GameLogic = {
    getTileIndex: {
        firstEmpty: () => {
            for (let i = 0; i < CONFIG.COLS; i++) {
                const tile = DOM.getTile(gameState.currentRow, i);
                if (tile && !tile.textContent.trim()) return i;
            }
            return -1;
        },

        lastFilled: () => {
            for (let i = CONFIG.COLS - 1; i >= 0; i--) {
                const tile = DOM.getTile(gameState.currentRow, i);
                if (tile && tile.textContent.trim()) return i;
            }
            return -1;
        }
    },

    getCurrentWord: () => {
        let word = '';
        for (let i = 0; i < CONFIG.COLS; i++) {
            const tile = DOM.getTile(gameState.currentRow, i);
            word += tile?.textContent || '';
        }
        return word;
    },

    isValidWord: word => gameState.validWords.has(Utils.normalizeWord(word)),

    checkWord: guess => {
        const target = gameState.targetWord;
        const result = Array(CONFIG.COLS);
        const targetCount = {};
        
        // Contar letras do target
        for (const letter of target) {
            targetCount[letter] = (targetCount[letter] || 0) + 1;
        }
        
        // Primeira passada: posições corretas
        for (let i = 0; i < CONFIG.COLS; i++) {
            if (guess[i] === target[i]) {
                result[i] = 'correct';
                targetCount[guess[i]]--;
            }
        }
        
        // Segunda passada: posições incorretas
        for (let i = 0; i < CONFIG.COLS; i++) {
            if (result[i]) continue;
            
            if (targetCount[guess[i]] > 0) {
                result[i] = 'wrong-position';
                targetCount[guess[i]]--;
            } else {
                result[i] = 'incorrect';
            }
        }
        
        return result;
    }
};

// ===== CONTROLES =====
const Controls = {
    addLetter(letter) {
        const col = GameLogic.getTileIndex.firstEmpty();
        if (col === -1) return false;
        
        const tile = DOM.getTile(gameState.currentRow, col);
        if (tile) {
            tile.textContent = letter.toUpperCase();
            tile.classList.add('typed');
            setTimeout(() => tile.classList.remove('typed'), 120);
            return true;
        }
        return false;
    },

    deleteLetter() {
        const col = GameLogic.getTileIndex.lastFilled();
        if (col === -1) return false;
        
        const tile = DOM.getTile(gameState.currentRow, col);
        if (tile) {
            tile.textContent = '';
            return true;
        }
        return false;
    },

    animateKey(key) {
        const keyElement = DOM.getKeyElement(key.toLowerCase());
        if (keyElement) {
            keyElement.classList.add('key-clicked');
            setTimeout(() => keyElement.classList.remove('key-clicked'), 150);
        }
    },

    updateKeyboard(word, results) {
        for (let i = 0; i < word.length; i++) {
            const letter = word[i].toLowerCase();
            const state = results[i];
            const keyElement = DOM.getKeyElement(letter);
            
            if (keyElement && this.shouldUpdateKeyState(keyElement, state)) {
                keyElement.classList.remove('correct', 'wrong-position', 'incorrect', 'disabled');
                keyElement.classList.add(state);
                
                // Se a letra não está na palavra (incorrect), adiciona efeito visual especial
                if (state === 'incorrect') {
                    setTimeout(() => {
                        keyElement.style.transition = 'all 0.3s ease';
                        keyElement.classList.add('disabled');
                    }, 100);
                }
            }
        }
    },

    shouldUpdateKeyState(element, newState) {
        const hierarchy = { 'incorrect': 1, 'wrong-position': 2, 'correct': 3 };
        const current = element.classList.contains('correct') ? 'correct' :
                       element.classList.contains('wrong-position') ? 'wrong-position' :
                       element.classList.contains('incorrect') ? 'incorrect' : 'none';
        
        return hierarchy[newState] >= hierarchy[current];
    },

    resetKeyboard() {
        const allKeys = document.querySelectorAll('.key');
        allKeys.forEach(key => {
            key.classList.remove('correct', 'wrong-position', 'incorrect', 'disabled');
            key.style.transition = '';
            key.style.animation = '';
        });
    }
};

// ===== GERENCIADOR DO JOGO =====
const Game = {
    async init() {
        console.log('🎮 Inicializando jogo...');
        
        try {
            await WordLoader.load();
            this.setupEventListeners();
            UI.updateRowStates();
            UI.showMessage('Bem-vindo ao Termads! Adivinhe a palavra de 5 letras.', 3000);
            console.log('✅ Jogo inicializado');
        } catch (error) {
            console.error('❌ Falha na inicialização:', error);
            UI.showMessage('Erro ao carregar. Recarregue a página.', 10000);
        }
    },

    setupEventListeners() {
        // Teclado físico
        document.addEventListener('keydown', ev => {
            const key = ev.key;
            if (Utils.isLetter(key) || key === 'Backspace' || key === 'Enter') {
                ev.preventDefault();
                this.handleKey(key);
            }
        });

        // Teclado virtual
        document.addEventListener('click', ev => {
            const btn = ev.target.closest('.key[data-key]');
            if (btn) {
                ev.preventDefault();
                btn.blur();
                document.getSelection().removeAllRanges();
                this.handleKey(btn.dataset.key);
            }
        });

        // Prevenção de seleção
        document.addEventListener('focusin', ev => {
            if (ev.target.classList.contains('key')) ev.target.blur();
        });
        
        document.addEventListener('mousedown', () => {
            document.getSelection().removeAllRanges();
        });
    },

    handleKey(key) {
        if (gameState.gameOver) return;

        // Verificar se a tecla está desabilitada (apenas para letras)
        if (Utils.isLetter(key)) {
            const keyElement = DOM.getKeyElement(key.toLowerCase());
            if (keyElement && keyElement.classList.contains('disabled')) {
                // Feedback visual para tecla desabilitada
                keyElement.style.animation = 'shake 0.3s ease-in-out';
                setTimeout(() => keyElement.style.animation = '', 300);
                UI.showMessage('⚠️ Esta letra não está na palavra!', 1200);
                return;
            }
        }

        Controls.animateKey(key);

        if (Utils.isLetter(key)) {
            Controls.addLetter(key);
        } else if (key === 'Backspace') {
            Controls.deleteLetter();
        } else if (key === 'Enter' || key === 'enter') {
            this.submitGuess();
        }
    },

    submitGuess() {
        const word = GameLogic.getCurrentWord();
        
        if (word.length !== CONFIG.COLS) {
            UI.showMessage('Palavra incompleta!', 1500);
            UI.shakeRow();
            return;
        }
        
        if (!GameLogic.isValidWord(word)) {
            UI.showMessage('Palavra não encontrada no dicionário!', 1500);
            UI.shakeRow();
            return;
        }

        const results = GameLogic.checkWord(word.toUpperCase());
        
        UI.animateRowResults(gameState.currentRow, results);
        Controls.updateKeyboard(word, results);
        
        if (results.every(r => r === 'correct')) {
            this.endGame(true);
        } else if (gameState.currentRow >= CONFIG.ROWS - 1) {
            this.endGame(false);
        } else {
            gameState.currentRow++;
            UI.updateRowStates();
        }
    },

    endGame(won) {
        gameState.gameOver = true;
        
        const message = won ? 
            `🎉 Parabéns! Você acertou em ${gameState.currentRow + 1} tentativas!` :
            `😔 Fim de jogo! A palavra era: ${gameState.targetWord}`;
        
        setTimeout(() => {
            UI.showMessage(message, 5000);
            setTimeout(() => {
                if (confirm('Jogar novamente?')) location.reload();
            }, 5500);
        }, 1000);
    }
};

// ===== FUNÇÕES DE DEBUG =====
window.testConnectivity = async () => {
    console.log('🔍 Testando conectividade...');
    try {
        const response = await fetch('https://api.github.com/zen');
        console.log('✅ Conectividade OK:', response.status);
        return true;
    } catch (error) {
        console.error('❌ Problema de conectividade:', error);
        return false;
    }
};

window.testWordValidation = () => {
    const testWords = ['carro', 'morte', 'corte', 'porte', 'mundo', 'teste', 'abcde'];
    console.log('🧪 Testando validação:');
    testWords.forEach(word => {
        const normalized = Utils.normalizeWord(word);
        const isValid = GameLogic.isValidWord(word);
        console.log(`"${word}" → "${normalized}" → ${isValid ? 'válida' : 'inválida'}`);
    });
    console.log(`📊 Total: ${gameState.validWords.size} palavras`);
    console.log(`📄 Primeiras 20 palavras:`, Array.from(gameState.validWords).slice(0, 20));
    console.log(`📄 Últimas 20 palavras:`, Array.from(gameState.validWords).slice(-20));
    
    // Procurar palavras suspeitas
    const suspiciousWords = Array.from(gameState.validWords).filter(word => 
        /xviii|wesen|isles|^[A-Z]|[0-9]/i.test(word) || 
        !/[aeiouáàâãéêíóôõú]/.test(word)
    );
    console.log(`⚠️ Palavras suspeitas encontradas (${suspiciousWords.length}):`, suspiciousWords);
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => Game.init());