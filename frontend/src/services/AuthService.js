// ユーザーの認証情報の管理

import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const navigatetoTop = () => {
        navigate('/');
    }

    const navigateToLogin = () => {
        navigate('/login');
    }

    const login = (email) => {
        try {
            // ここでトークンをCookieに保存する実装必要
            setUser({ email }); // 本当はユーザー情報をセットしたい
            navigatetoTop();
        }   catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    const logout = () => {
        // ログアウト処理(トークンの削除など)
        setUser(null);
        navigateToLogin();
    }

    const signup = (email) => {
        try {
            // 新規登録処理
            // 成功した場合、トークンをCookieに保存する実装が必要
            setUser({ email });  // 本当はユーザー情報
            navigatetoTop();
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    )
}