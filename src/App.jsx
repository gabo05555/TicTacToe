import { useState } from 'react';
import './App.css';

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const winner = calculateWinner(board);
  const isDraw = !winner && !board.includes(null);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
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
                <span className="winner-text">🎉 Player {winner} wins!</span>
              ) : isDraw ? (
                <span className="draw-text">🤝 It's a draw!</span>
              ) : (
                <span className="turn-text">Player {xIsNext ? 'X' : 'O'}'s turn</span>
              )}
            </div>

            {/* Score Board */}
            <div className="score-board">
              <h3 className="score-title">Score Board</h3>
              <div className="score-items">
                <div className="score-item player-x">
                  <span className="score-label">Player X</span>
                  <span className="score-value">{scores.X}</span>
                </div>
                <div className="score-item draws">
                  <span className="score-label">Draws</span>
                  <span className="score-value">{scores.draws}</span>
                </div>
                <div className="score-item player-o">
                  <span className="score-label">Player O</span>
                  <span className="score-value">{scores.O}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn btn-new-game" onClick={resetGame}>
                New Game
              </button>
              <button className="btn btn-reset-all" onClick={resetAll}>
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
