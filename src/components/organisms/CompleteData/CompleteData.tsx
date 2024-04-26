import React, {useState} from 'react';
import Input from "../../atoms/Input/Input";
import Button from "../../atoms/Button/Button";
import {Errors} from "../../../types/validation";
import {FaIdCard, FaUser} from "react-icons/fa";

const CompleteData = () => {
    const [ci, setCi] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (value: string, setter: (value: string) => void, field: string, pattern: string) => {
        setter(value);
        let newErrors = {...errors};
        if (new RegExp(pattern).test(value)) {
            delete newErrors[field];
        } else {
            newErrors[field] = 'El valor es requerido.';
        }
        setErrors(newErrors);
    };

    const handleUpdate = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitted(true);
        let newErrors: any = {};

        if (!ci) {
            newErrors.ci = 'La cédula es requerida';
        }
        else if (!/^\d{10}$/.test(ci)) {
            newErrors.ci = 'La cédula debe tener 10 dígitos';
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

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                // Aquí puedes hacer la llamada a tu API para actualizar los datos del usuario
                console.log("Datos actualizados");
            } catch (error) {
                console.error(error);
            }
        }
    };


    return (
        <div className="register-container">
            <form onSubmit={handleUpdate} noValidate>
                <Input
                    type="text"
                    placeholder="Cedula"
                    value={ci}
                    onChange={(value) => handleInputChange(value, setCi, "ci", "\\d{10}")}
                    Icon={FaIdCard}
                    pattern="\d{10}"
                    required
                    error={errors.ci}
                    isSubmitted={isSubmitted}
                    label="Cedula"
                />
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
                <div className="button-container">
                    <Button text="Actualizar" onClick={handleUpdate}/>
                </div>
            </form>
        </div>
    );
};

export default CompleteData;