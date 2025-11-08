// ===== CONFIGURAÇÕES =====
const CONFIG = {
    ROWS: 6,
    COLS: 5,
    ANIMATION_DELAY: 200,
    TIMEOUT: 30000,
    API_ENDPOINTS: [
        'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/pt/pt_50k.txt',
        'https://api.allorigins.win/raw?url=https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/pt/pt_50k.txt',
        'https://corsproxy.io/?https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/pt/pt_50k.txt'
    ],
    EMERGENCY_WORDS: [
        'mundo', 'tempo', 'lugar', 'forma', 'parte', 'fazer', 'outro', 'pessoa', 'grande',
        'olhar', 'falar', 'saber', 'poder', 'estar', 'dizer', 'ficar', 'viver', 'final',
        'grupo', 'ponto', 'ordem', 'valor', 'linha', 'vista', 'coisa', 'carro', 'morte',
        'casas', 'vidas', 'terra', 'tomar', 'levar', 'partir', 'certo', 'curso', 'banco',
        'campo', 'carta', 'chave', 'cinco', 'claro', 'corpo', 'costa', 'criar', 'dente',
        'desde', 'entre', 'epoca', 'escola', 'etapa', 'feliz', 'festa', 'forte', 'fraco',
        'fundo', 'geral', 'gosto', 'grama', 'grave', 'hotel', 'igual', 'junto', 'largo',
        'leite', 'lista', 'livro', 'maior', 'marca', 'massa', 'menor', 'mesmo', 'metro',
        'norte', 'novas', 'nunca', 'obras', 'papel', 'passo', 'pedra', 'perto', 'preto',
        'plano', 'pobre', 'porta', 'posto', 'praia', 'prato', 'primo', 'prova', 'quase',
        'radio', 'regra', 'resto', 'risco', 'rosto', 'saida', 'senhor', 'serio', 'silva',
        'sobre', 'suave', 'tecla', 'texto', 'tipos', 'turno', 'verde', 'bravo', 'breve',
        'virus', 'vista', 'volume', 'zebra', 'calma', 'carne', 'cheio', 'doido', 'errar',
        'ainda', 'amigo', 'andar', 'antes', 'areia', 'assim', 'baixo', 'sorte', 'corte',
    EMERGENCY_WORDS: [
        // Verbos comuns (infinitivo e conjugações)
        'achar', 'agir', 'amar', 'andar', 'arder', 'bater', 'beber', 'buscar', 'caber',
        'cagar', 'casar', 'chegar', 'chorar', 'comer', 'comprar', 'contar', 'correr', 'coser',
        'criar', 'curar', 'dançar', 'dizer', 'doer', 'dormir', 'entrar', 'errar', 'estar',
        'fazer', 'falar', 'ferir', 'ficar', 'fugir', 'ganhar', 'gastar', 'gritar', 'haver',
        'ir', 'jogar', 'lavar', 'levar', 'limpar', 'ler', 'mandar', 'matar', 'meter',
        'mirar', 'morar', 'mover', 'nadar', 'nascer', 'odiar', 'olhar', 'ouvir', 'pagar',
        'parar', 'partir', 'passar', 'pedir', 'pegar', 'pensar', 'perder', 'pisar', 'poder',
        'poner', 'pular', 'querer', 'rachar', 'ralar', 'rolar', 'saber', 'sair', 'secar',
        'sentar', 'sento', 'servir', 'socar', 'subir', 'sugar', 'suar', 'tecer', 'tirar',
        'tocar', 'tomar', 'valer', 'vender', 'venir', 'verde', 'viajar', 'virar', 'viver',
        'voar', 'voltar', 'votar',

        // Substantivos comuns
        'agua', 'aluno', 'amigo', 'amor', 'animal', 'ano', 'arvore', 'aviao', 'bacia',
        'balde', 'banco', 'barra', 'barco', 'base', 'bicho', 'blusa', 'boca', 'bolsa',
        'borda', 'braco', 'bravo', 'breve', 'brisa', 'burro', 'cabra', 'caixa', 'calca',
        'caldo', 'cama', 'campo', 'cansa', 'capaz', 'carga', 'carne', 'carro', 'carta',
        'casa', 'casal', 'causa', 'chave', 'chefe', 'chuva', 'cinco', 'clima', 'cobra',
        'coisa', 'color', 'conta', 'corda', 'cores', 'corpo', 'costa', 'couro', 'crisp',
        'cuida', 'curso', 'dados', 'dente', 'dieta', 'doces', 'dores', 'drama', 'ducha',
        'dupla', 'epoca', 'ervas', 'escola', 'etapa', 'facil', 'farol', 'festa', 'fibra',
        'figos', 'final', 'flore', 'forma', 'forte', 'fruta', 'fumar', 'fundo', 'garoa',
        'gemas', 'genio', 'geral', 'gosta', 'grama', 'grande', 'grave', 'greve', 'grupo',
        'heroi', 'horta', 'hotel', 'idade', 'igual', 'janta', 'jeans', 'junto', 'jovem',
        'lapis', 'largo', 'leite', 'letra', 'linha', 'lista', 'livro', 'louca', 'lugar',
        'manga', 'marca', 'massa', 'medal', 'melao', 'menor', 'mesa', 'mesmo', 'metro',
        'molho', 'monte', 'moral', 'morte', 'museu', 'mundo', 'nariz', 'navio', 'negro',
        'netos', 'nivel', 'noite', 'norte', 'notas', 'novel', 'obras', 'olhos', 'ordem',
        'papel', 'pardo', 'parte', 'parto', 'pasta', 'patos', 'pedra', 'peixe', 'perna',
        'perto', 'pessoa', 'picos', 'pinta', 'placa', 'plano', 'pluma', 'pobre', 'poder',
        'ponto', 'porta', 'posto', 'praia', 'prato', 'preco', 'preto', 'primo', 'prova',
        'quota', 'radio', 'rapaz', 'ratos', 'razao', 'regra', 'reino', 'resto', 'risco',
        'roupa', 'ruins', 'salao', 'senha', 'silva', 'sogra', 'solar', 'sobre', 'tempo',
        'terra', 'texto', 'tipos', 'torre', 'traje', 'turno', 'unhas', 'valor', 'verso',
        'vista', 'zebra',

        // Adjetivos e outras palavras
        'agudo', 'ainda', 'assim', 'baixo', 'basto', 'bello', 'bravo', 'breve', 'calma',
        'certa', 'cheio', 'claro', 'doido', 'errado', 'facil', 'falso', 'feliz', 'forte',
        'fraco', 'grave', 'largo', 'lento', 'limpo', 'lindo', 'louco', 'maior', 'menor',
        'muito', 'negro', 'nossa', 'novo', 'perto', 'pouco', 'preto', 'primo', 'quase',
        'rapido', 'seco', 'serio', 'suave', 'todos', 'verde', 'velho',

        // Palavras do dia a dia brasileiras
        'beijo', 'sonho', 'sorte', 'corte', 'porte', 'morte', 'forte', 'norte', 'ponte',
        'fonte', 'monte', 'conte', 'dorme', 'forme', 'torne', 'porne', 'bonde', 'conde',
        'funde', 'mundo', 'fundo', 'tunel', 'canal', 'legal', 'metal', 'total', 'vital',
        'ideal', 'real', 'igual', 'atual', 'usual', 'local', 'final', 'moral', 'oral',
        'rural', 'social', 'geral', 'central', 'mental', 'dental', 'postal', 'normal',

        // Conjugações verbais comuns
        'tenho', 'venho', 'ponho', 'ganho', 'banho', 'ranho', 'sonho', 'donho',
        'facho', 'macho', 'cacho', 'tacho', 'nacho', 'bicho', 'ficho', 'nicho',
        'fecho', 'techo', 'decho', 'pecho', 'lecho', 'becho', 'secho', 'necho',
        'creio', 'freio', 'cheio', 'feios', 'veios', 'seios', 'meios', 'teios',
        'cruze', 'bruxa', 'luzes', 'vezes', 'vozes', 'rosas', 'coisas', 'poses',
        'bases', 'doses', 'risos', 'mesas', 'casas', 'pesas', 'tesas', 'besas'
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
        console.log('🔄 Carregando palavras...');
        
        // Usando apenas dicionário português brasileiro verificado
        console.log('🇧🇷 Carregando dicionário português brasileiro...');
        this.activateEmergencyMode();
        return true;
    },

    async fetchFromAPI(url) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
        
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'text/plain',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            
            const text = await response.text();
            return this.processText(text);
        } finally {
            clearTimeout(timeoutId);
        }
    },

    processText(text) {
        if (!text || text.length < 100) {
            throw new Error('Resposta muito pequena');
        }

        let words = [];
        
        try {
            const jsonData = JSON.parse(text);
            if (Array.isArray(jsonData)) {
                words = jsonData.map(word => word.toString());
                console.log('📄 Processado como JSON');
            }
        } catch {
            words = text.split(/[\n\r]+/).map(line => line.split(/\s+/)[0]);
            console.log('📄 Processado como texto');
        }

        const validWords = words
            .map(Utils.normalizeWord)
            .filter(word => {
                return word.length === CONFIG.COLS && 
                       this.isValidPortugueseWord(word);
            });

        console.log(`🔍 ${validWords.length} palavras válidas encontradas`);
        return validWords;
    },

    isValidPortugueseWord(word) {
        // Apenas letras minúsculas
        if (!/^[a-z]+$/.test(word)) return false;
        
        // Deve ter pelo menos uma vogal
        if (!/[aeiou]/.test(word)) return false;
        
        // Filtro simples - apenas obviamente não portuguesas
        if (this.isObviouslyForeignWord(word)) return false;
        
        return true; // Muito mais permissivo
    },

    isObviouslyForeignWord(word) {
        // Lista reduzida - apenas palavras OBVIAMENTE estrangeiras
        const obviouslyForeign = [
            // Inglês muito comum
            'about', 'being', 'could', 'every', 'first', 'found', 'great', 'house',
            'large', 'light', 'local', 'might', 'never', 'other', 'place', 'point',
            'right', 'small', 'sound', 'state', 'still', 'their', 'there', 'these',
            'think', 'those', 'three', 'under', 'water', 'where', 'which', 'while',
            'world', 'would', 'write', 'young', 'isles',
            
            // Nomes claramente estrangeiros
            'darlo', 'lazlo', 'wesen', 'smith', 'jones', 'brown'
        ];
        
        return obviouslyForeign.includes(word) ||
               /xviii|[0-9]/.test(word);  // Apenas números/romanos
    },

    hasNonPortuguesePatterns(word) {
        // Padrões claramente não portugueses - mais permissivo
        return /xviii|[0-9]/.test(word) ||        // Números romanos e dígitos
               word.includes('xx') ||              // Duplo X
               word.includes('kk') ||              // Duplo K  
               word.includes('ww') ||              // Duplo W
               /^[qwxy][^u]/.test(word) ||        // Q,W,X,Y no início sem U depois
               /[bcdfghjklmnpqrstvwxyz]{5}/.test(word); // 5+ consoantes seguidas
    },

    hasPortugueseSyllableStructure(word) {
        // Mais permissivo - aceita a maioria das estruturas portuguesas
        const consonantClusters = word.match(/[bcdfghjklmnpqrstvwxyz]+/g) || [];
        
        for (const cluster of consonantClusters) {
            // Permite até 4 consoantes (muito permissivo)
            if (cluster.length > 4) return false;
        }
        
        return true; // Muito mais permissivo
    },

    setWords(words) {
        gameState.words = words;
        gameState.validWords = new Set(words);
        gameState.targetWord = Utils.selectRandom(words).toUpperCase();
        console.log('🎯 Palavra selecionada:', gameState.targetWord);
    },

    activateEmergencyMode() {
        console.warn('🇧🇷 Modo dicionário português ativado');
        const words = CONFIG.EMERGENCY_WORDS.filter(word => word.length === CONFIG.COLS);
        this.setWords(words);
        UI.showEmergencyMessage();
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

    showEmergencyMessage() {
        const message = document.createElement('div');
        message.className = 'emergency-message';
        message.innerHTML = `
            <div style="display: flex; align-items: center; padding: 16px 20px; gap: 12px; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 8px; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3); position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000; max-width: 90vw; animation: slideDown 0.5s ease-out;">
                <div style="font-size: 24px;">🇧🇷</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; font-size: 16px;">Dicionário Português</div>
                    <div style="font-size: 14px; opacity: 0.9;">Usando apenas palavras verificadas em português</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 4px 8px; border-radius: 4px; color: white;">×</button>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 8000);
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