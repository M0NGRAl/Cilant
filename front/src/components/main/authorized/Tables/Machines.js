import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider.js";
import Machines_filter from "../Filters/Machines_filter.js";
import '../../../../styles/authorized/Tables/Machines.css'
import {useNavigate} from "react-router-dom";


const Machines = () => {
    const navigate = useNavigate()
    const {userRole, usernameUser, setMachinesData, authFetch} = useContext(AuthContext);
    const [machines, setMachines] = useState([]);
    const [filteredMachines, setFilteredMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('access_token');

            try {
                let machinesData = [];

                if (userRole === 'Клиент') {
                    machinesData = await fetchMachinesForClient(usernameUser, token);
                } else if (userRole === 'Сервисная организация') {
                    machinesData = await fetchMachinesForServiceCompany(usernameUser, token);
                } else if (userRole === 'Менеджер') {
                    machinesData = await fetchMachinesForManager(token)
                } else {
                    throw new Error('Неизвестная роль пользователя');
                }

                const machineNumbers = machinesData.map(m => m.head_machine_No);

                setMachines(machinesData);
                setFilteredMachines(machinesData);
                setMachinesData(machineNumbers);

            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userRole, usernameUser, setMachinesData]);

    const handleFilterChange = (newFilters) => {
        const filtered = machines.filter(machine => {
            return (
                (!newFilters.model || machine.model?.id.toString() === newFilters.model) &&
                (!newFilters.engine || machine.model_engine?.id.toString() === newFilters.engine) &&
                (!newFilters.transmission || machine.model_transmission?.id.toString() === newFilters.transmission) &&
                (!newFilters.drivingAxle || machine.driving_axle?.id.toString() === newFilters.drivingAxle) &&
                (!newFilters.controlledAxle || machine.model_controlled_axle?.id.toString() === newFilters.controlledAxle)
            );
        });
        setFilteredMachines(filtered);
    };

    const fetchMachinesForClient = async (username, token) => {
        try {
            const response = await authFetch(
                'http://127.0.0.1:8000/api/machines/get_by_client/',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({username})
                }
            );

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            console.error('Ошибка при загрузке машин клиента:', err);
            throw err;
        }
    };

    const fetchMachinesForServiceCompany = async (username, token) => {
        try {
            const response = await authFetch(
                'http://127.0.0.1:8000/api/machines/get_by_service_company/',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({username})
                }
            );

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            console.error('Ошибка при загрузке машин сервисной компании:', err);
            throw err;
        }
    };

    const fetchMachinesForManager = async (token) => {
        try {
            const response = await authFetch(
                "http://127.0.0.1:8000/api/machines/",
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            )

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            return await response.json()
        } catch (err) {
            console.error('Ошибка при загрузке машин сервисной компании:', err);
            throw err;
        }
    }

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="machines-container">
            <h2 className="results-heading">Список машин</h2>
            <Machines_filter onFilterChange={handleFilterChange} />

            {filteredMachines.length > 0 ? (
                <div className="table-responsive">
                    <table className="result-table">
                        <thead>
                        <tr>
                            <th>Заводской номер</th>
                            <th>Модель техники</th>
                            <th>Модель двигателя</th>
                            <th>Модель трансмиссии</th>
                            <th>Модель ведущего моста</th>
                            <th>Модель управляемого моста</th>
                            <th>Дата договора поставки</th>
                            <th>Дата отгрузки</th>
                            <th>Получатель</th>
                            <th>Адрес поставки</th>
                            <th>Комплектация</th>
                            <th>Клиент</th>
                            <th>Сервисная компания</th>
                        </tr>
                        </thead>
                        <tbody>
                            {filteredMachines.map(machine => (
                                <tr
                                    key={machine.id}
                                    onClick={() => {
                                        navigate(`machine/${machine.id}`)
                                        console.log('Clicked on machine:', machine.id);
                                    }}
                                    style={{cursor: 'pointer'}}
                                    className="clickable-row"
                                >
                                    <td>{machine.head_machine_No}</td>
                                    <td>{machine.model?.name || 'Н/Д'}</td>
                                    <td>{machine.model_engine?.name || 'Н/Д'}</td>
                                    <td>{machine.model_transmission?.name || 'Н/Д'}</td>
                                    <td>{machine.driving_axle?.name || 'Н/Д'}</td>
                                    <td>{machine.model_controlled_axle?.name || 'Н/Д'}</td>
                                    <td>{machine.delivery_agreement_date}</td>
                                    <td>{machine.date_shipment}</td>
                                    <td>{machine.recipient}</td>
                                    <td>{machine.delivery_address}</td>
                                    <td>{machine.equipment}</td>
                                    <td>{machine.client?.username || 'Н/Д'}</td>
                                    <td>{machine.service_company?.username || 'Н/Д'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-data-message">
                    {machines.length === 0 ? 'Машины не найдены' : 'Нет машин, соответствующих выбранным фильтрам'}
                </p>
            )}
        </div>
    );
}
export default Machines;