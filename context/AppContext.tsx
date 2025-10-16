import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
// Note: We assume Movie type is defined in a global or imported data file.

// --- INTERFACES (TypeScript Definitions) ---

interface Group {
  id: string;
  name: string;
  avatar: string;
  color: string;
  members: string[];
  sharedMovies: number[];
  pendingInvites: string[];
  quizCompleted?: string[];
  hasGroupQuiz?: boolean;
  topPicks?: number[];
}

interface Folder {
  id: string;
  name: string;
  source: 'clips' | 'home' | 'discover';
  movieIds: number[];
  clipIds?: number[];
}

interface UserData {
  username: string;
  email: string;
  genres: string[];
  likedMovies: number[];
  dislikedMovies: number[];
  savedMovies: number[];
  watchedMovies: number[];
  bookmarkedMovies: number[];
  groups: Group[];
  streamingServices: string[];
  level: number;
  folders: Folder[];
  selectedGroupForTopPicks?: string;
}

type Screen = 'auth' | 'signup' | 'create-account' | 'google-signup' | 'quiz' | 'swipe' | 'streaming-setup' | 'group-setup' | 'home' | 'clips' | 'discover' | 'saved' | 'groups' | 'profile' | 'group-top-picks';

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  previousScreen: Screen | null;
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  updateUserData: (data: Partial<UserData>) => void;
  isReturningUser: boolean;
  setIsReturningUser: (value: boolean) => void;
}

// --- CONTEXT ---
const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // We explicitly type the state based on our interfaces
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isReturningUser, setIsReturningUser] = useState(false);

  const handleSetCurrentScreen = useCallback((screen: Screen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  }, [currentScreen]);

  const updateUserData = useCallback((data: Partial<UserData>) => {
    setUserData(prev => {
        if (!prev) return null;
        return { ...prev, ...data };
    });
  }, []);

  const contextValue = useMemo(() => ({
    currentScreen,
    setCurrentScreen: handleSetCurrentScreen,
    previousScreen,
    userData,
    setUserData,
    updateUserData,
    isReturningUser,
    setIsReturningUser
  }), [
    currentScreen,
    handleSetCurrentScreen,
    previousScreen,
    userData,
    updateUserData,
    isReturningUser
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}