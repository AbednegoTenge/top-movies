import Movies from '../database/movieDb.js';
import axios from 'axios';

const authController = {
    async home(req, res) {
        try {
            const movies = await Movies.find({}).sort({ rating: -1});

            let rank = 1;
            let previousRating = null;
            let displayRank = 1


            for (let i = 0; i < movies.length; i++) {
                const movie = movies[i];

                if (movie.rating !== previousRating) {
                    displayRank = rank
                }

                movie.ranking = displayRank;
                previousRating = movie.rating;
                rank++;

                await movie.save(); 
            }
            res.render('index', { movies, title: 'Movies' });
        } catch (err) {
            console.error('Error fetching movies:', err);
            res.status(500).json({ message: err.message });
        }
    },

    async addMoviePage(req, res) {
        const movieId = req.query.id;
        const headers = {
            'accept': 'application/json',
            'Authorization': `Bearer ${process.env.TOKEN}`
        };
        const apiKey = process.env.API_KEY;

        if (movieId) {
            try {
                const movieDetailsURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
                const movieDetails = (await axios.get(movieDetailsURL, { headers }));
                const movieData = movieDetails.data;

                const newMovie = new Movies({
                    title: movieData.original_title,
                    year: movieData.release_date.slice(0, 4),
                    description: movieData['overview'],
                    image_url: `https://image.tmdb.org/t/p/w500${movieData['poster_path']}`
                });

                await newMovie.save();
                const id = newMovie.id;
                return res.redirect('/edit/' + id);
            } catch (err) {
                console.error(err.message);
                return res.status(500).send('Failed to fetch or save movie details.');
            }
        }

        // No ID → just render the form
        res.render('add');
    },

    async addMovieSearch(req, res) {
        const title = req.body.title;
        const headers = {
            'accept': 'application/json',
            'Authorization': `Bearer ${process.env.TOKEN}`
        };
        const apiKey = process.env.API_KEY;

        if (!title) return res.status(400).send("Movie title required");

        try {
            const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;
            const response = await axios.get(searchUrl, { headers });
            const movies = response.data;

            if (movies && movies.results.length > 0) {
                res.render('select', { movies });
            } else {
                res.status(404).send('No movies found');
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error searching for movie');
        }
    },

    async editMoviePage(req, res) {
        const movieId = Number(req.params.id);

        try {
            const movie = await Movies.findOne({ id: movieId });

            if (!movie) {
                return res.status(404).send('Movie not found');
            }

            res.render('edit', { movie });
        } catch (err) {
            console.error('Error loading edit page:', err.message);
            res.status(500).send('Server error');
        }
    },

    async editMovieForm(req, res) {
        const movieId = Number(req.params.id);
        const { rating, review } = req.body;

        try {
            const updatedMovie = await Movies.findOneAndUpdate(
                { id: movieId },
                { $set: { rating, review } },
                { new: true, runValidators: true }
            );

            if (updatedMovie) {
                res.redirect('/');
            } else {
                res.status(404).send('Movie not found');
            }
        } catch (err) {
            console.error('Error updating movie:', err.message);
            res.status(500).send('Failed to update movie');
        }
    },

    async delete(req, res) {
        const movieId = Number(req.params.id);

        try{
            if (isNaN(movieId)) {
                return res.status(400).send('Invalid movie ID');
            }

            const deletedMovie = await Movies.findOneAndDelete({ id: movieId });

            if (deletedMovie) {
                return res.status(200).send('Movie Deleted');
            } else {
                return res.status(404).send('Movie not found');
            }

            res.redirect('/')
        } catch (err) {
            console.error('Error deleting movie:', err.message);
            res.status(500).send('Server error');
        }
    }
};


export default authController;