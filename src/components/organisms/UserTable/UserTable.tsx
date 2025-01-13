import React, {FC, useState} from 'react';
import "./UserTable.scss";
import Button from "../../atoms/Button/Button";
import {FaEnvelope, FaLock, FaTrash, FaUserCheck, FaUserTimes} from "react-icons/fa";

type User = {
    id: string;
    name: string;
    username: string;
    email: string;
    dateSing: string;
    isActive: boolean;
};

const usersData: User[] = [
    {
        id: "1",
        name: "Juan Perez",
        username: "juanp",
        email: "juan.perez@example.com",
        dateSing: "2024/03/23",
        isActive: false,
    },
    {
        id: "2",
        name: "Maria Garcia",
        username: "mariag",
        email: "maria.garcia@example.com",
        dateSing: "2024/03/23",
        isActive: true,
    },
];

const UserTable:FC = () => {
    const [users, setUsers] = useState<User[]>(usersData);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 20;

    const sendResendLink = (id: string) => {
        console.log(`Sending reset link to user ${id}`);
    }

    const resetPassword = (id: string) => {
        console.log(`Edit user ${id}`);
    };

    const toggleActiveStatus = (id: string) => {
        setUsers(users.map(user => user.id === id ? { ...user, isActive: !user.isActive } : user));
    };

    const handleDelete = (id: string) => {
        console.log(`Delete user ${id}`);
        setUsers(users.filter((user) => user.id !== id));
    };

    const pageCount = Math.ceil(users.length / itemsPerPage);


    return (
        <div className="user-table-container">
            <h1>Lista de Usuarios</h1>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Fullname</th>
                        <th>Fecha alta</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users
                        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                        .map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.name}</td>
                                <td>{user.dateSing}</td>
                                <td>
                                    <Button Icon={<FaEnvelope/>} onClick={() => sendResendLink(user.id)}/>
                                    <Button Icon={<FaLock/>} onClick={() => resetPassword(user.id)}/>
                                    <Button
                                        Icon={user.isActive ? <FaUserTimes /> : <FaUserCheck />}
                                        variant="toggle"
                                        onClick={() => toggleActiveStatus(user.id)}
                                        isActive={user.isActive}
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