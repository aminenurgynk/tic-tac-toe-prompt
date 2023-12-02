// src/components/GameCreateScreen/GameCreateScreen.js

import React from 'react';
import './GameCreateScreen.scss';

const GameCreateScreen = () => {
  return (
    <div className="game-create-container">
      <h1>Create a New Game</h1>
      <div className="input-group">
        <label htmlFor="gameName">Game Name:</label>
        <input type="text" id="gameName" />
      </div>
      <div className="input-group">
        <label htmlFor="backgroundColor">Board Background Color:</label>
        <select id="backgroundColor">
          <option value="#ffffff">White</option>
          <option value="#f2f2f2">Light Gray</option>
          <option value="#d9d9d9">Gray</option>
          {/* You can add more color options */}
        </select>
      </div>
      <button className="btn-create-game">Create Game</button>
    </div>
  );
}

export default GameCreateScreen;
