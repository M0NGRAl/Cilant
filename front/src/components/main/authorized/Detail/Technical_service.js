import React, {use, useContext, useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../../../context/AuthProvider.js";
import TechnicalServiceView from "../DetailView/TechnicalServiceView.js";
import TechnicalServiceEditForm from "../Edit_forms/TechnicalServiceEditForm.js";

const Technical_service = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const { authFetch, userRole } = useContext(AuthContext);
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const [machines, setMachines] = useState([]);
    const [serviceCompanies, setServiceCompanies] = useState([]);
    const [maintenanceTypes, setMaintenanceTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const serviceResponse = await authFetch(`http://127.0.0.1:8000/api/technical-services/${id}`);
                if (!serviceResponse.ok) throw new Error(`Ошибка сервера: ${serviceResponse.status}`);
                const serviceData = await serviceResponse.json();

                if (!serviceData || !serviceData.type || !serviceData.machine || !serviceData.service_company) {
                    throw new Error('Неполные данные о техническом обслуживании');
                }

                setService(serviceData);
                setFormData({
                    type: serviceData.type?.id || '',
                    machine: serviceData.machine?.id || '',
                    service_company: serviceData.service_company?.id || '',
                    date: serviceData.date || '',
                    operating_time: serviceData.operating_time || 0,
                    order_number: serviceData.order_number || '',
                    date_order: serviceData.date_order || ''
                });

                const [machinesRes, serviceCompaniesRes, serviceTypesRes] = await Promise.all([
                    authFetch('http://127.0.0.1:8000/api/machines/'),
                    authFetch('http://127.0.0.1:8000/api/users/get_by_role/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: 'service_company' })
                    }),
                    authFetch('http://127.0.0.1:8000/api/maintenance-types/')
                ]);

                const machinesData = await machinesRes.json();
                const companiesData = await serviceCompaniesRes.json();
                const typesData = await serviceTypesRes.json();

                if (!machinesData || !companiesData || !typesData) {
                    throw new Error('Ошибка загрузки справочников');
                }

                setMachines(machinesData);
                setServiceCompanies(companiesData);
                setMaintenanceTypes(typesData);
            } catch (err) {
                setError(err.message);
            } finally {
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
        setFormData(prev => ({ ...prev, [name]: parseInt(value) || '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authFetch(`http://127.0.0.1:8000/api/technical-services/${id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type_id: formData.type,
                    machine_id: formData.machine,
                    service_company_id: formData.service_company,
                    date: formData.date,
                    operating_time: formData.operating_time,
                    order_number: formData.order_number,
                    date_order: formData.date_order
                })
            });

            if (!response.ok) throw new Error('Ошибка при обновлении');

            const updatedData = await response.json();
            setService(updatedData);
            setEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const canEdit = ['Менеджер', 'Сервисная организация', "Клиент"].includes(userRole);

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;
    if (!service) return <div>Данные не найдены</div>;

    return (
        <div className='detail-container'>
            {editing ? (
                <div className='edit-form-container'>
                    <TechnicalServiceEditForm
                        formData={formData}
                        machines={machines}
                        serviceCompanies={serviceCompanies}
                        serviceTypes={maintenanceTypes}
                        onInputChange={handleInputChange}
                        onSelectChange={handleSelectChange}
                        onSubmit={handleSubmit}
                        onCancel={() => setEditing(false)}
                    />
                </div>
            ) : (
                <div className='view-container'>
                    <TechnicalServiceView
                        service={service}
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
            )}
        </div>
    );
};

export default Technical_service;