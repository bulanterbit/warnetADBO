import express from 'express';
import { generateLaporanHarian } from '../controllers/laporan.controller.js';
import { protect, isOperator } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   POST /api/laporan/harian
// @desc    Operator membuat laporan pendapatan harian
// @access  Private (Hanya Operator)
router.post('/harian', protect, isOperator, generateLaporanHarian);

export default router;