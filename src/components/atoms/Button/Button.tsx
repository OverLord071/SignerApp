import React, {FC, ReactNode} from 'react';
import './Button.scss';

interface ButtonProps {
    text?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'cancel' | 'file' | 'primary--small' | 'cancel--small' | 'toggle';
    Icon?: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    isActive?: boolean;
    disabled?: boolean;
}
const Button: FC<ButtonProps> = ({text, onClick, variant = 'primary', Icon, type, isActive, disabled = false}) => {
    const toggleVariant = isActive ? 'active' : 'inactive';

    return (
        <button
            type={type}
            onClick={onClick}
            className={`button ${variant} ${variant === 'toggle' ? toggleVariant : ''} ${disabled ? 'disabled' : ''}`}
            disabled={disabled}
        >
            {Icon && <span className="button-icon">{Icon}</span>}
            {text}
        </button>
    );
};

export default Button;