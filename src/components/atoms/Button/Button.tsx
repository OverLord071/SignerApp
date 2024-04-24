import React, {FC, ReactNode} from 'react';
import './Button.scss';

interface ButtonProps {
    text: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'cancel' | 'file';
    Icon?: ReactNode;
    type?: 'button' | 'submit' | 'reset';
}
const Button: FC<ButtonProps> = ({text, onClick, variant = 'primary', Icon, type}) => {
    return (
        <button type={type} onClick={onClick} className={`button ${variant}`}>
            {Icon && <span className="button-icon">{Icon}</span>}
            {text}
        </button>
    );
};

export default Button;