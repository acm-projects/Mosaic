export interface Movie {
  id: number;
  title: string;
  year: number;
  runtime: number;
  rating: number;
  genre: string[];
  description: string;
  poster: string;
  backdrop: string;
  whereToWatch: string[];
  mood: string[];
  trailerUrl: string;
  actors: string[];
  // Added duration property for consistent display on group screens
  duration: string; 
}

export const movies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    runtime: 148,
    rating: 8.8,
    genre: ["Sci-Fi", "Thriller", "Action"],
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    poster: "https://placehold.co/400x600/1C3C78/ffffff?text=INCEPTION",
    backdrop: "https://placehold.co/800x400/1C3C78/ffffff?text=INCEPTION_BACKDROP",
    whereToWatch: ["Netflix", "Amazon Prime"],
    mood: ["Intense", "Mind-bending", "Serious"],
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
    duration: "2h 28m"
  },
  {
    id: 2,
    title: "The Grand Budapest Hotel",
    year: 2014,
    runtime: 99,
    rating: 8.1,
    genre: ["Comedy", "Drama", "Adventure"],
    description: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy.",
    poster: "https://placehold.co/400x600/5C7AB8/ffffff?text=BUDAPEST",
    backdrop: "https://placehold.co/800x400/5C7AB8/ffffff?text=BUDAPEST_BACKDROP",
    whereToWatch: ["Hulu", "HBO Max"],
    mood: ["Quirky", "Heartwarming", "Whimsical"],
    trailerUrl: "https://www.youtube.com/embed/1Fg5iWmQjwk",
    actors: ["Ralph Fiennes", "Tony Revolori", "Saoirse Ronan", "Adrien Brody"],
    duration: "1h 39m"
  },
  {
    id: 3,
    title: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    runtime: 117,
    rating: 8.4,
    genre: ["Animation", "Action", "Adventure"],
    description: "Teen Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals from other dimensions.",
    poster: "https://placehold.co/400x600/000000/ffffff?text=SPIDER-VERSE",
    backdrop: "https://placehold.co/800x400/000000/ffffff?text=SPIDER_BACKDROP",
    whereToWatch: ["Netflix", "Amazon Prime"],
    mood: ["Fun", "Energetic", "Heartwarming"],
    trailerUrl: "https://www.youtube.com/embed/g4Hbz2jLxvQ",
    actors: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld", "Mahershala Ali"],
    duration: "1h 57m"
  },
  {
    id: 4,
    title: "La La Land",
    year: 2016,
    runtime: 128,
    rating: 8.0,
    genre: ["Musical", "Romance", "Drama"],
    description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.",
    poster: "https://placehold.co/400x600/FFC0CB/000000?text=LA+LA+LAND",
    backdrop: "https://placehold.co/800x400/FFC0CB/000000?text=LALALAND_BACKDROP",
    whereToWatch: ["Netflix", "Paramount+"],
    mood: ["Romantic", "Dreamy", "Bittersweet"],
    trailerUrl: "https://www.youtube.com/embed/0pdqf4P9MB8",
    actors: ["Ryan Gosling", "Emma Stone", "John Legend", "Rosemarie DeWitt"],
    duration: "2h 8m"
  },
  {
    id: 5,
    title: "Get Out",
    year: 2017,
    runtime: 104,
    rating: 7.7,
    genre: ["Horror", "Thriller", "Mystery"],
    description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception evolves into paranoia.",
    poster: "https://placehold.co/400x600/800080/ffffff?text=GET+OUT",
    backdrop: "https://placehold.co/800x400/800080/ffffff?text=GETOUT_BACKDROP",
    whereToWatch: ["Netflix", "Peacock"],
    mood: ["Scary", "Intense", "Thought-provoking"],
    trailerUrl: "https://www.youtube.com/embed/DzfpyUB60YY",
    actors: ["Daniel Kaluuya", "Allison Williams", "Bradley Whitford", "Catherine Keener"],
    duration: "1h 44m"
  },
  {
    id: 6,
    title: "Knives Out",
    year: 2019,
    runtime: 130,
    rating: 7.9,
    genre: ["Mystery", "Comedy", "Crime"],
    description: "A detective investigates the death of a patriarch of an eccentric, combative family.",
    poster: "https://placehold.co/400x600/f59e0b/000000?text=KNIVES+OUT",
    backdrop: "https://placehold.co/800x400/f59e0b/000000?text=KNIVESOUT_BACKDROP",
    whereToWatch: ["Amazon Prime", "Netflix"],
    mood: ["Funny", "Clever", "Engaging"],
    trailerUrl: "https://www.youtube.com/embed/qGqiHJTsRkQ",
    actors: ["Daniel Craig", "Ana de Armas", "Chris Evans", "Jamie Lee Curtis"],
    duration: "2h 10m"
  },
  {
    id: 7,
    title: "Interstellar",
    year: 2014,
    runtime: 169,
    rating: 8.6,
    genre: ["Sci-Fi", "Drama", "Adventure"],
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster: "https://placehold.co/400x600/10b981/ffffff?text=INTERSTELLAR",
    backdrop: "https://placehold.co/800x400/10b981/ffffff?text=INTERSTELLAR_BACKDROP_2",
    whereToWatch: ["Paramount+", "Amazon Prime"],
    mood: ["Epic", "Emotional", "Mind-bending"],
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    duration: "2h 49m"
  },
  {
    id: 8,
    title: "Dune",
    year: 2021,
    runtime: 155,
    rating: 8.0,
    genre: ["Sci-Fi", "Adventure", "Drama"],
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    poster: "https://placehold.co/400x600/06b6d4/ffffff?text=DUNE",
    backdrop: "https://placehold.co/800x400/06b6d4/ffffff?text=DUNE_BACKDROP",
    whereToWatch: ["HBO Max", "Amazon Prime"],
    mood: ["Epic", "Immersive", "Serious"],
    trailerUrl: "https://www.youtube.com/embed/8g18jFHCLXk",
    actors: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Oscar Isaac"],
    duration: "2h 35m"
  }
];

export interface Clip {
  id: number;
  movieId: number;
  movieTitle: string;
  clipUrl: string;
  thumbnail: string;
  duration: number;
  genre: string[];
}

export const clips: Clip[] = movies.map((movie, index) => ({
  id: index + 1,
  movieId: movie.id,
  movieTitle: movie.title,
  clipUrl: movie.backdrop, // Using backdrop as a mock clip URL
  thumbnail: movie.backdrop,
  duration: 20 + Math.floor(Math.random() * 20), // 20 to 39 seconds
  genre: movie.genre
})); 