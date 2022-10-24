import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { useHistory } from 'react-router-dom';

import mac from '../assets/mac.png';

import { register } from '../api/api';
import { createNotification } from '../services/notification';
import evaluatePasswordStrength from '../helpers/evaluatePasswordStrength';
import PasswordStrengthBars from '../components/_shared/PasswordStrengthBars';

function Register() {
    const [name, setName] = useState({ value: '', valid: true });
    const [email, setEmail] = useState({ value: '', valid: true });
    const [password, setPassword] = useState({ value: '', valid: true });
    const [passwordRepeat, setPasswordRepeat] = useState({ value: '', valid: true });

    const [passwordStrength, setPasswordStrength] = useState(0);

    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.value !== passwordRepeat.value || !password.valid)
            return console.log(password === passwordRepeat, password.valid);
        console.log('passed requ');

        register(name.value, email.value, password.value)
            .then((res) => {
                if (res.status == 204) {
                    history.push('/login');
                    createNotification({
                        title: 'Udało się!',
                        message: 'Mozesz się teraz zalogować',
                        type: 'success',
                    });
                } else {
                    createNotification({
                        title: 'Ups, podane dane są niepoprawne',
                        message: 'spróbuj jeszcze raz',
                        type: 'danger',
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                createNotification({
                    title: 'Ups, podane dane są niepoprawne',
                    message: 'spróbuj jeszcze raz',
                    type: 'danger',
                });
            });
    };

    const handlePasswordChange = (e) => {
        const passStrength = evaluatePasswordStrength(e.target.value);
        setPasswordStrength(passStrength);
        setPassword({ value: e.target.value, valid: passStrength > 2 });
    };

    const handlePasswordRepeatChange = (e) => {
        setPasswordRepeat({ value: e.target.value, valid: password.value === e.target.value });
    };

    return (
        <div className="single-center-container">
            <div className="login-whole">
                <div className="login-content">
                    <div className="login-texts">
                        <h1>Zarejestuj się</h1>
                        <h4 style={{ marginTop: 30 }}>Zarejestuj się do serwisu,</h4>
                        <p className="smaller">
                            Cieszymy się, że chcesz do nas dołączyć, uzupełnij dane, aby utworzyć nowe konto
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="login-inputs add-sale-inputs-inner">
                            <TextField
                                label="nazwa firmy"
                                variant="outlined"
                                size="small"
                                onChange={(e) => setName({ value: e.target.value, valid: e.target.validity.valid })}
                            />
                            <TextField
                                label="email"
                                variant="outlined"
                                size="small"
                                error={!email.valid}
                                helperText={!email.valid && 'Nieprawidłowy format email'}
                                inputProps={{
                                    type: 'email',
                                }}
                                onChange={(e) => setEmail({ value: e.target.value, valid: e.target.validity.valid })}
                            />
                            <TextField
                                label="hasło"
                                variant="outlined"
                                size="small"
                                type="password"
                                error={!password.valid}
                                onChange={handlePasswordChange}
                            />
                            <PasswordStrengthBars strength={passwordStrength} />
                            <TextField
                                label="powtórz hasło"
                                variant="outlined"
                                size="small"
                                type="password"
                                error={!passwordRepeat.valid}
                                helperText={!passwordRepeat.valid && 'Hasła nie są takie same'}
                                onChange={handlePasswordRepeatChange}
                            />
                            <div style={{ width: 200 }}>
                                <button className="button-primary">zarejestuj mnie</button>
                            </div>
                            <p style={{ marginTop: 10 }} className="smaller">
                                Masz już konto?{' '}
                                <a href="/login">
                                    <b>Zaloguj się</b>
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="login-image-container">
                    <img src={mac} />
                </div>
            </div>
        </div>
    );
}

export default Register;
