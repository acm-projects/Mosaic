export interface User {
    email: string;
    username: string;
    groups: string[];
    favorite_movies: number[];
    favorite_genre: string[];
    favorite_actor: string[];
    favorite_director: string[];
    taken_quiz: boolean;
    createdAt: string;
    mood: Map<string, string>;
}