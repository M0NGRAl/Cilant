import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../../../context/AuthProvider.js";
import MachineView from "../DetailView/MachineView.js";
import MachineEditForm from "../Edit_forms/MachineEditForm.js";

const Machine = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const { authFetch, userRole, } = useContext(AuthContext);
    const [machine, setMachine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const [models, setModels] = useState([]);
    const [engines, setEngines] = useState([]);
    const [transmissions, setTransmissions] = useState([]);
    const [drivingAxles, setDrivingAxles] = useState([]);
    const [controlledAxles, setControlledAxles] = useState([]);
    const [clients, setClients] = useState([]);
    const [serviceCompanies, setServiceCompanies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Загружаем данные машины
                const machineResponse = await authFetch(`http://127.0.0.1:8000/api/machines/${id}`);
                if (!machineResponse.ok) throw new Error(`Ошибка сервера: ${machineResponse.status}`);
                const machineData = await machineResponse.json();
                setMachine(machineData);

                // Заполняем форму данными машины
                setFormData({
                    model: machineData.model.id,
                    model_engine: machineData.model_engine.id,
                    model_transmission: machineData.model_transmission.id,
                    driving_axle: machineData.driving_axle.id,
                    model_controlled_axle: machineData.model_controlled_axle.id,
                    client: machineData.client.id,
                    service_company: machineData.service_company.id,
                    head_machine_No: machineData.head_machine_No,
                    engine_No: machineData.engine_No,
                    transmission_No: machineData.transmission_No,
                    axle_No: machineData.axle_No,
                    controlled_axle_No: machineData.controlled_axle_No,
                    delivery_agreement_date: machineData.delivery_agreement_date,
                    date_shipment: machineData.date_shipment,
                    recipient: machineData.recipient,
                    delivery_address: machineData.delivery_address,
                    equipment: machineData.equipment
                });

                const [
                    modelsRes, enginesRes, transmissionsRes,
                    drivingAxlesRes, controlledAxlesRes,
                    clientsRes, serviceCompaniesRes
                ] = await Promise.all([
                    authFetch('http://127.0.0.1:8000/api/machine-models/'),
                    authFetch('http://127.0.0.1:8000/api/engine-models/'),
                    authFetch('http://127.0.0.1:8000/api/transmission-models/'),
                    authFetch('http://127.0.0.1:8000/api/drive-axle-models/'),
                    authFetch('http://127.0.0.1:8000/api/controlled-axle-models/'),
                    authFetch('http://127.0.0.1:8000/api/users/get_by_role/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: 'client' })
                    }),
                    // POST запрос для сервисных компаний с телом
                    authFetch('http://127.0.0.1:8000/api/users/get_by_role/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: 'service_company' })
                    }),
                ]);


                setModels(await modelsRes.json());
                setEngines(await enginesRes.json());
                setTransmissions(await transmissionsRes.json());
                setDrivingAxles(await drivingAxlesRes.json());
                setControlledAxles(await controlledAxlesRes.json());
                setClients(await clientsRes.json());
                setServiceCompanies(await serviceCompaniesRes.json());
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, authFetch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const serverFormatData = {
            model_id: formData.model,
            model_engine_id: formData.model_engine,
            model_transmission_id: formData.model_transmission,
            driving_axle_id: formData.driving_axle,
            model_controlled_axle_id: formData.model_controlled_axle,
            client_id: formData.client,
            service_company_id: formData.service_company,
            head_machine_No: formData.head_machine_No,
            engine_No: formData.engine_No,
            transmission_No: formData.transmission_No,
            axle_No: formData.axle_No,
            controlled_axle_No: formData.controlled_axle_No,
            delivery_agreement_date: formData.delivery_agreement_date,
            date_shipment: formData.date_shipment,
            recipient: formData.recipient,
            delivery_address: formData.delivery_address,
            equipment: formData.equipment
        };
        try {
            const response = await authFetch(`http://127.0.0.1:8000/api/machines/${id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serverFormatData)
            });

            if (!response.ok) throw new Error('Ошибка при обновлении');

            const updatedData = await response.json();
            setMachine(updatedData);
            setEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const canEdit = ['Менеджер'].includes(userRole);

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;
    if (!machine) return <div>Данные не найдены</div>;

    return (
        <div className='detail-container'>
            {editing ? (
                <div className='edit-form-container'>
                    <MachineEditForm
                        formData={formData}
                        models={models}
                        engines={engines}
                        transmissions={transmissions}
                        drivingAxles={drivingAxles}
                        controlledAxles={controlledAxles}
                        clients={clients}
                        serviceCompanies={serviceCompanies}
                        onInputChange={handleInputChange}
                        onSelectChange={handleSelectChange}
                        onSubmit={handleSubmit}
                        onCancel={() => setEditing(false)}
                    />
                </div>
            ) : (
                <div className='view-container'>
                    <MachineView
                        machine={machine}
                        onEdit={() => setEditing(true)}
                        canEdit={canEdit}
                    />
                    <div className='view-container-button-section'>
                        <button
                            onClick={() => navigate('../authorized/')}
                            className="home-btn"
                            >
                            На главную
                        </button>
                    </div>
                </div>
            )
            }
        </div>
)
    ;
};

export default Machine;