import React from "react";

const MachineView = ({ machine, onEdit, canEdit }) => {
    return (
        <div className="views-container">

                <div className="view-header">
                    <h2>Информация о машине {machine.head_machine_No}</h2>
                    {canEdit && (
                        <button onClick={onEdit} className="edit-btn">
                            Редактировать
                        </button>
                    )}
                </div>

                <div className="machine-details">

                    <div className="detail-section">
                        <h3>Модель машины</h3>
                        <p><span>Название:</span> {machine.model.name}</p>
                        <p><span>Описание:</span> {machine.model.description}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Двигатель</h3>
                        <p><span>Модель:</span> {machine.model_engine.name}</p>
                        <p><span>Описание:</span> {machine.model_engine.description}</p>
                        <p><span>Заводской номер:</span> {machine.engine_No}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Трансмиссия</h3>
                        <p><span>Модель:</span> {machine.model_transmission.name}</p>
                        <p><span>Описание:</span> {machine.model_transmission.description}</p>
                        <p><span>Заводской номер:</span> {machine.transmission_No}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Ведущий мост</h3>
                        <p><span>Модель:</span> {machine.driving_axle.name}</p>
                        <p><span>Описание:</span> {machine.driving_axle.description}</p>
                        <p><span>Заводской номер:</span> {machine.axle_No}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Управляемый мост</h3>
                        <p><span>Модель:</span> {machine.model_controlled_axle.name}</p>
                        <p><span>Описание:</span> {machine.model_controlled_axle.description}</p>
                        <p><span>Заводской номер:</span> {machine.controlled_axle_No}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Основные параметры</h3>
                        <p><span>Заводской номер машины:</span> {machine.head_machine_No}</p>
                        <p><span>Дата отгрузки:</span> {machine.date_shipment}</p>
                        <p><span>Дата договора поставки:</span> {machine.delivery_agreement_date}</p>
                        <p><span>Получатель:</span> {machine.recipient}</p>
                        <p><span>Адрес доставки:</span> {machine.delivery_address}</p>
                        <p><span>Комплектация:</span> {machine.equipment}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Клиент</h3>
                        <p><span>Имя пользователя:</span> {machine.client.username}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Сервисная компания</h3>
                        <p><span>Название:</span> {machine.service_company.username}</p>
                    </div>
                </div>
            </div>
            );
}

export default MachineView;


