import { useRef, useState, useEffect } from 'react';
import './App.css';
import X from './img/X.png';
import O from './img/O.png';
import sound from './sound/music.mp3';

const initialBoard = Array(9).fill({ player: null, image: null });

const App = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [playAgainstComputer, setPlayAgainstComputer] = useState(false);
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [firstTurn, setFirstTurn] = useState('X');

  useEffect(() => {
    if (playAgainstComputer && currentPlayer === 'O' && !winner) {
      setTimeout(() => {
        calculateComputerMove();
      }, 300);
    }
  }, [currentPlayer, playAgainstComputer, winner]);

  const handleRegistration = () => {
    if (player1Name) {
      setIsRegistered(true);
      if (playAgainstComputer) {
        setPlayer2Name('Computer');
      }
    } else {
      alert('Por favor, ingrese el nombre del jugador.');
    }
  };

  const audioRef = useRef(null);
  const handleTogglePlayback = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleClick = (index) => {
    if (!board[index].player && !winner) {
      const newBoard = [...board];
      const image = currentPlayer === 'X' ? `${X}` : `${O}`;
      newBoard[index] = { player: currentPlayer, image };
      setBoard(newBoard);

      checkWinner(newBoard, currentPlayer);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const calculateComputerMove = () => {
    const emptyCells = board.reduce((cells, cell, index) => {
      if (!cell.player) {
        cells.push(index);
      }
      return cells;
    }, []);

    if (emptyCells.length > 0) {
      let computerMove;

      // Check if there is a winning move for the computer
      computerMove = findWinningMove(board, currentPlayer);
      if (computerMove !== null) {
        makeMove(computerMove);
        return;
      }

      // Check if there is a winning move for the player
      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
      computerMove = findWinningMove(board, nextPlayer);
      if (computerMove !== null) {
        makeMove(computerMove);
        return;
      }

      // Make a move in the center if available
      if (emptyCells.includes(4)) {
        makeMove(4);
        return;
      }

      // Make a move in a random empty corner if available
      const corners = [0, 2, 6, 8];
      const emptyCorners = corners.filter((corner) => emptyCells.includes(corner));
      if (emptyCorners.length > 0) {
        const randomCorner = emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
        makeMove(randomCorner);
        return;
      }

      // Make a move in a random empty cell
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      computerMove = emptyCells[randomIndex];
      makeMove(computerMove);
    }
  };

  const findWinningMove = (currentBoard, player) => {
    for (let i = 0; i < currentBoard.length; i++) {
      if (!currentBoard[i].player) {
        const newBoard = [...currentBoard];
        const image = player === 'X' ? `${X}` : `${O}`;
        newBoard[i] = { player, image };
        if (isWinningMove(newBoard, player)) {
          return i;
        }
      }
    }
    return null;
  };

  const isWinningMove = (currentBoard, player) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        currentBoard[a].player === player &&
        currentBoard[b].player === player &&
        currentBoard[c].player === player
      ) {
        return true;
      }
    }

    return false;
  };

  const makeMove = (index) => {
    const newBoard = [...board];
    const image = currentPlayer === 'X' ? `${X}` : `${O}`;
    newBoard[index] = { player: currentPlayer, image };
    setBoard(newBoard);

    checkWinner(newBoard, currentPlayer);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const checkWinner = (board, player) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        board[a].player === player &&
        board[b].player === player &&
        board[c].player === player
      ) {
        setWinner(player === 'X' ? player1Name : player2Name);
        setFirstTurn(player === 'X' ? 'O' : 'X');
        return;
      }
    }

    if (board.every((cell) => cell.player !== null)) {
      setWinner('draw');
      setFirstTurn('X');
    }
  };

  const renderCell = (index) => (
    <div
      className={`cell ${board[index].player && (board[index].player === 'X' ? 'x-turn' : 'o-turn')}`}
      onClick={() => handleClick(index)}
    >
      {board[index].image && <img width={50} src={board[index].image} alt={board[index].player} />}
    </div>
  );

  const resetGame = () => {
    setBoard(initialBoard);
    setWinner(null);
    setCurrentPlayer(firstTurn);
  };

  return (
    <div className="App">
      {!isRegistered ? (
        <div className="registration-form">
          <h2>Regístrate</h2>
          <div className="Form">
            <div>
              <img width={20} src={X} alt="" />
              <input
                type="text"
                placeholder="Jugador uno..."
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                required
              />
            </div>
            {!playAgainstComputer && (
              <div>
                <img width={20} src={O} alt="" />
                <input
                  type="text"
                  placeholder="Jugador dos..."
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <button onClick={() => setPlayAgainstComputer(true)}>Jugar contra la computadora</button>
            </div>
          </div>
          <button onClick={handleRegistration}>Iniciar</button>
        </div>
      ) : (
        <div className="App">
          <h1 className="NameGame">Tic Tac Toe</h1>
          <p className="TurnUser">
            Turno de: <span> {currentPlayer}</span>
          </p>
          <div className="board">{board.map((_, index) => renderCell(index))}</div>
          {winner && (
            <div className="message">
              {winner === 'draw' ? '¡Empate!' : `¡${winner} ha ganado!`}
              <button onClick={resetGame}>Reiniciar</button>
            </div>
          )}
          <audio ref={audioRef} src={sound} autoPlay loop />
          <button className="BtnPauseAndRep" onClick={handleTogglePlayback}>
            {isPlaying ? '||' : '=>'}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
