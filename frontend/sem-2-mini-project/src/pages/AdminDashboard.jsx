import { useEffect, useState } from "react";
import { ShieldCheck, Trash2, Users, Edit, Plus, User as UserIcon } from "lucide-react";
import api from "../utils/api";
import AdminDashboardModal from "../components/AdminDashboardModal";
import "../assets/css/ui.css";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserId, setEditUserId] = useState(null);

    // Default form structure
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });

    // Get current logged-in admin from LocalStorage，用于权限比对
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // get all users
    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            // update page and show all users
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    // Auto-fetch when page loads
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${id}`);
            // filter the array to keep only the notes whose ID does NOT match the deleted ID
            setUsers(users.filter((u) => u._id !== id));
        } catch (err) {
            alert(err.response?.data?.error || "Delete user failed");
        }
    };

    // Open Modal for Create
    const handleCreateClick = () => {
        setIsEditMode(false);
        setFormData({ name: "", email: "", password: "", role: "user" });
        setShowModal(true);
    };

    // Open Modal for Edit
    const handleEditClick = (user) => {
        setIsEditMode(true);
        setEditUserId(user._id);
        // 密码留空，只有在输入新密码时才更新
        setFormData({ name: user.name, email: user.email, password: "", role: user.role });
        setShowModal(true);
    };

    // close modal
    const handleCloseModal = () => {
        setShowModal(false);
        // reset the form
        setFormData({ name: "", email: "", password: "", role: "user" });
    };

    // Submit Form (Create or Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 如果是编辑模式但没填密码，则把密码字段移除，避免把空字符串发给后端
            const payload = { ...formData };
            if (isEditMode && !payload.password) {
                delete payload.password;
            }

            if (isEditMode) {
                // , payload is to send the edited data to backend so that backend know edit what data
                // Update existing user (PUT)
                const res = await api.put(`/users/${editUserId}`, payload);
                setUsers(users.map((u) => (u._id === editUserId ? res.data : u)));
            } else {
                // Create new user (POST)
                const res = await api.post(`/users`, payload);
                setUsers([...users, res.data]);
            }
            handleCloseModal();
        } catch (err) {
            alert(err.response?.data?.error || "Action failed");
        }
    };

    return (
        <div className="note-page-container">
            {/* Header */}
            <header className="page-header">
                <div>
                    <h2>
                        Admin Dashboard
                    </h2>
                    <p className="subtitle">Manage user accounts, roles, and permissions.</p>
                </div>
                <button className="primary-btn" onClick={handleCreateClick}>
                    <Plus size={18} /> Create New User
                </button>
            </header>

            {/* User Directory Table Card */}
            <div className="toolbar-container p-0 overflow-hidden">
                <div className="p-3 bg-light border-bottom d-flex align-items-center gap-2">
                    <Users size={20} className="text-muted" />
                    <span className="fw-bold text-dark">User Directory ({users.length})</span>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4 py-3">User</th>
                                <th className="py-3">Email</th>
                                <th className="py-3">Role</th>
                                <th className="py-3">Joined Date</th>
                                <th className="text-end pe-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => {
                                // 检查这一行是不是当前登录的管理员自己
                                const isSelf = currentUser && u._id === currentUser._id;

                                return (
                                    <tr key={u._id}>
                                        <td className="ps-4 fw-semibold">{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`category-badge ${u.role === "admin" ? "bg-primary-subtle text-primary" : "bg-secondary-subtle text-secondary"}`}>
                                                {u.role === "admin" ? <ShieldCheck size={12} /> : <UserIcon size={12} />}
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</td>
                                        <td className="text-end pe-4">
                                            {/* Disable buttons if it's the admin's own account */}
                                            <button onClick={() => handleEditClick(u)} className="action-btn me-2" disabled={isSelf} title={isSelf ? "Cannot edit self" : "Edit User"}>
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteUser(u._id)} className="action-btn delete" disabled={isSelf} title={isSelf ? "Cannot delete self" : "Delete User"}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pop-out Modal */}
            <AdminDashboardModal show={showModal} onClose={handleCloseModal} onSubmit={handleSubmit} formData={formData} setFormData={setFormData} isEditMode={isEditMode} />
        </div>
    );
};

export default AdminDashboard;
