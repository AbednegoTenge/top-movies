import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get('/', authController.home)
router.post('/add', authController.add);

export default router;