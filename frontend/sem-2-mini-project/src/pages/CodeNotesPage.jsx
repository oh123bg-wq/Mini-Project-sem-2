import { useState, useEffect } from "react";
import { Plus, Copy, Check, Terminal, Trash2, Pin, Edit } from "lucide-react";
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

    // get all notes
    const fetchSnippets = async () => {
        try {
            const res = await api.get("/codeNotes");
            // 将后端发回的数据更新到 snippets 状态中
            setSnippets(res.data);
        } catch (err) {
            console.error("Failed to fetch code snippets:", err);
        }
    };

    // fetch once when page loads
    useEffect(() => {
        fetchSnippets();
        // empty dependency array
    }, []);

    const handleCopy = (id, codeText) => {
        // 使用浏览器原生的 Clipboard API 将代码文本写入系统剪贴板
        // save the code directly to the user's clipboard.
        navigator.clipboard.writeText(codeText);
        // 记录被复制的 snippet ID，触发UI图标变为 Check
        setCopiedId(id);
        // 设置 2 秒定时器，2 秒后清空 copiedId，图标恢复原状
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleTogglePin = async (id) => {
        try {
            const res = await api.patch(`/codeNotes/${id}/pin`);
            // Update the page without refresh page
            setSnippets(snippets.map((s) => (s._id === id ? res.data : s)));
        } catch (err) {
            console.error("Toggle pin failed:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this code snippet?")) return;
        try {
            await api.delete(`/codeNotes/${id}`);
            // filter the array to keep only the notes whose ID does NOT match the deleted ID
            setSnippets(snippets.filter((s) => s._id !== id));
        } catch (err) {
            console.error("Delete snippet failed:", err);
        }
    };

    // function to close popup modal and reset the form
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        // Reset the form
        setFormData({ title: "", language: "JavaScript", category: "General", description: "", code: "" });
    };

    // Create & Update
    const handleSubmit = async (e) => {
        // prevent page refresh
        e.preventDefault();
        try {
            if (editingId) {
                // , formData is to send the edited data to backend so that backend know edit what data
                const res = await api.put(`/codeNotes/${editingId}`, formData);
                setSnippets(snippets.map((s) => (s._id === editingId ? res.data : s)));
            } else {
                // create new note
                const res = await api.post("/codeNotes", formData);
                // update the page latest notes in front
                setSnippets([res.data, ...snippets]);
            }
            handleCloseModal();
        } catch (err) {
            console.error("Submit failed:", err);
        }
    };

    // function that triggers when user click the edit button
    const handleEditClick = (snippet) => {
        // fill in the existing data of the notes
        setFormData({
            title: snippet.title,
            language: snippet.language,
            category: snippet.category || "General",
            description: snippet.description,
            code: snippet.code,
        });
        // let the app know which note you editing
        setEditingId(snippet._id);
        // show the modal out
        setShowModal(true);
    };

    // Dropdown
    // 1. map(): Get all categories
    // 2. filter(Boolean): Remove empty/null values
    // 3. new Set(): Remove duplicates
    // 4. ["All", ...]: Add "All" as the first option
    const categories = ["All", ...Array.from(new Set(snippets.map((s) => s.category).filter(Boolean)))];

    // 过滤 + 置顶项优先排序
    const filteredSnippets = snippets
        // 使用 .filter() 遍历 notes 数组，筛选出符合条件的笔记
        .filter((s) => {
            const matchesSearch =
                // the first tolowercase is turn all data to small letter and second tolowercase is turn all user type data to small
                s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.code.toLowerCase().includes(searchTerm.toLowerCase());
            // Check if note matches selected Language (or return 'All' if no Language selected)    
            const matchesLanguage = selectedLanguage === "All" || s.language === selectedLanguage;
            const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;

            return matchesSearch && matchesLanguage && matchesCategory;
        })
        // 如果 b 被置顶 (true)，(b.isPinned ? 1 : 0) 为 1；如果 a 没置顶，算式结果为 1 - 0 = 1 (正数)，代表 b 排到 a 前面
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    return (
        <div className="note-page-container">
            {/* Header */}
            <header className="page-header">
                <div>
                    <h2>Code Snippets</h2>
                    <p className="subtitle">Save and quick-copy your reusable code blocks.</p>
                </div>
                <button className="primary-btn" onClick={() => setShowModal(true)}>
                    <Plus size={18} /> New Snippet
                </button>
            </header>

            {/* Filter Toolbar */}
            <div className="toolbar-container mb-4">
                <div className="row g-2 align-items-center justify-content-between">
                    {/* Search Bar */}
                    <div className="col-12 col-md-5 col-lg-4">
                        <input
                            type="text"
                            className="form-control form-control-sm shadow-sm"
                            placeholder="Search by title, description or code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* 右侧 Select Dropdowns */}
                    <div className="col-12 col-md-6 col-lg-5 ms-auto d-flex gap-2 justify-content-end">
                        <select 
                            className="form-select form-select-sm shadow-sm" 
                            value={selectedLanguage} 
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                            <option value="All">All Languages</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="Node.js">Node.js</option>
                            <option value="Python">Python</option>
                            <option value="HTML/CSS">HTML/CSS</option>
                            <option value="SQL">SQL</option>
                            <option value="Other">Other</option>
                        </select>

                        <select 
                            className="form-select form-select-sm shadow-sm" 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
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