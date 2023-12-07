// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GameCreateScreen from './pages/GameCreateScreen';
import ListOfGamesScreen from './pages/ListOfGamesScreen';
import GameScreen from "./pages/GameScreen";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<GameCreateScreen />} />
            <Route path="list_of_games" element={<ListOfGamesScreen />} />
            <Route path="game" element={<GameScreen />} />
        </Routes>
    );
}

export default App;
