import React, {FC} from 'react';
import './Error.scss';

interface ErrorProps {
    message: string;
}
const Error : FC<ErrorProps> = ({message}) => {
    return <span className="error-message">{message}</span>;
};

export default Error;