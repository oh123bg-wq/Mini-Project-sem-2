import { useState, useEffect } from 'react';
import { Copy, Check, Plus, Trash2, Tag, Edit } from 'lucide-react';
import api from '../utils/api';
import CheatsheetModal from '../components/CheatsheetModal';
import '../assets/css/ui.css';

const CheatsheetPage = () => {
    const [cheatsheets, setCheatsheets] = useState([]);
    const [copiedId, setCopiedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const initialForm = {
        title: '',
        category: '',
        commands: [{ command: '', desc: '' }]
    };

    const [formData, setFormData] = useState(initialForm);

    // Get all notes
    const fetchCheatsheets = async () => {
        try {
            const res = await api.get('/cheatsheets', {
                params: { search: searchTerm }
            });
            // update the 'cheatsheets' state (show all notes)
            setCheatsheets(res.data);
        } catch (err) {
            console.error('Failed to fetch cheatsheets:', err);
        }
    };

    // get all notes when ppl search and (when the page load)
    useEffect(() => {
        fetchCheatsheets();
    }, [searchTerm]);

    const handleCopy = (text, id) => {
        // 使用浏览器原生的 Clipboard API 将代码文本写入系统剪贴板
        // save the code directly to the user's clipboard.
        navigator.clipboard.writeText(text);
        // 记录被复制的 snippet ID，触发UI图标变为 Check
        setCopiedId(id);
        // 设置 2 秒定时器，2 秒后清空 copiedId，图标恢复原状
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this cheatsheet?')) return;
        try {
            await api.delete(`/cheatsheets/${id}`);
            // Update the page without refresh page
            setCheatsheets(cheatsheets.filter(item => item._id !== id));
        } catch (err) {
            console.error('Delete cheatsheet failed:', err);
        }
    };

    // function that triggers when user click the edit button
    const handleEditClick = (item) => {
        // fill in the existing data of the notes
        setFormData({ 
            title: item.title, 
            category: item.category, 
            commands: item.commands && item.commands.length > 0 
                // Check if the item has existing commands. If yes, map over them to populate the form.
                ? item.commands.map(c => ({ 
                    command: c.command, 
                    // Fallback to an empty string if the description is missing to prevent UI errors
                    desc: c.desc || '' 
                })) 
                // If there are no commands, provide a default empty input row for the user
                : [{ command: '', desc: '' }]
        });
        // let the app know which note you editing
        setEditingId(item._id);
        // show the modal out
        setShowModal(true);
    };

    // Close modal and reset form
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        // reset the form
        setFormData(initialForm);
    };

    // Create or Update
    const handleSubmit = async (e) => {
        // prevent page refresh
        e.preventDefault();
        try {
            const payload = {
                title: formData.title,
                category: formData.category,
                commands: formData.commands
            };
            
            if (editingId) {
                // , payload is to send the edited data to backend so that backend know edit what data
                const res = await api.put(`/cheatsheets/${editingId}`, payload);
                setCheatsheets(cheatsheets.map(item => item._id === editingId ? res.data : item));
            } else {
                // create new cheatsheet
                const res = await api.post('/cheatsheets', payload);
                // update the page, latest cheatsheet in front
                setCheatsheets([res.data, ...cheatsheets]);
            }
            handleCloseModal();
        } catch (err) {
            console.error('Submit failed:', err);
        }
    };

    return (
        <div className="note-page-container">
            {/* Header */}
            <header className="page-header">
                <div>
                    <h2>Quick Cheatsheets</h2>
                    <p className="subtitle">Reference commands, shortcuts, and code snippets instantly.</p>
                </div>
                <button className="primary-btn" onClick={() => setShowModal(true)}>
                    <Plus size={18} /> New Cheatsheet
                </button>
            </header>

            <div className="toolbar-container mb-4">
                <div className="row">
                    <div className="col-12">
                        <input 
                            type="text" 
                            className="form-control form-control-sm shadow-sm" 
                            placeholder="Search by title, command, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="cheatsheet-grid">
                {cheatsheets.length > 0 ? (
                    cheatsheets.map((item) => (
                        <div className={`cheatsheet-card ${item.isPinned ? 'pinned' : ''}`} key={item._id}>
                            <div className="card-top">
                                <span className="category-badge">
                                    <Tag size={12} /> {item.category}
                                </span>
                                <div className="card-actions">
                                    <button onClick={() => handleEditClick(item)} className="action-btn">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className="action-btn delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="card-title text-break">{item.title}</h3>

                            <div className="commands-list">
                                {item.commands?.map((cmd, idx) => (
                                    <div key={idx} className="command-block">
                                        <div className="command-header">
                                            <span className="desc-text text-break">{cmd.desc}</span>
                                            <button 
                                                className="copy-btn" 
                                                onClick={() => handleCopy(cmd.command, `${item._id}-${idx}`)}
                                            >
                                                {copiedId === `${item._id}-${idx}` ? (
                                                    <Check size={14} color="#10B981" />
                                                ) : (
                                                    <Copy size={14} />
                                                )}
                                            </button>
                                        </div>
                                        <pre className="command-code text-break"><code>{cmd.command}</code></pre>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5 text-muted col-12">
                        No cheatsheets found.
                    </div>
                )}
            </div>

            <CheatsheetModal 
                show={showModal}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isEditing={!!editingId}
            />
        </div>
    );
};

export default CheatsheetPage;