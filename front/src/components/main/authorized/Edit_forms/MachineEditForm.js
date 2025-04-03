import React from "react";
import '../../../../styles/authorized/Edit_forms/Edit_form.css'

const MachineEditForm = ({
    formData,
    models,
    engines,
    transmissions,
    drivingAxles,
    controlledAxles,
    clients,
    serviceCompanies,
    onInputChange,
    onSelectChange,
    onSubmit,
    onCancel
}) => {
    return (
        <form onSubmit={onSubmit} className="edit-form">
            <div className="form-section">
                <h3>Основные данные</h3>
                <label>
                    Модель машины:
                    <select
                        name="model"
                        value={formData.model}
                        onChange={onSelectChange}
                        required
                    >
                        {models.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Модель двигателя:
                    <select
                        name="model_engine"
                        value={formData.model_engine}
                        onChange={onSelectChange}
                        required
                    >
                        {engines.map(engine => (
                            <option key={engine.id} value={engine.id}>
                                {engine.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Заводской номер машины:
                    <input
                        type="text"
                        name="head_machine_No"
                        value={formData.head_machine_No}
                        onChange={onInputChange}
                        required
                    />
                </label>

                <label>
                    Дата отгрузки:
                    <input
                        type="date"
                        name="date_shipment"
                        value={formData.date_shipment}
                        onChange={onInputChange}
                        required
                    />
                </label>
            </div>

            <div className="form-section">
                <h3>Комплектующие</h3>

                <label>
                    Модель трансмиссии:
                    <select
                        name="model_transmission"
                        value={formData.model_transmission}
                        onChange={onSelectChange}
                        required
                    >
                        {transmissions.map(trans => (
                            <option key={trans.id} value={trans.id}>
                                {trans.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Номер трансмиссии:
                    <input
                        type="text"
                        name="transmission_No"
                        value={formData.transmission_No}
                        onChange={onInputChange}
                        required
                    />
                </label>

                <label>
                    Ведущий мост:
                    <select
                        name="driving_axle"
                        value={formData.driving_axle}
                        onChange={onSelectChange}
                        required
                    >
                        {drivingAxles.map(axle => (
                            <option key={axle.id} value={axle.id}>
                                {axle.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Номер ведущего моста:
                    <input
                        type="text"
                        name="axle_No"
                        value={formData.axle_No}
                        onChange={onInputChange}
                        required
                    />
                </label>

                <label>
                    Управляемый мост:
                    <select
                        name="model_controlled_axle"
                        value={formData.model_controlled_axle}
                        onChange={onSelectChange}
                        required
                    >
                        {controlledAxles.map(axle => (
                            <option key={axle.id} value={axle.id}>
                                {axle.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Номер управляемого моста:
                    <input
                        type="text"
                        name="controlled_axle_No"
                        value={formData.controlled_axle_No}
                        onChange={onInputChange}
                        required
                    />
                </label>
            </div>

            <div className="form-section">
                <h3>Дополнительная информация</h3>

                <label>
                    Клиент:
                    <select
                        name="client"
                        value={formData.client}
                        onChange={onSelectChange}
                        required
                    >
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.username}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Сервисная компания:
                    <select
                        name="service_company"
                        value={formData.service_company}
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

                <label>
                    Дата договора поставки:
                    <input
                        type="date"
                        name="delivery_agreement_date"
                        value={formData.delivery_agreement_date}
                        onChange={onInputChange}
                        required
                    />
                </label>

                <label>
                    Получатель:
                    <input
                        name="recipient"
                        value={formData.recipient}
                        onChange={onInputChange}
                        required
                    />
                </label>

                <label>
                    Адрес доставки:
                    <input
                        name="delivery_address"
                        value={formData.delivery_address}
                        onChange={onInputChange}
                        required
                    />
                </label>

                <label>
                    Комплектация:
                    <input
                        name="equipment"
                        value={formData.equipment}
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
)
    ;
};

export default MachineEditForm;