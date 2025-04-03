import React from "react";
import '../../../../styles/authorized/Edit_forms/Edit_form.css'

const TechnicalServiceEditForm = ({
    formData = {},
    machines = [],
    serviceCompanies = [],
    serviceTypes = [],
    onInputChange,
    onSelectChange,
    onSubmit,
    onCancel
}) => {
    if (!formData || machines.length === 0 || serviceCompanies.length === 0 || serviceTypes.length === 0) {
        return <div className="loading">Загрузка данных формы...</div>;
    }

    return (
        <form onSubmit={onSubmit} className="edit-form">
            <div className="form-section">
                <h3>Основные данные ТО</h3>

                <label>
                    Тип технического обслуживания:
                    <select
                        name="type"
                        value={formData.type || ''}
                        onChange={onSelectChange}
                        required
                    >

                        {serviceTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Машина:
                    <select
                        name="machine"
                        value={formData.machine || ''}
                        onChange={onSelectChange}
                        required
                    >
                        {machines.map(machine => (
                            <option key={machine.id} value={machine.id}>
                                {machine.model?.name || 'Без модели'} (№{machine.head_machine_No || 'не указан'})
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Сервисная компания:
                    <select
                        name="service_company"
                        value={formData.service_company || ''}
                        onChange={onSelectChange}
                        required
                    >
                        {serviceCompanies.map(company => (
                            <option key={company.id} value={company.id}>
                                {company.username}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="form-section">
                <h3>Параметры обслуживания</h3>

                <label>
                    Дата проведения ТО:
                    <input
                        type="date"
                        name="date"
                        value={formData.date || ''}
                        onChange={onInputChange}
                        required
                    />
                </label>

                <label>
                    Наработка (м/час):
                    <input
                        type="number"
                        name="operating_time"
                        value={formData.operating_time || 0}
                        onChange={onInputChange}
                        required
                        min="0"
                    />
                </label>

                <label>
                    Номер заказ-наряда:
                    <input
                        type="text"
                        name="order_number"
                        value={formData.order_number || ''}
                        onChange={onInputChange}
                        required
                    />
                </label>

                <label>
                    Дата заказ-наряда:
                    <input
                        type="date"
                        name="date_order"
                        value={formData.date_order || ''}
                        onChange={onInputChange}
                        required
                    />
                </label>
            </div>

            <div className="form-actions">
                <button type="submit" className="save-btn">Сохранить</button>
                <button type="button" onClick={onCancel} className="cancel-btn">
                    Отмена
                </button>
            </div>
        </form>
    );
};

export default TechnicalServiceEditForm;