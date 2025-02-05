import React, {useEffect, useState} from 'react';
import "./SmtpConfig.scss";
import Input from "../../atoms/Input/Input";
import Button from "../../atoms/Button/Button";
import InputFile from "../../atoms/InputFile/InputFile";
import {
    createSmtpConfig, getLogo,
    getSmtpConfig,
    testSmtpConnection,
    updateSmtpConfig,
    uploadLogo
} from "../../../api/UserService";

const SmtpConfig = () => {
    const [smtpConfig, setSmtpConfig] = useState<{
        id: number;
        host: string;
        port: number;
        useSsl: boolean;
        userName: string;
        password: string;
    } | null>(null);

    const [host, setHost] = useState("");
    const [port, setPort] = useState(0);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [logoUrl, setLogoUrl] = useState<string>("");
    const [isEditMode, setIsEditMode] = useState(false);

    const [testInputsVisible, setTestInputsVisible] = useState(false);
    const [testRecipient, setTestRecipient] = useState("");
    const [testSubject, setTestSubject] = useState("");
    const [testBody, setTestBody] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setLoading(true);
                const data = await getSmtpConfig();
                if (data.length > 0) {
                    const config = data[0];
                    setSmtpConfig(config.id);
                    setSmtpConfig(config);
                    setHost(config.host);
                    setPort(config.port);
                    setUsername(config.userName);
                    setPassword(config.password);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchLogo = async ()=>{
          try {
              const response = await getLogo();
              if (response && response.logoUrl) {
                  setLogoUrl(response.logoUrl);
              }
          } catch (error: any) {
              console.error("Error al obtener el logo:", error.message);
          }
        };

        fetchLogo();
        fetchConfig();
    }, []);

    const handleSaveConfig = async () => {
        setIsSubmitted(true);

        if (!host || !port || !username || !password) {
            return;
        }

        try {
            setLoading(true);
            const configData = {
                host,
                port: Number(port),
                useSsl: true,
                username,
                password,
            };

            if (smtpConfig) {
                await updateSmtpConfig(smtpConfig.id, configData);
            } else {
                await createSmtpConfig(configData);
            }

            alert("Configuración SMTP guardada exitosamente");
            setIsEditMode(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveLogo = async ()=>{
        if (!logo) return alert("Debe seleccionar un logo.");

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", logo);

            const response = await uploadLogo(logo);
            if (response && response.logoUrl) {
                setLogoUrl(response.logoUrl);
                alert("Logo actualizado exitosamente");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTestConnection = async () => {
        if (!testRecipient || !testSubject || !testBody) {
            alert("Por favor, complete todos los campos para probar la conexión.");
            return;
        }

        try {
            setLoading(true);
            const response = await testSmtpConnection({
                recipient: testRecipient,
                subject: testSubject,
                body: testBody,
            });
            alert(response.message || "Conexión SMTP probada exitosamente");
        } catch (err: any) {
            alert("Error al probar la conexión SMTP: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="smtp-config-container">
            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="smtp-config-left">
                <h2>Configuracion SMTP</h2>
                <Input
                    type="text"
                    placeholder="Servidor SMTP"
                    value={host}
                    onChange={setHost}
                    label="Servidor SMTP"
                    required
                    isSubmitted={isSubmitted}
                    disabled={!isEditMode}
                    error={!host ? "El servidor SMTP es obligatorio" : ""}
                />
                <Input
                    type="number"
                    placeholder="Puerto"
                    value={port.toString()}
                    onChange={(value) => setPort(Number(value))}
                    label="Puerto"
                    required
                    isSubmitted={isSubmitted}
                    disabled={!isEditMode}
                    error={!port ? "El puerto es obligatorio" : ""}
                />
                <Input
                    type="email"
                    placeholder="Correo Remitente"
                    value={username}
                    onChange={setUsername}
                    label="Correo Remitente"
                    required
                    isSubmitted={isSubmitted}
                    disabled={!isEditMode}
                    error={!username ? "El correo es obligatorio" : ""}
                />
                <Input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={setPassword}
                    label="Contraseña"
                    required
                    isSubmitted={isSubmitted}
                    disabled={!isEditMode}
                    error={!password ? "La contraseña es obligatoria" : ""}
                />
                {isEditMode ? (
                    <Button text="Guardar Configuración SMTP" type="button" onClick={handleSaveConfig} />
                ) : (
                    <Button text="Editar Configuración" type="button" variant="return" onClick={() => setIsEditMode(true)} />
                )}
                <Button
                    text="Probar Conexión SMTP"
                    type="button"
                    onClick={()=> setTestInputsVisible(!testInputsVisible)}
                />
                {testInputsVisible && (
                    <div className="test-smtp-container">
                        <Input
                            type="email"
                            placeholder="Destinatario"
                            value={testRecipient}
                            onChange={setTestRecipient}
                            label="Destinatario"
                            required
                        />
                        <Input
                            type="text"
                            placeholder="Asunto"
                            value={testSubject}
                            onChange={setTestSubject}
                            label="Asunto"
                            required
                        />
                        <Input
                            type="text"
                            placeholder="Mensaje"
                            value={testBody}
                            onChange={setTestBody}
                            label="Mensaje"
                            required
                        />
                        <Button text="Enviar Prueba" type="button" onClick={handleTestConnection} />
                    </div>
                )}
            </div>
            <div className="smtp-config-right">
                <h2>Configuracion del Logo</h2>
                <InputFile
                    onChange={setLogo}
                />
                {logo && (
                    <div className="logo-preview">
                        <h4>Logo Actual</h4>
                        <img
                            src={logoUrl}
                            alt="Logo"
                            className="logo-image-preview"
                        />
                    </div>
                )}
                {logo && (
                    <div className="logo-preview">
                        <h4>Vista previa del nuevo logo:</h4>
                        <img src={URL.createObjectURL(logo)} alt="Vista previa" className="logo-image-preview" />
                        <Button text="Guardar Logo" type="button" onClick={handleSaveLogo} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmtpConfig;