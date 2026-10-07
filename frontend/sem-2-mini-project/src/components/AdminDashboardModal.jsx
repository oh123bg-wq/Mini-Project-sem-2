const AdminDashboardModal = ({ show, onClose, onSubmit, formData, setFormData, isEditMode }) => {
    if (!show) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    
                    {/* Header */}
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title fw-bold">
                            {isEditMode ? 'Edit User' : 'New User'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label fw-medium">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter user name"
                                    value={formData.name || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter email address"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="row g-3">
                                <div className="col-md-7">
                                    <label className="form-label fw-medium">
                                        Password {isEditMode && <small className="text-muted">(Optional)</small>}
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder={isEditMode ? "Leave blank to keep" : "Enter password"}
                                        value={formData.password || ''}
                                        onChange={handleChange}
                                        required={!isEditMode}
                                    />
                                </div>
                                <div className="col-md-5">
                                    <label className="form-label fw-medium">Role</label>
                                    <select
                                        name="role"
                                        className="form-select"
                                        value={formData.role || 'user'}
                                        onChange={handleChange}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardModal;