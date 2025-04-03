import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [usernameUser, setUsernameUser] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [machinesData, setMachinesData] = useState([])
    const navigate = useNavigate();

    const setAuthTokens = (access, refresh) => {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
    };

    const removeTokens = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    };

     const refreshToken = useCallback(async ()=> {
         try {
             const refreshToken = localStorage.getItem('refresh_token')
             if (!refreshToken){
                 throw new Error('No refresh token available')
             }

             const responce = await fetch('http://127.0.0.1:8000/api/refresh/',{
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ refresh: refreshToken }),
             })

             const data = await responce.json()
              setAuthTokens(data.access, data.refresh);
            return data.access;
        } catch (error) {
            removeTokens();
            setIsAuthenticated(false);
            throw error;
         }
     }, [])

    const authFetch = useCallback(async (url, options = {}) => {
        let response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        if (response.status === 401) {
            try {
                const newToken = await refreshToken();

                response = await fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Authorization': `Bearer ${newToken}`
                    }
                });
            } catch (error) {
                logoutUser();
                throw error;
            }
        }

        return response;
    }, [refreshToken, logoutUser]);

    const loginUser = useCallback(async (username, password) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Login failed');

            setAuthTokens(data.access, data.refresh); // Сохраняем токены
            setIsAuthenticated(true);
            setUsernameUser(data.username);
            setUserRole(data.role);
        } catch (error) {
            throw error;
        }
    }, []);

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/check-auth/', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Auth check failed');

            const data = await response.json();
            setIsAuthenticated(true);
            setUsernameUser(data.username);
            setUserRole(data.role);
            navigate('authorized/')
        } catch (error) {
            removeTokens();
            setIsAuthenticated(false);
        }
    }, [authFetch]);

    const logoutUser = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');

            if (!refreshToken) {
                throw new Error('No refresh token found');
            }

            const response = await fetch('http://127.0.0.1:8000/api/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({ refresh: refreshToken })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Logout failed');
            }

            // Всегда очищаем данные клиента
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setIsAuthenticated(false);
            setUsernameUser('');
            setUserRole('');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error.message);
            // Даже при ошибке очищаем локальные данные
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setIsAuthenticated(false);
            setUsernameUser('');
            setUserRole('');
            navigate('/');
        }
    }, [navigate, authFetch]);

    useEffect(() => {
        checkAuth().finally(() => setIsLoading(false));
    }, [checkAuth]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            usernameUser,
            userRole,
            loginUser,
            logoutUser,
            checkAuth,
            machinesData,
            setMachinesData,
            authFetch
        }}>
            {children}
        </AuthContext.Provider>
    );
};