import React, {FC, useEffect, useState} from 'react';
import PdfSigner from "../PdfSigner/PdfSigner";
import {deleteDocument, getAllDocuments, getDocumentsByEmail, resendEmail} from "../../../api/UserService";
import './ListDocuments.scss';
import Button from "../../atoms/Button/Button";
import {FaEnvelope, FaTrash} from "react-icons/fa";

type Document = {
    id: string;
    title: string;
    url: string;
    isSigned: boolean;
    date: string;
    expiration: string;
    statusDocument: string;
};

interface ListDocumentsProps {
    email?: string;
    isAdmin: boolean;
}

const ListDocuments : FC<ListDocumentsProps> = ({ email, isAdmin}) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [toSignedDocument, setToSignedDocument] = useState<Document|null>();
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 20;

    useEffect(()=>{
        const fetchDocuments = async () => {
            let docs;
            if (isAdmin) {
                docs = await getAllDocuments();
            } else if (email){
                docs = await getDocumentsByEmail(email);
            }
            setDocuments(Array.isArray(docs) ? docs : []);
        };
        fetchDocuments();
    }, [email, isAdmin]);

    const noSignedDocuments = documents.filter(doc => !doc.isSigned && doc.statusDocument === 'Enviado');
    const pageCount = Math.ceil(noSignedDocuments.length / itemsPerPage);

    const handleSignSuccess = () => {
        setDocuments(documents.map(doc => doc.id === toSignedDocument?.id ? {...doc, isSigned: true} : doc));
        setToSignedDocument(null);
    };

    const handleSignFailure = () => {
        setToSignedDocument(null);
    };

    const handleResendEmail = async (doc: Document) => {
        try {
            const result = await resendEmail(doc.id);
            console.log(result);
        } catch (error) {
            console.log(error);
        }

    };

    const handleDeleteDocument = async (doc: Document) => {
        try {
            const result = await deleteDocument(doc.id);
            console.log('Documento eliminado con éxito:', result);
        } catch (error) {
            console.error('Error al eliminar el documento:', error);
        }
        setDocuments(documents.filter(d => d.id !== doc.id));
    };


    return (
        <div className="document-container">
            {toSignedDocument ? (
                <div className="pdf-signer-container">
                    <PdfSigner document={toSignedDocument} onSignSuccess={handleSignSuccess}
                               onSignFailure={handleSignFailure}/>
                </div>
            ) : (
                <>
                    <h2>{isAdmin ? "Todos los documentos" : "Documentos por firmar"}</h2>
                    {noSignedDocuments.length === 0 ? (
                        <div className="no-documents-alert">
                            <p>No tienes documentos por firmar.</p>
                        </div>
                    ) : (
                        <>
                            <div className="table-container">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Nombre del Documento</th>
                                        <th>ID</th>
                                        <th>Fecha envío</th>
                                        <th>Fecha expiración</th>
                                        <th>Estado</th>
                                        <th>Acción</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {noSignedDocuments
                                        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                                        .map(doc => (
                                            <tr key={doc.id}>
                                                <td>{doc.title}</td>
                                                <td>{doc.id}</td>
                                                <td>{doc.date}</td>
                                                <td>{doc.expiration}</td>
                                                <td>{doc.statusDocument}</td>
                                                <td>
                                                    {isAdmin ? (
                                                        <>
                                                            <Button Icon={<FaEnvelope />} onClick={() => handleResendEmail(doc)} />
                                                            <Button Icon={<FaTrash />} variant="cancel" onClick={() => handleDeleteDocument(doc)} />
                                                        </>
                                                    ) : (
                                                        <Button
                                                            text="Firmar"
                                                            onClick={() => setToSignedDocument(doc)}
                                                        />
                                                    )}
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
                </>
            )}
        </div>
    );
};

export default ListDocuments;