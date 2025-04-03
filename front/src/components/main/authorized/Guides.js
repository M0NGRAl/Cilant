import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider.js";
import '../../../styles/authorized/Guides.css'

const Guides = () => {
    const navigate = useNavigate();
    const { authFetch } = useContext(AuthContext);
    const [state, setState] = useState({
        loading: true,
        error: null,
        saving: false,
        originalData: null,
        machineModels: [],
        engineModels: [],
        transmissionModels: [],
        driveAxleModels: [],
        controlledAxleModels: [],
        maintenanceTypes: [],
        failureNodes: [],
        recoveryMethods: []
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setState(prev => ({...prev, loading: true}));
            const [
                machineRes, engineRes, transmissionRes,
                driveAxleRes, controlledAxleRes,
                maintenanceRes, failureRes, recoveryRes
            ] = await Promise.all([
                authFetch('http://127.0.0.1:8000/api/machine-models/'),
                authFetch('http://127.0.0.1:8000/api/engine-models/'),
                authFetch('http://127.0.0.1:8000/api/transmission-models/'),
                authFetch('http://127.0.0.1:8000/api/drive-axle-models/'),
                authFetch('http://127.0.0.1:8000/api/controlled-axle-models/'),
                authFetch('http://127.0.0.1:8000/api/maintenance-types/'),
                authFetch('http://127.0.0.1:8000/api/failure-nodes/'),
                authFetch('http://127.0.0.1:8000/api/recovery-methods/')
            ]);

            if (!machineRes.ok) throw new Error('Ошибка загрузки моделей техники');
            if (!engineRes.ok) throw new Error('Ошибка загрузки моделей двигателей');

            const originalData = {
                machineModels: await machineRes.json(),
                engineModels: await engineRes.json(),
                transmissionModels: await transmissionRes.json(),
                driveAxleModels: await driveAxleRes.json(),
                controlledAxleModels: await controlledAxleRes.json(),
                maintenanceTypes: await maintenanceRes.json(),
                failureNodes: await failureRes.json(),
                recoveryMethods: await recoveryRes.json()
            };

            setState({
                ...originalData,
                originalData,
                error: null,
                loading: false
            });
        } catch (err) {
            setState(prev => ({...prev, error: err.message, loading: false}));
        }
    };

    const hasChanges = (modelType, model) => {
        const originalModel = state.originalData[modelType].find(m => m.id === model.id);
        return originalModel.name !== model.name || originalModel.description !== model.description;
    };

    const handleInputChange = (modelType, id, field, value) => {
        setState(prevState => {
            const updatedModels = prevState[modelType].map(model =>
                model.id === id ? { ...model, [field]: value } : model
            );
            return { ...prevState, [modelType]: updatedModels };
        });
    };

    const handleSave = async (modelType, model) => {
        try {
            setState(prev => ({...prev, saving: true}));
            const endpointMap = {
                'machineModels': 'machine-models',
                'engineModels': 'engine-models',
                'transmissionModels': 'transmission-models',
                'driveAxleModels': 'drive-axle-models',
                'controlledAxleModels': 'controlled-axle-models',
                'maintenanceTypes': 'maintenance-types',
                'failureNodes': 'failure-nodes',
                'recoveryMethods': 'recovery-methods'
            };

            const response = await authFetch(`http://127.0.0.1:8000/api/${endpointMap[modelType]}/${model.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(model)
            });

            if (!response.ok) {
                throw new Error('Ошибка при сохранении изменений');
            }

            setState(prevState => ({
                ...prevState,
                originalData: {
                    ...prevState.originalData,
                    [modelType]: prevState[modelType]
                },
                saving: false
            }));
        } catch (err) {
            setState(prev => ({...prev, error: err.message, saving: false}));
        }
    };

    const renderModelGroup = (title, modelType, models) => {
        return (
            <div className="model-group" key={modelType}>
                <h2>{title}</h2>
                {models.map(model => {
                    const hasChanges1 = hasChanges(modelType, model);
                    return (
                        <div key={`${modelType}-${model.id}`} className="model-item">
                            <input
                                type="text"
                                className="model-input model-input-name"
                                value={model.name || ''}
                                onChange={(e) => handleInputChange(modelType, model.id, 'name', e.target.value)}
                            />
                            <input
                                type="text"
                                className="model-input model-input-description"
                                value={model.description || ''}
                                onChange={(e) => handleInputChange(modelType, model.id, 'description', e.target.value)}
                            />
                            {hasChanges1 && (
                                <button
                                    className="save-button"
                                    onClick={() => handleSave(modelType, model)}
                                    disabled={state.saving}
                                >
                                    {state.saving ? 'Сохранение...' : 'Сохранить'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    if (state.loading) return <div className="loading">Загрузка...</div>;
    if (state.error) return <div className="error">Ошибка: {state.error}</div>;

    return (
        <div className="guides-container">
            <div className="header-section">
                <h1>Справочники</h1>
                <button
                    className="home-button"
                    onClick={() => navigate('../authorized/')}
                >
                    На главную
                </button>
            </div>
            {state.saving && <div className="saving-indicator">Сохранение изменений...</div>}

            {renderModelGroup('Модели техники', 'machineModels', state.machineModels)}
            {renderModelGroup('Модели двигателей', 'engineModels', state.engineModels)}
            {renderModelGroup('Модели трансмиссий', 'transmissionModels', state.transmissionModels)}
            {renderModelGroup('Модели ведущих мостов', 'driveAxleModels', state.driveAxleModels)}
            {renderModelGroup('Модели управляемых мостов', 'controlledAxleModels', state.controlledAxleModels)}
            {renderModelGroup('Типы ТО', 'maintenanceTypes', state.maintenanceTypes)}
            {renderModelGroup('Узлы отказа', 'failureNodes', state.failureNodes)}
            {renderModelGroup('Способы восстановления', 'recoveryMethods', state.recoveryMethods)}
        </div>
    );
};

export default Guides;