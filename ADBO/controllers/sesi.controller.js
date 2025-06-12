import Sesi from '../models/Sesi.model.js';
import Pengguna from '../models/Pengguna.model.js';
import Komputer from '../models/Komputer.model.js';
import Transaksi from '../models/Transaksi.model.js';
import JenisKomputer from '../models/JenisKomputer.model.js';

/**
 * @desc    Memulai sesi baru (oleh Operator)
 * @route   POST /api/sesi/mulai
 * @access  Private (Operator Only)
 */
export const mulaiSesi = async (req, res) => {
  const { idPelanggan, idKomputer } = req.body;

  try {
    const pelanggan = await Pengguna.findByPk(idPelanggan);
    if (!pelanggan || pelanggan.saldo <= 0) {
      return res.status(400).json({ message: 'Saldo pelanggan tidak mencukupi.' });
    }

    const komputer = await Komputer.findByPk(idKomputer);
    if (!komputer || komputer.status !== 'Tersedia') {
      return res.status(400).json({ message: 'Komputer tidak tersedia.' });
    }

    const sesiBaru = await Sesi.create({
      penggunaId: idPelanggan,
      komputerId: idKomputer,
      waktuMulai: new Date(),
    });

    await komputer.update({ status: 'Digunakan' });
    res.status(201).json({ message: 'Sesi berhasil dimulai.', data: sesiBaru });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Menghentikan sesi (oleh Operator)
 * @route   POST /api/sesi/stop
 * @access  Private (Operator Only)
 */
export const stopSesi = async (req, res) => {
  const { idSesi } = req.body;

  try {
    const sesi = await Sesi.findByPk(idSesi, {
      include: { model: Komputer, include: { model: JenisKomputer } },
    });

    if (!sesi || sesi.status === 'Selesai') {
      return res.status(404).json({ message: 'Sesi tidak ditemukan atau sudah selesai.' });
    }

    const waktuSelesai = new Date();
    const durasiMs = waktuSelesai - sesi.waktuMulai;
    const durasiMenit = Math.ceil(durasiMs / (1000 * 60));
    const totalBiaya = durasiMenit * sesi.Komputer.JenisKomputer.tarifPerMenit;

    const pelanggan = await Pengguna.findByPk(sesi.penggunaId);
    await pelanggan.decrement('saldo', { by: totalBiaya });

    await Transaksi.create({
      penggunaId: sesi.penggunaId,
      jumlah: totalBiaya,
      tipe: 'PEMBAYARAN_SESI',
      sesiId: sesi.id,
      operatorId: req.pengguna.id,
    });

    await sesi.update({ status: 'Selesai', waktuSelesai, durasiMenit });
    await sesi.Komputer.update({ status: 'Tersedia' });

    res.status(200).json({
      message: 'Sesi selesai.',
      durasi: `${durasiMenit} menit`,
      biaya: totalBiaya,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};