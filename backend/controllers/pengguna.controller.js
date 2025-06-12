import Komputer from '../models/Komputer.model.js';
import JenisKomputer from '../models/JenisKomputer.model.js';

// --- Manajemen Jenis Komputer ---
export const tambahJenisKomputer = async (req, res) => {
  try {
    const { nama, tarifPerMenit } = req.body;
    const jenisBaru = await JenisKomputer.create({ nama, tarifPerMenit });
    res.status(201).json(jenisBaru);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getAllJenisKomputer = async (req, res) => {
  try {
    const semuaJenis = await JenisKomputer.findAll();
    res.status(200).json(semuaJenis);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Manajemen Komputer ---
export const tambahKomputer = async (req, res) => {
  try {
    const { nama, jenisId } = req.body;
    const komputerBaru = await Komputer.create({ nama, jenisId });
    res.status(201).json(komputerBaru);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getAllKomputer = async (req, res) => {
  try {
    const semuaKomputer = await Komputer.findAll({
      include: {
        model: JenisKomputer,
        attributes: ['nama', 'tarifPerMenit'],
      },
    });
    res.status(200).json(semuaKomputer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateStatusKomputer = async (req, res) => {
  try {
    const { status } = req.body; // status: "Tersedia", "Digunakan", "Perbaikan"
    const komputer = await Komputer.findByPk(req.params.id);
    if (!komputer) {
      return res.status(404).json({ message: 'Komputer tidak ditemukan' });
    }
    await komputer.update({ status });
    res.status(200).json(komputer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getProfilSaya = async (req, res) => {
  try {
    // req.pengguna di-set oleh middleware protect
    if (!req.pengguna) {
      return res.status(401).json({ message: 'Tidak ada data pengguna' });
    }
    res.json({
      id: req.pengguna.id,
      nama: req.pengguna.nama,
      username: req.pengguna.username,
      role: req.pengguna.role,
      saldo: req.pengguna.saldo,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const topUpSaldo = async (req, res) => {
  try {
    const { jumlah } = req.body;
    const pengguna = await req.pengguna.constructor.findByPk(req.params.id);

    if (!pengguna) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    await pengguna.increment('saldo', { by: jumlah });

    res.status(200).json({
      message: `Saldo berhasil ditambah sebesar ${jumlah}`,
      saldoBaru: pengguna.saldo + Number(jumlah)
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ...export fungsi lain seperti ...