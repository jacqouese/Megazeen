import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { TextField } from '@mui/material';

import LoadingDots from '../components/_shared/LoadingDots';
import mac from '../assets/mac.png';

import { login, sanctum } from '../api/api';
import { createNotification } from '../services/notification';

function Login({ setLogin, isAuth, logoutUser }) {
    const [email, setEmail] = useState({ value: '', valid: true });
    const [password, setPassword] = useState({ value: '', valid: true });

    const [loading, setLoading] = useState(false);

    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        sanctum()
            .then(() => {
                login(email.value, password.value)
                    .then((res) => {
                        if (res.status === 200) {
                            setLogin(true);
                            setLoading(false);
                            history.push('/');
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        createNotification({
                            title: 'Ups, podane dane są niepoprawne',
                            message: 'spróbuj jeszcze raz',
                            type: 'danger',
                        });
                        setLoading(false);
                    });
            })
            .catch((err) => {
                console.log(err);
                createNotification({
                    title: 'Ups, coś jest nie tak',
                    message: 'spróbuj jeszcze raz',
                    type: 'danger',
                });
                setLoading(false);
            });
    };

    const handleEmailChange = (e) => {
        setEmail({ value: e.target.value, valid: e.target.validity.valid });
    };

    const handlePasswordChange = (e) => {
        setPassword({ value: e.target.value, valid: true });
    };

    useEffect(() => {
        if (isAuth) logoutUser();
    }, []);

    return (
        <div className="single-center-container">
            <div className="login-whole">
                <div className="login-content">
                    <div className="login-texts">
                        <h1>Zaloguj się</h1>
                        <h4 style={{ marginTop: 30 }}>Zaloguj się do serwisu</h4>
                        <p className="smaller">Miło Cię znowu widzieć, podaj swoje dane aby się zalogować</p>
                    </div>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="login-inputs add-sale-inputs-inner">
                            <TextField
                                label="email"
                                variant="outlined"
                                size="small"
                                error={!email.valid}
                                helperText={!email.valid && 'Nieprawidłowy format email'}
                                inputProps={{
                                    type: 'email',
                                }}
                                onChange={handleEmailChange}
                            />
                            <TextField
                                label="hasło"
                                variant="outlined"
                                size="small"
                                type="password"
                                onChange={handlePasswordChange}
                            />
                            <div style={{ width: 200 }}>
                                <button type="submit" className="button-primary">
                                    {' '}
                                    {loading ? <LoadingDots /> : 'loguj'}{' '}
                                </button>
                            </div>
                            <p style={{ marginTop: 10 }} className="smaller">
                                Nie masz jeszcze konta?{' '}
                                <a href="/register">
                                    <b>Zarejestuj się</b>
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="login-image-container">
                    <img src={mac} alt="" />
                </div>
            </div>
        </div>
    );
}

export default Login;
