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

    // 初始化表单数据
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });

    // 从 LocalStorage 获取当前登录的管理员，用于权限比对
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
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
            setUsers(users.filter((u) => u._id !== id));
        } catch (err) {
            alert(err.response?.data?.error || "Delete user failed");
        }
    };

    // 触发创建模式 Pop-out Modal
    const handleCreateClick = () => {
        setIsEditMode(false);
        setFormData({ name: "", email: "", password: "", role: "user" });
        setShowModal(true);
    };

    // 触发编辑模式 Pop-out Modal
    const handleEditClick = (user) => {
        if (currentUser && user._id === currentUser._id) {
            alert("Action Denied: You cannot edit your own account.");
            return;
        }
        setIsEditMode(true);
        setEditUserId(user._id);
        // 密码留空，只有在输入新密码时才更新
        setFormData({ name: user.name, email: user.email, password: "", role: user.role });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ name: "", email: "", password: "", role: "user" });
    };

    // 提交表单数据
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 如果是编辑模式但没填密码，则把密码字段移除，避免把空字符串发给后端
            const payload = { ...formData };
            if (isEditMode && !payload.password) {
                delete payload.password;
            }

            if (isEditMode) {
                // 执行更新请求
                const res = await api.put(`/users/${editUserId}`, payload);
                setUsers(users.map((u) => (u._id === editUserId ? res.data : u)));
            } else {
                // 执行创建请求
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
                        <ShieldCheck className="text-warning d-inline me-2" size={28} />
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
