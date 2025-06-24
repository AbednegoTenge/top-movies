import express from 'express';
import authController from '../controllers/authController.js';
import axios from 'axios';
import Movies from '../database/movieDb.js';

const router = express.Router();

router.get('/', authController.home)
router.get('/add', authController.addMoviePage)
router.post('/add', authController.addMovieSearch)
router.get('/edit/:id', authController.editMoviePage)
router.post('/edit/:id', authController.editMovieForm)

export default router;