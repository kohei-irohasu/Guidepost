import React, {useState, useContext} from "react";
import { AuthContext } from "../services/AuthService";
import { LoginService } from "../services/ApiService";

export const Login = () => {
    const { login, navigateToRegister } = useContext(AuthContext);

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
                const token = response.access;

                await login(loginEmaill, token); // ログイン処理
                console.log('Login successful!');
                // ログイン成功時の処理を追加
            }   catch (error) {
                console.log(error);
                setError(error.message);
                // ログイン失敗時の処理を追加
            }
        }
    }

    const handleRegistration = () => {
        navigateToRegister();
    }

    return (
      <div>
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
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

        <h2></h2>
        <button onClick={handleRegistration}>新規登録はこちら</button>
    </div>
    )
}