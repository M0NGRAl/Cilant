import React, { useState, useEffect } from "react";
import '../../../styles/not_authorized/Search_result.css'

const Search_result = ({ factoryNumber }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const requestBody = {
                "head_machine_No": factoryNumber,
            };

            if (factoryNumber) {
                setLoading(true);
                setError(null);
                setNotFound(false);

                try {
                    const response = await fetch(
                        "http://127.0.0.1:8000/api/machines/get_by_head_machine_no/",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(requestBody),
                        }
                    );

                    if (response.status === 404) {
                        setNotFound(true);
                        return;
                    }

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    setData(result);
                } catch (error) {
                    console.error(error);
                    setError(error);
                } finally {
                    setLoading(false);
                }
            } else {
                setData(null);
            }
        };

        fetchData();
    }, [factoryNumber]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error.message}</div>;

    return (
        <div>
            {notFound ? (
                <div className='no-data-message'>Данных о машине с заводским номером {factoryNumber} нет в системе</div>
            ) : data ? (
                <div>
                    <h3 className="results-heading">Результаты поиска:</h3>
                    <table className="result-table">
                        <thead>
                        <tr>
                            <th>Заводской номер</th>
                            <th>Модель техники</th>
                            <th>Модель двигателя</th>
                            <th>Номер двигателя</th>
                            <th>Модель трансмиссии</th>
                            <th>Номер трансмиссии</th>
                            <th>Модель ведущего моста</th>
                            <th>Номер ведущего моста</th>
                            <th>Модель управляемого моста</th>
                            <th>Номер управляемого моста</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{data.head_machine_No}</td>
                            <td>{data.model.name}</td>
                            <td>{data.model_engine.name}</td>
                            <td>{data.engine_No}</td>
                            <td>{data.model_transmission.name}</td>
                            <td>{data.transmission_No}</td>
                            <td>{data.driving_axle.name}</td>
                            <td>{data.axle_No}</td>
                            <td>{data.model_controlled_axle.name}</td>
                            <td>{data.controlled_axle_No}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='no-data-message'>Введите заводской номер для поиска</div>
            )}
        </div>
    )
}

export default Search_result;