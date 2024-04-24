import React, {FC, useState} from 'react';
import './Input.scss';
import {IconType} from "react-icons";
import {FaExclamationCircle} from "react-icons/fa";

interface InputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    Icon?: IconType;
    IconError?: IconType;
    error?: string;
    pattern?: string;
    required?: boolean;
    isSubmitted?: boolean;
    label?: string;
}
const Input: FC<InputProps> = ({type,placeholder,value,onChange, Icon, IconError = FaExclamationCircle, error, pattern, required, isSubmitted, label}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div>
            <label>{label}</label>
            <div className={`input-container ${isSubmitted && error ? 'invalid' : ''} ${isFocused ? 'focused' : ''}`}>
                {Icon && <Icon className="input-icon"/>}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => {setIsFocused(true)}}
                    onBlur={() => {setIsFocused(false)}}
                    className="input-field"
                    pattern={pattern}
                    required={required}
                />
                {isSubmitted && error && <IconError className="input-icon-error"/>}
            </div>
            {isSubmitted && error && <div className="error-message">{error}</div>}
        </div>

    );
};

export default Input;