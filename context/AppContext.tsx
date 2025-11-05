import { auth } from '@/lib/firebase_config';
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppScreen, UserData } from '../types/types';

interface AppContextType {
    userData: UserData | null;
    setCurrentScreen: (screen: AppScreen) => void;
    updateUserData: (data: Partial<UserData>) => void;
    loading: boolean;
}

const AppContext = createContext<AppContextType>({
    userData: null,
    setCurrentScreen: () => {},
    updateUserData: () => {},
    loading: true
});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [currentScreen, setCurrentScreen] = useState<string>('home');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('Setting up auth state listener');
        setLoading(true);
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Auth state changed:', user ? 'User logged in' : 'No user');
            try {
                if (user) {
                    // Initialize with basic user data
                    setUserData({
                        id: user.uid,
                        email: user.email || '',
                        name: user.displayName || 'User',
                        groups: [],
                        watchedMovies: [],
                        savedMovies: [],
                        genres: []
                    });
                } else {
                    setUserData(null);
                }
            } catch (error) {
                console.error('Error setting user data:', error);
                setUserData(null);
            } finally {
                setLoading(false);
            }
        }, (error) => {
            console.error('Auth state change error:', error);
            setLoading(false);
        });

        // If auth listener doesn't fire within 10s, stop loading and warn
        const timeout = setTimeout(() => {
            console.error('Auth state listener did not respond within 10s — timing out.');
            setLoading(false);
        }, 10000);

        return () => {
            console.log('Cleaning up auth state listener');
            clearTimeout(timeout);
            unsubscribe();
        };
    }, []);

    const updateUserData = (data: Partial<UserData>) => {
        setUserData(prev => prev ? { ...prev, ...data } : null);
    };

    return (
        <AppContext.Provider value={{
            userData,
            setCurrentScreen,
            updateUserData,
            loading
        }}>
            {children}
        </AppContext.Provider>
    );
};
