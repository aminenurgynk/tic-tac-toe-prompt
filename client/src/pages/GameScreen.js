import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/GameScreen.scss';
import Square from '../components/Square';

const GameScreen = () => {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isXNext, setIsXNext] = useState(true);
  const [gameUserName, setGameUserName] = useState('');
  const [boardSize, setBoardSize] = useState(3);
  const defaultBoardBackgroundColor = '#f0f0f0';
  const [boardBackgroundColor, setBoardBackgroundColor] = useState(localStorage.getItem('boardBackgroundColor') || defaultBoardBackgroundColor);
  const [userInput, setUserInput] = useState('');
  const [isUserTurn, setIsUserTurn] = useState(true);

  useEffect(() => {
    const currentGameId = localStorage.getItem('currentGameId');
    const storedGameList = JSON.parse(localStorage.getItem('gameList')) || [];

    if (storedGameList.length > 0 && currentGameId) {
      const userGameIndex = currentGameId - 1;
      setGameUserName(storedGameList[userGameIndex].name);
      setBoardSize(parseInt(storedGameList[userGameIndex].boardSize.charAt(0), 10));
    } else {
      setGameUserName('');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gameUserName', gameUserName);
  }, [gameUserName]);

  useEffect(() => {
    setBoard(Array(boardSize * boardSize).fill(""));
  }, [boardSize]);

  useEffect(() => {
    const storedBoardBackgroundColor = localStorage.getItem('boardBackgroundColor');
    if (storedBoardBackgroundColor) {
      setBoardBackgroundColor(storedBoardBackgroundColor);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('boardBackgroundColor', boardBackgroundColor);
  }, [boardBackgroundColor]);
  

  const getCurrentUserBackgroundColor = (currentGameId) => {
    const storedGameList = JSON.parse(localStorage.getItem('gameList')) || [];
    const currentUser = storedGameList.find(user => user.id === currentGameId);
    return currentUser ? currentUser.boardBackgroundColor : '#ffffff';
  };

  const handleBackgroundColorChange = () => {
    const currentGameId = localStorage.getItem('currentGameId');
    const backgroundColor = getCurrentUserBackgroundColor(parseInt(currentGameId, 10));
    setBoardBackgroundColor(backgroundColor);
    localStorage.setItem('boardBackgroundColor', backgroundColor);
  };

  const handleInputChange = async (index, value) => {
    if (!board[index] && !calculateWinner(board, boardSize) && isUserTurn) {
      const newBoard = board.slice();
      newBoard[index] = value;
      setBoard(newBoard);
      setIsUserTurn(false);
  
      // Send the user's move to the backend
      await sendBoardToBackend(newBoard);
  
      // localStorage'a tahtanın anlık durumunu kaydet
      saveBoardToLocalStorage(newBoard);

      // Fetch the assistant's move from the backend after a delay
      //setTimeout(fetchAssistantMove, 500);
    }
  };
  
  const sendBoardToBackend = async (currentBoard) => {
    try {
      console.log(`Request................`)
      console.log(currentBoard)
      const response = await fetch('http://localhost:3031/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board: currentBoard,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send board to backend.');
      }
  
      console.log('Board sent to backend successfully.');
      const data = await response.json();
     let payload = data.lastMessage.replace(/'/g, '"')
     payload=payload.substring(
      payload.indexOf("[") , 
      payload.lastIndexOf("]")+1
  );
      // Update the game board with the assistant's move
      console.log(data.lastMessage)
      console.log(payload)
      setBoard( JSON.parse(payload));
      setIsUserTurn(true);
    } catch (error) {
      console.error('Error sending board to backend:', error);
    }
  };
  
  const handleUserInput = () => {
    if (userInput.trim() !== '') {
      try {
        const newBoard = JSON.parse(userInput);
  
        if (Array.isArray(newBoard) && newBoard.length === 9) {
          // Check if all elements in the array are either 'X', 'O', or null
          const validValues = ['X', 'O', null];
          const isValidInput = newBoard.every(value => validValues.includes(value));
  
          if (isValidInput) {
            setBoard(newBoard);
            setIsXNext(!isXNext); // Bu kısım, X ve O'nun sırayla gitmesini sağlar. Gerekirse güncelleyebilirsiniz.
            console.log('New Board State:', newBoard);
          } else {
            alert('Please enter a valid array with the correct values (\'X\', \'O\', or null).');
          }
        } else {
          alert('Please enter an array of length 9.');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Please enter a valid JSON array.');
      }
    } else {
      alert('Please enter a valid input.');
    }
  };
  

  const saveBoardToLocalStorage = (currentBoard) => {
    const currentGameId = localStorage.getItem('currentGameId');
    const storedGameList = JSON.parse(localStorage.getItem('gameList')) || [];

    // Güncel oyunun index'ini bul
    const userGameIndex = storedGameList.findIndex(user => user.id === parseInt(currentGameId, 10));

    // Eğer oyun bulunduysa, tahtanın anlık durumunu güncelle ve localStorage'a kaydet
    if (userGameIndex !== -1) {
      storedGameList[userGameIndex].board = currentBoard;
      localStorage.setItem('gameList', JSON.stringify(storedGameList));
    }
  };

  const handleRestart = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setIsXNext(true);
  };

  useEffect(() => {
    if (userInput.trim() !== '') {
      try {
        const parsedInput = JSON.parse(userInput);

        if (Array.isArray(parsedInput) && parsedInput.length === boardSize * boardSize) {
          parsedInput.forEach((value, index) => {
            if (value === 'X' || value === 'O') {
              handleInputChange(index, value);
            }
          });

          setIsXNext(!isXNext);
        } else {
          alert('Please enter a valid array with the correct length.');
        }
      } catch (error) {
        alert('Please enter a valid JSON array.');
      }
    }
  }, [userInput]);

  const renderSquare = (index) => {
    const squareValue = board[index];
    const squareBackgroundColor = squareValue ? getCurrentUserBackgroundColor(squareValue) : boardBackgroundColor;

    return (
      <Square
        key={index}
        value={squareValue}
        onClick={() => handleInputChange(index, isXNext ? 'X' : 'O')}
        backgroundColor={squareBackgroundColor}
      />
    );
  };

  const winner = calculateWinner(board, boardSize);
  const status = winner ? `Winner: ${winner}` : `Next player: ${isXNext ? 'X' : 'O'}`;

  

  return (
    <div>
      <h1>Tic Tac Toe Game</h1>
      <div>
        <p>Welcome, {gameUserName ? ` ${gameUserName}!` : ' Player!'}</p>
      </div>
      <div className="game-board" style={{ backgroundColor: boardBackgroundColor }}>
        {[...Array(boardSize).keys()].map((row) => (
          <div key={row} className="board-row">
            {[...Array(boardSize).keys()].map((col) => renderSquare(row * boardSize + col))}
          </div>
        ))}
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button className="button" onClick={handleRestart}>
          Restart
        </button>
      </div>
      <Link to="/list_of_games" className="link">
        <button className="secondary-button">Back</button>
      </Link>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], // 1. satır
    [3, 4, 5], // 2. satır
    [6, 7, 8], // 3. satır
    [0, 3, 6], // 1. sütun
    [1, 4, 7], // 2. sütun
    [2, 5, 8], // 3. sütun
    [0, 4, 8], // Ana çapraz
    [2, 4, 6]  // Ters çapraz
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  
  return null;
};

export default GameScreen;