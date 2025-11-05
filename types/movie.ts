export interface Movie {
  id: number;
  title: string;
  year: string;
  poster: string;
  genre: string[];
  description: string;
}

export interface UserData {
  id: string;
  groups: Group[];
  watchedMovies: number[];
  savedMovies: number[];
  genres: string[];
}

export interface Group {
  id: string;
  name: string;
  color: string;
  pendingInvites?: string[];
  quizCompleted?: string[];
  hasGroupQuiz?: boolean;
  topPicks?: number[];
}