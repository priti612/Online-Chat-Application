import { useContext } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { Toaster } from "react-hot-toast";
import "./App.css";
import { AuthContext } from './context/AuthContext';

const App = () => {
  const { authUser, isCheckingAuth } = useContext(AuthContext); // You need to add isCheckingAuth to context if not there

  // If you don't have isCheckingAuth, you can skip this part, 
  // but it's smoother to have a loader.
  if (authUser === undefined) return <div className="loading">Loading...</div>;
  
  return (
    <div className="app-background">
      <Toaster />
      {authUser ? (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
};

export default App;