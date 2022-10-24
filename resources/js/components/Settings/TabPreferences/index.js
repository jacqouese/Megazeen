import { MoonFill, SunFill } from 'akar-icons';
import React from 'react';

function TabPreferences({ isDark, setIsDark }) {
  return (
    <div className="settings-tab-general">
      <h4>Dostosuj preferencje</h4>
      <div className="settings-inner-content">
        dark mode
        <button className="button-primary" onClick={() => setIsDark(!isDark)}>
          {isDark ? (
            <SunFill size={16} color="#fff" />
          ) : (
            <MoonFill size={16} color="#fff" />
          )}
        </button>
        <button className="button-primary">Zapisz zmiany</button>
      </div>
    </div>
  );
}

export default TabPreferences;
