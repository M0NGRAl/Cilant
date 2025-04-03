import React from "react";
import '../styles/Footer.css'
import logo_image from '../images/Header/logo.png'
import tg_image from "../images/Header/TG.png";
const Footer = () => {
    return (
        <footer>
            <div className='footer-logo-section'>
                <img src={logo_image}/>
            </div>
            <div className='footer-imformation'>
                <div className='tg-section'>
                    <p>+7-8352-20-12-08</p>
                    <img src={tg_image}/>
                </div>
                <div className='label'>
                    <p>Мой Силант 2022</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer