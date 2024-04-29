import React, {FC, useEffect, useState} from 'react';
import PdfSigner from "../PdfSigner/PdfSigner";
import {getDocumentsByEmail} from "../../../api/UserService";
import './ListDocuments.scss';
import ReactPaginate from "react-paginate";
import Button from "../../atoms/Button/Button";

type Document = {
    id: string;
    title: string;
    url: string;
    isSigned: boolean;
    date: Date;
};

const ListDocuments : FC<{token: string, email: string}> = ({token, email}) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [toSignedDocument, setToSignedDocument] = useState<Document|null>();

    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 10;

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

    const handlePageClick = ({selected}: { selected: number}) => {
      setCurrentPage(selected);
    };

    return (
        <div className="document-container">
            {toSignedDocument ? (
                <PdfSigner token={token} document={toSignedDocument} onSignSuccess={handleSignSuccess}
                           onSignFailure={handleSignFailure}/>
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
                                        <td>{new Date(doc.date).toLocaleDateString()}</td>
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
                    <ReactPaginate
                        previousLabel={<button className="pagination-button">Anterior</button>}
                        nextLabel={<button className="pagination-button">Siguiente</button>}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                    />
                </>
            )}
        </div>
    );
};

export default ListDocuments;