import jwt from "jsonwebtoken";
import Pengguna from "../models/Pengguna.model.js";

// Middleware untuk verifikasi token JWT dan mengambil data pengguna
export const protect = async (req, res, next) => {
  let token;

  // Ambil token dari header Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Tidak ada token, akses ditolak" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.pengguna = await Pengguna.findByPk(decoded.id);
    if (!req.pengguna) {
      return res.status(401).json({ message: "Pengguna tidak ditemukan" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid" });
  }
};

// Middleware untuk cek role Operator
export const isOperator = (req, res, next) => {
  if (req.pengguna?.role !== "Operator") {
    return res.status(403).json({ message: "Akses hanya untuk Operator" });
  }
  next();
};