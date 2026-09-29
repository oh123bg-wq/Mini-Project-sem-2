import { useState } from 'react';
import { Terminal, Copy, Check, Plus, Pin, Trash2, Tag } from 'lucide-react';
import '../assets/css/CheatsheetPage.css';

const CheatsheetPage = () => {
    // 静态测试数据
    const [cheatsheets, setCheatsheets] = useState([
        {
            _id: '1',
            title: 'Git Commands',
            category: 'DevOps',
            isPinned: true,
            commands: [
                { command: 'git commit -m "feat: add user api"', desc: 'Commit changes with message' },
                { command: 'git checkout -b feature/login', desc: 'Create and switch branch' }
            ]
        },
        {
            _id: '2',
            title: 'Array Methods',
            category: 'JavaScript',
            isPinned: false,
            commands: [
                { command: 'const active = items.filter(i => i.isActive);', desc: 'Filter active items' }
            ]
        },
        {
            _id: '3',
            title: 'Flexbox Center',
            category: 'CSS',
            isPinned: false,
            commands: [
                { command: 'display: flex;\njustify-content: center;\nalign-items: center;', desc: 'Center element' }
            ]
        }
    ]);

    const [copiedId, setCopiedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', category: '', command: '', desc: '' });

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleTogglePin = (id) => {
        setCheatsheets(cheatsheets.map(item => 
            item._id === id ? { ...item, isPinned: !item.isPinned } : item
        ));
    };

    const handleDelete = (id) => {
        setCheatsheets(cheatsheets.filter(item => item._id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = {
            _id: Date.now().toString(),
            title: formData.title,
            category: formData.category,
            isPinned: false,
            commands: [{ command: formData.command, desc: formData.desc }]
        };
        setCheatsheets([newItem, ...cheatsheets]);
        setShowModal(false);
        setFormData({ title: '', category: '', command: '', desc: '' });
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
                                <button onClick={() => handleTogglePin(item._id)} className={`action-btn ${item.isPinned ? 'active-pin' : ''}`}>
                                    <Pin size={16} />
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
                                        <button className="copy-btn" onClick={() => handleCopy(cmd.command, `${item._id}-${idx}`)}>
                                            {copiedId === `${item._id}-${idx}` ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <pre className="command-code"><code>{cmd.command}</code></pre>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3>Create New Cheatsheet</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Title (e.g. Git Basics)"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Category (e.g. Git, React, Docker)"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Description (e.g. Commit changes)"
                                value={formData.desc}
                                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Command or Code"
                                value={formData.command}
                                onChange={(e) => setFormData({ ...formData, command: e.target.value })}
                                required
                            />
                            <div className="modal-buttons">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="primary-btn">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheatsheetPage;