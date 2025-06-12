import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Transaksi = sequelize.define('Transaksi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  jumlah: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  tipe: {
    type: DataTypes.ENUM('TOPUP', 'PEMBAYARAN_SESI'),
    allowNull: false,
  },
}, {
  tableName: 'transaksi',
  timestamps: true
});

export default Transaksi;