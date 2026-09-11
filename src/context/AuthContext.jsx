import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'cinemameet_user_session';
const USERS_KEY = 'cinemameet_registered_users';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Failed to load user session', e);
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_KEY);
      return saved ? JSON.parse(saved) : [
        {
          id: 'user-demo-1',
          name: 'Gokul (Host)',
          email: 'gokul@stream.com',
          password: 'password123',
          avatar: '🍿',
          color: '#00f2fe'
        },
        {
          id: 'user-demo-2',
          name: 'Alex',
          email: 'alex@cinema.com',
          password: 'password123',
          avatar: '🎬',
          color: '#7928ca'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // Keep session synced in localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to update local session', e);
    }
  }, [user]);

  // Keep registered users in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(registeredUsers));
    } catch (e) {
      console.error('Failed to store registered users', e);
    }
  }, [registeredUsers]);

  const login = (email, password) => {
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const signup = (name, email, password, avatar = '🍿') => {
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Account with this email already exists' };
    }

    const colors = ['#00f2fe', '#7928ca', '#ff0080', '#10b981', '#f59e0b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      avatar,
      color: randomColor
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
