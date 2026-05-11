use wasm_bindgen::prelude::*;

#[derive(Clone, Copy, PartialEq, Eq)]
enum Cell {
    Empty,
    X,
    O,
}

const WIN_LINES: [[usize; 3]; 8] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

// Function to check for a win
fn check_win(board: &[Cell; 9], player: Cell) -> bool {
    WIN_LINES.iter().any(|[a, b, c]| {
        board[*a] == player && board[*b] == player && board[*c] == player
    })
}

// Function to get available spots on the board
fn available_spots(board: &[Cell; 9]) -> Vec<usize> {
    board.iter().enumerate()
        .filter(|(_, c)| **c == Cell::Empty)
        .map(|(i, _)| i)
        .collect()
}

// Minimax algorithm
fn minimax(board: &[Cell; 9], player: Cell) -> (i32, Option<usize>) {
    // Check for terminal states (win/loss/draw)
    if check_win(board, Cell::O) {
        return (10, None);
    }
    if check_win(board, Cell::X) {
        return (-10, None);
    }
    let spots = available_spots(board);
    if spots.is_empty() {
        return (0, None);
    }

    let mut best_score = if player == Cell::O { i32::MIN } else { i32::MAX };
    let mut best_move = None;

    for &spot in &spots {
        let mut next = *board;
        next[spot] = player;
        let next_player = if player == Cell::O { Cell::X } else { Cell::O };
        let (score, _) = minimax(&next, next_player);

        if player == Cell::O {
            if score > best_score {
                best_score = score;
                best_move = Some(spot);
            }
        } else {
            if score < best_score {
                best_score = score;
                best_move = Some(spot);
            }
        }
    }

    (best_score, best_move)
}

// Game state
#[wasm_bindgen]
pub struct Game {
    board: [Cell; 9],
    active: bool,
    last_ai: i32,
}

#[wasm_bindgen]
impl Game {
    // Function to initialize the game
    #[wasm_bindgen(constructor)]
    pub fn new() -> Game {
        Game {
            board: [Cell::Empty; 9],
            active: true,
            last_ai: -1,
        }
    }

    // Handle user click on a cell
    pub fn human_move(&mut self, index: usize) -> i32 {
        if !self.active || index >= 9 || self.board[index] != Cell::Empty {
            return -1;
        }

        self.board[index] = Cell::X;

        if check_win(&self.board, Cell::X) {
            self.active = false;
            return 1;
        }
        if available_spots(&self.board).is_empty() {
            self.active = false;
            return 2;
        }

        0
    }

    // Minimax makes a move
    pub fn ai_move(&mut self) -> i32 {
        if !self.active {
            return -1;
        }

        let (_, best_move) = minimax(&self.board, Cell::O);
        let spot = match best_move {
            Some(s) => s,
            None => return -1,
        };
        self.board[spot] = Cell::O;
        self.last_ai = spot as i32;

        if check_win(&self.board, Cell::O) {
            self.active = false;
            return 10;
        }
        if available_spots(&self.board).is_empty() {
            self.active = false;
            return 20;
        }

        0
    }

    pub fn last_ai_cell(&self) -> i32 {
        self.last_ai
    }

    pub fn is_active(&self) -> bool {
        self.active
    }
}
