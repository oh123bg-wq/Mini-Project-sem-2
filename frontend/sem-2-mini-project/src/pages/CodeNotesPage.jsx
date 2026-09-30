import React, { useState } from 'react';
import { Code, Search, Plus, Copy, Check, Terminal, Trash2 } from 'lucide-react';

const CodeNotesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    // 示例代码片段数据
    const [snippets, setSnippets] = useState([
        {
            id: 1,
            title: 'Custom Axios Instance Interceptor',
            language: 'JavaScript',
            description: 'Axios instance configuration with dynamic Bearer Token injection.',
            code: `const api = axios.create({\n  baseURL: 'http://localhost:5000/api'\n});\n\napi.interceptors.request.use((config) => {\n  const token = localStorage.getItem('token');\n  if (token) config.headers.Authorization = \`Bearer \${token}\`;\n  return config;\n});`,
        },
        {
            id: 2,
            title: 'Express JWT Verification Middleware',
            language: 'Node.js',
            description: 'Protect backend API endpoints by validating incoming JWT headers.',
            code: `const verifyToken = (req, res, next) => {\n  const authHeader = req.headers.authorization;\n  if (!authHeader) return res.status(401).json("Unauthorized");\n  const token = authHeader.split(" ")[1];\n  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {\n    if (err) return res.status(403).json("Token invalid");\n    req.user = user;\n    next();\n  });\n};`,
        }
    ]);

    const handleCopy = (id, codeText) => {
        navigator.clipboard.writeText(codeText);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredSnippets = snippets.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.language.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container my-4">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold d-flex align-items-center gap-2 mb-1">
                        <Code color="#4F46E5" size={28} />
                        <span>Code Snippets</span>
                    </h2>
                    <p className="text-muted mb-0">Save and quick-copy your reusable code blocks.</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2 px-3">
                    <Plus size={18} />
                    <span>New Snippet</span>
                </button>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                        <Search size={18} className="text-muted" />
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="Search by code title or language (e.g. JavaScript, Python)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Snippet Grid */}
            <div className="row g-4">
                {filteredSnippets.map((snippet) => (
                    <div key={snippet.id} className="col-12 col-lg-6">
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-2 px-3">
                                <div className="d-flex align-items-center gap-2 fs-6">
                                    <Terminal size={16} className="text-primary" />
                                    <span className="fw-semibold">{snippet.title}</span>
                                </div>
                                <span className="badge bg-secondary">{snippet.language}</span>
                            </div>
                            <div className="card-body bg-light position-relative p-0">
                                <pre className="m-0 p-3 bg-dark text-light rounded-bottom fs-7" style={{ overflowX: 'auto', maxHeight: '200px' }}>
                                    <code>{snippet.code}</code>
                                </pre>
                            </div>
                            <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center py-2">
                                <small className="text-muted">{snippet.description}</small>
                                <div className="d-flex gap-2">
                                    <button 
                                        onClick={() => handleCopy(snippet.id, snippet.code)} 
                                        className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                                    >
                                        {copiedId === snippet.id ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                                        <span>{copiedId === snippet.id ? 'Copied!' : 'Copy'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CodeNotesPage;