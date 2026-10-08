import { useState, useEffect } from 'react';
import { LogIn, Mail, Lock } from 'lucide-react';
import '../assets/css/LoginPage.css';
import api from "../utils/api";
import { useNavigate } from 'react-router';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem("token");
        // console.log(userToken);
        if (userToken !== null) navigate("/codenotes");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Add your login / authentication logic here
        console.log("Form submitted:", { email, password });
        try {
            const response = await api.post("/users/login", {
                email,
                password,
            });
            localStorage.setItem("token", response.data.token);

            const userData = response.data.user || { email: email, name: email.split('@')[0], role: 'user' };
            localStorage.setItem("user", JSON.stringify(userData));

            if (setUser) setUser(userData);
            navigate("/codenotes");
            console.log(response.data);
            alert("Login Successful!");
        } catch (error) {
            console.log("Login Error: ", error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <LogIn size={36} color="#4F46E5" />
                    <h2 className="auth-title">DevNotes</h2>
                    <p className="auth-subtitle">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <Mail size={20} color="#6B7280" className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={20} color="#6B7280" className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        Sign In
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <a href="/register" className="auth-link">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;