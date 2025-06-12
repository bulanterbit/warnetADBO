-- =================================================================
-- Script SQL untuk Setup Database Sistem Manajemen Warnet
-- Dijalankan pada: 12 Juni 2025
-- =================================================================

-- Membuat database baru dengan nama 'warnet_db'.
-- IF NOT EXISTS digunakan agar tidak terjadi error jika database sudah ada.
CREATE DATABASE IF NOT EXISTS warnet_db;

-- Membuat pengguna (user) baru bernama 'victoryNet' yang hanya bisa diakses dari localhost.
-- Ganti 'pass_warnet' jika Anda ingin menggunakan password yang berbeda.
-- CATATAN: Perintah ini akan error jika pengguna 'victoryNet' sudah ada. 
-- Anda bisa mengabaikan error tersebut jika Anda tahu pengguna sudah dibuat sebelumnya.
CREATE USER 'victoryNet'@'localhost' IDENTIFIED BY 'pass_warnet';

-- Memberikan semua hak akses (privileges) kepada pengguna 'victoryNet'
-- hanya untuk database 'warnet_db'.
GRANT ALL PRIVILEGES ON warnet_db.* TO 'victoryNet'@'localhost';

-- Menerapkan (flush) semua perubahan hak akses agar segera berlaku.
FLUSH PRIVILEGES;

-- Menampilkan pesan bahwa proses setup telah selesai.
-- Pesan ini akan terlihat di terminal setelah script berhasil dijalankan.
SELECT 'Database `warnet_db` dan user `victoryNet` berhasil dibuat.' AS 'Status';