import React, {useState, useContext} from "react";
import { AuthContext } from "../services/AuthService";
import { LoginService } from "../services/ApiService";
import { Registration } from "./Registration";

export const Login = () => {
    const { login } = useContext(AuthContext);
    const [showRegistration, setShowRegistration] = useState(false);

    const [loginEmaill, setLoginEmaill] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [error, setError] = useState(null);

    const validateLoginInputs = (email, password) => {
        if (!email || !password) {
            alert('Email and Password are required.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Invalid email format.');
            return false;
        }

        return true;
    }

    const handleLogin = async() => {
        const isValid = validateLoginInputs(loginEmaill, loginPassword);

        if (isValid) {
            try {
                const response = await LoginService.login(loginEmaill, loginPassword);
                await login(loginEmaill, loginPassword); // ログイン処理
                const { access, refresh } = response;
                console.log('Login successful!');
                // ログイン成功時の処理を追加
            }   catch (error) {
                console.log(error.message);
                setError(error.message);
                // ログイン失敗時の処理を追加
            }
        }
    }

    const handleShowRegistration = () => {
        setShowRegistration(!showRegistration);
    }

    return (
      <div>
        <h2>Login</h2>
        <input 
            type="email"
            placeholder='Email'
            value={loginEmaill}
            onChange={(e) => setLoginEmaill(e.target.value)}
        />
        <input 
            type="password"
            placeholder='Password'
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>

        <h2>新規登録</h2>
        {showRegistration && <Registration />}
        <button onClick={handleShowRegistration}>
            {showRegistration ? "閉じる" : "新規登録はこちら"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
    )
}