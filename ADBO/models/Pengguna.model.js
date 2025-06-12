import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Pengguna = sequelize.define('Pengguna', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  saldo: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  role: {
    type: DataTypes.ENUM('Pelanggan', 'Operator'),
    allowNull: false,
  },
}, {
  tableName: 'pengguna',
  timestamps: true // Menambahkan createdAt dan updatedAt secara otomatis
});

export default Pengguna;