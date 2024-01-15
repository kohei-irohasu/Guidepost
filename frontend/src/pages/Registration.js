import React, { useState } from "react";
import { LoginService } from "../services/ApiService";

export const Registration = () => {
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [password_confirm, setPassword_confirm] = useState('');
    const [nick_name, setNick_name] = useState('');

    const validateResitrationInput = (email, password, password_confirm, nick_name) => {
        if (!email || !password || !password_confirm || !nick_name) {
            alert('Please fill in all fields.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Invalid email format.');
            return false;
        }

        if (password !== password_confirm) {
            alert("password and password_confirm don't match.");
            return false;
        }

        return true;
    }
    const handleRegister = async () => {
        const isValid = validateResitrationInput(registerEmail, registerPassword, password_confirm, nick_name);

        if (isValid) {
            try {
                await LoginService.register(registerEmail, registerPassword, password_confirm, nick_name);
                console.log('Registration successful:');
                // 登録成功時の処理を追加
            }   catch (error) {
                console.log('Registration failed:', error.message);
                // 登録失敗時の処理を追加
            }
        }
    }

    return (
        <div>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={password_confirm}
                    onChange={(e) => setPassword_confirm(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="test"
                    placeholder="nick name"
                    value={nick_name}
                    onChange={(e) => setNick_name(e.target.value)}
                />
            </div>
            <div>
                <button onClick={handleRegister}>Register</button>
            </div>
        </div>
    )
}

