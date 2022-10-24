import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { updatePassword } from '../../../api/api';
import { createNotification } from '../../../services/notification';

function TabPassword() {
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [passwordOld, setPasswordOld] = useState('');

    const handleSubmit = () => {
        if (password !== passwordRepeat) {
            return createNotification({
                title: 'Coś poszło nie tak',
                message: 'Hasła nie są takie same',
                type: 'danger',
            });
        }

        updatePassword(passwordOld, password)
            .then((res) => {
                createNotification({
                    title: 'Udało się',
                    message: 'Zmiana hasła przebiegła pomyślnie',
                    type: 'success',
                });
            })
            .catch((err) => {
                createNotification({
                    title: 'Coś poszło nie tak',
                    message: 'Upewnij się, że nowe hasło spełnia wymagania silnego hasła',
                    type: 'danger',
                });
            });
    };

    return (
        <div className="settings-tab-general">
            <h4>Zmień hasło</h4>
            <div className="settings-inner-content">
                <TextField
                    label="nowe hasło"
                    variant="outlined"
                    size="small"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    label="powtórz nowe hasło"
                    variant="outlined"
                    size="small"
                    type="password"
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                />
                <TextField
                    label="obecne hasło"
                    variant="outlined"
                    size="small"
                    type="password"
                    onChange={(e) => setPasswordOld(e.target.value)}
                />
                <button className="button-primary" onClick={handleSubmit}>
                    Zapisz zmiany
                </button>
            </div>
        </div>
    );
}

export default TabPassword;
