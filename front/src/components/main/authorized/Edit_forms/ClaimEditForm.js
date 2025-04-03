import React from "react";
import '../../../../styles/authorized/Edit_forms/Edit_form.css'

const ClaimEditForm = ({
    formData = {},
    machines = [],
    failureNodes = [],
    recoveryMethods = [],
    serviceCompanies = [],
    onInputChange,
    onSelectChange,
    onSubmit,
    onCancel
}) => {
    if (!formData || machines.length === 0 || failureNodes.length === 0 || recoveryMethods.length === 0) {
        return <div className="loading">Загрузка данных формы...</div>;
    }

    return (
        <form onSubmit={onSubmit} className="edit-form">
            <div className="form-section">
                <h3>Основные данные</h3>

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
                    Узел отказа:
                    <select
                        name="failure_node"
                        value={formData.failure_node || ''}
                        onChange={onSelectChange}
                        required
                    >
                        {failureNodes.map(node => (
                            <option key={node.id} value={node.id}>
                                {node.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Способ восстановления:
                    <select
                        name="recovery_method"
                        value={formData.recovery_method || ''}
                        onChange={onSelectChange}
                        required
                    >
                        {recoveryMethods.map(method => (
                            <option key={method.id} value={method.id}>
                                {method.name}
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
                <h3>Параметры рекламации</h3>

                <label>
                    Дата отказа:
                    <input
                        type="date"
                        name="failure_date"
                        value={formData.failure_date || ''}
                        onChange={onInputChange}
                        required
                    />
                </label>

                <label>
                    Наработка, м/час:
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
                    Описание отказа:
                    <input
                        name="failure_description"
                        value={formData.failure_description || ''}
                        onChange={onInputChange}
                        required
                    />
                </label>

                <label>
                    Использованные запчасти:
                    <input
                        name="spare_parts_used"
                        value={formData.spare_parts_used || ''}
                        onChange={onInputChange}
                        required
                    />
                </label>

                <label>
                    Дата восстановления:
                    <input
                        type="date"
                        name="recovery_date"
                        value={formData.recovery_date || ''}
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

export default ClaimEditForm;