import axios from 'axios';
import FormData from 'form-data';

export const authenticateUser = async (usernameOrEmail: string, password: string) => {
    try {
        const response = await axios.post(`https://dwdemos.digitalsolutions.com.ec/signer/api/DW/login?usernameOrEmail=${usernameOrEmail}&password=${password}`);
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

export async function singPdf(certificateFile: File, password: string, pdfFile: Blob, reason: string, location: string, page: number, posX: number, posY: number) {
    const formData = new FormData();

    formData.append('certificateFile', certificateFile);
    formData.append('pdfFile', pdfFile);

    const encodedPassword = encodeURIComponent(password);

    const response = await axios.post(`https://dwdemos.digitalsolutions.com.ec/signer/api/DW/sign-pdf?password=${encodedPassword}&reason=${reason}&location=${location}&page=${page}&positionX=${posX}&positionY=${posY}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'accept': '*/*'
        }
    });
    return response.data;
}

export async function changePassword(email: string, validationPin: string, newPassword: string) {
    try {
        const response = await axios.post('https://localhost:7159/api/DW/changePassword', {
            email,
            validationPin,
            newPassword
        });
        return response.data;
    } catch (error) {
        throw new Error('Error al cambiar la contraseña');
    }
}

export async function createUser(user: any) {
    try {
        const response = await axios.post('https://localhost:7159/api/DW/register', user);
        return response.data;
    } catch (error) {
        throw new Error('Error al crear el usuario');
    }
}

export async function getUserById(id: string) {
    try {
        const response = await axios.get(`https://localhost:7159/api/DW/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener el usuario');
    }
}

export async function sendPinValidation(email: string) {
    try {
        const response = await axios.post('https://localhost:7159/api/DW/sendPinValidation', {email});
        return response.data;
    } catch (error) {
        throw new Error('Error al enviar el PIN de validación');
    }
}

export async function createCertificate(id: string, certificate: File, pinCertificate: string) {
    try {
        const formData = new FormData();
        formData.append('certificate', certificate);

        const response = await axios.post(`https://localhost:7159/api/DW/createCertificate?id=${id}&pinCertificate=${pinCertificate}`, formData, {});

        return response.data;
    } catch (error) {
        throw new Error('Error al crear el certificado');
    }
}

export async function verifyEmail(email: string, verificationCode: string) {
    try {
        const response = await axios.post(`https://dwdemos.digitalsolutions.com.ec/signer/api/DW/verifyEmail?email=${email}&verificationCode=${verificationCode}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(JSON.stringify(error.response.data, null, 2));
        } else {
            throw new Error(`Error desconocido al verificar el correo: ${error}`);
        }
    }
}

export async function updateCertificate(id: string, certificate: string, pinCertificate: string) {
    try {
        const response = await axios.post(`https://localhost:7159/api/DW/updateCertificate`, {
            id,
            certificate,
            pinCertificate
        });
        return response.data;
    } catch (error) {
        throw new Error('Error al actualizar el certificado');
    }
}

export async function getDocumentsByEmail(email: string) {
    try {
        const response = await axios.get(`https://dwdemos.digitalsolutions.com.ec/signer/api/Document/${email}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Error al obtener los documentos');
    }
}

export async function updateDocumentIsSigned(id: string) {
    try {
        const response = await axios.put(`https://dwdemos.digitalsolutions.com.ec/signer/api/Document/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al actualizar el documento');
    }
}

