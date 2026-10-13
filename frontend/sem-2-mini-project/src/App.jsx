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
    // Checks LocalStorage see if a user is already logged in.
    const [user, setUser] = useState(() => {
        // go localStorage check is there got "user" 档案 to make is logged in
        const savedUser = localStorage.getItem("user");
        // If got saved user, convert it back to an object form string; otherwise, return null 
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Logout Function
    const handleLogout = () => {
        // clear all things in local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // 更新状态，Navbar 会自动刷成未登录样式
        setUser(null);
    };

    // to make sure navbar show in right pages
    const location = useLocation();
    // hide navbar in these pages
    const hideNavbarPaths = ["/", "/login", "/register"];

    return (
        <>
            {/* 只要当前路径不在 hideNavbarPaths 数组中，才渲染 Navbar */}
            {/* location.pathname holds the current route path 
            (e.g., "/login" when on the Login page) */}
            {!hideNavbarPaths.includes(location.pathname) && (
                <Navbar user={user} onLogout={handleLogout} />
            )}

            <Routes>
                {/* Homepage: 已登录用户访问重定向到 /codenotes，未登录显示 Home */}
                <Route path="/" element={user ? <Navigate to="/codenotes" /> : <Home />} />

                {/* Login & Register: 已登录用户访问直接重定向到 /codenotes */}
                <Route path="/login" element={user ? <Navigate to="/codenotes" /> : <Login setUser={setUser} />} />
                <Route path="/register" element={user ? <Navigate to="/codenotes" /> : <Register />} />

                {/* If user is NOT logged in, redirect them to the homepage ("/") */}
                <Route path="/classnotes" element={user ? <ClassNotes /> : <Navigate to="/" />} />
                <Route path="/codenotes" element={user ? <CodeNotes /> : <Navigate to="/" />} />
                <Route path="/cheatsheet" element={user ? <Cheatsheet /> : <Navigate to="/" />} />

                {/* Admin Dashboard: just role is 'admin' can in，otherwise go Homepage ("/") */}
                <Route 
                    path="/admin/dashboard" 
                    element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
                />
            </Routes>
        </>
    );
}

export default App;
