// Game variables
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let aiMovePending = false; // Track if AI move is pending

// Function to initialize the game
function initializeGame() {
    document.querySelectorAll('.square').forEach(square => {
        square.textContent = ""; // Clear the board
        square.removeEventListener('click', handleCellClick); // Remove old event listeners
        square.addEventListener('click', handleCellClick); // Add new event listener
    });

    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    aiMovePending = false; // Reset AI move pending flag

    document.getElementById('game-status').textContent = "click to play";
    // document.getElementById('try-again-button').style.display = 'none'; // Hide Try Again button
}

// Handle user clicks on a cell
function handleCellClick(event) {
    if (!gameActive || aiMovePending) return; // Ignore clicks if game is not active or AI move is pending

    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.id);

    if (board[clickedCellIndex] !== "") {
        return; // Ignore if the cell is already filled
    }

    updateCell(clickedCell, clickedCellIndex);
    if (checkForWinner()) return; // Check for winner after user's move

    aiMovePending = true; // Set AI move as pending
    setTimeout(() => {
        if (gameActive) handleAiMove(); // Delay AI move slightly
    }, 500);
}

// Update the cell with the current player's move
function updateCell(clickedCell, index) {
    board[index] = currentPlayer;
    clickedCell.textContent = currentPlayer;
}

// Switch the player
function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById('game-status').textContent = `Player ${currentPlayer}'s turn`;
}

// Check for winner
function checkForWinner() {
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            document.getElementById('game-status').textContent = `Player ${currentPlayer} has won!`;
            gameActive = false;
            // document.getElementById('try-again-button').style.display = 'block'; // Show Try Again button
            document.getElementById('try-again-button').classList.add('show'); // Show Try Again button with transition

            return true;
        }
    }

    if (!board.includes("")) {
        document.getElementById('game-status').textContent = "a draw!";
        gameActive = false;
        // document.getElementById('try-again-button').style.display = 'block'; // Show Try Again button
        document.getElementById('try-again-button').classList.add('show'); // Show Try Again button with transition

        return true;
    }

    switchPlayer();
    return false;
}

// AI (Minimax) makes a move
function handleAiMove() {
    if (!gameActive) return;

    let bestMove = minimax(board, currentPlayer).index;
    board[bestMove] = currentPlayer;
    document.getElementById(bestMove).textContent = currentPlayer;

    if (!checkForWinner()) { // Only check if AI move did not end the game
        aiMovePending = false; // AI move is completed
    }
}

// Minimax algorithm
function minimax(board, player) {
    const availableSpots = getAvailableSpots(board);

    // Check for terminal states (win/loss/draw)
    if (checkWin(board, "O")) {
        return { score: 10 }; // AI wins
    } else if (checkWin(board, "X")) {
        return { score: -10 }; // Opponent wins
    } else if (availableSpots.length === 0) {
        return { score: 0 }; // Draw
    }

    // Array to store all possible moves
    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = availableSpots[i];
        board[availableSpots[i]] = player;

        let result;
        if (player === "O") {
            result = minimax(board, "X");
            move.score = result.score;
        } else {
            result = minimax(board, "O");
            move.score = result.score;
        }

        board[availableSpots[i]] = ""; // Undo the move
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

// Function to get available spots on the board
function getAvailableSpots(board) {
    return board.map((val, index) => val === "" ? index : null).filter(val => val !== null);
}

// Function to check for a win
function checkWin(board, player) {
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winningConditions.some(condition => 
        board[condition[0]] === player && 
        board[condition[1]] === player && 
        board[condition[2]] === player
    );
}

// Wait for the start button to be clicked before showing the game
document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    
    // const startScreen = document.getElementById('start-screen')
    // document.getElementById('game-screen').style.display = 'block';
    // startScreen.classList.add('fade-out');

    initializeGame();
});

function hideTryAgainButton() {
    document.getElementById('try-again-button').classList.remove('show');
}

// Try Again button to reset the game after completion
document.getElementById('try-again-button').addEventListener('click', () => {
    hideTryAgainButton();
    initializeGame();
});


document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    document.getElementById('game-container').classList.toggle('dark-theme')
    document.getElementById('trace-path').classList.toggle('dark-theme')

});

document.getElementById('chart').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    document.getElementById('game-container').classList.toggle('dark-theme')
    document.getElementById('trace-path').classList.toggle('dark-theme')

});