// src/components/ClassNoteModal.jsx
import React from 'react';

const ClassNoteModal = ({ show, onClose, onSubmit, formData, setFormData }) => {
    // 如果 show 为 false，直接不渲染任何 DOM
    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">New Class Note</h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Title</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    required 
                                    value={formData.title} 
                                    onChange={e => setFormData({ ...formData, title: e.target.value })} 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Subject</label>
                                <select 
                                    className="form-select" 
                                    value={formData.subject} 
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="System Design">System Design</option>
                                    <option value="Web Development">Web Development</option>
                                    <option value="Database">Database</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Tags (comma separated)</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="react, hooks" 
                                    value={formData.tags} 
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })} 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Content</label>
                                <textarea 
                                    className="form-control" 
                                    rows="4" 
                                    required 
                                    value={formData.bodyContent} 
                                    onChange={e => setFormData({ ...formData, bodyContent: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save Note
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClassNoteModal;