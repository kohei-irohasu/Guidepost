import { UserService, StoryService } from "../services/ApiService";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { EditProfile } from "./EditProfile";
import { StoryForm } from "./StoryForm";

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);

    const [story, setStory] = useState(null);
    const [editingStoryMode, setEditingStoryMode] = useState(false);

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

    useEffect(() => {
        const fetchUserStory = async () => {

            if (!user?.stories || user.stories.length === 0) {
                return ;
            }

            const storyId = user.stories.id;
            const response = await StoryService.getUserStory(storyId);
            setStory(response.data);
        };

        if (user) {
            fetchUserStory();
            console.log('story:', user.stories ? user.stories : 'No story');
        }
    }, [user]);

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
    
    const deleteAccount = useCallback(async () => {
        try {
            const success = await UserService.deleteUser(password);

            if (success) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setError(error.message);
        } finally {
            setPassword('');
        }
    }, [password, navigate]);

    useEffect(() => {
        if (password) {
            deleteAccount();
        }
    }, [password, deleteAccount]);

    const hadnleEditStoryclick = () => {
        setEditingStoryMode(true);
    };

    const handleSaveStory = async (storyData) => {
        try {
            let response;
            if (story) {
                response = await StoryService.updateStory(story.id, storyData);
            } else {
                response = await StoryService.createStory(storyData);
            }
            // ストーリーのリスト更新や通知表示などの処理
            setStory(response.data);
            setEditingStoryMode(false);
        } catch (error) {
            // エラーハンドリング
            console.error("Error saving the story:", error);
        }
    };

    const handleDeleteStory = async () => {

        const confirmDelete = window.confirm("Are you sure you want to delete this story?");

        if (confirmDelete) {
            try {
                await StoryService.deleteStory(story.id);
                setStory("");
                alert("Story deleted successfully.🎉");
            } catch (error) {
                console.error("Error deleting the story:", error);
                alert("Failed to delete the story.");
            }
        }   
    }

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
                      <p>Id: {user.uuid}</p>
                      <p>Nick Name: {user.nick_name}</p>
                      <p>Bio: {user.profile}</p>
                      <button onClick={handleEditClick}>Edit Profile</button>
                      <button onClick={handleDeleteClick}>Delete User</button>
                      <div>
                        <h2>Career Story</h2>
                        <div>
                            {editingStoryMode ? (
                                <StoryForm
                                    initialStory={story}
                                    onSave={handleSaveStory}
                                    onCancel={() => setEditingStoryMode(false)}
                                />
                            ) : (
                                story ? (
                                    <>
                                        <p>Title: {story.title}</p>
                                        <p>Tag:</p>
                                        <ul>
                                            <p>Start: {story.tags[0]}</p>
                                            <p>Previous: {story.tags[1]}</p>
                                            <p>Today: {story.tags[2]}</p>
                                        </ul>
                                        <p>Text: {story.text}</p>
                                        <p>privacy: {story.privacy ? 'Private' : 'Public'}</p>
                                        <button onClick={hadnleEditStoryclick}>Edit Story</button>
                                        <button onClick={handleDeleteStory}>Delete Story</button>
                                    </>
                                ) : (
                                    <>
                                        <p>No career story available.</p>
                                        <button onClick={hadnleEditStoryclick}>Create Story</button>
                                    </>
                                )
                            )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p>Loading profile</p>
                  )}
                </>
            )}
        </div>
    );
};