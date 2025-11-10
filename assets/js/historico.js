document.addEventListener('DOMContentLoaded', function() {
    
    const gamesList = document.getElementById('games-list');
    const noGames = document.getElementById('no-games');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModal = document.getElementById('close-modal');
    
    const totalGamesEl = document.getElementById('total-games');
    const winRateEl = document.getElementById('win-rate');
    const currentStreakEl = document.getElementById('current-streak');
    const maxStreakEl = document.getElementById('max-streak');

    function getGameHistory() {
        const history = localStorage.getItem('termads-history');
        if (history) {
            return JSON.parse(history);
        }
        
        return getExampleGames();
    }

    function getExampleGames() {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
        
        return [
            {
                id: 1,
                date: now.toISOString(),
                targetWord: 'MUNDO',
                won: true,
                attempts: 4,
                guesses: [
                    { word: 'CARRO', result: ['incorrect', 'incorrect', 'incorrect', 'incorrect', 'correct'] },
                    { word: 'LUGAR', result: ['incorrect', 'correct', 'incorrect', 'incorrect', 'incorrect'] },
                    { word: 'PONTO', result: ['incorrect', 'incorrect', 'wrong-position', 'incorrect', 'correct'] },
                    { word: 'MUNDO', result: ['correct', 'correct', 'correct', 'correct', 'correct'] }
                ]
            },
            {
                id: 2,
                date: yesterday.toISOString(),
                targetWord: 'FORTE',
                won: true,
                attempts: 3,
                guesses: [
                    { word: 'TEMPO', result: ['wrong-position', 'wrong-position', 'incorrect', 'incorrect', 'wrong-position'] },
                    { word: 'PONTE', result: ['incorrect', 'incorrect', 'wrong-position', 'correct', 'correct'] },
                    { word: 'FORTE', result: ['correct', 'correct', 'correct', 'correct', 'correct'] }
                ]
            },
            {
                id: 3,
                date: twoDaysAgo.toISOString(),
                targetWord: 'PLANO',
                won: false,
                attempts: 6,
                guesses: [
                    { word: 'CARRO', result: ['incorrect', 'wrong-position', 'incorrect', 'incorrect', 'wrong-position'] },
                    { word: 'TERRA', result: ['incorrect', 'incorrect', 'incorrect', 'incorrect', 'wrong-position'] },
                    { word: 'GOSTO', result: ['incorrect', 'incorrect', 'incorrect', 'incorrect', 'wrong-position'] },
                    { word: 'HOTEL', result: ['incorrect', 'wrong-position', 'incorrect', 'incorrect', 'wrong-position'] },
                    { word: 'MASSA', result: ['incorrect', 'wrong-position', 'incorrect', 'incorrect', 'wrong-position'] },
                    { word: 'LINHA', result: ['wrong-position', 'incorrect', 'wrong-position', 'incorrect', 'wrong-position'] }
                ]
            }
        ];
    }

    function saveGameHistory(history) {
        localStorage.setItem('termads-history', JSON.stringify(history));
    }

    function addNewGame(gameData) {
        const history = getGameHistory();
        gameData.id = Date.now();
        gameData.date = new Date().toISOString();
        history.unshift(gameData);
        saveGameHistory(history);
        renderGames();
        updateStats();
    }

    function calculateStats(games) {
        const totalGames = games.length;
        const wins = games.filter(game => game.won).length;
        const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
        
        let currentStreak = 0;
        let maxStreak = 0;
        let tempStreak = 0;
        
        for (let i = 0; i < games.length; i++) {
            if (games[i].won) {
                tempStreak++;
                if (i === 0) currentStreak = tempStreak;
            } else {
                if (i === 0) currentStreak = 0;
                tempStreak = 0;
            }
            maxStreak = Math.max(maxStreak, tempStreak);
        }
        
        return { totalGames, winRate, currentStreak, maxStreak };
    }

    function updateStats() {
        const games = getGameHistory();
        const stats = calculateStats(games);
        
        totalGamesEl.textContent = stats.totalGames;
        winRateEl.textContent = `${stats.winRate}%`;
        currentStreakEl.textContent = stats.currentStreak;
        maxStreakEl.textContent = stats.maxStreak;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays === 1) {
            return `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return date.toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    function createGameItem(game) {
        const gameItem = document.createElement('div');
        gameItem.className = 'game-item';
        gameItem.addEventListener('click', () => showGameDetails(game));
        
        const statusClass = game.won ? 'status-win' : 'status-lose';
        const statusText = game.won ? `Vitória em ${game.attempts}/6` : 'Derrota';
        
        gameItem.innerHTML = `
            <div class="game-left">
                <div class="game-date">${formatDate(game.date)}</div>
                <div class="game-status ${statusClass}">${statusText}</div>
            </div>
            <div class="game-right">
                <div class="game-word">${game.targetWord}</div>
                <div class="game-attempts">${game.attempts} tentativas</div>
            </div>
        `;
        
        return gameItem;
    }

    function renderGames() {
        const games = getGameHistory();
        
        if (games.length === 0) {
            gamesList.style.display = 'none';
            noGames.style.display = 'flex';
            return;
        }
        
        gamesList.style.display = 'flex';
        noGames.style.display = 'none';
        gamesList.innerHTML = '';
        
        games.forEach(game => {
            const gameItem = createGameItem(game);
            gamesList.appendChild(gameItem);
        });
    }

    function showGameDetails(game) {
        document.getElementById('game-date').textContent = formatDate(game.date);
        document.getElementById('target-word').textContent = game.targetWord;
        document.getElementById('game-result').textContent = game.won ? 'Vitória' : 'Derrota';
        document.getElementById('attempts-count').textContent = `${game.attempts}/6`;
        
        const attemptsGrid = document.getElementById('attempts-grid');
        attemptsGrid.innerHTML = '';
        
        game.guesses.forEach(guess => {
            const attemptRow = document.createElement('div');
            attemptRow.className = 'attempt-row';
            
            for (let j = 0; j < 5; j++) {
                const tile = document.createElement('div');
                tile.className = 'attempt-tile';
                tile.textContent = guess.word[j];
                tile.classList.add(guess.result[j]);
                attemptRow.appendChild(tile);
            }
            
            attemptsGrid.appendChild(attemptRow);
        });
        
        modalOverlay.classList.add('active');
    }

    function hideGameDetails() {
        modalOverlay.classList.remove('active');
    }

    closeModal.addEventListener('click', hideGameDetails);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            hideGameDetails();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideGameDetails();
        }
    });

    window.addGameToHistory = addNewGame;

    renderGames();
    updateStats();
    
    if (getGameHistory().length === 0) {
        const exampleGames = getExampleGames();
        saveGameHistory(exampleGames);
        renderGames();
        updateStats();
    }
});