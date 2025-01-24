import React, {useEffect, useState} from 'react';
import { changePasswordWithToken, validateToken} from "../../api/UserService";
import {useSearchParams} from "react-router-dom";
import Input from "../atoms/Input/Input";
import Button from "../atoms/Button/Button";
import {Errors} from "../../types/validation";
import {useNavigate} from "react-router";


const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [success, setSuccess] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if(!token) {
            setError("Token no válido o inexistente.");
        } else {
            validateToken(token).catch(()=>{
                setError("Token inválido o expirado.");
            });
        }
    }, [token]);

    const handlePasswordChange = async () => {
        let newErrors: Errors = {};
        setIsSubmitted(true);
        if(!token) {
            setError("Token requerido");
            return;
        }

        if (!newPassword) {
            newErrors.newPassword = 'La contraseña es requerida';
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await changePasswordWithToken(token, newPassword);
                setSuccess(true);
                navigate("/login");
            } catch (err) {
                setError("Error al cambiar la contraseña. Intenta nuevamente.");
            }
        }

    };

    if (error) {
        return <div>{error}</div>;
    }

    if (success) {
        return <div>¡Contraseña cambiada exitosamente!</div>;
    }

    return (
        <div>
            <h2>Restablecer Contraseña</h2>
            <Input
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={setNewPassword}
                label="Nueva contraseña"
                error={errors.newPassword}
                isSubmitted={isSubmitted}
            />
            <Input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={setConfirmPassword}
                label="Confirmar contraseña"
                error={errors.confirmPassword}
                isSubmitted={isSubmitted}
            />
            <Button
                text="Cambiar contraseña"
                onClick={handlePasswordChange}
            />
        </div>
    );
};

export default ResetPassword;