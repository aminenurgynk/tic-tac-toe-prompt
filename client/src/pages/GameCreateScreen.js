// GameCreateScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Eklediğimiz yeni import
import '../components/styles/Button.scss';
import './styles/GameCreateScreen.scss';

const GameCreateScreen = ({ onBoardColorChange }) => {
    const navigate = useNavigate();
    const [gameName, setGameName] = useState(localStorage.getItem('gameUserName') || '');
    const [boardSize, setBoardSize] = useState(localStorage.getItem('boardSize') || '3x3');
    const [boardBackgroundColor, setBoardBackgroundColor] = useState(localStorage.getItem('boardBackgroundColor') || '#ffffff');

    const handleCreateGame = () => {
        // Oyun listesini localStorage'dan al
        const gameList = JSON.parse(localStorage.getItem('gameList')) || [];

        // Yeni oyunun bilgilerini oluştur
        const newGame = {
            id: gameList.length + 1,
            name: gameName,
            boardSize: boardSize,
            boardBackgroundColor: boardBackgroundColor,
            // Diğer oyun bilgileri buraya eklenebilir
        };

        // Yeni oyunu oyun listesine ekle
        gameList.push(newGame);

        // Oyun listesini localStorage'a kaydet
        localStorage.setItem('gameList', JSON.stringify(gameList));

        // Yeni oyun oluşturulduktan sonra, bu oyunun bilgilerini local storage'dan çek ve userId'yi belirle
        const userGameIndex = newGame.id - 1;
        setGameName(gameList[userGameIndex].name);

        // Yeni oyun oluşturulduktan sonra, bu oyunun id'sini local storage'da kaydet
        localStorage.setItem('currentGameId', newGame.id);

        // Oyun oluşturulduktan sonra ListOfGamesScreen'e yönlendir
        navigate('/list_of_games');

        // onBoardColorChange prop'unu kontrol et ve çağır
        if (onBoardColorChange && typeof onBoardColorChange === 'function') {
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
        <div className="game-create-container" style={{ height: '100vh' }}>
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
                <select id="boardBackgroundColor" onChange={handleBoardBackgroundColorChange} value={boardBackgroundColor}>
                    <option value="#ffffff">White</option>
                    <option value="#901010">Red</option>
                    <option value="#003153">Blue</option>
                    <option value="#ff4f00">Orange</option>
                    <option value="#228b22">Green</option>
                    <option value="#2f4f4f">Darkslategray</option>
                    {/* You can add more color options */}
                </select>
            </div>
            <button type="button" className="button btn-create-game" onClick={handleCreateGame}>
                Create Game
            </button>
        </div>
    );
};

GameCreateScreen.propTypes = {
    onBoardColorChange: PropTypes.func,
};

export default GameCreateScreen;
