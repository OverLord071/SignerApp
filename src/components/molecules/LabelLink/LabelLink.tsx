import React, {FC} from 'react';
import './LabelLink.scss';
import Link from "../../atoms/Link/Link";

interface LabelLinkProps {
    label: string;
    linkText: string;
    onClick: () => void;
}
const LabelLink : FC<LabelLinkProps> = ({label, linkText, onClick}) => {
    return (
        <div className="label-link">
            <span>{label}</span>
            <Link text={linkText} onClick={onClick}/>
        </div>
    );
};

export default LabelLink;