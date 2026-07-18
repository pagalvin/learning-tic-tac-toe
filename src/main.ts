import './style.css';
import { chooseMediumMove } from './ai';
import { createGameState, playMove, type GameState } from './game';

const HUMAN_PLAYER = 'X';
const COMPUTER_PLAYER = 'O';
const COMPUTER_MOVE_DELAY_MS = 420;

const app = document.querySelector<HTMLDivElement>('#app');

if (app === null) {
  throw new Error('App container not found');
}

app.innerHTML = `
  <main class="game-shell">
    <h1>Tic-Tac-Toe</h1>
    <p class="subtitle">You are <strong>${HUMAN_PLAYER}</strong>. The computer is <strong>${COMPUTER_PLAYER}</strong>.</p>
    <p id="status" class="status" role="status" aria-live="polite"></p>
    <div id="board" class="board" role="grid" aria-label="Tic-tac-toe board">
      ${Array.from(
        { length: 9 },
        (_, index) =>
          `<button class="cell" data-index="${index}" role="gridcell" aria-label="Cell ${index + 1}" type="button"></button>`,
      ).join('')}
    </div>
    <button id="restart" class="restart" type="button">Restart Round</button>
  </main>
`;

const boardElement = document.querySelector<HTMLDivElement>('#board');
const statusElement = document.querySelector<HTMLParagraphElement>('#status');
const restartButton = document.querySelector<HTMLButtonElement>('#restart');

if (boardElement === null || statusElement === null || restartButton === null) {
  throw new Error('Game UI elements not found');
}

const board = boardElement;
const status = statusElement;

let game: GameState = createGameState(HUMAN_PLAYER);
let isComputerThinking = false;

board.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  if (isComputerThinking || game.isGameOver || game.currentPlayer !== HUMAN_PLAYER) {
    return;
  }

  const index = Number(target.dataset.index);
  const moveResult = playMove(game, index);
  if (!moveResult.moved) {
    return;
  }

  game = moveResult.state;
  render();

  if (!game.isGameOver && game.currentPlayer === COMPUTER_PLAYER) {
    queueComputerMove();
  }
});

restartButton.addEventListener('click', () => {
  game = createGameState(HUMAN_PLAYER);
  isComputerThinking = false;
  render();
});

function queueComputerMove(): void {
  isComputerThinking = true;
  render();

  window.setTimeout(() => {
    const move = chooseMediumMove(game.board, COMPUTER_PLAYER, HUMAN_PLAYER);
    if (move === null) {
      isComputerThinking = false;
      render();
      return;
    }

    const moveResult = playMove(game, move);
    if (moveResult.moved) {
      game = moveResult.state;
    }

    isComputerThinking = false;
    render();
  }, COMPUTER_MOVE_DELAY_MS);
}

function render(): void {
  const cells = board.querySelectorAll<HTMLButtonElement>('.cell');
  cells.forEach((cell) => {
    const index = Number(cell.dataset.index);
    const value = game.board[index];
    cell.textContent = value ?? '';
    cell.disabled =
      value !== null ||
      game.isGameOver ||
      isComputerThinking ||
      game.currentPlayer !== HUMAN_PLAYER;
  });

  status.textContent = getStatusMessage();
}

function getStatusMessage(): string {
  if (game.winner === HUMAN_PLAYER) {
    return 'You win!';
  }
  if (game.winner === COMPUTER_PLAYER) {
    return 'Computer wins!';
  }
  if (game.isDraw) {
    return "It's a draw.";
  }
  if (isComputerThinking) {
    return 'Computer is thinking...';
  }
  return 'Your turn.';
}

render();
