import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const JenisKomputer = sequelize.define('JenisKomputer', {
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
  tarifPerMenit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'jenis_komputer',
  timestamps: false // Tabel ini mungkin tidak memerlukan timestamps
});

export default JenisKomputer;