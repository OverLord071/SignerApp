import React, {useEffect, useState} from 'react';
import "./SmtpConfig.scss";
import Input from "../../atoms/Input/Input";
import Button from "../../atoms/Button/Button";
import InputFile from "../../atoms/InputFile/InputFile";
import {createSmtpConfig, getSmtpConfig} from "../../../api/UserService";

const SmtpConfig = () => {
    const [smtpConfig, setSmtpConfig] = useState<{
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

            await createSmtpConfig(configData);
            alert("Configuración SMTP guardada exitosamente");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTestConnection = () => {
        alert("Probar conexión SMTP (pendiente de implementación)");
        // Implementar lógica para probar la conexión SMTP aquí.
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
                    error={!password ? "La contraseña es obligatoria" : ""}
                />
                <Button
                    text={smtpConfig ? "Probar Conexión" : "Guardar Configuración SMTP"}
                    type="button"
                    onClick={smtpConfig ? handleTestConnection : handleSaveConfig}
                />
            </div>
            <div className="smtp-config-right">
                <h2>Configuracion del Logo</h2>
                <InputFile
                    onChange={setLogo}
                />
                {logo && (
                    <div className="logo-preview">
                        <h4>Vista previa del logo:</h4>
                        <img
                            src={URL.createObjectURL(logo)}
                            alt="Vista previa del logo"
                            className="logo-image-preview"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmtpConfig;