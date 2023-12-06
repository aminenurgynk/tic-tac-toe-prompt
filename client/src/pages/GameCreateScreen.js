// GameCreateScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/Button.scss';
import './styles/GameCreateScreen.scss';

const GameCreateScreen = ({ backgroundColor, onColorChange }) => {
    const navigate = useNavigate();
    const [gameName, setGameName] = useState(localStorage.getItem('gameUserName') || '');
    const [boardSize, setBoardSize] = useState(localStorage.getItem('boardSize') || '3x3');

    const handleCreateGame = () => {
        // Oyun listesini localStorage'dan al
        const gameList = JSON.parse(localStorage.getItem('gameList')) || [];

        // Yeni oyunun bilgilerini oluştur
        const newGame = {
            id: gameList.length + 1,
            name: gameName,
            boardSize: boardSize,
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
    };

    const handleColorChange = (event) => {
        onColorChange(event.target.value);
    };

    const handleBoardSizeChange = (event) => {
        setBoardSize(event.target.value);
    };

    return (
        <div className="game-create-container" style={{ backgroundColor: backgroundColor, height: '100vh' }}>
            <h1>Create a New Game</h1>
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
                <label htmlFor="backgroundColor">Background Color:</label>
                <select id="backgroundColor" onChange={handleColorChange} value={backgroundColor}>
                    <option value="#ffffff">White</option>
                    <option value="#901010">Red</option>
                    <option value="#003153">Blue</option>
                    <option value="#ff4f00">Orange</option>
                    <option value="#228b22">Green</option>
                    <option value="#2f4f4f">Darkslategray</option>
                    {/* You can add more color options */}
                </select>
            </div>
            <div className="input-group">
                <label htmlFor="boardSize">Board Size:</label>
                <select id="boardSize" onChange={handleBoardSizeChange} value={boardSize}>
                    <option value="3x3">3x3</option>
                    <option value="4x4">4x4</option>
                    <option value="5x5">5x5</option>
                    <option value="6x6">6x6</option>
                </select>
            </div>
            <button type="button" className="button btn-create-game" onClick={handleCreateGame}>
                Create Game
            </button>
        </div>
    );
};

export default GameCreateScreen;
