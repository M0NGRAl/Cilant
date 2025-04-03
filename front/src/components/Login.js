import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthProvider.js';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        try {
            await loginUser(username, password);
            navigate('/authorized/');
        } catch (error) {
            setError(error.message || 'Неверный логин или пароль');
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2 className="title">Вход</h2>
                <div className="input-container">
                    <i className="fas fa-user icon"></i>
                    <input
                        type="text"
                        placeholder="Логин"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="input-container">
                    <i className="fas fa-lock icon"></i>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                    />
                </div>
                {error && <p className="error-message">Неверные логин или пароль</p>} {/* Изменено на p с классом error-message */}
                <button onClick={handleLogin} className="button">Войти</button> {/* Текст кнопки изменен на русский */}
            </div>
        </div>
    );
};

export default Login;