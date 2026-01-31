import { useEffect, useRef, useContext, useState } from 'react';
import { formatMessageTime } from '../lib/utils';
import assets from '../assets/assets';
import { ChatContext } from '../context/ChatContext';
import './ChatContainer.css';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const { selectedUser, setSelectedUser, messages, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);
  const scrollEnd = useRef(null);
  const [input, setInput] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input.trim() });
    setInput('');
  };

  const handleSendImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image');
      return;
    }

    // ✅ size limit (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      // ✅ guard against invalid base64
      if (!reader.result || typeof reader.result !== 'string') {
        toast.error('Failed to read image');
        return;
      }

      await sendMessage({ image: reader.result });
      e.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <div className="chat-empty">
        <img src={assets.logo_icon} alt="logo" />
        <h3>Welcome to QuickChat</h3>
        <p>Select a user from the sidebar to start chatting</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="profile" />

        <div className="chat-user">
          <span>{selectedUser.fullName}</span>
          <span className="online-dot"></span>
        </div>

        <img
          src={assets.arrow_icon}
          alt="back"
          className="back-btn"
          onClick={() => setSelectedUser(null)}
        />
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages?.length ? (
          messages.map((msg, index) => {
            const isSent = msg.senderId === authUser?._id;

            return (
              <div key={msg._id} className={`message-row ${isSent ? 'sent' : 'received'}`}>
                <div className="message-content">
                  {msg.image ? (
                    <img src={msg.image} className="message-image" alt="sent" />
                  ) : (
                    <div className="message-bubble">{msg.text}</div>
                  )}
                  <span className="message-time">
                    {formatMessageTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-messages">No messages yet</p>
        )}
        <div ref={scrollEnd} />
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Send a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
        />

        <div className="input-actions">
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
            onChange={handleSendImage}
          />
          <label htmlFor="image" className="input-icon">
            <img src={assets.gallery_icon} alt="gallery" />
          </label>

          <button type="button" onClick={handleSendMessage}>
            <img src={assets.send_button} alt="send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
