export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  isGameOver: boolean;
}

export interface MoveResult {
  state: GameState;
  moved: boolean;
}

const BOARD_LENGTH = 9;
const WINNING_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createGameState(startingPlayer: Player = 'X'): GameState {
  return {
    board: Array.from({ length: BOARD_LENGTH }, () => null),
    currentPlayer: startingPlayer,
    winner: null,
    isDraw: false,
    isGameOver: false,
  };
}

export function getAvailableMoves(board: Board): number[] {
  const moves: number[] = [];
  for (let index = 0; index < board.length; index += 1) {
    if (board[index] === null) {
      moves.push(index);
    }
  }
  return moves;
}

export function playMove(state: GameState, index: number): MoveResult {
  if (!isMoveValid(state, index)) {
    return { state, moved: false };
  }

  const nextBoard = [...state.board];
  nextBoard[index] = state.currentPlayer;

  const winner = getWinner(nextBoard);
  const isDraw = winner === null && getAvailableMoves(nextBoard).length === 0;
  const isGameOver = winner !== null || isDraw;

  return {
    moved: true,
    state: {
      board: nextBoard,
      currentPlayer: isGameOver
        ? state.currentPlayer
        : state.currentPlayer === 'X'
          ? 'O'
          : 'X',
      winner,
      isDraw,
      isGameOver,
    },
  };
}

export function getWinner(board: Board): Player | null {
  for (const [a, b, c] of WINNING_LINES) {
    const first = board[a];
    if (first !== null && first === board[b] && first === board[c]) {
      return first;
    }
  }
  return null;
}

function isMoveValid(state: GameState, index: number): boolean {
  return (
    Number.isInteger(index) &&
    index >= 0 &&
    index < state.board.length &&
    !state.isGameOver &&
    state.board[index] === null
  );
}
