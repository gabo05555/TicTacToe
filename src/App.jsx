import { useState } from 'react';
import './App.css';

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [isComputerMode, setIsComputerMode] = useState(false);
  const winner = calculateWinner(board);
  const isDraw = !winner && !board.includes(null);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    // If computer mode and it's O's turn next, make computer move
    if (isComputerMode && xIsNext && !calculateWinner(newBoard) && newBoard.includes(null)) {
      setTimeout(() => {
        makeComputerMove(newBoard);
      }, 500); // Delay for better UX
    }
  };

  const makeComputerMove = (currentBoard) => {
    const availableMoves = currentBoard
      .map((cell, index) => cell === null ? index : null)
      .filter(val => val !== null);
    
    if (availableMoves.length === 0) return;

    // Simple AI: Try to win, block player, or pick random
    let move = findWinningMove(currentBoard, 'O'); // Try to win
    if (move === -1) move = findWinningMove(currentBoard, 'X'); // Block player
    if (move === -1) move = availableMoves[Math.floor(Math.random() * availableMoves.length)]; // Random

    const newBoard = [...currentBoard];
    newBoard[move] = 'O';
    setBoard(newBoard);
    setXIsNext(true);
  };

  const findWinningMove = (board, player) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] === player && board[b] === player && board[c] === null) return c;
      if (board[a] === player && board[c] === player && board[b] === null) return b;
      if (board[b] === player && board[c] === player && board[a] === null) return a;
    }
    return -1;
  };

  const resetGame = () => {
    // Update scores if game is over
    if (winner) {
      setScores(prev => ({
        ...prev,
        [winner]: prev[winner] + 1
      }));
    } else if (isDraw) {
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
    }
    
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const resetAll = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setScores({ X: 0, O: 0, draws: 0 });
    setIsComputerMode(false);
  };

  const startComputerGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setIsComputerMode(true);
  };

  return (
    <div className="app-container">
      <div className="game-wrapper">
        {/* Header */}
        <div className="game-header">
          <h1 className="game-title">Tic-Tac-Toe</h1>
          <p className="game-subtitle">Challenge your friends in this classic game!</p>
        </div>

        <div className="game-content">
          {/* Game Board */}
          <div className="game-board-container">
            <div className="game-board">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  className={`cell-btn ${cell === 'X' ? 'cell-x' : cell === 'O' ? 'cell-o' : ''}`}
                  disabled={!!cell || !!winner}
                >
                  {cell}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="game-sidebar">
            {/* Current Turn */}
            <div className="turn-indicator">
              {winner ? (
                <span className="winner-text">
                  🎉 {winner === 'X' ? (isComputerMode ? 'You win!' : 'Player X wins!') : (isComputerMode ? 'Computer wins!' : 'Player O wins!')}
                </span>
              ) : isDraw ? (
                <span className="draw-text">🤝 It's a draw!</span>
              ) : (
                <span className="turn-text">
                  {isComputerMode 
                    ? (xIsNext ? "Your turn (X)" : "Computer's turn (O)") 
                    : `Player ${xIsNext ? 'X' : 'O'}'s turn`}
                </span>
              )}
            </div>

            {/* Score Board */}
            <div className="score-board">
              <h3 className="score-title">Score Board</h3>
              <div className="score-items">
                <div className="score-item player-x">
                  <span className="score-label">{isComputerMode ? 'You' : 'Player X'}</span>
                  <span className="score-value">{scores.X}</span>
                </div>
                <div className="score-item draws">
                  <span className="score-label">Draws</span>
                  <span className="score-value">{scores.draws}</span>
                </div>
                <div className="score-item player-o">
                  <span className="score-label">{isComputerMode ? 'Computer' : 'Player O'}</span>
                  <span className="score-value">{scores.O}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <div className="button-row">
                <button className="btn btn-new-game" onClick={resetGame}>
                  New Game
                </button>
                <button className="btn btn-computer" onClick={startComputerGame}>
                  Play with Computer
                </button>
              </div>
              <button className="btn btn-reset-all btn-full-width" onClick={resetAll}>
                Reset All
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="game-footer">
          <p>Built with React</p>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(cells) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}
