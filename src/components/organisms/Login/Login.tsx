import React, {FC, useEffect, useState} from 'react';
import Input from "../../atoms/Input/Input";
import {FaEnvelope} from "react-icons/fa";
import './Login.scss';
import Button from "../../atoms/Button/Button";
import Link from "../../atoms/Link/Link";
import LabelLink from "../../molecules/LabelLink/LabelLink";
import Label from "../../atoms/Label/Label";
import Registrer from "../Register/Registrer";
import PasswordRecovery from "../PasswordRecovery/PasswordRecovery";
import {Errors, validateField } from "../../../types/validation";
import {authenticateUser, authenticateWithToken} from "../../../api/UserService";
import Verification from "../Verification/Verification";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ListDocuments from "../ListDocuments/ListDocuments";
import {useNavigate} from "react-router";

interface LoginProps {
    onLogin: (user: { role: number; email: string }) => void;
}

const Login: FC<LoginProps> = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const [showRecovery, setShowRecovery] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showListDocuments, setShowListDocuments] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            authenticateWithToken(token)
                .then((userEmail: string) => {
                    setEmail(userEmail);
                    setShowListDocuments(true);
                })
                .catch((error: Error) => {
                    console.log(error);
                });
        }
    }, []);

    const handleInputChange = (value: string, setter: (value: string) => void, field: string, pattern: string) => {
        setter(value);
        let newErrors = {...errors};
        if (validateField(value, pattern)) {
            delete newErrors[field];
        } else {
            newErrors[field] = 'El valor es requerido.';
        }
        setErrors(newErrors);
    }

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitted(true);
        let newErrors: Errors = {};

        if (!username) {
            newErrors.username = 'El nombre de usuario es requerido.';
        }

        if (!password) {
            newErrors.password = 'La contraseña es requerida';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const user = await authenticateUser(username, password);
                setEmail(user.email);
                toast.success('Iniciando session');
                onLogin(user);
                if (user.role === 1) {
                    navigate("/documentos");
                } else {
                    setShowListDocuments(true);
                }
            } catch (error) {
                if (error instanceof Error) {
                    setErrors({server: error.message});
                }
            }
        }
    };

    const handleVerification = async () => {
        setShowVerification(false);
    };

    const handleRegistered = (registeredEmail: string) => {
        setEmail(registeredEmail);
        setShowRegister(false);
        setShowVerification(true);
    };


    if (showRegister) {
        return <Registrer onRegistered={handleRegistered} onCancel={() => setShowRegister(false)}/>;
    }

    if (showRecovery) {
        return <PasswordRecovery onCancel={() => setShowRecovery(false)}/>;
    }

    if (showListDocuments) {
        return <ListDocuments email={email} isAdmin={false}/>
    }

    if (showVerification) {
        return <Verification email={email} onVerified={handleVerification}/>;
    }

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <ToastContainer/>
                <Label text="Firmador"/>
                <Input
                    type="text"
                    placeholder="User name / Email"
                    label="User name / Email"
                    value={username}
                    onChange={(value) => handleInputChange(value, setUsername, 'username', '')}
                    Icon={FaEnvelope}
                    required
                    error={errors.username}
                    isSubmitted={isSubmitted}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    label="Password"
                    value={password}
                    onChange={(value) => handleInputChange(value, setPassword, 'password', '')}
                    required
                    error={errors.password}
                    isSubmitted={isSubmitted}
                />
                <Link text="Olvido su contraseña?" onClick={() => setShowRecovery(true)}/>
                <Button text="LOGIN" onClick={handleLogin}/>
                <LabelLink
                    label="No tienes una cuenta?"
                    linkText="Regístrate aquí"
                    onClick={() => setShowRegister(true)}
                />
                {errors.server && <div className="error">{errors.server}</div>}
            </form>
        </div>
    );
};

export default Login;