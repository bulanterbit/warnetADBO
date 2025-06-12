import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Sesi = sequelize.define('Sesi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  komputerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'komputer',
      key: 'id'
    }
  },
  penggunaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pengguna',
      key: 'id'
    }
  },
  waktuMulai: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  waktuSelesai: {
    type: DataTypes.DATE,
  },
  durasiMenit: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.ENUM('Aktif', 'Selesai'),
    defaultValue: 'Aktif',
  },
}, {
  tableName: 'sesi',
  timestamps: true
});

export default Sesi;