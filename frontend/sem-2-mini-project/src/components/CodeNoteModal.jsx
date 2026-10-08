const CodeNoteModal = ({ show, onClose, onSubmit, formData, setFormData, isEditing }) => {
    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">{isEditing ? 'Edit Snippet' : 'New Snippet'}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="row mb-3">
                                <div className="col-md-5">
                                    <label className="form-label fw-semibold">Title</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        required 
                                        placeholder="e.g. useState Hook Example"
                                        value={formData.title || ''} 
                                        onChange={e => setFormData({ ...formData, title: e.target.value })} 
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Category</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        required 
                                        placeholder="e.g. Frontend, Utility" 
                                        value={formData.category || ''} 
                                        onChange={e => setFormData({ ...formData, category: e.target.value })} 
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">Language</label>
                                    <select 
                                        className="form-select" 
                                        value={formData.language || 'JavaScript'} 
                                        onChange={e => setFormData({ ...formData, language: e.target.value })}
                                    >
                                        <option value="JavaScript">JavaScript</option>
                                        <option value="Node.js">Node.js</option>
                                        <option value="Python">Python</option>
                                        <option value="HTML/CSS">HTML/CSS</option>
                                        <option value="SQL">SQL</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Description</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Brief description of what this code does..."
                                    value={formData.description || ''} 
                                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Code</label>
                                <textarea 
                                    className="form-control font-monospace" 
                                    rows="6" 
                                    required 
                                    placeholder="Paste or write code snippet here..."
                                    value={formData.code || ''} 
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                ></textarea>
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

export default CodeNoteModal;