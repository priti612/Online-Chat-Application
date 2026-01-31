import { useContext } from 'react';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';
import Sidebar from '../components/Sidebar';
import { ChatContext } from '../context/ChatContext';
import "../pages/HomePage.css";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="homepage-container">
      <div className={`homepage-inner ${selectedUser ? "layout-selected" : "layout-default"}`}>
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;
