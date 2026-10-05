import { useState } from "react";
import { UserPlus, User, Mail, Lock } from "lucide-react";
import "../assets/css/RegisterPage.css";
import api from "../utils/api";
import { useNavigate } from "react-router";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your login / authentication logic here
        console.log("Register Form submitted:", { name, email, password });
        try {
            const response = await api.post("/users/register", {
                name,
                email,
                password,
            });
            console.log("Register successful: ", response.data);
            alert("Register Successful!");
            navigate("/login");
        } catch (error) {
            console.log("Register Error: ", error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <UserPlus size={36} color="#4F46E5" />
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Get started with DevNotes</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <User size={20} color="#6B7280" className="input-icon" />
                        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="auth-input" />
                    </div>

                    <div className="input-group">
                        <Mail size={20} color="#6B7280" className="input-icon" />
                        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="auth-input" />
                    </div>

                    <div className="input-group">
                        <Lock size={20} color="#6B7280" className="input-icon" />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="auth-input" />
                    </div>

                    <button type="submit" className="auth-button">
                        Register
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <a href="/login" className="auth-link">
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
