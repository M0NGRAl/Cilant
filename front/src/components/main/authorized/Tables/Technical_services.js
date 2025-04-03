import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider.js";
import Technical_service_filter from "../Filters/Technical_service_filter.js";
import '../../../../styles/authorized/Tables/Technical_services.css'
import {useNavigate} from "react-router-dom";

const Technical_services = () => {
    const navigate = useNavigate()
    const { userRole, usernameUser, machinesData, authFetch } = useContext(AuthContext);
    const [technicalServices, setTechnicalServices] = useState([]);
    const [filteredTechnicalServices, setFilteredTechnicalServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let services = [];
                const token = localStorage.getItem('access_token');

                if (userRole === 'Клиент') {
                    if (!machinesData?.length) {
                        setTechnicalServices([]);
                        setFilteredTechnicalServices([]);
                        return;
                    }
                    services = await fetchServicesForClient(machinesData, token);
                }
                else if (userRole === 'Сервисная организация') {
                    services = await fetchServicesForServiceCompany(usernameUser, token);
                }
                else if (userRole === 'Менеджер') {
                    services = await fetchServicesForManager(token);
                }
                else {
                    throw new Error('Неизвестная роль пользователя');
                }

                setTechnicalServices(services);
                setFilteredTechnicalServices(services);
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
        const filtered = technicalServices.filter(service => {
            return (
                (!newFilters.maintenance_type || service.type?.id.toString() === newFilters.maintenance_type.toString()) &&
                (!newFilters.head_machine_No || service.machine?.head_machine_No.toString() === newFilters.head_machine_No.toString()) &&
                (!newFilters.service_company || service.service_company?.id.toString() === newFilters.service_company.toString())
            );
        });
        setFilteredTechnicalServices(filtered);
    };

    const fetchServicesForClient = async (machines, token) => {
        const allServices = [];
        for (const machine of machines) {
            try {
                const response = await authFetch(
                    'http://127.0.0.1:8000/api/technical-services/get_by_head_machine_no/',
                    {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ head_machine_No: machine })
                    }
                );
                if (response.ok) allServices.push(...(await response.json()));
            } catch (err) {
                console.error(`Ошибка для машины ${machine}:`, err);
            }
        }
        return allServices;
    };

    const fetchServicesForServiceCompany = async (username, token) => {
        const response = await authFetch(
            'http://127.0.0.1:8000/api/technical-services/get_by_service_company/',
            {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            }
        );
        return response.ok ? await response.json() : [];
    };

    const fetchServicesForManager = async (token) => {
        const response = await authFetch(
            "http://127.0.0.1:8000/api/technical-services/",
            {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            }
        );
        return response.ok ? await response.json() : [];
    };

    if (loading) return <div>Загрузка данных о технических обслуживаниях...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="technical-services-container">
            <h2 className="results-heading">Технические обслуживания</h2>

            <Technical_service_filter
                onFilterChange={handleFilterChange}
                technicalServices={technicalServices}
            />

            {filteredTechnicalServices.length > 0 ? (
                <div className="table-responsive">
                    <table className="result-table">
                        <thead>
                            <tr>
                                <th>Заводской номер</th>
                                <th>Модель техники</th>
                                <th>Тип ТО</th>
                                <th>Дата ТО</th>
                                <th>Наработка, м/час</th>
                                <th>№ заказ-наряда</th>
                                <th>Дата заказ-наряда</th>
                                <th>Сервисная компания</th>
                                <th>Клиент</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTechnicalServices.map(service => (
                                <tr
                                    key={service.id}
                                    onClick={() => {
                                        navigate(`technical-service/${service.id}`);
                                    }}
                                    style={{cursor: 'pointer'}}
                                    className="clickable-row"
                                >
                                    <td>{service.machine?.head_machine_No || 'Н/Д'}</td>
                                    <td>{service.machine?.model?.name || 'Н/Д'}</td>
                                    <td>{service.type?.name || 'Н/Д'}</td>
                                    <td>{service.date || 'Н/Д'}</td>
                                    <td>{service.operating_time || 'Н/Д'}</td>
                                    <td>{service.order_number || 'Н/Д'}</td>
                                    <td>{service.date_order || 'Н/Д'}</td>
                                    <td>{service.service_company.username || 'Н/Д'}</td>
                                    <td>{service.machine?.client?.username || 'Н/Д'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-data-message">
                    {technicalServices.length === 0 ? "Технические обслуживания не найдены" : "Нет результатов по выбранным фильтрам"}
                </p>
            )}
        </div>
    );
};

export default Technical_services;