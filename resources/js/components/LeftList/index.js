import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  AlignBottom,
  Book,
  DotGrid,
  Gear,
  Home,
  Newspaper,
  SignOut,
} from 'akar-icons';
import home from '../../assets/home.png';
import boxes from '../../assets/boxes.png';
import warehouse from '../../assets/warehouse.png';
import stats from '../../assets/stats.png';
import list from '../../assets/list.png';
import settings from '../../assets/settings.png';

import logo from '../../assets/logo-small.png';

function LeftList({ logoutUser }) {
  return (
    <div className="left-list">
      <div className="logo-container">
        <img src={logo} />
        <h3>Megazeen</h3>
      </div>
      <div className="left-list-list">
        <ul>
          <NavLink
            exact
            to="/"
            activeClassName="active-left-list"
            className="navigation__item"
          >
            <li>
              <img src={home} alt="" /> <p>Moja sprzedaż</p>
            </li>
          </NavLink>
          <NavLink
            exact
            to="/returns"
            activeClassName="active-left-list"
            className="navigation__item"
          >
            <li>
              <img src={boxes} alt="" /> <p>Zwroty</p>
            </li>
          </NavLink>
          <NavLink
            to="/warehouse"
            activeClassName="active-left-list"
            className="navigation__item"
          >
            <li>
              <img src={warehouse} alt="" /> <p>Magazyn</p>
            </li>
          </NavLink>
          <NavLink
            to="/statistics"
            activeClassName="active-left-list"
            className="navigation__item"
          >
            <li>
              <img src={stats} alt="" /> <p>Statystyki</p>
            </li>
          </NavLink>
          <NavLink
            to="/products"
            activeClassName="active-left-list"
            className="navigation__item"
          >
            <li>
              <img src={list} alt="" /> <p>Produkty</p>
            </li>
          </NavLink>
          <NavLink
            to="/settings"
            activeClassName="active-left-list"
            className="navigation__item"
          >
            <li>
              <img src={settings} alt="" /> <p>Ustawienia</p>
            </li>
          </NavLink>
        </ul>
        <div className="left-list-bottom">
          <a onClick={logoutUser}>
            <SignOut size={24} />
            <p>Wyloguj mnie</p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default LeftList;
