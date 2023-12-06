// GameScreen.js
import React, { useState, useEffect } from 'react';
import './styles/GameScreen.scss'; // Stil dosyanızı ekleyin

const GameScreen = ({ backgroundColor }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [gameUserName, setGameUserName] = useState('');

    useEffect(() => {
        // Component yüklendiğinde local storage'dan ismi al ve state'e set et
        const storedUserName = localStorage.getItem('gameUserName');
        if (storedUserName) {
            setGameUserName(storedUserName);
        }
    }, []); // Boş dependency array, sadece bir kere çalışmasını sağlar

    const handleClick = (index) => {
        if (board[index] || calculateWinner(board)) {
            // Hücre zaten doluysa veya oyun bitmişse tıklamayı işleme alma
            return;
        }

        const newBoard = board.slice();
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    const renderSquare = (index) => {
        return (
            <div key={index} className="grid-cell" onClick={() => handleClick(index)}>
                {board[index]}
            </div>
        );
    };

    const winner = calculateWinner(board);
    const status = winner ? `Winner: ${winner}` : `Next player: ${isXNext ? 'X' : 'O'}`;

    return (
        <div style={{ backgroundColor: backgroundColor }}>
            <h1>Tic Tac Toe Game</h1>
            <div>
                <p>Welcome, {gameUserName || 'Player'}!</p>
            </div>
            {/* Oyun tahtası */}
            <div className="game-board">
                {[0, 1, 2].map((row) => (
                    <div key={row} className="board-row">
                        {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
                    </div>
                ))}
            </div>
            <div className="game-info">
                <div>{status}</div>
            </div>
        </div>
    );
}

export default GameScreen;

// Yardımcı fonksiyon: Oyunun kazananını kontrol et
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
