import React, {FC, useState} from 'react';
import PdfSigner from "../PdfSigner/PdfSigner";

type Document = {
    id: string;
    title: string;
    url: string;
    isSigned: boolean;
};

const ListDocuments : FC<{}> = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [toSignedDocument, setToSignedDocument] = useState<Document|null>();

    const signedDocuments = documents.filter(doc => doc.isSigned);
    const noSignedDocuments = documents.filter(doc => !doc.isSigned);

    const handleSignSuccess = () => {
        setDocuments(documents.map(doc => doc.id === toSignedDocument?.id ? {...doc, isSigned: true} : doc));
        setToSignedDocument(null);
    };

    const handleSignFailure = () => {
        setToSignedDocument(null);
    };

    return (
        <div>
            {toSignedDocument ? (
                <PdfSigner token="" document={toSignedDocument} onSignSuccess={handleSignSuccess} onSignFailure={handleSignFailure}/>
            ) : (
                <>
                    <h2>Documentos por firmar</h2>
                    {noSignedDocuments.map(doc => (
                        <div key={doc.id}>
                            <p>{doc.title}</p>
                            <button onClick={() => setToSignedDocument(doc)}>
                                Firmar
                            </button>
                        </div>
                    ))}
                    <h2>Historial de documentos firmados</h2>
                    {signedDocuments.map(doc => (
                        <div key={doc.id}>
                            <p>{doc.title}</p>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default ListDocuments;