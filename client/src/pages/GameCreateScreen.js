// GameCreateScreen.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../components/styles/Button.scss";
import "./styles/GameCreateScreen.scss";

const GameCreateScreen = ({ onBoardColorChange }) => {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState(
    localStorage.getItem("gameUserName") || ""
  );
  const [boardSize, setBoardSize] = useState(
    localStorage.getItem("boardSize") || "3x3"
  );
  const [boardBackgroundColor, setBoardBackgroundColor] = useState(
    localStorage.getItem("boardBackgroundColor") || "#ffffff"
  );

  const handleCreateGame = () => {
    // Get the game list from localStorage
    const gameList = JSON.parse(localStorage.getItem("gameList")) || [];

    // Create the details for a new game
    const newGame = {
      id: gameList.length + 1,
      name: gameName,
      boardSize: boardSize,
      boardBackgroundColor: boardBackgroundColor,
      // Create the details for a new game
    };

    // Add the new game to the game list
    gameList.push(newGame);

    // // Save the game list to localStorage
    localStorage.setItem("gameList", JSON.stringify(gameList));

    // After creating a new game, retrieve the details from local storage and set the userId
    const userGameIndex = newGame.id - 1;
    setGameName(gameList[userGameIndex].name);

    // After creating a new game, retrieve the details from local storage and set the userId
    localStorage.setItem("currentGameId", newGame.id);

    // Redirect to the ListOfGamesScreen after creating the game
    navigate("/list_of_games");

    // Redirect to the ListOfGamesScreen after creating the game
    if (onBoardColorChange && typeof onBoardColorChange === "function") {
      onBoardColorChange(boardBackgroundColor);
    }
  };

  const handleBoardBackgroundColorChange = (event) => {
    setBoardBackgroundColor(event.target.value);
  };

  const handleBoardSizeChange = (event) => {
    setBoardSize(event.target.value);
  };

  return (
    <div
      className="game-create-container"
      style={{
        height: "100vh",
        backgroundImage: `url('../images/tic-tac-toe-1.svg')`,
        backgroundSize: "50%",
      }}
    >
      <h1>Tic Tac Toe</h1>
      <div className="input-group">
        <label htmlFor="gameName">Name:</label>
        <input
          type="text"
          id="gameName"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="boardBackgroundColor">Board Background Color:</label>
        <input
          type="color"
          id="boardBackgroundColor"
          onChange={handleBoardBackgroundColorChange}
          value={boardBackgroundColor}
        />
      </div>
      <button
        type="button"
        className="button btn-create-game"
        onClick={handleCreateGame}
      >
        Create Game
      </button>
    </div>
  );
};

GameCreateScreen.propTypes = {
  onBoardColorChange: PropTypes.func,
};

export default GameCreateScreen;
