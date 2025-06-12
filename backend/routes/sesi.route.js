// warnetADBO/backend/routes/sesi.route.js

import express from "express";
// PERBAIKAN: Impor fungsi baru getSesiAktif
import {
  mulaiSesi,
  stopSesi,
  getSesiAktif,
} from "../controllers/sesi.controller.js";
import { protect, isOperator } from "../middleware/auth.middleware.js";

const router = express.Router();

// Semua rute di sini hanya untuk operator
router.use(protect, isOperator);

// PERBAIKAN: Tambahkan rute GET untuk sesi aktif
// @route   GET /api/sesi/aktif
// @desc    Operator mendapatkan semua sesi yg sedang berjalan
// @access  Private (Hanya Operator)
router.get("/aktif", getSesiAktif);

// @route   POST /api/sesi/mulai
// @desc    Operator memulai sesi billing untuk pelanggan di sebuah PC
// @access  Private (Hanya Operator)
router.post("/mulai", mulaiSesi);

// @route   POST /api/sesi/stop
// @desc    Operator menghentikan sesi billing
// @access  Private (Hanya Operator)
router.post("/stop", stopSesi);

export default router;
