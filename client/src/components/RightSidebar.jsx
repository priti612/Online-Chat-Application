import { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { ChatContext } from '../context/ChatContext';
import './RightSidebar.css';
import { AuthContext } from '../context/AuthContext';

const RightSidebar = () => {
  const { selectedUser,messages } = useContext(ChatContext);
  const {logout,onlineUsers}=useContext(AuthContext)
  const[msgImages,setMsgImages]=useState([])


  //get all the images from the 
  useEffect(()=>{
    setMsgImages(
      (messages || []).filter(msg => msg && msg.image).map(msg => msg.image)
    )
  },[messages])
  
  if (!selectedUser) return null;

  return selectedUser && (
    <div className="right-sidebar">
      
      {/* User Profile Section */}
      <div className="profile-section">
        <img 
          src={selectedUser?.profilePic || assets.avatar_icon} 
          alt="profile" 
          className="profile-image"
        />
        <div className="profile-info">
          <div className="profile-name">
            {(onlineUsers || []).includes?.(selectedUser._id) && <span className="online-indicator"></span>}
            {selectedUser.fullName}
          </div>
          <p className="profile-bio">{selectedUser.bio}</p>
        </div>
      </div>
      
      <div className="divider"></div>
      
      {/* Media Section */}
      <div className="media-section">
        <h3 className="section-title">Media</h3>
        <div className="media-grid">
          {msgImages.map((url, index) => (
            <div key={index} className="media-item">
              <img 
                src={url} 
                alt={`media-${index}`}
                onClick={() => window.open(url)}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Button */}
      <div className="action-section">
        <button 
          className="logout-button"
          onClick={() =>logout()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
