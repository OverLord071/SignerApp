import React, {FC, useEffect, useState} from 'react';
import PdfSigner from "../PdfSigner/PdfSigner";
import {getDocumentsByEmail} from "../../../api/UserService";
import DocumentCard from "../../molecules/DocuementCard/DocumentCard";
import './ListDocuments.scss';

type Document = {
    id: string;
    title: string;
    url: string;
    isSigned: boolean;
};

const ListDocuments : FC<{token: string}> = ({token}) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [toSignedDocument, setToSignedDocument] = useState<Document|null>();

    useEffect(()=>{
        const fetchDocuments = async () => {
            const docs = await getDocumentsByEmail('calbarracin@digitalsolutions.com.ec');
            console.log(docs);
            setDocuments(docs);
        };
        fetchDocuments();
    }, []);

    const noSignedDocuments = documents.filter(doc => !doc.isSigned);

    const handleSignSuccess = () => {
        setDocuments(documents.map(doc => doc.id === toSignedDocument?.id ? {...doc, isSigned: true} : doc));
        setToSignedDocument(null);
    };

    const handleSignFailure = () => {
        setToSignedDocument(null);
    };

    return (
        <div className="document-container">
            {toSignedDocument ? (
                <PdfSigner token={token} document={toSignedDocument} onSignSuccess={handleSignSuccess}
                           onSignFailure={handleSignFailure}/>
            ) : (
                <>
                    <h2>Documentos por firmar</h2>
                    <div className="document-grid">
                        {noSignedDocuments.map(doc => (
                            <DocumentCard
                                key={doc.id}
                                document={doc}
                                onSign={() => setToSignedDocument(doc)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ListDocuments;