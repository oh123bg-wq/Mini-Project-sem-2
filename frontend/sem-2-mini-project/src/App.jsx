import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Cheatsheet from "./pages/CheatsheetPage";
import ClassNotes from "./pages/ClassNotesPage";
import CodeNotes from "./pages/CodeNotesPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    // 初始化 user 状态（可以从 localStorage 读取）
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // 退出登录函数
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null); // 更新状态，Navbar 会自动刷成未登录样式
    };

    const location = useLocation();
    const hideNavbarPaths = ["/", "/login", "/register"];

    return (
        <>
            {/* 只要当前路径不在 hideNavbarPaths 数组中，才渲染 Navbar */}
            {!hideNavbarPaths.includes(location.pathname) && (
                <Navbar user={user} onLogout={handleLogout} />
            )}

            <Routes>
                {/* Homepage: 已登录用户访问重定向到 /codenotes，未登录显示 Home */}
                <Route path="/" element={user ? <Navigate to="/codenotes" /> : <Home />} />

                {/* Login & Register: 已登录用户访问直接重定向到 /codenotes */}
                <Route path="/login" element={user ? <Navigate to="/codenotes" /> : <Login setUser={setUser} />} />
                <Route path="/register" element={user ? <Navigate to="/codenotes" /> : <Register />} />

                {/* Protected Pages: 未登录用户访问统一重定向回 Homepage ("/") */}
                <Route path="/classnotes" element={user ? <ClassNotes /> : <Navigate to="/" />} />
                <Route path="/codenotes" element={user ? <CodeNotes /> : <Navigate to="/" />} />
                <Route path="/cheatsheet" element={user ? <Cheatsheet /> : <Navigate to="/" />} />

                {/* Admin Dashboard: 只有 role 为 'admin' 的已登录用户可访问，否则重定向回 Homepage ("/") */}
                <Route 
                    path="/admin/dashboard" 
                    element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
                />
            </Routes>
        </>
    );
}

export default App;
