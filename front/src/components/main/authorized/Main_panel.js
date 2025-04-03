import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider.js";
import '../../../styles/authorized/Main_panel.css';
import { useNavigate } from "react-router-dom";

const Main_panel = () => {
    const navigate = useNavigate();
    const { userRole } = useContext(AuthContext);

    const handleNavigate = () => {
        navigate('guides/');
    };

    return (
        <div className='main-panel-container'>
            <title>Основная панель</title>
            <p className='user-role-badge'>{userRole}</p>
            <p className='main-panel-text'>
                Информация о комплектации и технических <br/>
                характеристиках Вашей техники
            </p>

            {userRole === 'Менеджер' && (
                <button
                    className="manager-button"
                    onClick={handleNavigate}
                >
                    Справочники
                </button>
            )}
        </div>
    );
};

export default Main_panel;