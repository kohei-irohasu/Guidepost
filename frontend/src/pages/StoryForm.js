import React, { useState } from "react";

export const StoryForm = ({ initialStory = {}, onSave, onCancel }) => {
    const [title, setTitle] = useState(initialStory?.title || "");
    const [text, setText] = useState(initialStory?.text || "");
    const [privacy, setPrivacy] = useState(initialStory?.privacy || false);
    const [startTag, setStartTag] = useState(initialStory?.tags[0] || "");
    const [previousTag, setPreviousTag] = useState(initialStory?.tags[1] || "");
    const [todayTag, setTodayTag] = useState(initialStory?.tags[2] || "");

    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!title || !text || !startTag || !previousTag || !todayTag) {
            setError("Please fill in all fields.");
            return;
        }
        const tags_write = [startTag, previousTag, todayTag]
        onSave({ title, text, privacy, tags_write });
        setError('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label>Tag:</label>
                <ul>
                <div>
                    <label>Start:</label>
                    <input
                        type="text"
                        value={startTag}
                        onChange={(e) => setStartTag(e.target.value)}
                    />
                </div>
                <div>
                    <label>Previous:</label>
                    <input
                        type="text"
                        value={previousTag}
                        onChange={(e) => setPreviousTag(e.target.value)}
                    />
                </div>
                <div>
                    <label>Today:</label>
                    <input
                        type="text"
                        value={todayTag}
                        onChange={(e) => setTodayTag(e.target.value)}
                    />
                </div>
                </ul>
            </div> 
            <div>
                <label>Text:</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <div>
                <label>Privacy:</label>
                <input
                    type="checkbox"
                    checked={privacy}
                    onChange={(e) => setPrivacy(e.target.checked)}
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Save Story</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};