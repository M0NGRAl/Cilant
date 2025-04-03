import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider.js";
import '../../../../styles/authorized/Filters/Filters.css'

const Claims_filter = ({ onFilterChange }) => {
    const { authFetch } = useContext(AuthContext);
    const [filterOptions, setFilterOptions] = useState({
        failure_nodes: [],
        recovery_methods: [],
        service_company: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        failure_node: '',
        recovery_method: '',
        service_company: ''
    });

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [
                    serviceCompaniesResponse,
                    failureNodes,
                    recoveryMethods
                ] = await Promise.all([
                    authFetch('http://127.0.0.1:8000/api/users/get_by_role/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: 'service_company' })
                    }),
                    authFetch('http://127.0.0.1:8000/api/failure-nodes/').then(r => r.json()),
                    authFetch('http://127.0.0.1:8000/api/recovery-methods/').then(r => r.json())
                ]);

                const serviceCompanies = await serviceCompaniesResponse.json();

                setFilterOptions({
                    failure_nodes: failureNodes,
                    recovery_methods: recoveryMethods,
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
            failure_node: '',
            recovery_method: '',
            service_company: ''
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    if (loading) return <div>Загрузка фильтров...</div>;
    if (error) return <div>Ошибка загрузки фильтров: {error}</div>;

    return (
        <div className="claims-filter">
            <h2>Фильтры рекламаций:</h2>

            <div className="filter-row">
                <div className="filter-group">
                    <label>Узел отказа:</label>
                    <select
                        value={filters.failure_node}
                        onChange={(e) => handleFilterChange('failure_node', e.target.value)}
                    >
                        <option value="">Все узлы</option>
                        {filterOptions.failure_nodes.map(node => (
                            <option key={`node-${node.id}`} value={node.id}>
                                {node.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Способ восстановления:</label>
                    <select
                        value={filters.recovery_method}
                        onChange={(e) => handleFilterChange('recovery_method', e.target.value)}
                    >
                        <option value="">Все способы</option>
                        {filterOptions.recovery_methods.map(method => (
                            <option key={`method-${method.id}`} value={method.id}>
                                {method.name}
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
                                {company.user?.username || company.username || 'Н/Д'}
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

export default Claims_filter;