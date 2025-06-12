// warnetADBO/backend/controllers/pengguna.controller.js

import Pengguna from "../models/Pengguna.model.js";
// PERBAIKAN: Impor model Transaksi dan instance sequelize untuk transaction
import Transaksi from "../models/Transaksi.model.js";
import { sequelize } from "../config/db.js";

// Fungsi getAllPengguna dan getProfilSaya tidak perlu diubah
export const getAllPengguna = async (req, res) => {
  try {
    const semuaPengguna = await Pengguna.findAll({
      attributes: {
        exclude: ["password"],
      },
      order: [["nama", "ASC"]],
    });
    res.status(200).json(semuaPengguna);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getProfilSaya = async (req, res) => {
  try {
    if (!req.pengguna) {
      return res.status(401).json({ message: "Tidak ada data pengguna" });
    }
    res.json({
      id: req.pengguna.id,
      nama: req.pengguna.nama,
      username: req.pengguna.username,
      role: req.pengguna.role,
      saldo: req.pengguna.saldo,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// PERBAIKAN: Logika topUpSaldo dirombak total
export const topUpSaldo = async (req, res) => {
  // Memulai transaksi database
  const t = await sequelize.transaction();

  try {
    const { jumlah } = req.body;
    const pengguna = await Pengguna.findByPk(req.params.id);

    if (!pengguna) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const jumlahNumeric = parseFloat(jumlah);
    if (isNaN(jumlahNumeric) || jumlahNumeric <= 0) {
      return res.status(400).json({ message: "Jumlah top up tidak valid." });
    }

    // 1. Tambahkan saldo di dalam transaksi
    await pengguna.increment("saldo", { by: jumlahNumeric, transaction: t });

    // 2. Catat ke tabel Transaksi di dalam transaksi yang sama
    await Transaksi.create(
      {
        jumlah: jumlahNumeric,
        tipe: "TOPUP",
        penggunaId: pengguna.id,
        // sesiId dibiarkan null karena ini bukan transaksi dari sesi billing
      },
      { transaction: t }
    );

    // 3. Jika semua berhasil, commit transaksi
    await t.commit();

    // 4. Reload data pengguna untuk mendapatkan saldo terbaru dari database
    await pengguna.reload();

    res.status(200).json({
      message: `Saldo untuk ${
        pengguna.nama
      } berhasil ditambah sebesar Rp${jumlahNumeric.toLocaleString("id-ID")}`,
      saldoBaru: pengguna.saldo, // Kirim saldo yang sudah di-reload
    });
  } catch (error) {
    // 5. Jika terjadi error, batalkan semua perubahan (rollback)
    await t.rollback();
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
