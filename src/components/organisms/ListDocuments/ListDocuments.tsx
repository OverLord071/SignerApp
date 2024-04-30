import React, {FC, useEffect, useState} from 'react';
import PdfSigner from "../PdfSigner/PdfSigner";
import {getDocumentsByEmail} from "../../../api/UserService";
import './ListDocuments.scss';
import Button from "../../atoms/Button/Button";

type Document = {
    id: string;
    title: string;
    url: string;
    isSigned: boolean;
    date: string;
};

const ListDocuments : FC<{token: string, email: string}> = ({token, email}) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [toSignedDocument, setToSignedDocument] = useState<Document|null>();

    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 20;

    useEffect(()=>{
        const fetchDocuments = async () => {
            const docs = await getDocumentsByEmail(email);
            console.log(docs);
            setDocuments(docs);
        };
        fetchDocuments();
    }, [email]);

    const noSignedDocuments = documents.filter(doc => !doc.isSigned);
    const pageCount = Math.ceil(noSignedDocuments.length / itemsPerPage);

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
                <div className="pdf-signer-container">
                    <PdfSigner token={token} document={toSignedDocument} onSignSuccess={handleSignSuccess}
                               onSignFailure={handleSignFailure}/>
                </div>
            ) : (
                <>
                    <h2>Documentos por firmar</h2>
                    <div className="table-container">
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo de Documento</th>
                                <th>Fecha</th>
                                <th>Firmar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {noSignedDocuments
                                .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                                .map(doc => (
                                    <tr key={doc.id}>
                                        <td>{doc.id}</td>
                                        <td>{doc.title}</td>
                                        <td>{doc.date}</td>
                                        <td>
                                            <Button
                                                text="Firmar"
                                                onClick={() => setToSignedDocument(doc)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination-container">
                        <div className="results-text">
                            Mostrando {currentPage * itemsPerPage + 1} a {(currentPage + 1) * itemsPerPage} de {noSignedDocuments.length} resultados
                        </div>
                        <div className="pagination-buttons">
                            <button
                                onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => currentPage < pageCount - 1 && setCurrentPage(currentPage + 1)}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ListDocuments;