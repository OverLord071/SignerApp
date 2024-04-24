import React, {FC, useState} from 'react';
import './PasswordRecovery.scss';
import Input from "../../atoms/Input/Input";
import {FaEnvelope} from "react-icons/fa";
import Button from "../../atoms/Button/Button";

const PasswordRecovery: FC<{onCancel: () => void}> = ({onCancel}) => {
    const [email, setEmail] = useState('');

    const handleRecovery = (event: React.FormEvent) => {
        event.preventDefault();
    }

    return (
        <div className="recovery-container">
            <form onSubmit={handleRecovery}>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={setEmail}
                    Icon={FaEnvelope}
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    required
                />
                <div className="button-container">
                    <Button text="Recuperar" onClick={handleRecovery}/>
                    <Button text="Cancelar" onClick={onCancel} variant="cancel"/>
                </div>
            </form>
        </div>
    );
};

export default PasswordRecovery;