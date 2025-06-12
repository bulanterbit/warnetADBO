import express from 'express';
import { mulaiSesi, stopSesi } from '../controllers/sesi.controller.js';
import { protect, isOperator } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   POST /api/sesi/mulai
// @desc    Operator memulai sesi billing untuk pelanggan di sebuah PC
// @access  Private (Hanya Operator)
router.post('/mulai', protect, isOperator, mulaiSesi);

// @route   POST /api/sesi/stop
// @desc    Operator menghentikan sesi billing
// @access  Private (Hanya Operator)
router.post('/stop', protect, isOperator, stopSesi);

export default router;