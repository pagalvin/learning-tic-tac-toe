import { type Board, type Player, getAvailableMoves } from './game';

const CORNERS = [0, 2, 6, 8];
const EDGES = [1, 3, 5, 7];

export function chooseMediumMove(
  board: Board,
  computerPlayer: Player,
  humanPlayer: Player,
): number | null {
  const legalMoves = getAvailableMoves(board);
  if (legalMoves.length === 0) {
    return null;
  }

  const winningMove = findImmediateLineMove(board, computerPlayer);
  const blockingMove = findImmediateLineMove(board, humanPlayer);
  const centerMove = legalMoves.includes(4) ? 4 : null;
  const cornerMove = pickRandom(legalMoves.filter((move) => CORNERS.includes(move)));
  const edgeMove = pickRandom(legalMoves.filter((move) => EDGES.includes(move)));

  const strategicMoves = [winningMove, blockingMove, centerMove, cornerMove, edgeMove]
    .filter((move): move is number => move !== null)
    .filter((move, index, arr) => arr.indexOf(move) === index);

  const playStrategicMove = Math.random() < 0.7;
  if (playStrategicMove && strategicMoves.length > 0) {
    return strategicMoves[0];
  }

  return pickRandom(legalMoves);
}

function findImmediateLineMove(board: Board, player: Player): number | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    const values = [board[a], board[b], board[c]];
    const playerMarks = values.filter((value) => value === player).length;
    const emptyCells = line.filter((position) => board[position] === null);

    if (playerMarks === 2 && emptyCells.length === 1) {
      return emptyCells[0];
    }
  }

  return null;
}

function pickRandom(options: number[]): number | null {
  if (options.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}
