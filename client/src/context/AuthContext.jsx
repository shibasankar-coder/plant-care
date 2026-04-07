import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { initPushNotifications, unsubscribePush } from '../services/pushService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            initPushNotifications(parsedUser._id);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        if (res.data) {
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            initPushNotifications(res.data._id, true);
        }
        return res.data;
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        if (res.data) {
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            initPushNotifications(res.data._id);
        }
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        // Optional: unsubscribe Push to stop receiving messages when logged out
        // unsubscribePush();
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
