import React, {FC, useState} from 'react';
import './PasswordRecovery.scss';
import Input from "../../atoms/Input/Input";
import {FaEnvelope} from "react-icons/fa";
import Button from "../../atoms/Button/Button";
import {changePassword, sendPinValidation, verifyPin} from "../../../api/UserService";
import PinInput from "../../atoms/PinInput/PinInput";
import Label from "../../atoms/Label/Label";

const PasswordRecovery: FC<{onCancel: () => void}> = ({onCancel}) => {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState<number>(1);
    const [validationPin, setValidationPin] = useState('');
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState("");

    const handleSendPin = async () => {
      setLoading(true);
      setError("");
      try {
          await sendPinValidation(email);
          setStep(2);
      } catch (err) {
          setError("Error al enviar el Pin. Verifica el correo ingresado.");
      } finally {
          setLoading(false);
      }
    };

    const handleVerifyPin = async () => {
      setLoading(true);
      setError("");
      try {
          const isValid = await verifyPin(email, validationPin);
          if (isValid) {
              setStep(3);
          } else {
              setError("El Pin ingresado no es válido.");
          }
      } catch (err) {
          setError("Error al verificar el pin.");
      } finally {
          setLoading(false);
      }
    };

    const handleChangePassword = async () => {
      setLoading(true);
      setError("");
      try {
          await changePassword(email, validationPin, newPassword);
          alert("Contraseña camnbiada exitosamente.");
          onCancel();
      } catch (err) {
          setError("Error al cambiar la contraseña. Inténtalo nuevamente.");
      } finally {
          setLoading(false);
      }
    };

    return (
        <div className="recovery-container">
            {error && <div className="error-message">{error}</div>}
            {step === 1 && (
                <form onSubmit={(e) => e.preventDefault()}>
                    <Input
                        type="email"
                        placeholder="Correo electrónico."
                        value={email}
                        onChange={setEmail}
                        Icon={FaEnvelope}
                        required
                        label="Correo"
                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    />
                    <div className="button-container">
                        <Button
                            text={loading ? "Enviando..." : "Enviar PIN"}
                            onClick={handleSendPin}
                            disabled={loading}
                        />
                        <Button
                            text="Cancelar"
                            onClick={onCancel}
                            variant="cancel"
                        />
                    </div>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={(e) => e.preventDefault()}>
                    <Label text="Ingresar Pin"/>
                    <PinInput
                        onPinChange={setValidationPin}
                        disabled={loading}
                    />
                    <div className="button-container">
                        <Button
                            text={loading ? "Verificando..." : "Verificar PIN"}
                            onClick={handleVerifyPin}
                            disabled={loading}
                        />
                        <Button
                            text="Cancelar"
                            onClick={onCancel}
                            variant="cancel"
                        />
                    </div>
                </form>
            )}
            {step === 3 && (
                <form onSubmit={(e) => e.preventDefault()}>
                    <Input
                        type="password"
                        placeholder="Nueva Contraseña"
                        value={newPassword}
                        onChange={setNewPassword}
                        required
                        label="Nueva Contraseña"
                    />
                    <div className="button-container">
                        <Button
                            text={loading ? "Cambiando..." : "Cambiar contraseña"}
                            onClick={handleChangePassword}
                            disabled={loading}
                        />
                        <Button
                            text="Cancelar"
                            onClick={onCancel}
                            variant="cancel"
                        />
                    </div>
                </form>
            )}
        </div>
    );
};

export default PasswordRecovery;