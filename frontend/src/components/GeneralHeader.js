/*トップページへのリンク
キャリアストーリーの検索欄
ユーザー情報へのリンク */
import React from "react";
import { Link, Outlet } from "react-router-dom";

const GeneralHeader = () => {
    return (
        <div>
            <Link to='/'>Top</Link>
            <ul>
                <input type="text" />
                <li><Link to='/profile'>Mypage</Link></li>
            </ul>
            <Outlet />
        </div>
    )
}

export default GeneralHeader