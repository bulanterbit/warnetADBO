import express from 'express';
import {
    tambahJenisKomputer,
    getAllJenisKomputer,
    tambahKomputer,
    getAllKomputer,
    updateStatusKomputer
} from '../controllers/komputer.controller.js';
import { protect, isOperator } from '../middleware/auth.middleware.js';

const router = express.Router();

// Terapkan middleware untuk semua rute di file ini
// karena semua fungsi manajemen komputer hanya untuk Operator
router.use(protect, isOperator);

// Rute untuk manajemen Jenis Komputer
router.route('/jenis')
    .post(tambahJenisKomputer)
    .get(getAllJenisKomputer);

// Rute untuk manajemen Komputer
router.route('/')
    .post(tambahKomputer)
    .get(getAllKomputer);

// Rute untuk mengubah status satu komputer
router.put('/:id/status', updateStatusKomputer);

export default router;