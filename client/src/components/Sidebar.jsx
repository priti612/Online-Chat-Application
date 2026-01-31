import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import "./Sidebar.css";
import assets from '../assets/assets';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [input, setInput] = useState("");

  const filteredUsers = input ? 
    users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : 
    users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers])

  const handleMenuClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    logout();
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUnseenMessages(prev => ({...prev, [user._id]: 0}));
  };

  return  (
    <div className={`sidebar-container ${selectedUser ? "hide-on-mobile" : ""}`}>
      
      {/* Header */}
      <div className="sidebar-header">
        <img src={assets.logo_icon} alt="logo" className="sidebar-logo" />

        <div className="menu-wrapper">
          <img 
            src={assets.menu_icon} 
            alt="menu" 
            className="menu-icon" 
            onClick={handleMenuClick}
          />

          <div className={`menu-dropdown ${isDropdownOpen ? 'show' : ''}`}>
            <p onClick={handleProfileClick}>Edit Profile</p>
            <hr />
            <p onClick={handleLogoutClick}>Logout</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-box">
        <img src={assets.search_icon} alt="search" />
        <input 
          type="text" 
          placeholder="Search User..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* User List */}
      <div className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div
              key={user._id || index}
              className={`user-item ${
                selectedUser?._id === user._id ? "active-user" : ""
              }`}
              onClick={() => handleUserClick(user)}
            >
              <img src={user.profilePic || assets.avatar_icon} alt="user" className="user-avatar" />
              <div>
                <p>{user.fullName}</p>
                <small>
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </small>
              </div>
              {unseenMessages[user._id] > 0 && (
                <div className="notification-badge">
                  {unseenMessages[user._id]}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-users">
            <p>No users found</p>
          </div>
        )}
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="dropdown-overlay" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

    </div>
  );
};

export default Sidebar;