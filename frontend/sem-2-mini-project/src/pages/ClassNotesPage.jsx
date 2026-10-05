// src/pages/ClassNotesPage.jsx
import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Calendar, Tag, Trash2, Pin } from 'lucide-react';
import api from '../utils/api';
import ClassNoteModal from '../components/ClassNoteModal'; // 引入抽离后的 Modal 组件

const ClassNotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');
    
    // Modal 状态管理
    const [showModal, setShowModal] = useState(false);
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

    const handleCreateNote = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
            };
            const res = await api.post('/classNotes', payload);
            setNotes([res.data, ...notes]);
            setShowModal(false);
            setFormData({ title: '', subject: 'Computer Science', tags: '', bodyContent: '' });
        } catch (err) {
            console.error('Fetch Failed Status:', err.response?.status); // 打印 HTTP 状态码
        console.error('Fetch Failed Message:', err.response?.data || err.message);
            console.error('Create note failed:', err);
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

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              note.bodyContent.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
        return matchesSearch && matchesSubject;
    });

    return (
        <div className="container my-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold d-flex align-items-center gap-2 mb-1">
                        <BookOpen color="#4F46E5" size={28} />
                        <span>Class Notes</span>
                    </h2>
                    <p className="text-muted mb-0">Organize and review your lecture summaries and study topics.</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2 px-3" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    <span>New Class Note</span>
                </button>
            </div>

            <div className="row g-3 mb-4">
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

            {/* 卡片列表 */}
            <div className="row g-4">
                {filteredNotes.map((note) => (
                    <div key={note._id} className="col-md-6 col-lg-4">
                        <div className={`card h-100 shadow-sm border-0 bg-white ${note.isPinned ? 'border-start border-primary border-4' : ''}`}>
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-pill d-flex align-items-center gap-1">
                                        <Tag size={12} />
                                        {note.subject}
                                    </span>
                                    <div className="d-flex gap-2">
                                        <button className={`btn btn-sm btn-link p-0 ${note.isPinned ? 'text-primary' : 'text-muted'}`} onClick={() => handleTogglePin(note._id)}>
                                            <Pin size={16} />
                                        </button>
                                        <button className="btn btn-sm btn-link text-danger p-0" onClick={() => handleDelete(note._id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h5 className="card-title fw-bold text-dark">{note.title}</h5>
                                <p className="card-text text-muted flex-grow-1 fs-6">
                                    {note.bodyContent?.length > 110 ? note.bodyContent.substring(0, 110) + '...' : note.bodyContent}
                                </p>
                                <div className="d-flex align-items-center gap-1 text-muted fs-7 mt-3">
                                    <Calendar size={14} />
                                    <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 调用抽离后的 Modal 组件 */}
            <ClassNoteModal 
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleCreateNote}
                formData={formData}
                setFormData={setFormData}
            />
        </div>
    );
};

export default ClassNotesPage;