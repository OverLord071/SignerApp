import React, {FC} from 'react';
import './Link.scss';

interface LinkProps {
    text: string;
    onClick: () => void;
}

const Link : FC<LinkProps> = ({text,onClick}) => {
    return (
        <p onClick={onClick} className="link">
            {text}
        </p>
    );
};

export default Link;