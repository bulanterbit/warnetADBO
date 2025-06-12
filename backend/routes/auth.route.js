import express from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Mendaftarkan Pelanggan baru
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login untuk semua jenis pengguna
// @access  Public
router.post('/login', login);

export default router;