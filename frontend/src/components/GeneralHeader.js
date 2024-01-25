/*トップページへのリンク
キャリアストーリーの検索欄
ユーザー情報へのリンク */
import React from "react";
import { Link, Outlet } from "react-router-dom";

export const GeneralHeader = ({user, onLogout}) => {

    return (
        <div>
            <Link to='/'>Top</Link>
            
            {user ? (
                // ログイン時
                <ul>
                    <li><Link to="/profile">Mypage</Link></li>
                    <li><button onClick={onLogout}>Logout</button></li>
                </ul>
            ) : (
                // 未ログイン時
                <ul>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            )}
            <ul>
                {/* 検索機能はcomponetsに切り出す */}
                <input type="text" aria-label="search"/>
            </ul>
            <Outlet />
        </div>
    )
}