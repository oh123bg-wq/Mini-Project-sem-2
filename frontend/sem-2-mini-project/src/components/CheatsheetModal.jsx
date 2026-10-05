import React from 'react';

const CheatsheetModal = ({ show, onClose, onSubmit, formData, setFormData, isEditing }) => {
    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">{isEditing ? 'Edit Cheatsheet' : 'New Cheatsheet'}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Title</label>
                                <input type="text" className="form-control" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Category</label>
                                <input type="text" className="form-control" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Description</label>
                                <input type="text" className="form-control" required value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Command / Code</label>
                                <textarea className="form-control font-monospace" rows="3" required value={formData.command} onChange={e => setFormData({ ...formData, command: e.target.value })}></textarea>
                            </div>
                        </div>
                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Save'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheatsheetModal;