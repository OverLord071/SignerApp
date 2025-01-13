// noinspection Annotator

import axios from 'axios';
import FormData from 'form-data';

//const API_BASE_URL = "https://localhost:7159/api";
const API_BASE_URL_2 = "https://dwdemos.digitalsolutions.com.ec/signer/api";

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

interface UpdateDataResponse {
    mensaje: string;
    data: {
        documento: string | null;
        fileCabinet: string;
        dwdocid: number;
        estado: string;
    };
}

export const authenticateUser = async (usernameOrEmail: string, password: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL_2}/DW/login?usernameOrEmail=${usernameOrEmail}&password=${password}`);
        return response.data;
    } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error) && error.response) {
            console.error(error.response.data);
            throw new Error(JSON.stringify(error.response.data.message, null, 2));
        } else {
            throw new Error(`Error desconocido al iniciar sesión: ${error}`);
        }
    }
};

export const authenticateWithToken = async (token: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL_2}/DW/authenticateWithToken?token=${token}`);
        return response.data;
    } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error) && error.response) {
            console.error(error.response.data);
            throw new Error(JSON.stringify(error.response.data.message, null, 2));
        } else {
            throw new Error(`Error desconocido: ${error}`);
        }
    }
}

export const getToken = async () => {
    const data = {
        "uri": "https://dwdemos.digitalsolutions.com.ec/DocuWare/Platform/",
        "user": "Christian.Albarracin",
        "pasw": "DS-1820",
        "fid": "6e3dfea0-5b96-4a89-bd9d-b2ec86e71bb3"
    };

    try {
        const response = await axios.post('https://dwdemos.digitalsolutions.com.ec/dwapi2/api/Authentication/Validar', data);
        return response.data.token;
    } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error) && error.response) {
            console.error(error.response.data);
            throw new Error(JSON.stringify(error.response.data.message, null, 2));
        } else {
            throw new Error(`Error desconocido al obtener el token: ${error}`);
        }
    }
};

export async function replaceFileContent(token: string, documentoCodificado: string, documentId: string) {
    try {
        // noinspection Annotator
        const response = await axios.post('https://dwdemos.digitalsolutions.com.ec/dwapi2/api/Item/ReplaceFileContentJ', {
            documentoCodificado: documentoCodificado,
            extension: 'pdf',
            fid: '6e3dfea0-5b96-4a89-bd9d-b2ec86e71bb3',
            campoBusqueda: 'ID_DOCUMENTO',
            valorBusqueda: documentId
        }, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error al reemplazar el contenido del archivo');
    }
}

export async function updateData(dwdocid: number, token: string): Promise<UpdateDataResponse> {
     try {
         const response = await axios.put(`https://dwdemos.digitalsolutions.com.ec/dwapi2/api/Item/UpdateData/${dwdocid}`,{
             indices: "ESTADO:OK|",
             documentoCodificado: "",
             extension: ""
         }, {
             headers: {
                 'Authorization': 'Bearer ' + token,
             }
         });
         return response.data;
     } catch (error) {
         throw new Error(`Error al actualizar los datos: ${error}`);
     }
}

export async function singPdf(params: SignParams) {
    const formData = new FormData();

    formData.append('certificateFile', params.certificateFile);
    formData.append('pdfFile', params.pdfFile);

    const encodedPassword = encodeURIComponent(params.password);

    // noinspection Annotator
    const response = await axios.post(`${API_BASE_URL_2}/DW/sign-pdf?password=${encodedPassword}&reason=${params.reason}&location=${params.location}&page=${params.page}&positionX=${params.posX}&positionY=${params.posY}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'accept': '*/*'
        }
    });
    return response.data;
}

export async function createUser(user: any) {
    try {
        const response = await axios.post(`${API_BASE_URL_2}/DW/register`, user);
        return response.data;
    } catch (error) {
        throw new Error('Error al crear el usuario');
    }
}

export async function sendPinValidation(email: string) {
    try {
        const response = await axios.post(`${API_BASE_URL_2}/DW/sendPinValidation?email=${email}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al enviar el PIN de validación');
    }
}

export async function createCertificate(id: string, certificate: File, pinCertificate: string) {
    try {
        const formData = new FormData();
        formData.append('certificate', certificate);

        const response = await axios.post(`${API_BASE_URL_2}/DW/createCertificate?id=${id}&pinCertificate=${pinCertificate}`, formData, {});

        return response.data;
    } catch (error) {
        throw new Error('Error al crear el certificado');
    }
}

export async function verifyEmail(email: string, verificationCode: string) {
    try {
        const response = await axios.post(`${API_BASE_URL_2}/DW/verifyEmail?email=${email}&verificationCode=${verificationCode}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(JSON.stringify(error.response.data, null, 2));
        } else {
            throw new Error(`Error desconocido al verificar el correo: ${error}`);
        }
    }
}

export async function getDocumentsByEmail(email: string) {
    try {
        const response = await axios.get(`${API_BASE_URL_2}/Document/${email}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Error al obtener los documentos');
    }
}

export async function getAllDocuments() {
    try {
        const response = await axios.get(`${API_BASE_URL_2}/Document/GetAllDocuments`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Error al obtener los documentos');
    }
}

export async function updateDocumentIsSigned(id: string) {
    try {
        const response = await axios.put(`${API_BASE_URL_2}/Document/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al actualizar el documento');
    }
}

export async function getSmtpConfig() {
    try {
        const response = await axios.get(`${API_BASE_URL_2}/SmtpConfig`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener los smtpConfig');
    }
}

export async function createSmtpConfig(data: {
    host: string;
    port: number;
    useSsl: boolean;
    username: string;
    password: string;
}) {
    try {
        const response = await axios.post(`${API_BASE_URL_2}/SmtpConfig`, data);
        return response.data;
    } catch (error) {
        throw new Error("Error al crear la configuración SMTP");
    }
}

export async function verifyPin(email:string, code:string) {
    try {
        const response = await axios.get(`${API_BASE_URL_2}/DW/verifyPin?email=${email}&code=${code}`);
        return response.data;
    } catch (error) {
        throw new Error("Error al validar el pin");
    }
}

export async function changePassword(email: string, validationPin: string, newPassword: string) {
    try {
        const response = await axios.post(
            `${API_BASE_URL_2}/DW/changePassword`,
            null,
            {
                params: {
                    email,
                    validationPin,
                    newPassword,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error('Error al cambiar la contraseña');
    }
}

export async function resendEmail(documentId: string) {
    try {
        const response = await axios.post(`${API_BASE_URL_2}/Document/resend-email/${documentId}`);
        return response.data;
    } catch (error) {
        throw new Error("Error al reenviar el correo");
    }
}

export async function deleteDocument(documentId: string) {
    try {
        const response = await axios.delete(`${API_BASE_URL_2}/Document/${documentId}`);
        return response.data;
    } catch (error) {
        throw new Error("Error al eliminar el documento");
    }
}

export async function  rejectDocument(documentId: string, reason: string) {
    try {
        const body = {
            reason: reason
        };
        const response = await axios.put(`${API_BASE_URL_2}/DW/${documentId}/reject`, body);
        console.log('Documento rechazado exitosamente: ', response.data);
    } catch (error) {
        throw new Error('Error al rechazar el documento');
    }
}
