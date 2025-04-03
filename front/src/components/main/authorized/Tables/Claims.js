import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider.js";
import Claims_filter from "../Filters/Claims_filter.js";
import '../../../../styles/authorized/Tables/Claims.css';
import {useNavigate} from "react-router-dom";
import '../../../../styles/authorized/Tables/Claims.css'
import machine from "../Detail/Machine.js";

const Claims = () => {
    const navigate = useNavigate()
    const { userRole, usernameUser, machinesData, authFetch } = useContext(AuthContext);
    const [claims, setClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('access_token');

            try {
                let claimsData = [];

                if (userRole === 'Клиент') {
                    if (!machinesData?.length) {
                        setClaims([]);
                        setFilteredClaims([]);
                        setLoading(false);
                        return;
                    }
                    claimsData = await fetchClaimsForClient(machinesData, token);
                }
                else if (userRole === 'Сервисная организация') {
                    claimsData = await fetchClaimsForServiceCompany(usernameUser, token);
                }
                else if (userRole === 'Менеджер') {
                    claimsData = await fetchClaimsForManager(token);
                }
                else {
                    throw new Error('Неизвестная роль пользователя');
                }

                setClaims(claimsData);
                setFilteredClaims(claimsData);
            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userRole, usernameUser, machinesData, authFetch]);

    const handleFilterChange = (newFilters) => {
        const filtered = claims.filter(claim => {
            return (
                (!newFilters.failure_node || claim.failure_node?.id.toString() === newFilters.failure_node.toString()) &&
                (!newFilters.recovery_method || claim.recovery_method?.id.toString() === newFilters.recovery_method.toString()) &&
                (!newFilters.service_company || claim.service_company?.id.toString() === newFilters.service_company.toString())
            );
        });
        setFilteredClaims(filtered);
    };

    const fetchClaimsForClient = async (machines, token) => {
        console.log(machines)
        try {
            const requests = machines.map(machine =>
                authFetch('http://127.0.0.1:8000/api/claims/get_by_head_machine_no/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        head_machine_No: machine
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            console.error(`Ошибка для машины ${machine}:`, response.status);
                            return [];
                    }
                    return response.json();
                    })
                    .catch(error => {
                        console.error(`Ошибка запроса для машины ${machine}:`, error);
                        return [];

                })
            );

        const results = await Promise.all(requests);
        return results.flat();
    } catch (err) {
        console.error('Общая ошибка при загрузке рекламаций:', err);
        return [];
    }
};

    const fetchClaimsForServiceCompany = async (username, token) => {
        try {
            const response = await authFetch(
                'http://127.0.0.1:8000/api/claims/get_by_service_company/',
                {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username })
                }
            );
            return response.ok ? await response.json() : [];
        } catch (err) {
            console.error('Ошибка при загрузке рекламаций:', err);
            return [];
        }
    };

    const fetchClaimsForManager = async (token) => {
        try {
            const response = await authFetch(
                "http://127.0.0.1:8000/api/claims/",
                {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                }
            );
            return response.ok ? await response.json() : [];
        } catch (err) {
            console.error('Ошибка при загрузке рекламаций:', err);
            return [];
        }
    };

    if (loading) return <div>Загрузка данных о рекламациях...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="claims-container">
            <h2 className="results-heading">Рекламации</h2>

            <Claims_filter
                onFilterChange={handleFilterChange}
                claims={claims}
            />

            {filteredClaims.length > 0 ? (
                <div className="table-responsive">
                    <table className="result-table">
                        <thead>
                            <tr>
                                <th>Заводской номер</th>
                                <th>Модель техники</th>
                                <th>Дата отказа</th>
                                <th>Узел отказа</th>
                                <th>Описание отказа</th>
                                <th>Способ восстановления</th>
                                <th>Используемые запчасти</th>
                                <th>Дата восстановления</th>
                                <th>Время простоя</th>
                                <th>Сервисная компания</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClaims.map(claim => (
                                <tr
                                    key={claim.id}
                                    onClick={() => {
                                        navigate(`claim/${claim.id}`);
                                    }}
                                    style={{cursor: 'pointer'}}
                                    className="clickable-row"
                                >
                                    <td>{claim.machine?.head_machine_No ?? 'Н/Д'}</td>
                                    <td>{claim.machine?.model?.name ?? 'Н/Д'}</td>
                                    <td>{claim.failure_date ? new Date(claim.failure_date).toLocaleDateString() : 'Н/Д'}</td>
                                    <td>{claim.failure_node?.name ?? 'Н/Д'}</td>
                                    <td>{claim.failure_description ?? 'Н/Д'}</td>
                                    <td>{claim.recovery_method?.name ?? 'Н/Д'}</td>
                                    <td>{claim.spare_parts_used ?? 'Н/Д'}</td>
                                    <td>{claim.recovery_date ? new Date(claim.recovery_date).toLocaleDateString() : 'Н/Д'}</td>
                                    <td>{claim.downtime ? `${claim.downtime} ч` : 'Н/Д'}</td>
                                    <td>{claim.service_company?.user?.username ?? claim.service_company?.username ?? 'Н/Д'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-data-message">
                    {claims.length === 0 ? "Рекламации не найдены" : "Нет результатов по выбранным фильтрам"}
                </p>
            )}
        </div>
    );
};

export default Claims;