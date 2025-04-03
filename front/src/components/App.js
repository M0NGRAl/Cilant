import React from "react";
import Header from './Header.js'
import Footer from './Footer.js'
import Not_authorized from "./main/not_authorized/Not_authorized.js";
import Login from "./Login.js";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from "./context/AuthProvider.js";
import Authorized from "./main/authorized/Authorized.js";
import '../styles/App.css'
import Claim from "./main/authorized/Detail/Claim.js";
import Machine from "./main/authorized/Detail/Machine.js";
import Technical_service from "./main/authorized/Detail/Technical_service.js";
import Guides from "./main/authorized/Guides.js";

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className='App'>
                    <Header/>
                    <div className='content'>
                        <Routes>
                            <Route path='/' element={<Not_authorized/>}/>
                            <Route path='login/' element={<Login/>}/>
                            <Route path='authorized/' element={<Authorized/>}/>
                            <Route path='authorized/claim/:id' element={<Claim/>}/>
                            <Route path='authorized/machine/:id' element={<Machine/>}/>
                            <Route path='authorized/technical-service/:id' element={<Technical_service/>}/>
                            <Route path='authorized/guides/' element={<Guides/>}/>
                        </Routes>
                    </div>
                    <Footer/>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;