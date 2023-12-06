// GameScreen.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/GameScreen.scss';

const GameScreen = ({ backgroundColor }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [gameUserName, setGameUserName] = useState('');
    const [boardSize, setBoardSize] = useState(3); // Varsayılan boyut 3x3

    useEffect(() => {
        // Component yüklendiğinde local storage'dan mevcut oyunun id'sini al
        const currentGameId = localStorage.getItem('currentGameId');

        // Component yüklendiğinde local storage'dan ismi al ve state'e set et
        const storedGameList = JSON.parse(localStorage.getItem('gameList')) || [];
        if (storedGameList.length > 0 && currentGameId) {
            // Eğer gameList içinde en az bir oyun varsa, belirtilen oyunun adını kullan
            const userGameIndex = currentGameId - 1;
            setGameUserName(storedGameList[userGameIndex].name);
            setBoardSize(parseInt(storedGameList[userGameIndex].boardSize.charAt(0), 10)); // Board boyutunu güncelle
        } else {
            // Eğer local storage'da oyun yoksa veya currentGameId bulunamazsa, varsayılan olarak boş bir string set et
            setGameUserName('');
        }
    }, []); // Boş dependency array, sadece bir kere çalışmasını sağlar

    useEffect(() => {
        // Kullanıcının adı değiştiğinde, bu değişikliği localStorage'a kaydet
        localStorage.setItem('gameUserName', gameUserName);
    }, [gameUserName]); // gameUserName değiştiğinde çalışır

    useEffect(() => {
        // Board boyutu değiştiğinde, yeni bir tahta oluştur
        setBoard(Array(boardSize * boardSize).fill(null));
    }, [boardSize]);

    const handleClick = (index) => {
        if (board[index] || calculateWinner(board, boardSize)) {
            // Hücre zaten doluysa veya oyun bitmişse tıklamayı işleme alma
            return;
        }

        const newBoard = board.slice();
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);

        // Oyun bitip bitmediğini kontrol et
        const winner = calculateWinner(newBoard, boardSize);
        if (winner) {
            // Oyun bitmişse, kazanan veya kaybeden bilgilerini localStorage'a kaydet
            const result = winner === 'X' ? 'Winner' : 'Looser';
            const gameResult = { name: gameUserName, result: result };
            const gameResults = JSON.parse(localStorage.getItem('gameResults')) || [];
            gameResults.push(gameResult);
            localStorage.setItem('gameResults', JSON.stringify(gameResults));
        } else if (!newBoard.includes(null)) {
            // Oyun berabere bittiyse
            alert('Oyun berabere bitti!');
            handleRestart();
        }
    };

    const handleRestart = () => {
        // Oyunu sıfırla
        setBoard(Array(boardSize * boardSize).fill(null));
        setIsXNext(true);
    };

    const renderSquare = (index) => {
        return (
            <div key={index} className="grid-cell" onClick={() => handleClick(index)}>
                {board[index]}
            </div>
        );
    };

    const winner = calculateWinner(board, boardSize);
    const status = winner ? `Winner: ${winner}` : `Next player: ${isXNext ? 'X' : 'O'}`;

    return (
        <div style={{ backgroundColor: backgroundColor }}>
            <h1>Tic Tac Toe Game</h1>
            <div>
                <p>Welcome, {gameUserName ? ` ${gameUserName}!` : ' Player!'}</p>
            </div>
            {/* Oyun tahtası */}
            <div className="game-board">
                {[...Array(boardSize).keys()].map((row) => (
                    <div key={row} className="board-row">
                        {[...Array(boardSize).keys()].map((col) => renderSquare(row * boardSize + col))}
                    </div>
                ))}
            </div>
            <div className="game-info">
                <div>{status}</div>
                {/* Restart butonu */}
                <button className="secondary-button" onClick={handleRestart}>
                    Restart
                </button>
            </div>
            {/* Back butonu ekleyin */}
            <Link to="/list_of_games">
                <button className="secondary-button">Back</button>
            </Link>
        </div>
    );
};

// Yardımcı fonksiyon: Oyunun kazananını kontrol et
const calculateWinner = (squares, boardSize) => {
    const lines = [];

    // Satır kontrolü
    for (let i = 0; i < boardSize; i++) {
        lines.push([]);
        for (let j = 0; j < boardSize; j++) {
            lines[i].push(i * boardSize + j);
        }
    }

    // Sütun kontrolü
    for (let i = 0; i < boardSize; i++) {
        lines.push([]);
        for (let j = 0; j < boardSize; j++) {
            lines[i + boardSize].push(j * boardSize + i);
        }
    }

    // Çapraz kontrol (sadece kare tahtalarda)
    if (boardSize === boardSize) {
        lines.push([]);
        for (let i = 0; i < boardSize; i++) {
            lines[2 * boardSize].push(i * boardSize + i);
        }

        lines.push([]);
        for (let i = 0; i < boardSize; i++) {
            lines[2 * boardSize + 1].push(i * boardSize + (boardSize - 1 - i));
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const [a, b, c, d, e] = line;
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c] &&
            squares[a] === squares[d] &&
            squares[a] === squares[e]
        ) {
            return squares[a];
        }
    }

    return null;
};

export default GameScreen;
