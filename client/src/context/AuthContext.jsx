import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const backendUrl = "http://localhost:5000";

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    const checkAuth = async () => {
        try {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                // Real API call to validate token and fetch user
                const response = await axios.get('/api/auth/check');
                if (response.data.success) {
                    setAuthUser(response.data.user);
                } else {
                    // token invalid
                    setAuthUser(null);
                    setToken(null);
                    localStorage.removeItem('token');
                }
            } else {
                setAuthUser(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setAuthUser(null);
            // Keep token cleared to avoid unauthorized API calls
            setToken(null);
            localStorage.removeItem('token');
        }
    };

    // login function to handle user authentication and socket connection
    const login = async (state, credential) => {
        try {
            console.log("Login attempt:", state, credential);
            
            // Try real API first
            const endpoint = state === 'signup' ? '/api/auth/signup' : '/api/auth/login';
            const response = await axios.post(endpoint, credential);
            
            if (response.data.success) {
                setAuthUser(response.data.user);
                setToken(response.data.token);
                // ensure axios uses the token immediately
                axios.defaults.headers.common["token"] = response.data.token;
                localStorage.setItem("token", response.data.token);

                toast.success(response.data.message);

                // Connect socket for real-time features
                connectSocket(response.data.user);
            }
        } catch (error) {
            console.error("API login failed:", error);
            toast.error(error?.response?.data?.message || 'Login failed');
            // Ensure no stale token is stored
            setAuthUser(null);
            setToken(null);
            localStorage.removeItem('token');
        }
    };

    // logout function to handle user
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully");
        if (socket) {
            socket.disconnect();
        }
    };

    // update profile
    const updateProfile = async (body) => {
        try {
            console.log("Updating profile:", body);
            
            // Try real API first
            const response = await axios.put('/api/auth/update-profile', body);
            
            if (response.data.success) {
                setAuthUser(response.data.user);
                toast.success("Profile Updated Successfully");
                return;
            }
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error(error?.response?.data?.message || 'Profile update failed');
            throw error;
        }
    };

    // connect socket function to handle socket connection and online users update
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        
        try {
            const newSocket = io(backendUrl, {
                query: {
                    userId: userData._id,
                }
            });
            
            newSocket.connect();
            setSocket(newSocket);

            newSocket.on('getOnlineUsers', (userIds) => {
                setOnlineUsers(userIds);
            });
            
            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
            });
            
            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
            });
            
        } catch (error) {
            console.log("Socket connection failed:", error);
        }
    };

    // set axios header whenever token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
        } else {
            delete axios.defaults.headers.common["token"];
        }
    }, [token]);

    // run auth check on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
