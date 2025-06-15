import Movies from '../database/movieDb.js';
import axios from 'axios';

const authController = {
    async home(req, res) {
        try {
            const movies = await Movies.find({});
            res.status(200).json(movies);
        } catch (err) {
            console.error('Error fetching movies:', err);
            res.status(500).json({ message: err.message });
        }
    },

    async add(req, res) {
        const title = req.body.title;
        const movieId = req.query.id;

        const headers = {
            'accept': 'application/json',
            'Authorization': `Bearer ${process.env.TOKEN}`
        };        
        const apiKey = process.env.API_KEY;
        
        if (!apiKey || !process.env.TOKEN) {
            console.error('API_KEY or TOKEN is missing from');
            return res.status(500).json({ message: 'Server configuration error: Missing API_KEY or TOKEN' });
        }

        try {
            if (title) {
                const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;
                const response = await axios.get(searchUrl, { headers });
                const searchResults = response.data?.results;

                if (searchResults && searchResults.length > 0) {
                    return res.status(200).json({ movies: searchResults });
                } else {
                    return res.status(404).json({ message: 'No movies found for this title' });
                }

            }  else if (movieId) {
                const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
                const movieResponse = await axios.get(movieUrl, { headers });
                const movieDetails = movieResponse.data;


                if (movieDetails) {
                    const description = movieDetails.overview;
                    const image = `https://image.tmdb.org/t/p/w500${movieDetails['poster_path']}`;
                    const movieTitle = movieDetails.original_title;
                    const year = movieDetails.release_date.slice(0, 4);

                    const addMovie = new Movies({
                        title: movieTitle, 
                        description, 
                        image_url: image, 
                        year
                    });

                    await addMovie.save();
                    res.status(200).json({ message: 'Movie added succesfully', movie: addMovie});
                } else {
                    return res.status(400).json({ message: 'Movie details not found for the provided movieId'})
                }
            } else {
                return res.status(400).json({ message: 'Please provide a title in the form or an id query parameter' })
            }
        } catch (error) {
              console.error('Error in add controller:', error.isAxiosError && error.response ? error.response.data : error.message);
            // More specific error handling for Axios errors
            if (error.isAxiosError && error.response) {
                const { status, data } = error.response;
                const message = data?.status_message || 'Error fetching data from TMDB.';
                return res.status(status).json({ message });
            }
        } 
    }
}

export default authController;