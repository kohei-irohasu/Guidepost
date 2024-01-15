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

    const login = (email, password) => {
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

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}


// 改善点としては以下が考えられます:

// 認証検証ロジックを実際のバックエンドと連携