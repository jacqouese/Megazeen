import React, { useEffect, useState } from 'react';

function PasswordStrengthBars({ strength }) {
    const [currentStrengthText, setCurrentStrengthText] = useState('');
    const [color, setColor] = useState('#ef5350');
    const strengthText = ['-', 'Bardzo słabe', 'Dość słabe', 'Przeciętne', 'Ponad przeciętne', 'Dość silne', 'Silne'];
    const bars = [];

    useEffect(() => {
        setCurrentStrengthText(strengthText[strength]);

        if (strength <= 2) setColor('#ef5350');
        if (strength > 2 && strength <= 4) setColor('#ff9800');
        if (strength > 4) setColor('#4caf50');
    });

    for (let i = 1; i <= strength; i++) {
        bars.push(<span key={i} className="password-strength-bar" style={{ backgroundColor: color }}></span>);
    }

    return (
        <div className="password-strength-container">
            <div className="password-strength-bars">{bars}</div>
            <div className="password-strength-text">
                <p>{currentStrengthText}</p>
            </div>
        </div>
    );
}

export default PasswordStrengthBars;
