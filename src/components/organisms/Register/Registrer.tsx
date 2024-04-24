import React, {FC, useState} from 'react';
import './Registrer.scss';
import Input from "../../atoms/Input/Input";
import {FaEnvelope, FaIdCard, FaKey, FaUser} from "react-icons/fa";
import Button from "../../atoms/Button/Button";
import { Errors, validateField } from "../../../types/validation";
import {createUser} from "../../../api/UserService";

const Registrer : FC<{onRegistered: (email: string) => void, onCancel: () => void}> = ({onRegistered, onCancel}) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [emailConfirm, setEmailConfirm] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [cedula, setCedula] = useState('');
    const [name, setName] = useState('');
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (value: string, setter: (value: string) => void, field: string, pattern: string) => {
      setter(value);
      let newErrors = {...errors};
      if (validateField(value, pattern)) {
          delete newErrors[field];
      } else {
          newErrors[field] = 'El valor es requerido.';
      }
      setErrors(newErrors);
    };

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitted(true);
        let newErrors: Errors = {};

        if (!cedula) {
            newErrors.cedula = 'La cédula es requerida';
        }
        else if (!/^\d{10}$/.test(cedula)) {
            newErrors.cedula = 'La cédula debe tener 10 dígitos';
        }

        if (!name) {
            newErrors.name = 'El nombre es requerido';
        }
        else if (!/^[A-Za-z\s]+$/.test(name)) {
            newErrors.name = 'El nombre debe tener solo letras';
        }

        if (!username) {
            newErrors.username = 'El nombre de usuario es requerido';
        }

        if (!email) {
            newErrors.email = 'El correo es requerido';
        }
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            newErrors.email = 'El correo es invalido.';
        }

        if (!password) {
            newErrors.password = 'La contraseña es requerida';
        }

        if (password !== passwordConfirm) {
            newErrors.passwordConfirm = 'Las contraseñas no coinciden';
        }

        if (email !== emailConfirm) {
            newErrors.emailConfirm = 'Los correos electrónicos no coinciden';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const user = {
                    ci: cedula,
                    name: name,
                    email: email,
                    certificate: "",
                    pinCertificate: "",
                    userName: username,
                    password: password,
                    role: "user",
                    validationPin: "",
                    emailVerified: false
                };

                await createUser(user);
                onRegistered(email);
            }catch (error){
                if (error instanceof Error) {
                    alert(`Error al crear el usuario: ${error.message}`)
                }
            }
        }

    };

    return (
        <div className="register-container">
            <form onSubmit={handleRegister} noValidate>
                <Input
                    type="text"
                    placeholder="Nombre Completo"
                    value={name}
                    onChange={(value) => handleInputChange(value, setName, "name", "[A-Za-z\\s]+")}
                    Icon={FaUser}
                    pattern="[A-Za-z\s]+"
                    required
                    error={errors.name}
                    isSubmitted={isSubmitted}
                    label="Nombre Completo"
                />
                <div className="input-row">
                    <Input
                        type="text"
                        placeholder="Cedula"
                        value={cedula}
                        onChange={(value) => handleInputChange(value, setCedula, "cedula", "\\d{10}")}
                        Icon={FaIdCard}
                        pattern="\d{10}"
                        required
                        error={errors.cedula}
                        isSubmitted={isSubmitted}
                        label="Cedula"
                    />
                    <Input
                        type="text"
                        placeholder="nombre.apellido"
                        value={username}
                        onChange={(value) => handleInputChange(value, setUsername, "username", "[A-Za-z\\s]+")}
                        pattern="[A-Za-z\s]+"
                        Icon={FaUser}
                        required
                        error={errors.username}
                        isSubmitted={isSubmitted}
                        label="Nombre de Usuario"
                    />
                </div>

                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={setEmail}
                    Icon={FaEnvelope}
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    required
                    error={errors.email}
                    isSubmitted={isSubmitted}
                    label="Correo electrónico"
                />
                <Input
                    type="email"
                    placeholder="Confirmar Email"
                    value={emailConfirm}
                    onChange={setEmailConfirm}
                    Icon={FaEnvelope}
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    required
                    error={errors.emailConfirm}
                    isSubmitted={isSubmitted}
                    label="Confirmar correo electrónico"
                />

                <div className="input-row">
                    <Input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={setPassword}
                        Icon={FaKey}
                        required
                        error={errors.password}
                        isSubmitted={isSubmitted}
                        label="Contraseña"
                    />
                    <Input
                        type="password"
                        placeholder="Confirmar Contraseña"
                        value={passwordConfirm}
                        onChange={setPasswordConfirm}
                        Icon={FaKey}
                        required
                        error={errors.passwordConfirm}
                        isSubmitted={isSubmitted}
                        label="Confirmar contraseña"
                    />
                </div>
                <div className="button-container">
                    <Button text="Registrar" onClick={handleRegister}/>
                    <Button text="Cancelar" onClick={onCancel} variant="cancel"/>
                </div>
            </form>
        </div>
    );
};

export default Registrer;