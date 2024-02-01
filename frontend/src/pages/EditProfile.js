import React, { useState} from "react";

export const EditProfile = ({ user, onSave, onCancel }) => {
    const [editedUser, setEditedUser] = useState({
        email: user.email,
        nick_name: user.nick_name,
        profile: user.profile,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editedUser)
    };

    const hadleCancel = () => {
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Nick Name:</label>
            <input type="text" name="nick_name" value={editedUser.nick_name || ""} onChange={handleInputChange} />

            <label>Bio:</label>
            <textarea name="profile" value={editedUser.profile || ""} onChange={handleInputChange} />

            <button type="submit">Save</button>
            <button type="button" onClick={hadleCancel}>Cancel</button>
        </form>
    );
};