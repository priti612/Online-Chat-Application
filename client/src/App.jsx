import { useContext } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { Toaster } from "react-hot-toast";
import "./App.css";
import { AuthContext } from './context/AuthContext';

const App = () => {
  const { authUser } = useContext(AuthContext);
  
  return (
    <div className="app-background">
      <Toaster />
      {authUser ? (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<Navigate to="/" />} />
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
