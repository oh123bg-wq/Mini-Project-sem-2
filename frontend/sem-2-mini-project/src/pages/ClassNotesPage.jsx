import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Tag, Trash2, Pin, Edit } from 'lucide-react';
import api from '../utils/api';
import ClassNoteModal from '../components/ClassNoteModal';
import '../assets/css/ui.css';

const ClassNotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');
    
    // Modal & Editing State
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ 
        title: '', 
        subject: 'Computer Science', 
        tags: '', 
        bodyContent: '' 
    });

    const fetchNotes = async () => {
        try {
            const res = await api.get('/classNotes');
            setNotes(res.data);
        } catch (err) {
            console.error('Failed to fetch class notes:', err);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ title: '', subject: 'Computer Science', tags: '', bodyContent: '' });
    };

    const handleEditClick = (note) => {
        setFormData({
            title: note.title,
            subject: note.subject,
            tags: note.tags ? note.tags.join(', ') : '',
            bodyContent: note.bodyContent
        });
        setEditingId(note._id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
            };

            if (editingId) {
                const res = await api.put(`/classNotes/${editingId}`, payload);
                setNotes(notes.map(n => n._id === editingId ? res.data : n));
            } else {
                const res = await api.post('/classNotes', payload);
                setNotes([res.data, ...notes]);
            }
            handleCloseModal();
        } catch (err) {
            console.error('Submit failed:', err);
        }
    };

    const handleTogglePin = async (id) => {
        try {
            const res = await api.patch(`/classNotes/${id}/pin`);
            setNotes(notes.map(n => n._id === id ? res.data : n));
        } catch (err) {
            console.error('Toggle pin failed:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await api.delete(`/classNotes/${id}`);
            setNotes(notes.filter(n => n._id !== id));
        } catch (err) {
            console.error('Delete note failed:', err);
        }
    };

    // 过滤 + 置顶项优先排序
    const filteredNotes = notes
        .filter(note => {
            const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  note.bodyContent.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
            return matchesSearch && matchesSubject;
        })
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    return (
        <div className="note-page-container">
            {/* Header */}
            <header className="page-header">
                <div>
                    <h2>📚 Class Notes</h2>
                    <p className="subtitle">Organize and review your lecture summaries and study topics.</p>
                </div>
                <button className="primary-btn" onClick={() => setShowModal(true)}>
                    <Plus size={18} /> New Class Note
                </button>
            </header>

            {/* Filter Toolbar */}
            <div className="toolbar-container mb-4">
                <div className="row g-3">
                    <div className="col-md-8">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <Search size={18} className="text-muted" />
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Search class notes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <select className="form-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                            <option value="All">All Subjects</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="System Design">System Design</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Database">Database</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid List */}
            <div className="cheatsheet-grid">
                {filteredNotes.map((note) => (
                    <div className={`cheatsheet-card ${note.isPinned ? 'border-start border-primary border-4' : ''}`} key={note._id}>
                        <div className="card-top">
                            <span className="category-badge">
                                <Tag size={12} />
                                {note.subject}
                            </span>
                            <div className="d-flex gap-1">
                                <button className={`action-btn ${note.isPinned ? 'text-primary' : ''}`} onClick={() => handleTogglePin(note._id)} title="Pin Note">
                                    <Pin size={16} />
                                </button>
                                <button className="action-btn" onClick={() => handleEditClick(note)} title="Edit Note">
                                    <Edit size={16} />
                                </button>
                                <button className="action-btn delete" onClick={() => handleDelete(note._id)} title="Delete Note">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="card-title text-break">{note.title}</h3>
                        <p className="text-muted flex-grow-1 fs-6 mb-3 text-break" style={{ lineHeight: '1.6' }}>
                            {note.bodyContent?.length > 120 ? note.bodyContent.substring(0, 120) + '...' : note.bodyContent}
                        </p>

                        <div className="d-flex align-items-center gap-1 text-muted fs-7 pt-2 border-top">
                            <Calendar size={14} />
                            <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            <ClassNoteModal 
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

export default ClassNotesPage;