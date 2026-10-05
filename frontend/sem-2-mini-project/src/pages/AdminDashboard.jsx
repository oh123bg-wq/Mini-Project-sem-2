import React, { useEffect, useState } from 'react';
import { ShieldCheck, Trash2, Users } from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert(err.response?.data?.error || "Delete user failed");
        }
    };

    return (
        <div className="container my-4">
            <div className="d-flex align-items-center gap-2 mb-4">
                <ShieldCheck size={32} className="text-warning" />
                <h2>Admin Management Dashboard</h2>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white d-flex align-items-center gap-2">
                    <Users size={20} />
                    <span className="fw-bold">User Directory ({users.length})</span>
                </div>
                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined Date</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td className="fw-semibold">{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`badge ${u.role === 'admin' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td className="text-end">
                                        <button 
                                            onClick={() => handleDeleteUser(u._id)} 
                                            className="btn btn-outline-danger btn-sm"
                                            disabled={u.role === 'admin'}
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;