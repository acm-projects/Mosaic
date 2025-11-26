import { get_cached_movie } from "@/lib/cache";
import { DiscoverMovieResult, Genres, MovieDetails, Result } from "@/lib/types";

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

export async function get_movies_by_genre(
    genres: string[],
    and_or: "and" | "or" = "and",
    limit: number = 10
): Promise<Result<MovieDetails[]>> {
    try {
        const genre_codes = genres
            .map(g => Genres[g as keyof typeof Genres])
            .filter(code => code !== undefined) as number[];

        const with_genres =
            and_or === "and"
                ? genre_codes.join(",")
                : genre_codes.join("|");

        let collected_movies: MovieDetails[] = [];
        let page = 1;
        let max_pages = 1;

        while (collected_movies.length < limit && page <= max_pages) {
            const url = `https://api.themoviedb.org/3/discover/movie?` +
                `language=en-US&sort_by=vote_count.desc&page=${page}&with_genres=${with_genres}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: "Bearer " + process.env.EXPO_PUBLIC_API_TOKEN
                }
            });

            if (!response.ok) {
                return { ok: false, error: response.statusText, code: "404" };
            }

            const data = (await response.json()) as DiscoverMovieResult;
            max_pages = data.total_pages;

            if (data.results.length === 0) break;

            for (const movie of data.results) {
                if (collected_movies.length >= limit) break;

                const details = await get_movie_by_code(movie.id);

                if (!details.ok) {
                    console.log(`Failed movie ${movie.id}: ${details.error}`);
                    continue;
                }

                collected_movies.push(details.data);
            }

            page++;
        }

        collected_movies = collected_movies.slice(0, limit);

        return { ok: true, data: collected_movies };
    } catch (err: any) {
        return { ok: false, error: err.message, code: err.code };
    }
}


export async function fetch_movies_for_genres(genres: string[]): Promise<MovieDetails[]> {
    const [and_res, or_res] = await Promise.all([
        get_movies_by_genre(genres, "and", 20),
        get_movies_by_genre(genres, "or", 20),
    ]);

    if (!or_res.ok || !and_res.ok) {
        return [];
    };

    const unique: Map<number, MovieDetails> = new Map();
    [...and_res.data, ...or_res.data].forEach(m => unique.set(m.id, m));

    const unique_movies = Array.from(unique.values());
    unique_movies.sort((a, b) => b.popularity - a.popularity);

    return unique_movies;
}
