import { Op } from 'sequelize';
import Laporan from '../models/Laporan.model.js';
import Transaksi from '../models/Transaksi.model.js';

/**
 * @desc    Membuat laporan pendapatan harian
 * @route   POST /api/laporan/harian
 * @access  Private (Operator Only)
 */
export const generateLaporanHarian = async (req, res) => {
  // Mengambil tanggal hari ini (waktu server) jika tidak disediakan
  const tanggal = req.body.tanggal ? new Date(req.body.tanggal) : new Date();

  try {
    const awalHari = new Date(tanggal);
    awalHari.setHours(0, 0, 0, 0);

    const akhirHari = new Date(tanggal);
    akhirHari.setHours(23, 59, 59, 999);

    const transaksiHariIni = await Transaksi.findAll({
      where: {
        createdAt: {
          [Op.gte]: awalHari,
          [Op.lte]: akhirHari,
        },
      },
    });

    let totalTopUp = 0;
    let totalPendapatanSesi = 0;

    transaksiHariIni.forEach((t) => {
      if (t.tipe === 'TOPUP') {
        totalTopUp += parseFloat(t.jumlah);
      } else if (t.tipe === 'PEMBAYARAN_SESI') {
        totalPendapatanSesi += parseFloat(t.jumlah);
      }
    });

    const laporan = await Laporan.create({
      jenis: 'Pendapatan Harian',
      periode: awalHari.toISOString().split('T')[0], // Format YYYY-MM-DD
      data: {
        totalTopUp,
        totalPendapatanSesi,
        totalPendapatan: totalTopUp + totalPendapatanSesi,
        jumlahTransaksi: transaksiHariIni.length,
      },
      dibuatOlehId: req.pengguna.id,
    });

    res.status(201).json(laporan);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};