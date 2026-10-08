import { NavLink, Link } from 'react-router';
import { BookOpen, Code, Zap, ShieldCheck, LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
            <div className="container-fluid">
                {/* Brand Logo */}
                <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary" to="/">
                    <BookOpen size={24} color="#6366F1" />
                    <span className="fs-4 text-white">DevNotes</span>
                </Link>

                {/* Mobile Toggle Button */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Nav Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-2">
                        <li className="nav-item">
                            <NavLink 
                                className={({ isActive }) => `nav-link d-flex align-items-center gap-1 ${isActive ? 'active fw-bold' : ''}`} 
                                to="/codenotes"
                            >
                                <Code size={16} /> Code Snippets
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink 
                                className={({ isActive }) => `nav-link d-flex align-items-center gap-1 ${isActive ? 'active fw-bold' : ''}`} 
                                to="/classnotes"
                            >
                                <BookOpen size={16} /> Class Notes
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink 
                                className={({ isActive }) => `nav-link d-flex align-items-center gap-1 ${isActive ? 'active fw-bold' : ''}`} 
                                to="/cheatsheet"
                            >
                                <Zap size={16} /> Cheatsheets
                            </NavLink>
                        </li>

                        {/* 仅当用户存在且 role 为 admin 时才渲染该菜单 */}
                        {user && user.role === 'admin' && (
                            <li className="nav-item">
                                <NavLink 
                                    className={({ isActive }) => `nav-link d-flex align-items-center gap-1 text-warning ${isActive ? 'active fw-bold' : ''}`} 
                                    to="/admin/dashboard"
                                >
                                    <ShieldCheck size={16} /> Admin Dashboard
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    {/* Right User Controls */}
                    <div className="d-flex align-items-center gap-3">
                        {user ? (
                            <div className="d-flex align-items-center gap-3">
                                <span className="text-light fs-6">
                                    Hello, <strong>{user.name}</strong>
                                </span>
                                <button onClick={onLogout} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1">
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline-light btn-sm px-3">
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm px-3">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;