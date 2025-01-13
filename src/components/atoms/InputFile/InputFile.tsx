import React, {FC, useState} from 'react';
import { FaFileUpload } from 'react-icons/fa';
import "./InputFile.scss";

interface InputFileProps {
    onChange: (file: File) => void;
    label?: string;
    error?: string;
    isSubmitted?: boolean;
}

const InputFile: FC<InputFileProps> = ({onChange, label, isSubmitted, error}) => {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
            onChange(e.target.files[0]);
        }
    };

    return (
        <div className="file-input-wrapper">
            {label && <label>{label}</label>}
            <label className={`file-label ${isSubmitted && error ? 'invalid' : ''}`}>
                <FaFileUpload className="file-icon" />
                <span>{fileName || 'Selecciona un archivo'}</span>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                    accept=".png, .jpg, .jpeg"
                />
            </label>
            {isSubmitted && error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default InputFile;