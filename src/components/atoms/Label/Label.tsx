import React, {FC} from 'react';
import './Label.scss';

interface LabelProps {
    text: string;
}
const Label : FC<LabelProps> = ({text}) => {
    return (
        <label className="label">
            {text}
        </label>
    );
};

export default Label;