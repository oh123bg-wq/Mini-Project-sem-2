import React, { useState } from 'react';
import { BookOpen, Search, Plus, Calendar, Tag, Trash2, Edit3 } from 'lucide-react';

const ClassNotesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');

    // 示例数据：实际开发中通过 api.get('/notes/class-notes') 获取
    const [notes, setNotes] = useState([
        {
            id: 1,
            title: 'Data Structures: Binary Trees & Graphs',
            subject: 'Computer Science',
            date: '2026-09-28',
            content: 'Trees are non-linear data structures. BST property: Left node < Root < Right node. Graph traversal algorithms include BFS and DFS...',
        },
        {
            id: 2,
            title: 'Operating Systems: Thread Synchronization',
            subject: 'System Design',
            date: '2026-09-25',
            content: 'Mutexes and Semaphores are used to prevent race conditions in multi-threaded environments. Deadlock requires 4 conditions to occur...',
        },
    ]);

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              note.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
        return matchesSearch && matchesSubject;
    });

    return (
        <div className="container my-4">
            {/* Header Area */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold d-flex align-items-center gap-2 mb-1">
                        <BookOpen color="#4F46E5" size={28} />
                        <span>Class Notes</span>
                    </h2>
                    <p className="text-muted mb-0">Organize and review your lecture summaries and study topics.</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2 px-3">
                    <Plus size={18} />
                    <span>New Class Note</span>
                </button>
            </div>

            {/* Filter and Search Bar */}
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
                    <select 
                        className="form-select"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                        <option value="All">All Subjects</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="System Design">System Design</option>
                        <option value="Web Development">Web Development</option>
                    </select>
                </div>
            </div>

            {/* Note Cards Grid */}
            <div className="row g-4">
                {filteredNotes.map((note) => (
                    <div key={note.id} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm border-0 bg-white">
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <span className="badge bg-indigo-subtle text-indigo px-2 py-1 border border-indigo-subtle rounded-pill d-flex align-items-center gap-1">
                                        <Tag size={12} />
                                        {note.subject}
                                    </span>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-link text-muted p-0"><Edit3 size={16} /></button>
                                        <button className="btn btn-sm btn-link text-danger p-0"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <h5 className="card-title fw-bold text-dark">{note.title}</h5>
                                <p className="card-text text-muted flex-grow-1 fs-6">
                                    {note.content.length > 110 ? note.content.substring(0, 110) + '...' : note.content}
                                </p>
                                <div className="d-flex align-items-center gap-1 text-muted fs-7 mt-3">
                                    <Calendar size={14} />
                                    <span>Updated: {note.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassNotesPage;