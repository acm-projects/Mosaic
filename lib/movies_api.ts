import { get_cached_movie } from "@/lib/cache";
import { DiscoverMovieResult, MovieDetails, Result } from "@/lib/types";

export async function get_movie_by_code(code: number): Promise<Result<MovieDetails>> {
    const cache_result = await get_cached_movie(code);

    if (cache_result.ok) {
        return cache_result;
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${code}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer ' + process.env.EXPO_PUBLIC_API_TOKEN
            }
        });

        if (!response.ok) {
            return { ok: false, error: response.statusText, code: "404" };
        }

        const data = (await response.json()) as MovieDetails;
        return { ok: true, data: data };
    } catch (err: any) {
        return { ok: false, error: err.message, code: err.code };
    }
}

export async function get_movies_by_genre(genre: string[], and_or: 'and' | 'or' = 'and'): Promise<Result<MovieDetails[]>> {
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
            return { ok: false, error: response.statusText, code: "404" };
        }

        const data = (await response.json()) as DiscoverMovieResult;
        const movie_ids: MovieDetails[] = [];
        let count = 0;

        for (let i = 0; i < data.results.length; i++) {
            const result = await get_movie_by_code(data.results[i].id);
            if (!result.ok) {
                console.log(`Failed to fetch movie with ID ${data.results[i].id}: ${result.error}`);
                continue;
            } else {
                movie_ids.push(result.data);
                count++;
            }

            if (count >= 10) {
                break;
            }
        }

        return { ok: true, data: movie_ids };
    } catch (err: any) {
        return { ok: false, error: err.message, code: err.code };
    }
}

export async function fetch_movies_for_genres(genres: string[]) {
    const [and_res, or_res] = await Promise.all([
        get_movies_by_genre(genres, "and"),
        get_movies_by_genre(genres, "or"),
    ]);

    if (!and_res.ok || !or_res.ok) return [];

    const unique = new Map();
    [...and_res.data, ...or_res.data].forEach(m => unique.set(m.id, m));

    return Array.from(unique.values());
}
