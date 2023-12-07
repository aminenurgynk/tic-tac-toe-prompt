// components/Square.js
import React from 'react';
import './styles/Square.scss';

const Square = ({ value, onClick }) => {
    return (
        <div className="grid-cell" onClick={onClick}>
            {value}
        </div>
    );
};

export default Square;
