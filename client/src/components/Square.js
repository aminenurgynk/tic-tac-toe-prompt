// components/Square.js
import React from "react";
import "./styles/Square.scss";

const Square = ({ value, onClick, backgroundColor }) => {
  const currentGameId = parseInt(localStorage.getItem(`currentGameId`));
  const gameList = JSON.parse(localStorage.getItem(`gameList`));

  const bgcolor = gameList[currentGameId - 1].boardBackgroundColor;
  return (
    <div
      className="grid-cell"
      onClick={onClick}
      style={{ backgroundColor: bgcolor }}
    >
      {value}
    </div>
  );
};

export default Square;
