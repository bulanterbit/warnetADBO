import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Komputer = sequelize.define('Komputer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('Tersedia', 'Digunakan', 'Perbaikan'),
    defaultValue: 'Tersedia',
  },
  jenisId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jenis_komputer',
      key: 'id'
    }
  }
}, {
  tableName: 'komputer',
  timestamps: true
});

export default Komputer;