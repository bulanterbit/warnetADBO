import Komputer from '../models/Komputer.model.js';
import JenisKomputer from '../models/JenisKomputer.model.js';

// --- Manajemen Jenis Komputer ---

// @desc    Membuat Jenis Komputer baru
// @route   POST /api/komputer/jenis
export const tambahJenisKomputer = async (req, res) => {
    try {
        const { nama, tarifPerMenit } = req.body;
        const jenisBaru = await JenisKomputer.create({ nama, tarifPerMenit });
        res.status(201).json(jenisBaru);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Melihat semua Jenis Komputer
// @route   GET /api/komputer/jenis
export const getAllJenisKomputer = async (req, res) => {
    try {
        const semuaJenis = await JenisKomputer.findAll();
        res.status(200).json(semuaJenis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Manajemen Komputer ---

// @desc    Menambah Komputer baru
// @route   POST /api/komputer
export const tambahKomputer = async (req, res) => {
    try {
        const { nama, jenisId } = req.body;
        const komputerBaru = await Komputer.create({ nama, jenisId });
        res.status(201).json(komputerBaru);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Melihat semua komputer dengan status & jenisnya
// @route   GET /api/komputer
export const getAllKomputer = async (req, res) => {
    try {
        const semuaKomputer = await Komputer.findAll({
            include: [{ model: JenisKomputer, attributes: ['nama', 'tarifPerMenit'] }]
        });
        res.status(200).json(semuaKomputer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mengubah status komputer
// @route   PUT /api/komputer/:id/status
export const updateStatusKomputer = async (req, res) => {
    try {
        const { status } = req.body; // status: "Tersedia", "Digunakan", "Perbaikan"
        const komputer = await Komputer.findByPk(req.params.id);
        if (!komputer) {
            return res.status(404).json({ message: 'Komputer tidak ditemukan' });
        }
        komputer.status = status;
        await komputer.save();
        res.status(200).json(komputer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};