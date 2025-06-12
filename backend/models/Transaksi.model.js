// warnetADBO/backend/models/Transaksi.model.js

import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Transaksi = sequelize.define(
  "Transaksi",
  {
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
      type: DataTypes.ENUM("TOPUP", "PEMBAYARAN_SESI"),
      allowNull: false,
    },
    // PERBAIKAN: Menambahkan foreign key
    penggunaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pengguna",
        key: "id",
      },
    },
    sesiId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Sesi bisa NULL jika tipenya TOPUP
      references: {
        model: "sesi",
        key: "id",
      },
    },
  },
  {
    tableName: "transaksi",
    timestamps: true,
  }
);

export default Transaksi;
