import React, { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

import useLocalStorage from './hooks/useLocalStorage';

import LeftList from './components/LeftList';
import MySales from './pages/MySales';
import Warehouse from './pages/Warehouse';
import Returns from './pages/Returns';
import Products from './pages/Products';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

import { getUserDetailsGeneral, logout } from './api/api';
import ProtectedRoute from './ProtectedRoute';

import '../sass/app.scss';
import 'animate.css/animate.min.css';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import ConfirmDialog from './components/_shared/ConfirmDialog';

export const AlertContext = createContext();

require('./bootstrap');

function Example() {
    const [isDark, setIsDark] = useLocalStorage('isDark', false);
    const [login, setLogin] = useLocalStorage('login', false);

    useEffect(() => {
        if (isDark === true) {
            document.body.classList.add('dark');
        } else if (isDark === false) {
            document.body.classList.remove('dark');
        }
    });

    const logoutUser = () => {
        logout();
        setLogin(false);
    };

    const theme = createTheme({
        typography: {
            fontFamily: ['Public Sans', 'serif'].join(','),
            fontSize: 12,
        },
        palette: {
            type: 'light',
            primary: {
                main: '#004e89',
                light: '#0071ce',
                dark: '#04263d',
            },
            secondary: {
                main: '#CF4B0A',
            },
        },
    });

    return (
        <section className="container">
            <Router>
                <ThemeProvider theme={theme}>
                    <ReactNotification />
                    <ConfirmDialog />
                    <Switch>
                        <Route path="/login">
                            <Login setLogin={setLogin} isAuth={login} logoutUser={logoutUser} />
                        </Route>
                        <Route path="/register">{login ? <Redirect to={{ pathname: '/' }} /> : <Register />}</Route>
                        <Route path="/">
                            <LeftList logoutUser={logoutUser} />
                            <Switch>
                                <ProtectedRoute path="/" exact component={MySales} isAuth={login} />
                                <ProtectedRoute path="/returns" exact component={Returns} isAuth={login} />
                                <ProtectedRoute path="/warehouse" exact component={Warehouse} isAuth={login} />
                                <ProtectedRoute path="/statistics" exact component={Statistics} isAuth={login} />
                                <ProtectedRoute path="/products" exact component={Products} isAuth={login} />
                                <ProtectedRoute
                                    path="/settings"
                                    exact
                                    component={Settings}
                                    logout={logoutUser}
                                    isAuth={login}
                                    isDark={isDark}
                                    setIsDark={setIsDark}
                                />
                            </Switch>
                        </Route>
                    </Switch>
                </ThemeProvider>
            </Router>
        </section>
    );
}

export default Example;

if (document.getElementById('app')) {
    ReactDOM.render(<Example />, document.getElementById('app'));
}
