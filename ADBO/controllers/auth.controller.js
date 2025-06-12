import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Pengguna from '../models/Pengguna.model.js';

// Fungsi untuk membuat JSON Web Token (JWT)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

/**
 * @desc    Register Pelanggan baru
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  const { username, password, nama } = req.body;

  if (!username || !password || !nama) {
    return res.status(400).json({ message: 'Harap isi semua field' });
  }

  try {
    const penggunaExists = await Pengguna.findOne({ where: { username } });
    if (penggunaExists) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const pengguna = await Pengguna.create({
      username,
      nama,
      password: hashedPassword,
      role: 'Pelanggan', // Pendaftaran default hanya untuk Pelanggan
    });

    res.status(201).json({
      id: pengguna.id,
      nama: pengguna.nama,
      role: pengguna.role,
      token: generateToken(pengguna.id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Login Pengguna (Pelanggan/Operator)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const pengguna = await Pengguna.findOne({ where: { username } });

    if (pengguna && (await bcrypt.compare(password, pengguna.password))) {
      res.json({
        id: pengguna.id,
        nama: pengguna.nama,
        role: pengguna.role,
        token: generateToken(pengguna.id),
      });
    } else {
      res.status(401).json({ message: 'Username atau password salah' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};