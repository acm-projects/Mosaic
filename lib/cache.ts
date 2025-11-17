import AsyncStorage from "@react-native-async-storage/async-storage";
import { MovieDetails, Result } from "./types";

const CACHE_DURAITON = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function get_cached_movie(code: number): Promise<Result<MovieDetails>> {
    const cached_movie = await AsyncStorage.getItem(`movie_${code}`);

    if (cached_movie) {
        const movie_data = JSON.parse(cached_movie);
        delete movie_data.cached_at;

        return { ok: true, data: JSON.parse(movie_data) as MovieDetails };
    }

    return { ok: false, error: "Movie not found in cache", code: "404" };
}

export async function cache_movie(movie: MovieDetails): Promise<void> {
    const cache_data = { ...movie, cached_at: Date.now() };
    
    await AsyncStorage.setItem(`movie_${movie.id}`, JSON.stringify(cache_data));
}

export async function clean_cache() {
    const now = Date.now();
    const keys = await AsyncStorage.getAllKeys();

    for (const key of keys) {
        if (key.startsWith("movie_")) {
            const movie = await AsyncStorage.getItem(key);
            if (movie) {
                const movie_data = JSON.parse(movie);
                const movie_time = movie_data.cached_at;

                if (now - movie_time > CACHE_DURAITON) {
                    await AsyncStorage.removeItem(key);
                }
            }
        }
    }
}
