import React from "react";
import '../../../../styles/authorized/DetailView/DetailView.css'
const ClaimView = ({ claim, onEdit, canEdit }) => {
    if (!claim || !claim.machine || !claim.failure_node || !claim.recovery_method) {
        return <div className="loading">Загрузка данных...</div>;
    }

    return (
        <div className="views-container">
            <div className="view-header">
                <h2>Рекламация #{claim.id}</h2>
                {canEdit && (
                    <button onClick={onEdit} className="edit-btn">
                        Редактировать
                    </button>
                )}
            </div>

            <div className="view-details">
                <div className="detail-section">
                    <h3>Основная информация</h3>
                    <p><span>Дата отказа:</span> {claim.failure_date || 'не указана'}</p>
                    <p><span>Наработка, м/час:</span> {claim.operating_time || 'не указана'}</p>
                    <p><span>Описание отказа:</span> {claim.failure_description || 'не указано'}</p>
                    <p><span>Использованные запчасти:</span> {claim.spare_parts_used || 'не указаны'}</p>
                    <p><span>Дата восстановления:</span> {claim.recovery_date || 'не указана'}</p>
                    <p><span>Время простоя (часы):</span> {claim.downtime || 'не указано'}</p>
                </div>

                <div className="detail-section">
                    <h3>Узел отказа</h3>
                    <p><span>Название:</span> {claim.failure_node?.name || 'не указан'}</p>
                    <p><span>Описание:</span> {claim.failure_node?.description || 'нет описания'}</p>
                </div>

                <div className="detail-section">
                    <h3>Способ восстановления</h3>
                    <p><span>Название:</span> {claim.recovery_method?.name || 'не указан'}</p>
                    <p><span>Описание:</span> {claim.recovery_method?.description || 'нет описания'}</p>
                </div>

                <div className="detail-section">
                    <h3>Машина</h3>
                    <p><span>Модель:</span> {claim.machine?.model?.name || 'не указана'}</p>
                    <p><span>Заводской номер:</span> {claim.machine?.head_machine_No || 'не указан'}</p>
                </div>

                {claim.service_company && (
                    <div className="detail-section">
                        <h3>Сервисная компания</h3>
                        <p><span>Название:</span> {claim.service_company?.username || 'не указана'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClaimView;