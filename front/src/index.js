import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.js'; // Подключаем основной компонент


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);