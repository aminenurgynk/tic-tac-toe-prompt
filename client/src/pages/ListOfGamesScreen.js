// ListOfGamesScreen.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ListOfGamesScreen.scss";

const ListOfGamesScreen = ({ backgroundColor }) => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Retrieve game information from local storage
    const storedGames = localStorage.getItem("gameList");
    const gameList = storedGames ? JSON.parse(storedGames) : [];
    setGames(gameList);
  }, []);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleStartGameClick = () => {
    navigate("/game");
  };

  const renderGameCard = (game) => {
    const { id, name, boardSize, boardBackgroundColor } = game;

    return (
      <div
        key={id}
        className="game-card"
        style={{ backgroundColor: `${boardBackgroundColor}` }}
      >
        <div>{name}</div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: backgroundColor }}>
      <h1>List of Games</h1>
      <div className="game-cards">
        {games.map((game) => renderGameCard(game))}
      </div>
      <button className="secondary-button" onClick={handleBackClick}>
        Back
      </button>
      <button className="button" onClick={handleStartGameClick}>
        Start Game
      </button>
    </div>
  );
};

export default ListOfGamesScreen;
