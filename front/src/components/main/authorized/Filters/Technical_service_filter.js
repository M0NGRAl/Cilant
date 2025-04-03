import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider.js";
import '../../../../styles/authorized/Filters/Filters.css'

const Technical_service_filter = ({ onFilterChange, }) => {
    const { authFetch, machinesData } = useContext(AuthContext);
    const [filterOptions, setFilterOptions] = useState({
        maintenance_types: [],
        head_machine_No: [],
        service_company: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        maintenance_type: '',
        head_machine_No: '',
        service_company: ''
    });

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [serviceCompaniesResponse, maintenanceTypes] = await Promise.all([
                    authFetch('http://127.0.0.1:8000/api/users/get_by_role/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: 'service_company' })
                    }),
                    authFetch('http://127.0.0.1:8000/api/maintenance-types/').then(r => r.json())
                ]);

                const serviceCompanies = await serviceCompaniesResponse.json();
                const machines = machinesData.map(serialNumber => ({
                    id: serialNumber,
                    serial_number: serialNumber
                }));

                setFilterOptions({
                    maintenance_types: maintenanceTypes,
                    head_machine_No: machines, // Теперь это массив объектов
                    service_company: serviceCompanies
                  });
                setLoading(false);
            } catch (err) {
                console.error('Ошибка загрузки фильтров:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFilterData();
    }, [authFetch, machinesData]);

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
            maintenance_type: '',
            head_machine_No: '',
            service_company: ''
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    if (loading) return <div>Загрузка фильтров...</div>;
    if (error) return <div>Ошибка загрузки фильтров: {error}</div>;

    return (
        <div className="technical-service-filter">
            <h2>Фильтры ТО:</h2>
            <div className="filter-row">
                <div className="filter-group">
                    <label>Тип ТО:</label>
                    <select
                        value={filters.maintenance_type}
                        onChange={(e) => handleFilterChange('maintenance_type', e.target.value)}
                    >
                        <option value="">Все типы</option>
                        {filterOptions.maintenance_types.map(type => (
                            <option key={`maintenance-${type.id}`} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Зав. № машины:</label>
                    <select
                        value={filters.head_machine_No}
                        onChange={(e) => handleFilterChange('head_machine_No', e.target.value)}
                    >
                        <option value="">Все машины</option>
                        {filterOptions.head_machine_No.map(machine => (
                            <option key={`machine-${machine.id}`} value={machine.id}>
                                {machine.serial_number}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Сервисная компания:</label>
                    <select
                        value={filters.service_company}
                        onChange={(e) => handleFilterChange('service_company', e.target.value)}
                    >
                        <option value="">Все компании</option>
                        {filterOptions.service_company.map(company => (
                            <option key={`company-${company.id}`} value={company.id}>
                                {company.username}
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

export default Technical_service_filter;