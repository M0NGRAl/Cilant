import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../../../context/AuthProvider.js";
import ClaimView from "../DetailView/ClaimView.js";
import ClaimEditForm from "../Edit_forms/ClaimEditForm.js";
import '../../../../styles/authorized/Detail/Detail.css'

const Claim = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const { authFetch, userRole } = useContext(AuthContext);
    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const [machines, setMachines] = useState([]);
    const [failureNodes, setFailureNodes] = useState([]);
    const [recoveryMethods, setRecoveryMethods] = useState([]);
    const [serviceCompanies, setServiceCompanies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const claimResponse = await authFetch(`http://127.0.0.1:8000/api/claims/${id}`);
                if (!claimResponse.ok) throw new Error(`Ошибка сервера: ${claimResponse.status}`);
                const claimData = await claimResponse.json();

                if (!claimData || !claimData.machine || !claimData.failure_node || !claimData.recovery_method) {
                    throw new Error('Неполные данные о рекламации');
                }

                setClaim(claimData);
                setFormData({
                    machine: claimData.machine.id,
                    failure_node: claimData.failure_node.id,
                    recovery_method: claimData.recovery_method.id,
                    service_company: claimData.service_company.id,
                    failure_date: claimData.failure_date,
                    operating_time: claimData.operating_time,
                    failure_description: claimData.failure_description,
                    spare_parts_used: claimData.spare_parts_used,
                    recovery_date: claimData.recovery_date
                });

                // Загрузка справочников
                const [machinesRes, failureNodesRes, recoveryMethodsRes, serviceCompaniesRes] = await Promise.all([
                    authFetch('http://127.0.0.1:8000/api/machines/'),
                    authFetch('http://127.0.0.1:8000/api/failure-nodes/'),
                    authFetch('http://127.0.0.1:8000/api/recovery-methods/'),
                    authFetch('http://127.0.0.1:8000/api/users/get_by_role/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: 'service_company' })
                    })
                ]);

                setMachines(await machinesRes.json());
                setFailureNodes(await failureNodesRes.json());
                setRecoveryMethods(await recoveryMethodsRes.json());
                setServiceCompanies(await serviceCompaniesRes.json());
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
            const response = await authFetch(`http://127.0.0.1:8000/api/claims/${id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    machine_id: formData.machine,
                    failure_node_id: formData.failure_node,
                    recovery_method_id: formData.recovery_method,
                    service_company_id: formData.service_company,
                    failure_date: formData.failure_date,
                    operating_time: formData.operating_time,
                    failure_description: formData.failure_description,
                    spare_parts_used: formData.spare_parts_used,
                    recovery_date: formData.recovery_date
                })
            });

            console.log(JSON.stringify({
                    machine_id: formData.machine,
                    failure_node_id: formData.failure_node,
                    recovery_method_id: formData.recovery_method,
                    service_company_id: formData.service_company,
                    failure_date: formData.failure_date,
                    operating_time: formData.operating_time,
                    failure_description: formData.failure_description,
                    spare_parts_used: formData.spare_parts_used,
                    recovery_date: formData.recovery_date
                }))


            if (!response.ok) throw new Error('Ошибка при обновлении');

            const updatedData = await response.json();
            setClaim(updatedData);
            setEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const canEdit = ['Менеджер', 'Сервисная организация'].includes(userRole);

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;
    if (!claim) return <div>Данные не найдены</div>;

    return (
        <div className='detail-container'>
            {editing ? (
                <div className='edit-form-container'>
                    <ClaimEditForm
                        formData={formData}
                        machines={machines}
                        failureNodes={failureNodes}
                        recoveryMethods={recoveryMethods}
                        serviceCompanies={serviceCompanies}
                        onInputChange={handleInputChange}
                        onSelectChange={handleSelectChange}
                        onSubmit={handleSubmit}
                        onCancel={() => setEditing(false)}
                />
                </div>
            ) : (
                <div className='view-container'>
                    <ClaimView
                        claim={claim}
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

export default Claim;