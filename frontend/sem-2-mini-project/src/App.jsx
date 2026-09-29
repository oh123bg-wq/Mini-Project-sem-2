import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import Cheatsheet from "./pages/CheatsheetPage";
import Navbar from "./components/Navbar";

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

    return (
        <>
            <BrowserRouter>
                <Navbar user={user} onLogout={handleLogout} />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cheatsheet" element={<Cheatsheet />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
