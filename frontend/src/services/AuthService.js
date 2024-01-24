// ユーザーの認証情報の管理
import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const navigateToTop = () => {
        navigate('/');
    }

    const navigateToLogin = () => {
        navigate('/login');
    }

    const navigateToRegister = () => {
        navigate('/register');
    }

    const login = (email, token) => {
        try {
            setUser({ email });
            localStorage.setItem("access", token);
            navigateToTop();

        }   catch (error) {
            console.error('Login failed:', error);
        }
    }

    const logout = () => {
        // ログアウト処理(トークンの削除など)
        setUser(null);
        localStorage.removeItem("access");
        delete axios.defaults.headers.common["Authorization"];
        navigateToLogin();
    }

    const signup = () => {
        try {
            // 新規登録処理
            navigateToLogin();
        } catch (error) {
            console.error('Signup failed:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, navigateToRegister }}>
            {children}
        </AuthContext.Provider>
    )
}