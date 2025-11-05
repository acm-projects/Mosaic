import { Movie } from '../types/types';

export const mockMovies: Movie[] = [
    {
        id: 1,
        title: "Inception",
        year: "2010",
        poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        genre: ["Sci-Fi", "Action", "Thriller"],
        description: "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a CEO."
    },
    { 
        id: 2,
        title: "The Matrix",
        year: "1999",
        poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        genre: ["Sci-Fi", "Action"],
        description: "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free."
    },
    {
        id: 3,
        title: "Interstellar",
        year: "2014",
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        genre: ["Sci-Fi", "Drama", "Adventure"],
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
    },
    {
        id: 4,
        title: "The Dark Knight",
        year: "2008",
        poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        genre: ["Action", "Crime", "Drama"],
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
    },
    {
        id: 5,
        title: "Pulp Fiction",
        year: "1994",
        poster: "https://image.tmdb.org/t/p/w500/plnlrtBUULT0rh3Xsjmpubiso3L.jpg",
        genre: ["Crime", "Drama"],
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption."
    },
    {
        id: 6,
        title: "The Shawshank Redemption",
        year: "1994",
        poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        genre: ["Drama"],
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
    }
];
