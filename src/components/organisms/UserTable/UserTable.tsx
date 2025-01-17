import React, {FC, useEffect, useState} from 'react';
import "./UserTable.scss";
import Button from "../../atoms/Button/Button";
import {FaEnvelope, FaLock, FaTrash, FaUserCheck, FaUserTimes} from "react-icons/fa";
import {changeStatusUser, getAllUsers, sendLinkToChangePassword} from "../../../api/UserService";

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

    const resetPassword = (id: string) => {
        console.log(`Edit user ${id}`);
    };

    const handleDelete = (id: string) => {
        console.log(`Delete user ${id}`);
        setUsers(users.filter((user) => user.id !== id));
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
                                    <Button Icon={<FaLock/>} onClick={() => resetPassword(user.id)}/>
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
                                    <Button Icon={<FaTrash/>} variant="cancel--small" onClick={() => handleDelete(user.id)}/>
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
        </div>
    );
};

export default UserTable;