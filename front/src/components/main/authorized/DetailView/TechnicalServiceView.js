import React from "react";

const TechnicalServiceView = ({ service, onEdit, canEdit }) => {

    if (!service || !service.type || !service.machine || !service.service_company) {
        return <div className="loading">Загрузка данных...</div>;
    }

    return (
        <div className="views-container">
            <div className="view-header">
                <h2>Информация о техническом обслуживании {service.order_number}</h2>
                {canEdit && (
                    <button onClick={onEdit} className="edit-btn">
                        Редактировать
                    </button>
                )}
            </div>

            <div className="view-details">
                <div className="detail-section">
                    <h3>Основная информация</h3>
                    <p><span>Тип ТО:</span> {service.type?.name || 'не указан'}</p>
                    <p><span>Описание ТО:</span> {service.type?.description || 'нет описания'}</p>
                    <p><span>Дата проведения ТО:</span> {service.date || 'не указана'}</p>
                    <p><span>Наработка, м/час:</span> {service.operating_time || 'не указана'}</p>
                    <p><span>Номер заказ-наряда:</span> {service.order_number || 'не указан'}</p>
                    <p><span>Дата заказ-наряда:</span> {service.date_order || 'не указана'}</p>
                </div>

                <div className="detail-section">
                    <h3>Машина</h3>
                    <p><span>Заводской номер:</span> {service.machine?.head_machine_No || 'не указан'}</p>
                    <p><span>Модель:</span> {service.machine?.model?.name || 'не указана'}</p>
                    <p>
                        <span>Двигатель:</span> {service.machine?.model_engine?.name || 'не указан'} (№{service.machine?.engine_No || 'не указан'})
                    </p>
                    <p>
                        <span>Трансмиссия:</span> {service.machine?.model_transmission?.name || 'не указана'} (№{service.machine?.transmission_No || 'не указан'})
                    </p>
                </div>

                <div className="detail-section">
                    <h3>Сервисная компания</h3>
                    <p><span>Название:</span> {service.service_company?.username || 'не указана'}</p>
                </div>

                <div className="detail-section">
                    <h3>Клиент</h3>
                    <p><span>Имя пользователя:</span> {service.machine?.client?.username || 'не указан'}</p>
                </div>
            </div>
        </div>
    );
};

export default TechnicalServiceView;