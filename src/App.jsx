import  {useRef, useState } from 'react';
import './App.css';
import X from './img/X.png'
import O from './img/O.png'
import sound from './sound/music.mp3'

const initialBoard = Array(9).fill({ player: null, image: null });

const App = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  const handleRegistration = () => {
    if (player1Name && player2Name) {
      setIsRegistered(true);
    } else {
      alert('Por favor, complete los nombres de ambos jugadores.');
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
  

  const checkWinner = (board, player) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
      [0, 4, 8], [2, 4, 6] // Diagonales
    ];
  
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        board[a].player === player &&
        board[b].player === player &&
        board[c].player === player
      ) {
        if (player1Name && player2Name) {
          setWinner(player === 'X' ? player1Name : player2Name);
        }
        return;
      }
    }
  
    if (board.every(cell => cell.player !== null)) {
      setWinner('draw');
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
    setCurrentPlayer('X');
    setWinner(null);
  };
  

  return (
      <div className="App">
        {!isRegistered ? (
          <div className="registration-form">
            <h2>Registrese</h2>
            <div className='Form'>
           <div>
            <img width={20} src={X} alt="" />
           <input
              type="text"
              placeholder="Player one..."
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              required
            />
           </div>
            <div>
              <img width={20} src={O} alt="" />
            <input
              type="text"
              placeholder="Player two..."
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              required
            />
            </div>
            </div>
            <button  onClick={handleRegistration}>Iniciar</button>
          </div>
        ) : (
          <>
            {<div className="App">
      <h1 className='NameGame'>Tic Tac Toe</h1>
      <p className='TurnUser'>Turno de: <span> {currentPlayer}</span></p>
      <div className="board">
        {board.map((_, index) => renderCell(index))}
      </div>
      {winner && (
        <div className="message">
          {winner === 'draw' ? '¡ Empate !' : `¡  ${winner} ha ganado !`}
          <button onClick={resetGame}>Reiniciar</button>
        </div>
        
      )}
      <audio ref={audioRef} src={sound} autoPlay loop />
     

    </div>}
    <button className='BtnPauseAndRep' onClick={handleTogglePlayback}>
        {isPlaying ? '||' : '=>'}
      </button>

          </>
        )}
      </div>
    );
};

export default App;
