import React, {useEffect, useState} from 'react';
import './App.scss';
import Navbar from "./components/molecules/Navbar/Navbar";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import SmtpConfig from "./components/organisms/SmtpConfig/SmtpConfig";
import Login from "./components/organisms/Login/Login";
import ListDocuments from "./components/organisms/ListDocuments/ListDocuments";
import UserTable from "./components/organisms/UserTable/UserTable";
import ProtectedRoute from "./components/atoms/ProtectedRoute/ProtectedRoute";

interface User {
    role: number;
    email: string;
}

function App() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser) as User;
                if (parsedUser.email && parsedUser.role) {
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error("Error al parsear el usuario desde localStorage:", error);
                setUser(null);
            }
        }
    }, []);

    const handleLogin = (user: User) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const isAdmin = user?.role === 1;
    const isAuthenticated = !!user;

    return (
        <div className="App">
            <Router>
                {isAuthenticated && isAdmin && <Navbar isAdmin={isAdmin} />}
                <div className="main-content">
                    <Routes>
                        {/* Ruta de Login */}
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />

                        {/* Rutas Protegidas para Administradores */}
                        <Route
                            path="/smtp"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true}>
                                    <SmtpConfig />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/usuarios"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true}>
                                    <UserTable />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/documentos"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <ListDocuments email={user?.email} isAdmin={isAdmin} />
                                </ProtectedRoute>
                            }
                        />
                        {/* Ruta por Defecto */}
                        <Route
                            path="/"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/documentos" />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        {/* Rutas No Definidas */}
                        <Route path="*" element={<Navigate to={isAuthenticated ? "/documentos" : "/login"} />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
