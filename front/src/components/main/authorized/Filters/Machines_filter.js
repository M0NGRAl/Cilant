import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider.js";
import '../../../../styles/authorized/Filters/Filters.css'

const MachinesFilter = ({ onFilterChange }) => {
    const { authFetch } = useContext(AuthContext);
    const [filterOptions, setFilterOptions] = useState({
        models: [],
        engines: [],
        transmissions: [],
        drivingAxles: [],
        controlledAxles: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        model: '',
        engine: '',
        transmission: '',
        drivingAxle: '',
        controlledAxle: ''
    });

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [
                    models,
                    engines,
                    transmissions,
                    drivingAxles,
                    controlledAxles
                ] = await Promise.all([
                    authFetch('http://127.0.0.1:8000/api/machine-models/').then(r => r.json()),
                    authFetch('http://127.0.0.1:8000/api/engine-models/').then(r => r.json()),
                    authFetch('http://127.0.0.1:8000/api/transmission-models/').then(r => r.json()),
                    authFetch('http://127.0.0.1:8000/api/drive-axle-models/').then(r => r.json()),
                    authFetch('http://127.0.0.1:8000/api/controlled-axle-models/').then(r => r.json())
                ]);

                setFilterOptions({
                    models,
                    engines,
                    transmissions,
                    drivingAxles,
                    controlledAxles
                });
            } catch (err) {
                console.error('Ошибка загрузки фильтров:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFilterData();
    }, [authFetch]);

    const handleFilterChange = (filterType, value) => {
        const newFilters = {
            ...filters,
            [filterType]: value
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        const resetFilters = {
            model: '',
            engine: '',
            transmission: '',
            drivingAxle: '',
            controlledAxle: ''
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    if (loading) return <div>Загрузка фильтров...</div>;
    if (error) return <div>Ошибка загрузки фильтров: {error}</div>;

    return (
        <div className="machines-filter">
            <h2>Фильтры машин:</h2>

            <div className="filter-row">
                <div className="filter-group">
                    <label>Модель техники:</label>
                    <select
                        value={filters.model}
                        onChange={(e) => handleFilterChange('model', e.target.value)}
                    >
                        <option value="">Все модели</option>
                        {filterOptions.models.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Модель двигателя:</label>
                    <select
                        value={filters.engine}
                        onChange={(e) => handleFilterChange('engine', e.target.value)}
                    >
                        <option value="">Все двигатели</option>
                        {filterOptions.engines.map(engine => (
                            <option key={engine.id} value={engine.id}>
                                {engine.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Модель трансмиссии:</label>
                    <select
                        value={filters.transmission}
                        onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    >
                        <option value="">Все трансмиссии</option>
                        {filterOptions.transmissions.map(transmission => (
                            <option key={transmission.id} value={transmission.id}>
                                {transmission.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Ведущий мост:</label>
                    <select
                        value={filters.drivingAxle}
                        onChange={(e) => handleFilterChange('drivingAxle', e.target.value)}
                    >
                        <option value="">Все мосты</option>
                        {filterOptions.drivingAxles.map(axle => (
                            <option key={axle.id} value={axle.id}>
                                {axle.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Управляемый мост:</label>
                    <select
                        value={filters.controlledAxle}
                        onChange={(e) => handleFilterChange('controlledAxle', e.target.value)}
                    >
                        <option value="">Все мосты</option>
                        {filterOptions.controlledAxles.map(axle => (
                            <option key={axle.id} value={axle.id}>
                                {axle.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={resetFilters} className="reset-filters-btn">
                    <svg className="reset-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                    </svg>
                    Сбросить фильтры
                </button>
            </div>
        </div>
    );
};

export default MachinesFilter;