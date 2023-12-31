import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/GameScreen.scss";
import Square from "../components/Square";

const GameScreen = () => {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isXNext, setIsXNext] = useState(true);
  const [gameUserName, setGameUserName] = useState("");
  const [boardSize, setBoardSize] = useState(3);
  const defaultBoardBackgroundColor = "#f0f0f0";
  const [boardBackgroundColor, setBoardBackgroundColor] = useState(
    localStorage.getItem("boardBackgroundColor") || defaultBoardBackgroundColor
  );
  const [userInput, setUserInput] = useState("");
  const [isUserTurn, setIsUserTurn] = useState(true);

  useEffect(() => {
    const currentGameId = localStorage.getItem("currentGameId");
    const storedGameList = JSON.parse(localStorage.getItem("gameList")) || [];

    if (storedGameList.length > 0 && currentGameId) {
      const userGameIndex = currentGameId - 1;
      setGameUserName(storedGameList[userGameIndex].name);
      setBoardSize(
        parseInt(storedGameList[userGameIndex].boardSize.charAt(0), 10)
      );
    } else {
      setGameUserName("");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gameUserName", gameUserName);
  }, [gameUserName]);

  useEffect(() => {
    setBoard(Array(boardSize * boardSize).fill(""));
  }, [boardSize]);

  useEffect(() => {
    const storedBoardBackgroundColor = localStorage.getItem(
      "boardBackgroundColor"
    );
    if (storedBoardBackgroundColor) {
      setBoardBackgroundColor(storedBoardBackgroundColor);
    }
  }, []);

  useEffect(() => {
    const winner = calculateWinner(board, boardSize);
    if (!winner && board.every((e) => e !== null && e !== "")) {
      // If the game ended in a draw
      alert("The game is a draw!");
      handleRestart();
    }
  }, [board, boardSize]);

  const getCurrentUserBackgroundColor = (currentGameId) => {
    const storedGameList = JSON.parse(localStorage.getItem("gameList")) || [];
    const currentUser = storedGameList.find(
      (user) => user.id === currentGameId
    );
    return currentUser ? currentUser.boardBackgroundColor : "#ffffff";
  };

  const handleInputChange = async (index, value) => {
    if (!board[index] && !calculateWinner(board, boardSize) && isUserTurn) {
      const newBoard = board.slice();
      newBoard[index] = value;
      setBoard(newBoard);
      setIsUserTurn(false);

      // Send the user's move to the backend
      await sendBoardToBackend(newBoard);

      // Save the current state of the board to localStorage
      saveBoardToLocalStorage(newBoard);

      // Fetch the assistant's move from the backend after a delay
      //setTimeout(fetchAssistantMove, 500);
    }
  };

  const sendBoardToBackend = async (currentBoard) => {
    try {
      const response = await fetch("http://localhost:3031/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          board: currentBoard,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send board to backend.");
      }

      const data = await response.json();
      let payload = data.lastMessage.replace(/'/g, '"');
      payload = payload.substring(
        payload.indexOf("["),
        payload.lastIndexOf("]") + 1
      );
      // Update the game board with the assistant's move
      setBoard(JSON.parse(payload));
      setIsUserTurn(true);
    } catch (error) {
      console.error("Error sending board to backend:", error);
    }
  };

  const saveBoardToLocalStorage = (currentBoard) => {
    const currentGameId = localStorage.getItem("currentGameId");
    const storedGameList = JSON.parse(localStorage.getItem("gameList")) || [];

    // Find the index of the current game
    const userGameIndex = storedGameList.findIndex(
      (user) => user.id === parseInt(currentGameId, 10)
    );

    // If the game is found, update the current state of the board and save it to localStorage
    if (userGameIndex !== -1) {
      storedGameList[userGameIndex].board = currentBoard;
      localStorage.setItem("gameList", JSON.stringify(storedGameList));
    }
  };

  const handleRestart = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setIsXNext(true);
  };

  useEffect(() => {
    if (userInput.trim() !== "") {
      try {
        const parsedInput = JSON.parse(userInput);

        if (
          Array.isArray(parsedInput) &&
          parsedInput.length === boardSize * boardSize
        ) {
          parsedInput.forEach((value, index) => {
            if (value === "X" || value === "O") {
              handleInputChange(index, value);
            }
          });

          setIsXNext(!isXNext);
        } else {
          alert("Please enter a valid array with the correct length.");
        }
      } catch (error) {
        alert("Please enter a valid JSON array.");
      }
    }
  }, [userInput]);

  const renderSquare = (index) => {
    const squareValue = board[index];
    const squareBackgroundColor = squareValue
      ? getCurrentUserBackgroundColor(squareValue)
      : boardBackgroundColor;

    return (
      <Square
        key={index}
        value={squareValue}
        onClick={() => handleInputChange(index, isXNext ? "X" : "O")}
        backgroundColor={squareBackgroundColor}
      />
    );
  };

  const winner = calculateWinner(board, boardSize);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${isXNext ? "X" : "O"}`;

  return (
    <div>
      <h1>Tic Tac Toe Game</h1>
      <div>
        <p>Welcome, {gameUserName ? ` ${gameUserName}!` : " Player!"}</p>
      </div>
      <div
        className="game-board"
        style={{ backgroundColor: boardBackgroundColor }}
      >
        {[...Array(boardSize).keys()].map((row) => (
          <div key={row} className="board-row">
            {[...Array(boardSize).keys()].map((col) =>
              renderSquare(row * boardSize + col)
            )}
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
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
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
