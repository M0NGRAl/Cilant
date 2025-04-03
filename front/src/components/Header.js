import React, {useEffect, useState, useContext} from "react";
import logo_image from '../images/Header/logo.png'
import tg_image from '../images/Header/TG.png'
import '../styles/Header.css'
import {useNavigate} from "react-router-dom";
import {AuthContext} from "./context/AuthProvider.js";


const Header = () => {
    const navigate = useNavigate()
    const {isAuthenticated, logoutUser} = useContext(AuthContext)


    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <header>
            <div className="header-logo-section">
                <img src={logo_image}/>
            </div>
            <div className='header-info'>
                <p>Элекронная сервисная книжка "Мой Силант"</p>
                <div className='tg-section'>
                    <p>+7-8352-20-12-08</p>
                    <img src={tg_image}/>
                </div>
            </div>
            <div className='authorization-section'>
                {isAuthenticated ? (
                    <button onClick={logoutUser}>Выйти</button>
                ) : (
                    <button onClick={handleLoginClick}>Войти</button>
                )}

            </div>
        </header>
    )
}

export default Header