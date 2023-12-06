// ListOfGamesScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ListOfGamesScreen.scss';
import '../components/styles/Button.scss';

const ListOfGamesScreen = ({ backgroundColor }) => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);

    useEffect(() => {
        // Local storage'dan oyun bilgilerini al
        const storedGames = localStorage.getItem('gameList');
        const gameList = storedGames ? JSON.parse(storedGames) : [];
        setGames(gameList);
    }, []);

    const handleBackClick = () => {
        navigate('/');
    };

    const handleStartGameClick = () => {
        navigate('/game');
    };

    const renderGameCard = (game) => {
        const { id, name, boardSize } = game;

        return (
            <div key={id} className="game-card">
                <div>{name}</div>
                <div>{boardSize}</div>
                {/* Diğer oyun bilgileri buraya eklenebilir */}
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
