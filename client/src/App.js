// App.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import GameCreateScreen from './pages/GameCreateScreen';
import ListOfGamesScreen from './pages/ListOfGamesScreen';
import GameScreen from "./pages/GameScreen";

const App = () => {
    const [backgroundColor, setBackgroundColor] = useState('#ffffff'); // Başlangıç rengi beyaz

    return (
        <Routes>
            <Route
                path="/"
                element={<GameCreateScreen backgroundColor={backgroundColor} onColorChange={setBackgroundColor} />}
            />
            <Route path="list_of_games" element={<ListOfGamesScreen backgroundColor={backgroundColor} />} />
            <Route path="game" element={<GameScreen backgroundColor={backgroundColor} />} />
        </Routes>
    );
}

export default App;