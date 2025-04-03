import React from "react";
import Main_panel from "./Main_panel.js";
import Data_tables from "./Data_tables.js";
import '../../../styles/authorized/Authorized.css'
const Authorized = () => {
    return (
        <div className='authorization-container'>
            <Main_panel/>
            <Data_tables/>
        </div>
    )
}

export default Authorized