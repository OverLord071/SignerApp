// noinspection Annotator
import axios from 'axios';
import FormData from 'form-data';
import {JSEncrypt} from "jsencrypt";

const API_BASE_URL_2 = "https://localhost:7159/api";
//const API_BASE_URL_2 = "https://dwdemos.digitalsolutions.com.ec/signer/api";

interface SignParams {
    certificateFile: File;
    password: string;
    pdfFile: Blob;
    reason: string;
    location: string;
    page: number;
    posX: number;
    posY: number;
    documentId: string;
}

const getPublicKey = async () => {
    try {
        const response = await axios.get(API_BASE_URL_2 + "/Key/publicKey");
        return response.data;
    } catch (error) {
        console.error("Error al obtener la clave pública:", error);
        throw error;
    }
}

export const authenticateUser = async (usernameOrEmail: string, password: string) => {
    try {
        const credentials = {
            username: usernameOrEmail,
            password: password
        };

        const publicKey = await getPublicKey();

        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);

        const plainText = JSON.stringify(credentials);

        const encryptedData = encrypt.encrypt(plainText);

        if (!encryptedData) {
            throw new Error(`Error al cifrar los datos: ${encryptedData}`);
        }

        const response = await axios.post(`${API_BASE_URL_2}/DW/login`, { encryptedData });
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


export async function singPdf(params: SignParams) {
    const formData = new FormData();

    formData.append('certificateFile', params.certificateFile);
    formData.append('pdfFile', params.pdfFile);

    const requestBody = {
        password: params.password,
        reason: params.reason,
        location: params.location,
        page: params.page,
        positionX: params.posX,
        positionY: params.posY,
        documentId: params.documentId
    };

    const publicKey = await getPublicKey();

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);

    const plainText = JSON.stringify(requestBody);

    const encryptedData = encrypt.encrypt(plainText);

    if (!encryptedData) {
        throw new Error(`Error al cifrar los datos: ${encryptedData}`);
    }

    formData.append('encryptedData', encryptedData);

    // noinspection Annotator
    const response = await axios.post(`${API_BASE_URL_2}/DW/sign-pdf-encrypted`,
        formData,
        {
                    headers: {
                                'Content-Type': 'multipart/form-data',
                                'accept': '*/*'
                    }
        }
    );
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

export async function deleteUser(userId: string) {
  try {
      const response = await axios.delete(`${API_BASE_URL_2}/DW/${userId}`);
      return response.data;
  }  catch (error) {
      throw new Error("Error al eliminar el usuario");
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

export async function changeStatusUser(userId: string) {
    try {
        const response = await axios.put(`${API_BASE_URL_2}/DW/changeStatus/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al cambiar el estado del usuario');
    }
}

export async function getAllUsers() {
    try {
        const response = await axios.get(`${API_BASE_URL_2}/DW/getAllUsers`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener los usuarios');
    }
}

export async function validateToken(token: string) {
    try {
        const response = await axios.get(`${API_BASE_URL_2}/DW/validateToken?token=${token}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al validar el token');
    }
}

export async function changePasswordWithToken(token: string, password: string) {
    try {
        const body = {
            token: token,
            password: password,
        };
        const response = await axios.post(`${API_BASE_URL_2}/DW/changePasswordWithToken`, body);
        return response.data;
    } catch (error) {
        throw new Error('Error al actualizar la contraseña.');
    }
}

export async function  sendLinkToChangePassword(email: string) {
    try {
        const body = {
          email: email
        };
        const response = await axios.post(`${API_BASE_URL_2}/DW/sendPasswordLink`, body);
        return response.data;
    } catch (error) {
        throw new Error('Error al enviar el correo.');
    }
}

export async function generateRandomPassword(email: string) {
    try {
        const body = {
          email: email,
        };
        const response = await axios.post(`${API_BASE_URL_2}/DW/generate-random-password`, body);
        return response.data;
    } catch (error) {
        throw new Error('Error al reiniciar la contraseña.');
    }
}