import { useState, useEffect } from "react";
import { Search, Plus, Copy, Check, Terminal, Trash2, Pin, Edit } from "lucide-react";
import api from "../utils/api";
import CodeNoteModal from "../components/CodeNoteModal";
import '../assets/css/ui.css';

const CodeNotesPage = () => {
    const [snippets, setSnippets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    
    const [copiedId, setCopiedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    const [formData, setFormData] = useState({
        title: "",
        language: "JavaScript",
        category: "General",
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

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ title: "", language: "JavaScript", category: "General", description: "", code: "" });
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
            category: snippet.category || "General",
            description: snippet.description,
            code: snippet.code,
        });
        setEditingId(snippet._id);
        setShowModal(true);
    };

    const categories = ["All", ...Array.from(new Set(snippets.map((s) => s.category).filter(Boolean)))];

    // 过滤 + 置顶项优先排序
    const filteredSnippets = snippets
        .filter((s) => {
            const matchesSearch =
                s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.code.toLowerCase().includes(searchTerm.toLowerCase());
                
            const matchesLanguage = selectedLanguage === "All" || s.language === selectedLanguage;
            const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;

            return matchesSearch && matchesLanguage && matchesCategory;
        })
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    return (
        <div className="note-page-container">
            {/* Header */}
            <header className="page-header">
                <div>
                    <h2>💻 Code Snippets</h2>
                    <p className="subtitle">Save and quick-copy your reusable code blocks.</p>
                </div>
                <button className="primary-btn" onClick={() => setShowModal(true)}>
                    <Plus size={18} /> New Snippet
                </button>
            </header>

            {/* Filter Toolbar */}
            <div className="toolbar-container mb-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <Search size={18} className="text-muted" />
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Search by title, description or code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <select className="form-select" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                            <option value="All">All Languages</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="Node.js">Node.js</option>
                            <option value="Python">Python</option>
                            <option value="HTML/CSS">HTML/CSS</option>
                            <option value="SQL">SQL</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat}>
                                    {cat === "All" ? "All Categories" : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid List */}
            <div className="cheatsheet-grid">
                {filteredSnippets.map((snippet) => (
                    <div className={`cheatsheet-card ${snippet.isPinned ? 'border-start border-primary border-4' : ''}`} key={snippet._id}>
                        <div className="card-top">
                            <div className="d-flex gap-2">
                                <span className="category-badge">
                                    {snippet.category || "General"}
                                </span>
                                <span className="category-badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                                    {snippet.language}
                                </span>
                            </div>
                            <div className="d-flex gap-1">
                                <button className={`action-btn ${snippet.isPinned ? 'text-primary' : ''}`} onClick={() => handleTogglePin(snippet._id)} title="Pin Snippet">
                                    <Pin size={16} />
                                </button>
                                <button className="action-btn" onClick={() => handleEditClick(snippet)} title="Edit Snippet">
                                    <Edit size={16} />
                                </button>
                                <button className="action-btn delete" onClick={() => handleDelete(snippet._id)} title="Delete Snippet">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="card-title text-break">{snippet.title}</h3>
                        {snippet.description && <p className="subtitle mb-2 text-break">{snippet.description}</p>}

                        {/* Terminal Style Code Container */}
                        <div className="command-block mt-auto">
                            <div className="command-header">
                                <span className="desc-text d-flex align-items-center gap-1">
                                    <Terminal size={12} /> {snippet.language} Block
                                </span>
                                <button className="copy-btn" onClick={() => handleCopy(snippet._id, snippet.code)}>
                                    {copiedId === snippet._id ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <pre className="command-code text-break"><code>{snippet.code}</code></pre>
                        </div>
                    </div>
                ))}
            </div>

            <CodeNoteModal show={showModal} onClose={handleCloseModal} onSubmit={handleSubmit} formData={formData} setFormData={setFormData} isEditing={!!editingId} />
        </div>
    );
};

export default CodeNotesPage;