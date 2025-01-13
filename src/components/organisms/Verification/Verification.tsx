import React, {FC, useState} from 'react';
import './Verification.scss';
import {Errors, validateField} from "../../../types/validation";
import Input from "../../atoms/Input/Input";
import Button from "../../atoms/Button/Button";
import {verifyEmail} from "../../../api/UserService";

const Verification: FC<{onVerified: () => void, email: string}> = ({onVerified, email}) => {
    const [code, setCode] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


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

    const handleVerify = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitted(true);
        let newErrors: Errors = {};

        if (!code) {
            newErrors.code = 'El código es requerido.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await verifyEmail(email, code);
                onVerified();
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(`Error: ${error.message}`);
                }
            }
        }
    }

    return (
        <div className="verification-container">
            <form onSubmit={handleVerify} noValidate>
                <Input
                    type="text"
                    placeholder="Código de verificación."
                    value={code}
                    onChange={(value) => handleInputChange(value as string, setCode, "code", "\\d+")}
                    pattern="\d+"
                    required
                    error={errors.code}
                    isSubmitted={isSubmitted}
                    label="Código de verificación"
                />
                <Button text="Verificar" onClick={handleVerify}/>
            </form>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
};

export default Verification;