import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Laporan = sequelize.define(
  "Laporan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jenis: {
      type: DataTypes.ENUM("Pendapatan Harian", "Pendapatan Bulanan"),
      allowNull: false,
    },
    periode: {
      type: DataTypes.STRING, // e.g., '2025-06-12' or '2025-06'
      allowNull: false,
    },
    // DataTypes.JSON hanya didukung oleh beberapa dialek SQL (MySQL 5.7+ mendukungnya)
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "laporan",
    timestamps: true,
  }
);

export default Laporan;
