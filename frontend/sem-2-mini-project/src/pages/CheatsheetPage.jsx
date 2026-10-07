import { useState, useEffect } from 'react';
import { Copy, Check, Plus, Trash2, Tag, Edit } from 'lucide-react';
import api from '../utils/api';
import CheatsheetModal from '../components/CheatsheetModal';
import '../assets/css/CheatsheetPage.css';

const CheatsheetPage = () => {
    const [cheatsheets, setCheatsheets] = useState([]);
    const [copiedId, setCopiedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', category: '', command: '', desc: '' });
    const [editingId, setEditingId] = useState(null);

    const fetchCheatsheets = async () => {
        try {
            const res = await api.get('/cheatsheets');
            setCheatsheets(res.data);
        } catch (err) {
            console.error('Failed to fetch cheatsheets:', err);
        }
    };

    useEffect(() => {
        fetchCheatsheets();
    }, []);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this cheatsheet?')) return;
        try {
            await api.delete(`/cheatsheets/${id}`);
            setCheatsheets(cheatsheets.filter(item => item._id !== id));
        } catch (err) {
            console.error('Delete cheatsheet failed:', err);
        }
    };

    const handleEditClick = (item) => {
        setFormData({ 
            title: item.title, 
            category: item.category, 
            command: item.commands[0]?.command || '', 
            desc: item.commands[0]?.desc || '' 
        });
        setEditingId(item._id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ title: '', category: '', command: '', desc: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: formData.title,
                category: formData.category,
                commands: [{ command: formData.command, desc: formData.desc }]
            };
            
            if (editingId) {
                const res = await api.put(`/cheatsheets/${editingId}`, payload);
                setCheatsheets(cheatsheets.map(item => item._id === editingId ? res.data : item));
            } else {
                const res = await api.post('/cheatsheets', payload);
                setCheatsheets([res.data, ...cheatsheets]);
            }
            handleCloseModal();
        } catch (err) {
            console.error('Submit failed:', err);
        }
    };

    return (
        <div className="note-page-container">
            <header className="page-header">
                <div>
                    <h2>⚡ Quick Cheatsheets</h2>
                    <p className="subtitle">Reference commands, shortcuts, and code snippets instantly.</p>
                </div>
                <button className="primary-btn" onClick={() => setShowModal(true)}>
                    <Plus size={18} /> New Cheatsheet
                </button>
            </header>

            <div className="cheatsheet-grid">
                {cheatsheets.map((item) => (
                    <div className={`cheatsheet-card ${item.isPinned ? 'pinned' : ''}`} key={item._id}>
                        <div className="card-top">
                            <span className="category-badge">
                                <Tag size={12} /> {item.category}
                            </span>
                            <div className="card-actions">
                                <button onClick={() => handleEditClick(item)} className="action-btn text-primary">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(item._id)} className="action-btn delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="card-title">{item.title}</h3>

                        <div className="commands-list">
                            {item.commands?.map((cmd, idx) => (
                                <div key={idx} className="command-block">
                                    <div className="command-header">
                                        <span className="desc-text">{cmd.desc}</span>
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
                                    <pre className="command-code"><code>{cmd.command}</code></pre>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
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