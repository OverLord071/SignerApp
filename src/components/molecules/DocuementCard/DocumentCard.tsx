import React, {FC} from 'react';
import './DocumentCard.scss';
import Button from "../../atoms/Button/Button";


type Document = {
    id: string;
    tittle: string;
    url: string;
    isSigned: boolean;
};

interface DocuementCardProps {
    document: Document;
    onSign: () => void;
    onReject: () => void;
}

const DocuementCard: FC<DocuementCardProps> = ({document, onReject, onSign}) => {
    return (
        <div className="document-card">
            <img src="/img.png" alt="PDF Icon" className="document-card__image"/>
            <h4 className="document-card__title">{document.tittle}</h4>
            <div className="document-card__actions">
                <Button text="Firmar" onClick={onSign} variant="primary--small" />
            </div>
        </div>
    );
};

export default DocuementCard;