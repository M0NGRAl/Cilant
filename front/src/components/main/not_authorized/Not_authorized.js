import React, { useState } from "react";
import Search_result from "./Search_result.js";
import '../../../styles/not_authorized/Not_authorized.css'
import map_image from '../../../images/map.png'

const Not_authorized = () => {
    const [factoryNumber, setFactoryNumber] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const handleFactoryNumberChange = (e) => {
        setFactoryNumber(e.target.value);
    };

    const handleSubmit = () => {
        setSearchQuery(factoryNumber);
    };

    return (
        <div className="not_authorized">
            <div className='search-wrapper'>
                <div className='search'>
                    <div className='search-text'>
                        <h2>Проверьте комплектацию и технические
                            <br/>характеристики техники Силант
                            </h2>
                    </div>
                    <div className='search-content'>
                        <div className='search-input'>
                            <label>Заводской номер</label>
                            <input
                                id="factory_number"
                                name="factory_number"
                                value={factoryNumber}
                                onChange={handleFactoryNumberChange}
                            />
                        </div>
                        <div className='button-section'>
                            <button onClick={handleSubmit}>Поиск</button>
                        </div>
                    </div>
                </div>
                <div className='photo-container'>
                    <img src={map_image} alt="Описание фото"/>
                </div>
            </div>
            <div className='search-result'>
                <Search_result factoryNumber={searchQuery}/>
            </div>
        </div>
    );
};

export default Not_authorized;