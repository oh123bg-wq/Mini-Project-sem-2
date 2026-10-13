import { useState, useEffect } from 'react';
import { Plus, Calendar, Tag, Trash2, Pin, Edit } from 'lucide-react';
import api from '../utils/api';
import ClassNoteModal from '../components/ClassNoteModal';
import '../assets/css/ui.css';

const ClassNotesPage = () => {
    // Stores fetched notes
    const [notes, setNotes] = useState([]);
    // Search bar input
    const [searchTerm, setSearchTerm] = useState('');
    // Filter dropdown
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

    // Get all notes
    const fetchNotes = async () => {
        try {
            const res = await api.get('/classNotes');
            // update the 'notes' state (show all notes)
            setNotes(res.data);
        } catch (err) {
            console.error('Failed to fetch class notes:', err);
        }
    };

    // get all notes only once(when the page load)
    useEffect(() => {
        fetchNotes();
        // empty dependency array
    }, []);

    // function to close popup modal and reset the form
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        // Reset the form
        setFormData({ title: '', subject: 'Computer Science', tags: '', bodyContent: '' });
    };

    // function that triggers when user click the edit button
    const handleEditClick = (note) => {
        // fill in the existing data of the notes
        setFormData({
            title: note.title,
            subject: note.subject,
            tags: note.tags ? note.tags.join(', ') : '',
            bodyContent: note.bodyContent
        });
        // let the app know whihc note you editing
        setEditingId(note._id);
        setShowModal(true);
    };

    // Create & Update
    const handleSubmit = async (e) => {
        // prevent page refresh
        e.preventDefault();
        try {
            // Create a new data object to send to backend
            const payload = {
                // Copy all current properties from the formData state (title, subject, bodyContent)
                ...formData,
                // Convert the comma-separated tags string back into a clean array of individual words if empty give empty array
                // map(t => t.trim()) to remove extra whitespaces
                // filter(Boolean) to remove any empty items.
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
            };

            if (editingId) {
                // , payload is to send the edited data to backend so that backend know edit what data
                const res = await api.put(`/classNotes/${editingId}`, payload);
                // Update the page without refresh page
                setNotes(notes.map(n => n._id === editingId ? res.data : n));
            } else {
                // create new note
                const res = await api.post('/classNotes', payload);
                // update the page latest notes in front
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
            // Update the page without refresh page
            setNotes(notes.map(n => n._id === id ? res.data : n));
        } catch (err) {
            console.error('Toggle pin failed:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await api.delete(`/classNotes/${id}`);
            // filter the array to keep only the notes whose ID does NOT match the deleted ID
            setNotes(notes.filter(n => n._id !== id));
        } catch (err) {
            console.error('Delete note failed:', err);
        }
    };

    // 过滤 + 置顶项优先排序
    const filteredNotes = notes
        // 使用 .filter() 遍历 notes 数组，筛选出符合条件的笔记
        .filter(note => {
            // the first tolowercase is turn all data to small letter and second tolowercase is turn all user type data to small
            const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  note.bodyContent.toLowerCase().includes(searchTerm.toLowerCase());
            // Check if note matches selected subject (or return 'All' if no subject selected)
            const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
            return matchesSearch && matchesSubject;
        })
        // 如果 b 被置顶 (true)，(b.isPinned ? 1 : 0) 为 1；如果 a 没置顶，算式结果为 1 - 0 = 1 (正数)，代表 b 排到 a 前面
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    return (
        <div className="note-page-container">
            {/* Header */}
            <header className="page-header">
                <div>
                    <h2>Class Notes</h2>
                    <p className="subtitle">Organize and review your lecture summaries and study topics.</p>
                </div>
                <button className="primary-btn" onClick={() => setShowModal(true)}>
                    <Plus size={18} /> New Class Note
                </button>
            </header>

            {/* Filter Toolbar */}
            <div className="toolbar-container mb-4">
                <div className="row g-2 align-items-center justify-content-between">
                    {/* 左侧 Search Bar */}
                    <div className="col-12 col-md-6 col-lg-5">
                        <input
                            type="text"
                            className="form-control form-control-sm shadow-sm"
                            placeholder="Search class notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* 右侧 Select Dropdown */}
                    <div className="col-12 col-md-4 col-lg-3 ms-auto">
                        <select 
                            className="form-select form-select-sm shadow-sm" 
                            value={selectedSubject} 
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
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
                        <div className="mt-3">
                            {note.tags && note.tags.length > 0 && (
                                <div>
                                    {note.tags.map((tag, index) => (
                                        <span 
                                            key={index} 
                                            className="badge bg-primary rounded-pill me-1"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
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