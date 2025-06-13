import React from "react";
import {
    Routes,
    Route,
} from "react-router-dom";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

import Login from "../components/Login/login.jsx";
import Admin from "../components/Administrador/administrador.jsx";
import Usuario from "../components/Usuario/usuario.jsx";

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/proyecto/administrador" element={<Admin/>} />
                <Route path="/proyecto/usuario" element={<Usuario/>}/>
                <Route path="*" element={<h1>RECURSO NO ENCONTRADO</h1>} />
            </Routes>
        </div>
    );
}

export default App;
