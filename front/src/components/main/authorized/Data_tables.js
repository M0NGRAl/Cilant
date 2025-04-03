import React, {useState} from "react";
import Machines from "./Tables/Machines.js";
import Technical_services from "./Tables/Technical_services.js";
import Claims from "./Tables/Claims.js";
import '../../../styles/authorized/Data_tables.css'

const Data_tables = () => {
    const [activeTab, setActiveTab] = useState('machines')
    return (
        <div className='data-tables-container'>
            <p>Таблица с данными</p>
            <div className="data-tables-container-buttons">
                <button
                    className={activeTab === "machines" ? "active" : ""}
                    onClick={() => setActiveTab("machines")}
                >
                    Машины
                </button>
                <button
                    className={activeTab === "technicalservices" ? "active" : ""}
                    onClick={() => setActiveTab("technicalservices")}
                >
                    ТО
                </button>
                <button
                    className={activeTab === "claims" ? "active" : ""}
                    onClick={() => setActiveTab("claims")}
                >
                    Рекламации
                </button>

            </div>
            <div className="data-tables-content">
                {activeTab === "machines" && <Machines/>}
                {activeTab === "technicalservices" && <Technical_services/>}
                {activeTab === "claims" && <Claims/>}
            </div>
        </div>
    )
}

export default Data_tables