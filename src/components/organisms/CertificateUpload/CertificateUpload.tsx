import React, {FC, useRef, useState} from 'react';
import './CertificateUpload.scss';
import Button from "../../atoms/Button/Button";
import Input from "../../atoms/Input/Input";
import {createCertificate} from "../../../api/UserService";

const CertificateUpload: FC<{userId: string}> = ({userId}) => {
    const [certificate, setCertificate] = useState<File | null>();
    const [pin , setPin] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCertificateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCertificate(event.target.files ? event.target.files[0] : null);
    };

    const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        if (event.dataTransfer.items) {
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                if (event.dataTransfer.items[i].kind === 'file') {
                    setCertificate(event.dataTransfer.items[i].getAsFile());
                }
            }
        }
    };

    const handleUpload = async (event: React.FormEvent) => {
      event.preventDefault();

      if (certificate && pin) {
          try {
              const response = await createCertificate(userId, certificate, pin);
              console.log(response);
          } catch (error) {
              console.log(error);
          }

      } else {
          alert('Por favor, selecciona un certificado y proporciona su pin.');
      }

    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    return (
        <div className="certificate-upload-container">
            <h3>Certificado</h3>
            <div className="dropzone" onDragOver={handleDragOver} onDrop={handleDrop} onClick={handleClick}>
                <input type="file" ref={fileInputRef} style={{display: 'none'}} onChange={handleCertificateChange}/>
                {certificate ? <p>{certificate.name}</p> : <p>Arrastra el certificado aqui.</p>}
            </div>
            <form onSubmit={handleUpload} noValidate >
                <Input
                    type="password"
                    placeholder="Pin del certificado"
                    value={pin}
                    onChange={setPin}
                    required
                    label="Pin del certificado"
                />
            </form>
            <div className="button-container">
                <Button type="submit" text="Cargar" onClick={handleUpload}/>
                <Button text="Cerrar session" onClick={()=>{}} variant="cancel"/>
            </div>
        </div>
    );
};

export default CertificateUpload;