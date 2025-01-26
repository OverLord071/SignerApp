import React, {FC, useEffect, useState} from 'react';
import "./UserTable.scss";
import Button from "../../atoms/Button/Button";
import {FaEnvelope, FaTrash, FaUndoAlt, FaUserCheck, FaUserTimes} from "react-icons/fa";
import {
    changeStatusUser,
    deleteUser, generateRandomPassword,
    getAllUsers,
    sendLinkToChangePassword
} from "../../../api/UserService";

type User = {
    id: string;
    name: string;
    email: string;
    dateRegister: string;
    isActive: boolean;
};

const UserTable:FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 20;
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User|null>();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getAllUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, []);

    const toggleActiveStatus = async (id: string) => {
        setLoading(prev => ({ ...prev, [id]: true }));

        try {
            const response = await changeStatusUser(id);
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === id ? {...user, isActive: response.isActive} : user
                )
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    const sendResendLink = async (email: string) => {
        try {
            const response = await sendLinkToChangePassword(email)
            alert(response);
        } catch (error) {
            console.error(error);
        }
    };

    const resetPassword = async (email: string) => {
        try {
            const response = await generateRandomPassword(email);
            alert(response);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteUser = (user: User) => {
        setUserToDelete(user);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (userToDelete) {
            try {
                await deleteUser(userToDelete.id);
                alert('Usuario eliminado con éxito');
                setUserToDelete(null);
                setShowConfirmModal(false);
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
            }
            setUsers(users.filter((user) => user.id !== userToDelete.id));
        }
    };

    const cancelDelete = () => {
        setUserToDelete(null);
        setShowConfirmModal(false);
    };

    const pageCount = Math.ceil(users.length / itemsPerPage);

    return (
        <div className="user-table-container">
            <h2>Lista de Usuarios</h2>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Fullname</th>
                        <th>Fecha de alta</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users
                        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                        .map((user) => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.name}</td>
                                <td>{user.dateRegister}</td>
                                <td>
                                    <Button Icon={<FaEnvelope/>} onClick={() => sendResendLink(user.email)}/>
                                    <Button Icon={<FaUndoAlt/>} onClick={() => resetPassword(user.email)}/>
                                    <Button
                                        Icon={
                                            loading[user.id] ? (
                                                <span className="spinner"></span>
                                            ) : user.isActive ? (
                                                <FaUserTimes/>
                                            ) : (
                                                <FaUserCheck/>
                                            )
                                        }
                                        variant="toggle"
                                        onClick={() => toggleActiveStatus(user.id)}
                                        isActive={user.isActive}
                                        disabled={loading[user.id]}
                                    />
                                    <Button Icon={<FaTrash/>} variant="cancel" onClick={() => handleDeleteUser(user)}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination-container">
                <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                >
                    Anterior
                </button>
                <span>
                    Página {currentPage + 1} de {pageCount}
                </span>
                <button
                    disabled={currentPage >= pageCount - 1}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1))}
                >
                    Siguiente
                </button>
            </div>
            {showConfirmModal && (
                <div className="confirm-modal">
                    <div className="confirm-modal-content">
                        <h3>Esta seguro de eliminar este usuario?</h3>
                        <p>{userToDelete?.name}</p>
                        <div className="confirm-modal-actions">
                            <Button text="Confirmar"  variant="primary" onClick={confirmDelete}/>
                            <Button text="Cancelar" variant="cancel" onClick={cancelDelete} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;