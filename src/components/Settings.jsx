import { useState, useEffect, useRef } from "react";
import "emoji-picker-element";
import LoadingMessage from "./common/LoadingMessage";
import "../styles/settings.css";

export const Settings = ({ authUser, apiClient }) => {
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    emoji: "👤",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emojiPickerRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    if (authUser) {
      setFormData({
        display_name: authUser.display_name || "",
        bio: authUser.bio || "",
        emoji: authUser.emoji || "👤",
      });
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiClient.request("/user/me", {
        method: "PUT",
        data: formData,
      });

      setSuccess("Profile updated successfully!");
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Could not update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Close emoji picker if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        avatarRef.current?.contains(event.target) ||
        emojiPickerRef.current?.contains(event.target)
      ) {
        return;
      }
      setShowEmojiPicker(false);
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  useEffect(() => {
    const picker = emojiPickerRef.current;
    if (!picker || !showEmojiPicker) return;

    const handleEmojiClick = (e) => {
      setFormData((prev) => ({ ...prev, emoji: e.detail.unicode }));
      setShowEmojiPicker(false);
    };

    picker.addEventListener("emoji-click", handleEmojiClick);
    return () => picker.removeEventListener("emoji-click", handleEmojiClick);
  }, [showEmojiPicker]);

  useEffect(() => {
    document.title = "settings · stellr";
  }, []);

  if (!authUser) {
    return <LoadingMessage message="Loading user data..." />;
  }

  return (
    <div className="settings-container">
      <div className="settings-title">Edit Your Profile</div>

      <div className="settings-emoji">
        <button
          ref={avatarRef}
          className="settings-emoji-picker"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          {formData.emoji}
        </button>

        {showEmojiPicker && (
          <div className="settings-emoji-picker-container">
            <emoji-picker ref={emojiPickerRef}></emoji-picker>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-form-group">
          <label htmlFor="display_name">Display Name</label>
          <input
            type="text"
            id="display_name"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            maxLength={50}
            required
          />
        </div>

        <div className="settings-form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            maxLength={160}
            rows={3}
          ></textarea>
        </div>

        <button
          type="submit"
          className="settings-save-button"
          disabled={isLoading}
        >
          {isLoading ? <LoadingMessage size="small" /> : "Save Changes"}
        </button>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default Settings;
