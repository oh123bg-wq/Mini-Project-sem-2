import React, { useState, useEffect } from "react";
import { Code, Search, Plus, Copy, Check, Terminal, Trash2, Pin, Edit } from "lucide-react";
import api from "../utils/api";
import CodeNoteModal from "../components/CodeNoteModal";

const CodeNotesPage = () => {
    const [snippets, setSnippets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [copiedId, setCopiedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        language: "JavaScript",
        description: "",
        code: "",
    });
    const [editingId, setEditingId] = useState(null);

    const fetchSnippets = async () => {
        try {
            const res = await api.get("/codeNotes");
            setSnippets(res.data);
        } catch (err) {
            console.error("Failed to fetch code snippets:", err);
        }
    };

    useEffect(() => {
        fetchSnippets();
    }, []);

    const handleCopy = (id, codeText) => {
        navigator.clipboard.writeText(codeText);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleTogglePin = async (id) => {
        try {
            const res = await api.patch(`/codeNotes/${id}/pin`);
            setSnippets(snippets.map((s) => (s._id === id ? res.data : s)));
        } catch (err) {
            console.error("Toggle pin failed:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this code snippet?")) return;
        try {
            await api.delete(`/codeNotes/${id}`);
            setSnippets(snippets.filter((s) => s._id !== id));
        } catch (err) {
            console.error("Delete snippet failed:", err);
        }
    };

    const filteredSnippets = snippets.filter((s) => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.language.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ title: "", language: "JavaScript", description: "", code: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await api.put(`/codeNotes/${editingId}`, formData);
                setSnippets(snippets.map((s) => (s._id === editingId ? res.data : s)));
            } else {
                const res = await api.post("/codeNotes", formData);
                setSnippets([res.data, ...snippets]);
            }
            handleCloseModal();
        } catch (err) {
            console.error("Submit failed:", err);
        }
    };

    const handleEditClick = (snippet) => {
    setFormData({
        title: snippet.title,
        language: snippet.language,
        description: snippet.description,
        code: snippet.code,
    });
    setEditingId(snippet._id);
    setShowModal(true);
};

    return (
        <div className="container my-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold d-flex align-items-center gap-2 mb-1">
                        <Code color="#4F46E5" size={28} />
                        <span>Code Snippets</span>
                    </h2>
                    <p className="text-muted mb-0">Save and quick-copy your reusable code blocks.</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2 px-3" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    <span>New Snippet</span>
                </button>
            </div>

            <div className="mb-4">
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                        <Search size={18} className="text-muted" />
                    </span>
                    <input type="text" className="form-control border-start-0 ps-0" placeholder="Search by code title or language (e.g. JavaScript, Python)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div className="row g-4">
                {filteredSnippets.map((snippet) => (
                    <div key={snippet._id} className="col-12 col-lg-6">
                        <div className={`card h-100 shadow-sm border-0 ${snippet.isPinned ? "border-top border-primary border-4" : ""}`}>
                            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-2 px-3">
                                <div className="d-flex align-items-center gap-2 fs-6">
                                    <Terminal size={16} className="text-primary" />
                                    <span className="fw-semibold">{snippet.title}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="badge bg-secondary">{snippet.language}</span>
                                    <button onClick={() => handleEditClick(snippet)} className="btn btn-sm btn-link p-0 text-primary">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleTogglePin(snippet._id)} className={`btn btn-sm btn-link p-0 ms-1 ${snippet.isPinned ? "text-primary" : "text-light"}`}>
                                        <Pin size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(snippet._id)} className="btn btn-sm btn-link text-danger p-0 ms-1">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="card-body bg-light position-relative p-0">
                                <pre className="m-0 p-3 bg-dark text-light rounded-bottom fs-7" style={{ overflowX: "auto", maxHeight: "200px" }}>
                                    <code>{snippet.code}</code>
                                </pre>
                            </div>
                            <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center py-2">
                                <small className="text-muted">{snippet.description}</small>
                                <button onClick={() => handleCopy(snippet._id, snippet.code)} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
                                    {copiedId === snippet._id ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                                    <span>{copiedId === snippet._id ? "Copied!" : "Copy"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <CodeNoteModal show={showModal} onClose={handleCloseModal} onSubmit={handleSubmit} formData={formData} setFormData={setFormData} isEditing={!!editingId} />
        </div>
    );
};

export default CodeNotesPage;
