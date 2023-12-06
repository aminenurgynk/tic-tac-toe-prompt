// ListOfGamesScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ListOfGamesScreen.scss';
import '../components/styles/Button.scss';

const ListOfGamesScreen = ({ backgroundColor }) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    };

    const handleStartGameClick = () => {
        navigate('/game');
    };

    const players = [
        { name: 'Vudi', result: 'Winner' },
        { name: 'Gargamel', result: 'Looser' },
        { name: 'Dilara', result: 'Winner' },
        { name: 'Feyza', result: 'Winner' },
        { name: 'Ece', result: 'Winner' },
    ];

    const PRIMARY_BUTTON_CLASS = 'primary-button';

    const renderPlayerCard = (player, index) => {
        const { name, result } = player;

        return (
            <div key={index} className="game-card">
                <div>{name}</div>
                <div className={result.toLowerCase()}>{result}</div>
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: backgroundColor }}>
            <h1>List of Games</h1>
            <div className="game-cards">
                {players.map((player, index) => renderPlayerCard(player, index))}
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
