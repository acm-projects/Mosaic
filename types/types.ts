export type AppScreen = 
    | 'home'
    | 'profile'
    | 'group-setup'
    | 'group-top-picks'
    | 'movie-details';

export interface Movie {
    id: number;
    title: string;
    year: string;
    poster: string;
    backdrop?: string;
    genre: string[];
    description: string;
    runtime?: number;
    rating?: number;
}

export interface Group {
    id: string;
    name: string;
    color: string;
    members: string[];
    pendingInvites?: string[];
    quizCompleted?: string[];
    hasGroupQuiz?: boolean;
    topPicks?: number[];
}

export interface UserData {
    id: string;
    email: string;
    name: string;
    groups: Group[];
    watchedMovies: number[];
    savedMovies: number[];
    genres: string[];
}