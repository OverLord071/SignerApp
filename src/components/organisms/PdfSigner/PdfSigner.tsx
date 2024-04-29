import React, {ChangeEvent, FC, useEffect, useRef, useState} from 'react';
import {MinimalButton, ScrollMode, SpecialZoomLevel, Viewer, ViewMode, Worker} from '@react-pdf-viewer/core';
import Draggable, {DraggableEventHandler} from 'react-draggable';
import './PdfSigner.scss';
import Input from "../../atoms/Input/Input";
import Button from "../../atoms/Button/Button";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import {replaceFileContent, singPdf, updateDocumentIsSigned} from "../../../api/UserService";
import {Errors, validateField} from "../../../types/validation";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {AxiosError} from "axios";
import {
    NextIcon,
    pageNavigationPlugin,
    PreviousIcon,
    RenderCurrentPageLabelProps
} from "@react-pdf-viewer/page-navigation";
import {thumbnailPlugin} from "@react-pdf-viewer/thumbnail";


type Document = {
    id: string;
    title: string;
    url: string;
    isSigned: boolean;
};

interface PdfSignerProps {
    token: string | null;
    document: Document | null;
    onSignSuccess: Function;
    onSignFailure: Function;
}

interface ErrorResponse {
    certificateFile?: string[];
    pdfFile?: string[];
}

const PdfSigner: FC<PdfSignerProps> = ({token, document, onSignSuccess, onSignFailure}) => {
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

    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { jumpToNextPage, jumpToPreviousPage , CurrentPageLabel} = pageNavigationPluginInstance;
    const thumbnailPluginInstance = thumbnailPlugin();
    const [currentPage, setCurrentPage] = useState(0);

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
            if (certificateFile && pdfBlob && token) {
                try {
                    const signedPdfBase64 = await singPdf(certificateFile, pin, pdfBlob, reason, location, currentPage, x, - y + 796)
                    console.log(signedPdfBase64);
                    toast.success('El documento se firmo correctamente.');
                    const pdfFileName = document ? document.id : '';
                    try {
                        await replaceFileContent(token ,signedPdfBase64, pdfFileName);
                        toast.success('El documento se reemplazo correctamente.');
                        await updateDocumentIsSigned(pdfFileName);
                        setTimeout(() => {
                            onSignSuccess();
                        }, 2000);
                    } catch (error) {
                        console.error(error);
                        toast.error('Hubo un error al reemplazar el documento.');
                        setTimeout(() => {
                            onSignFailure();
                        }, 2000);
                    }

                } catch (error) {
                    const axiosError = error as AxiosError;
                    console.log(axiosError);
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

    return (
        <div className="pdf-signer">
            <div className="inputs-container">
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
                    <Button text={"Firmar"} onClick={handleSingClick}/>
                </div>
                <ToastContainer/>
            </div>
            <div className="pdf-viewer">
                {urlPdfFile && (
                    <div
                        style={{
                            border: '1px solid rgba(0, 0, 0, .3)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <div
                                style={{
                                    borderBottom: '1px solid rgba(0, 0, 0, .3)',
                                    height: '54rem',
                                    position: 'relative',
                                }}
                            >
                                <div
                                    style={{
                                        alignItems: 'center',
                                        backgroundColor: '#eeeeee',
                                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '8px',
                                    }}
                                >
                                    <CurrentPageLabel>
                                        {(props: RenderCurrentPageLabelProps) => {
                                            setCurrentPage(props.currentPage+1)
                                            return <span>{`${props.currentPage + 1} of ${props.numberOfPages}`}</span>
                                        }}
                                    </CurrentPageLabel>
                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '1rem',
                                        transform: 'translate(0, -100%) rotate(-90deg)',
                                        zIndex: '1',
                                    }}
                                >
                                    <MinimalButton onClick={jumpToPreviousPage}>
                                        <PreviousIcon/>
                                    </MinimalButton>
                                </div>
                                <Viewer
                                    defaultScale={SpecialZoomLevel.ActualSize}
                                    scrollMode={ScrollMode.Page}
                                    viewMode={ViewMode.SinglePage}
                                    fileUrl={urlPdfFile}
                                    plugins={[pageNavigationPluginInstance, thumbnailPluginInstance]}

                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '1rem',
                                        transform: 'translate(0, -100%) rotate(-90deg)',
                                        zIndex: '1',
                                    }}
                                >
                                    <MinimalButton onClick={jumpToNextPage}>
                                        <NextIcon/>
                                    </MinimalButton>
                                </div>
                            </div>
                        </Worker>
                        <Draggable position={{x, y}} onStop={handleStop}>
                            <div className="signature-rectangle">FIRMA</div>
                        </Draggable>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfSigner;
