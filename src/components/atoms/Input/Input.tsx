import React, { FC, useState } from 'react';
import './Input.scss';
import { IconType } from "react-icons";
import {FaExclamationCircle, FaEye, FaEyeSlash} from "react-icons/fa";

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
    disabled?: boolean;
    label?: string;
    autoComplete?: "on" | "off";
}

const Input: FC<InputProps> = ({ type, placeholder, value, onChange, Icon, IconError = FaExclamationCircle, error, pattern, required, isSubmitted, disabled, label, autoComplete = "off" }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="input-wrapper">
            <div className={`input-container ${isSubmitted && error ? 'invalid' : ''} ${isFocused || value ? 'focused' : ''}`}>
                <label className={`input-label ${isFocused || value ? 'label-focused' : ''}`} htmlFor={placeholder}>
                    {label}
                </label>
                <input
                    id={placeholder}
                    type={type === 'password' && isPasswordVisible ? 'text' : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleTextChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="input-field"
                    pattern={pattern}
                    required={required}
                    disabled={disabled}
                    autoComplete={autoComplete}
                />
                {Icon && <Icon className="input-icon"/>}
                {type === 'password' && (
                    <span
                        className="input-toggle-password"
                        onClick={togglePasswordVisibility}
                        role="button"
                        aria-label="Toggle password visibility"
                    >
                        {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                )}
                {isSubmitted && error && <IconError className="input-icon-error" />}
            </div>
            {isSubmitted && error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Input;
