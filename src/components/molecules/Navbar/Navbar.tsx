import React, {FC} from 'react';
import "./Navbar.scss";
import {Link, useNavigate} from "react-router-dom";

interface NavbarProps {
    isAdmin?: boolean;
}

const Navbar: FC<NavbarProps> = ({isAdmin}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <h2>Firmador EC</h2>
                </div>
                <ul className="navbar-menu">
                    {isAdmin && (
                        <>
                            <li className="navbar-item">
                                <Link to="/smtp" className="navbar-link">Configuración SMTP</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/usuarios" className="navbar-link">Administración de Usuarios</Link>
                            </li>
                        </>
                    )}
                    <li className="navbar-item">
                        <Link to="/documentos" className="navbar-link">
                            {isAdmin ? "Administración de Documentos" : "Documentos"}
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
