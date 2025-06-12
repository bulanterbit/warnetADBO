import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import penggunaRoutes from "./routes/pengguna.route.js";
import komputerRoutes from "./routes/komputer.routes.js";
import sesiRoutes from "./routes/sesi.route.js";
import laporanRoutes from "./routes/laporan.route.js";
import JenisKomputer from './models/JenisKomputer.model.js';
import Komputer from './models/Komputer.model.js';
import Sesi from './models/Sesi.model.js';
import Pengguna from './models/Pengguna.model.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routing
app.use("/api/auth", authRoutes);
app.use("/api/pengguna", penggunaRoutes);
app.use("/api/komputer", komputerRoutes);
app.use("/api/sesi", sesiRoutes);
app.use("/api/laporan", laporanRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Warnet siap digunakan!" });
});

// Definisikan relasi
JenisKomputer.hasMany(Komputer, { foreignKey: 'jenisId' });
Komputer.belongsTo(JenisKomputer, { foreignKey: 'jenisId' });
Komputer.hasMany(Sesi, { foreignKey: 'komputerId' });
Sesi.belongsTo(Komputer, { foreignKey: 'komputerId' });
Pengguna.hasMany(Sesi, { foreignKey: 'penggunaId' });
Sesi.belongsTo(Pengguna, { foreignKey: 'penggunaId' });

// Jalankan koneksi database sebelum server listen
connectDB()
  .then(() => {
    // Sinkronisasi semua model ke database (hanya untuk development!)
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("✅ Semua tabel sudah sinkron dengan database.");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("Koneksi database gagal:", error);
  });