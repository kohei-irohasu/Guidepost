import { UserService } from "../services/ApiService";
import { useEffect, useState } from "react";

export const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const user = await UserService.getUserProfile();
                setUser(user);
                console.log(user);
            } catch (error) {
                // エラーハンドリング
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div>
            {user ? (
                <>
                    <h2>Mypage</h2>
                    <p>Email: {user.email}</p>
                    <p>Id: {user.id}</p>
                    <p>Nick Name: {user.nick_name}</p>
                    <p>Profile: {user.profile}</p>
                </>
            ) : (
                <p>Loading profile</p>
            )}
        </div>
    );
}

