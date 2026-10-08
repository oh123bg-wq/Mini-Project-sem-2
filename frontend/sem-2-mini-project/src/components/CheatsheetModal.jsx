import { Plus, Trash2 } from 'lucide-react';

const CheatsheetModal = ({ show, onClose, onSubmit, formData, setFormData, isEditing }) => {
    if (!show) return null;

    // 更新特定索引位置的 command 或 desc
    const handleCommandChange = (index, field, value) => {
        const updatedCommands = [...formData.commands];
        updatedCommands[index] = { 
            ...updatedCommands[index], 
            [field]: value 
        };
        setFormData({ ...formData, commands: updatedCommands });
    };

    // 添加新的 Command 行
    const handleAddCommand = () => {
        setFormData({
            ...formData,
            commands: [...formData.commands, { command: '', desc: '' }]
        });
    };

    // 删除指定索引的 Command 行
    const handleRemoveCommand = (index) => {
        const updatedCommands = formData.commands.filter((_, i) => i !== index);
        setFormData({ ...formData, commands: updatedCommands });
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">{isEditing ? 'Edit Cheatsheet' : 'New Cheatsheet'}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Title</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        required 
                                        placeholder="e.g. Git Version Control Commands"
                                        value={formData.title || ''} 
                                        onChange={e => setFormData({ ...formData, title: e.target.value })} 
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Category</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        required 
                                        placeholder="e.g. Git & GitHub"
                                        value={formData.category || ''} 
                                        onChange={e => setFormData({ ...formData, category: e.target.value })} 
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-2 border-top pt-3">
                                <label className="form-label fw-bold m-0">Commands / Code Snippets</label>
                                <button 
                                    type="button" 
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                    onClick={handleAddCommand}
                                >
                                    <Plus size={16} /> Add Command
                                </button>
                            </div>

                            {formData.commands?.map((cmd, idx) => (
                                <div key={idx} className="p-3 mb-3 border rounded bg-light position-relative">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="badge bg-secondary"># {idx + 1}</span>
                                        {formData.commands.length > 1 && (
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-outline-danger border-0 p-1"
                                                onClick={() => handleRemoveCommand(idx)}
                                                title="Remove command"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Description 放在前面 */}
                                    <div className="mb-2">
                                        <label className="form-label small text-muted mb-1">Description</label>
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm" 
                                            placeholder="Create & switch to new branch"
                                            value={cmd.desc || ''} 
                                            onChange={e => handleCommandChange(idx, 'desc', e.target.value)}
                                        />
                                    </div>

                                    {/* Command / Code 放在后面 */}
                                    <div>
                                        <label className="form-label small text-muted mb-1">Command / Code</label>
                                        <textarea 
                                            className="form-control font-monospace" 
                                            rows="2" 
                                            required 
                                            placeholder="git checkout -b feature/new-idea"
                                            value={cmd.command || ''} 
                                            onChange={e => handleCommandChange(idx, 'command', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary">{isEditing ? 'Update Cheatsheet' : 'Save Cheatsheet'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheatsheetModal;