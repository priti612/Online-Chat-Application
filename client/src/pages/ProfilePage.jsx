import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Profile.css";
import assets from "../assets/assets";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!selectedImg) {
        await updateProfile({ fullName: name, bio });
        navigate("/");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);

      reader.onload = async () => {
        const base64Image = reader.result;
        await updateProfile({
          profilePic: base64Image,
          fullName: name,
          bio,
        });
        navigate("/");
      };
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      setSelectedImg(file);
    }
  };

  const getCurrentProfileImage = () => {
    if (selectedImg) {
      return URL.createObjectURL(selectedImg);
    }
    if (authUser?.profilePic) {
      return authUser.profilePic;
    }
    return null;
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          
          {/* Header */}
          <div className="profile-header">
            <button 
              className="back-button"
              onClick={() => navigate("/")}
            >
              <img src={assets.arrow_icon} alt="back" />
            </button>
            <h2>Edit Profile</h2>
            <img src={assets.logo_icon} alt="logo" className="header-logo" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="profile-form">
            
            {/* Profile Image Section */}
            <div className="image-section">
              <label htmlFor="avatar" className="image-upload">
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
                
                <div className="image-preview">
                  {getCurrentProfileImage() ? (
                    <img
                      src={getCurrentProfileImage()}
                      alt="profile"
                      className="profile-image"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <img src={assets.avatar_icon} alt="avatar" />
                    </div>
                  )}
                  <div className="image-overlay">
                    <img src={assets.gallery_icon} alt="upload" />
                    <span>Change Photo</span>
                  </div>
                </div>
              </label>
            </div>

            {/* Form Fields */}
            <div className="form-fields">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  placeholder="Tell us about yourself..."
                  rows={4}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={authUser?.email || ""}
                  disabled
                  className="form-input disabled"
                />
                <small className="form-hint">Email cannot be changed</small>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/")}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-button"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
