import { MovieDetails } from "@/lib/types";
import { Alert } from "react-native";

export async function get_movie_by_code(code: number): Promise<MovieDetails | null> {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${code}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer ' + process.env.EXPO_PUBLIC_API_TOKEN
            }
        });

        if (!response.ok) {
            Alert.alert('Error', 'Failed to fetch movie data: ' + response.statusText);
            return null;
        }

        const data = (await response.json()) as MovieDetails;
        return data;
    } catch (err: any) {
        Alert.alert('Error', 'Failed to fetch movie data: ' + err.message);
        return null;
    }
}

export async function get_movies_by_genre(genre: string[], and_or: 'and' | 'or' = 'and'): Promise<MovieDetails[] | null> {
    try {
        const with_genres = and_or === 'and' ? genre.join(',') : genre.join('|');

        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&sort_by=popularity.desc&with_genres=${with_genres}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer ' + process.env.EXPO_PUBLIC_API_TOKEN
            }
        });

        if (!response.ok) {
            Alert.alert('Error', 'Failed to fetch movie data: ' + response.statusText);
            return null;
        }

        const data = await response.json();
        const movie_ids: MovieDetails[] = [];
        let count = 0;

        for (let i = 0; i < data.results.length; i++) {
            get_movie_by_code(data.results[i].id).then((movie) => {
                if (movie != null) {
                    movie_ids.push(movie);
                    count++;
                }
            });

            if (count >= 10) {
                break;
            }
        }

        return movie_ids;
    } catch (err: any) {
        Alert.alert('Error', 'Failed to fetch movie data: ' + err.message);
        return null;
    }
}