import express from 'express';
import { getProfilSaya, topUpSaldo } from '../controllers/pengguna.controller.js';
import { protect, isOperator } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/pengguna/profil
// @desc    Mendapatkan data profil pengguna yang sedang login
// @access  Private (Memerlukan login untuk semua role)
router.get('/profil', protect, getProfilSaya);

// @route   POST /api/pengguna/:id/topup
// @desc    Operator melakukan top up saldo untuk seorang pelanggan
// @access  Private (Hanya Operator)
router.post('/:id/topup', protect, isOperator, topUpSaldo);

export default router;