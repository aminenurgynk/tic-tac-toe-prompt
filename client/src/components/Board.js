// components/Board.js
import React from "react";
import "./Board.scss";

const Board = ({ squares, onClick }) => {
  const renderSquare = (index) => (
    <div
      className="grid-cell"
      onClick={() => onClick(index)}
      style={{ backgroundColor: "red" }}
    >
      {squares[index]}
    </div>
  );

  return (
    <div className="game-board">
      {[0, 1, 2].map((row) => (
        <div key={row} className="board-row">
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
};

export default Board;
