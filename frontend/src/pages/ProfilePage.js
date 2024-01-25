import { UserService } from "../services/ApiService";
import { useEffect, useState } from "react";
import { EditProfile } from "./EditProfile";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const [user, setUser] = useState('');
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const fetchUserProfile = async () => {
        try {
            const userProfile = await UserService.getUserProfile();
            setUser(userProfile);
        } catch (error) {
            // エラーハンドリング
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleSave = async (editedUser) => {
        try {
            // ユーザ―更新処理
            await UserService.updateUserProfile(editedUser);

            // 編集モードを終了し、プロフィールを再読み込み
            setEditing(false);
            fetchUserProfile();
        } catch(error) {
            // エラーハンドリング
            setError(error.message);
        }
    };

    const handleCancelEdit = () => {
        setEditing(false);
        fetchUserProfile();
    };

    const handleDeleteClick = () => {
        const userPassword = prompt('Enter your password to delete your account:');
        if (userPassword !== null) {
            setPassword(userPassword);
        }
    };

    useEffect(() => {
        if (password) {
            deleteAccount();
        }
    }, [password]);
    
    const deleteAccount = async () => {
        try {
            const success = await UserService.deleteUser(password);

            if (success) {
                // ログイン画面へリダイレクト
                navigate('/login');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setError(error.message);
        } finally {
            setPassword('');
        }
    };

    return (
        <div>
            {editing ? (
                <EditProfile user={user} onSave={handleSave} onCancel={handleCancelEdit} />
            ) : (
                <>
                  {user ? (
                    <>
                      <h2>Profile</h2>
                      {error && <p style={{ color: "red" }}>{error}</p>}
                      <p>Email: {user.email}</p>
                      <p>Nick Name: {user.nick_name}</p>
                      <p>Bio: {user.profile}</p>
                      <button onClick={handleEditClick}>Edit profile</button>
                      <button onClick={handleDeleteClick}>Delete User</button>
                    </>
                  ) : (
                    <p>Loading profile</p>
                  )}
                </>
            )}
        </div>
    );
};