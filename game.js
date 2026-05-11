import init, { Game } from './pkg/uncharted_rs.js';

let game;
let currentPlayer = "X";
let gameActive = true;
let aiMovePending = false;

async function initializeGame() {
    if (!game) {
        await init();
    }
    game = new Game();

    document.querySelectorAll('.square').forEach(square => {
        square.textContent = "";
        square.removeEventListener('click', handleCellClick);
        square.addEventListener('click', handleCellClick);
    });

    currentPlayer = "X";
    gameActive = true;
    aiMovePending = false;

    document.getElementById('game-status').textContent = "click to play";
}

function handleCellClick(event) {
    if (!gameActive || aiMovePending) return;

    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.id);

    const status = game.human_move(clickedCellIndex);
    if (status === -1) return;

    clickedCell.textContent = currentPlayer;

    if (status === 1) {
        document.getElementById('game-status').textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;
        document.getElementById('try-again-button').classList.add('show');
        return;
    }

    if (status === 2) {
        document.getElementById('game-status').textContent = "a draw!";
        gameActive = false;
        document.getElementById('try-again-button').classList.add('show');
        return;
    }

    currentPlayer = "O";
    document.getElementById('game-status').textContent = `Player ${currentPlayer}'s turn`;

    aiMovePending = true;
    setTimeout(() => {
        if (gameActive) handleAiMove();
    }, 500);
}

function handleAiMove() {
    if (!gameActive) return;

    const result = game.ai_move();
    const bestMove = game.last_ai_cell();
    document.getElementById(bestMove).textContent = currentPlayer;

    if (result === 10) {
        document.getElementById('game-status').textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;
        document.getElementById('try-again-button').classList.add('show');
    } else if (result === 20) {
        document.getElementById('game-status').textContent = "a draw!";
        gameActive = false;
        document.getElementById('try-again-button').classList.add('show');
    } else {
        currentPlayer = "X";
        document.getElementById('game-status').textContent = `Player ${currentPlayer}'s turn`;
        aiMovePending = false;
    }
}

function hideTryAgainButton() {
    document.getElementById('try-again-button').classList.remove('show');
}

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    initializeGame();
});

document.getElementById('try-again-button').addEventListener('click', () => {
    hideTryAgainButton();
    initializeGame();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    document.getElementById('game-container').classList.toggle('dark-theme');
    document.getElementById('trace-path').classList.toggle('dark-theme');
});

document.getElementById('chart').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    document.getElementById('game-container').classList.toggle('dark-theme');
    document.getElementById('trace-path').classList.toggle('dark-theme');
});
