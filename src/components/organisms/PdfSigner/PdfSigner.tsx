import React, {ChangeEvent, FC, useEffect, useRef, useState} from 'react';
import { ScrollMode, SpecialZoomLevel, Viewer, Worker} from '@react-pdf-viewer/core';
import Draggable, {DraggableEventHandler} from 'react-draggable';
import './PdfSigner.scss';
import Input from "../../atoms/Input/Input";
import Button from "../../atoms/Button/Button";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import {
    getToken,
    rejectDocument,
    replaceFileContent,
    singPdf,
    updateData,
    updateDocumentIsSigned
} from "../../../api/UserService";
import {Errors, validateField} from "../../../types/validation";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {AxiosError} from "axios";
import {pageNavigationPlugin, RenderCurrentPageLabelProps} from "@react-pdf-viewer/page-navigation";
import {useNavigate} from "react-router";

type Document = {
    id: string;
    title: string;
    url: string;
    isSigned: boolean;
};

interface SignParams {
    certificateFile: File;
    password: string;
    pdfFile: Blob;
    reason: string;
    location: string;
    page: number;
    posX: number;
    posY: number;
}

interface PdfSignerProps {
    document: Document | null;
    onSignSuccess: Function;
    onSignFailure: Function;
}

interface ErrorResponse {
    certificateFile?: string[];
    pdfFile?: string[];
}

const PdfSigner: FC<PdfSignerProps> = ({ document, onSignSuccess, onSignFailure}) => {
    const [reason, setReason] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [urlPdfFile, setUrlPdfFile] = useState('');
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);
    const [pin, setPin] = useState('');
    const certInputRef = useRef<HTMLInputElement>(null);
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [reasonReject, setReasonReject] = useState<string>('');
    const [isRejecting, setIsRejecting] = useState(false);

    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { CurrentPageInput, GoToFirstPageButton, GoToLastPageButton, GoToNextPageButton, GoToPreviousPage } =
        pageNavigationPluginInstance;
    const { CurrentPageLabel} = pageNavigationPluginInstance;
    const [currentPage, setCurrentPage] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const  fetchPdf = async (url: string) => {
          const response = await fetch(url);
          const data = await response.blob();
          const blobUrl = URL.createObjectURL(data);
          setUrlPdfFile(blobUrl);
          setPdfBlob(data);
        };
        if (document) {
            fetchPdf(document.url);
        }

    },[document]);

    const handleInputChange = (value: string, setter: (value: string) => void, field: string, pattern: string) => {
        setter(value);
        let newErrors = {...errors};
        if (validateField(value, pattern)) {
            delete newErrors[field];
        } else {
            newErrors[field] = 'El valor es requerido.';
        }
        setErrors(newErrors);
    }

    const handleCertChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            files.length > 0 && setCertificateFile(files[0]);
        }
    };

    const handleStop: DraggableEventHandler = (event, data) => {
        setX(data.x);
        setY(data.y);
    };

    const handleCertClick = () => {
        certInputRef.current?.click();
    };

    const handleSingClick = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitted(true);
        let newErrors: Errors = {};

        if (!pin) {
            newErrors.pin = 'El pin del certificado es requerido.'
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            if (certificateFile && pdfBlob) {
                try {
                    const signParams : SignParams = {
                        certificateFile: certificateFile,
                        password: pin,
                        pdfFile: pdfBlob,
                        reason: reason,
                        location: location,
                        page: currentPage,
                        posX: x,
                        posY: -y + 796
                    };

                    const signedPdfBase64 = await singPdf(signParams);
                    toast.success('El documento se firmo correctamente.');
                    const pdfFileName = document ? document.id : '';
                    try {
                        const token = await getToken();
                        const replaceResponse = await replaceFileContent(token ,signedPdfBase64, pdfFileName);
                        toast.info('Cargando documento a DocuWare...');

                        await new Promise(resolve => setTimeout(resolve, 5000));
                        const updateResponse = await updateData(replaceResponse.objeto.dwdocid, token);

                        if (updateResponse.data.estado !== 'UPDATED') {
                            toast.error('El estado del documento no se actualizó.');
                        }

                        await updateDocumentIsSigned(pdfFileName);
                        toast.success("El documento se cargo correctamente.");
                        setTimeout(() => {
                            onSignSuccess();
                        }, 1000);
                    } catch (error) {
                        toast.error('Hubo un error al reemplazar el documento.');
                        setTimeout(() => {
                            onSignFailure();
                        }, 1000);
                    }

                } catch (error) {
                    const axiosError = error as AxiosError;
                    const errors = axiosError.response?.data as ErrorResponse;
                    if (axiosError.response?.status === 500){
                        toast.error('Error: ' + axiosError.response.data);
                    } else if (axiosError.response?.status === 400) {
                        if (errors.certificateFile) {
                            toast.error('El certificado es requerido.');
                        } else if (errors.pdfFile) {
                            toast.error('El pdf es requerido.');
                        }
                    }
                }
            } else {
                console.error('Falta el certificado o el pdf');
            }
        }
    };

    const handleRejectDocument= async (event: React.FormEvent) => {
        event.preventDefault();
        if (!document || !document.id) {
            toast.error('El documento no tiene un ID o no es válido.');
            return;
        }
        try {
            await rejectDocument(document.id, reasonReject);
            toast.success('El documento se rechazo correctamente.');
            setIsRejecting(false);
            navigate("documentos");
        } catch (error) {
            console.log('Error al rechazar el documento', error);
            toast.error('Error al rechazar el documento: ' + error);
        }
    };

    return (
        <div className="pdf-signer">
            <div className="inputs-container">
                {!isRejecting ? (
                    <>
                        <Input
                            type="text"
                            placeholder="Razón"
                            value={reason}
                            onChange={setReason}
                            label="Razón"
                        />
                        <Input
                            type="text"
                            placeholder="Ubicación"
                            value={location}
                            onChange={setLocation}
                            label="Ubicación"
                        />
                        <Input
                            type="password"
                            placeholder="Pin Certificado"
                            value={pin}
                            onChange={(value) => handleInputChange(value, setPin, 'pin', '')}
                            label="Pin Certificado"
                            error={errors.pin}
                            required
                            isSubmitted={isSubmitted}
                        />
                        <div className="buttons-container">
                            <input type="file" ref={certInputRef} style={{display: 'none'}} onChange={handleCertChange}/>
                            <Button text="Cargar certificado" onClick={handleCertClick} variant="file"/>
                            <Button text="Firmar" onClick={handleSingClick}/>
                            <Button text="Rechazar" variant="cancel" onClick={() => setIsRejecting(true)}/>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleRejectDocument}>
                        <Input
                            type="text"
                            placeholder="Razón del rechazo"
                            value={reasonReject}
                            onChange={setReasonReject}
                            label="Razón del rechazo"
                            required
                        />
                        <div className="buttons-container">
                            <Button text="Rechazar" variant="primary" onClick={handleRejectDocument}/>
                            <Button text="Cancelar" variant="cancel" onClick={() => setIsRejecting(false)}/>
                        </div>
                    </form>
                )}

                <ToastContainer/>
            </div>
            <div className="pdf-viewer">
                {urlPdfFile && (
                    <div className="pdf-container">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <div className="worker-container">
                                <div className="rpv-core__viewer"
                                     style={{
                                         border: '1px solid rgba(0, 0, 0, 0.3)',
                                         display: 'flex',
                                         flexDirection: 'column',
                                         height: '100%',
                                     }}
                                >
                                    <div
                                        style={{
                                            alignItems: 'center',
                                            backgroundColor: '#eeeeee',
                                            borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            padding: '2px',
                                        }}
                                    >
                                        <div style={{padding: '0px 2px'}}>
                                            <GoToFirstPageButton/>
                                        </div>
                                        <div style={{padding: '0px 2px'}}>
                                            <GoToPreviousPage/>
                                        </div>
                                        <div style={{padding: '0px 2px', width: '4rem'}}>
                                            <CurrentPageInput/>
                                        </div>
                                        <div className="current-page-label">
                                            <CurrentPageLabel>
                                                {(props: RenderCurrentPageLabelProps) => {
                                                    setCurrentPage(props.currentPage+1)
                                                    return <span>{`/ ${props.numberOfPages}`}</span>
                                                }}
                                            </CurrentPageLabel>
                                        </div>
                                        <div style={{padding: '0px 2px'}}>
                                            <GoToNextPageButton/>
                                        </div>
                                        <div style={{padding: '0px 2px'}}>
                                            <GoToLastPageButton/>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            flex: 1,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Viewer
                                            defaultScale={SpecialZoomLevel.PageFit}
                                            scrollMode={ScrollMode.Page}
                                            fileUrl={urlPdfFile}
                                            plugins={[pageNavigationPluginInstance]}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Worker>
                        <Draggable position={{x, y}} onStop={handleStop}>
                            <div className="signature-rectangle">
                                FIRMA
                            </div>
                        </Draggable>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfSigner;
