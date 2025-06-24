import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get('/', authController.home);
router.get('/add', authController.addMoviePage);
router.post('/add', authController.addMovieSearch);
router.get('/edit/:id', authController.editMoviePage);
router.post('/edit/:id', authController.editMovieForm);
router.delete('/delete/:id', authController.delete);


export default router;