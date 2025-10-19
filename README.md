# 📸 Evident Foto Gedung Telkom 2025

Aplikasi **Form Evident Aktivitas Gedung Telkom 2025** adalah alat bantu internal berbasis web untuk dokumentasi foto kegiatan pemeliharaan dan kebersihan gedung.  
Form ini hanya digunakan sebagai **media input dan cetak**, tanpa melakukan penyimpanan data ke server manapun.

---

## 🧱 Struktur Proyek
Evident_foto/
│
├── index.html # Halaman utama untuk memilih kelas aktivitas
├── form.html # Template form universal (otomatis berdasarkan kelas)
│
├── data/
│ └── kelas_data.js # Data aktivitas dan frekuensi tiap kelas (1–6)
│
└── assets/
├── style.css # Tampilan modern + print-friendly
└── app.js # Logika utama: upload, progress, hash duplikat


---

## ⚙️ Fitur Utama

- 📂 **Upload Foto** kegiatan tiap aktivitas.  
- 🧩 **Otomatis Menyesuaikan Kelas** (1–6) melalui dashboard.  
- 📏 **Konversi Rasio Gambar 4:3 Portrait** secara otomatis.  
- 🚫 **Deteksi Duplikat Foto** (hash-based).  
- 🖨️ **Tampilan Cetak Siap A4**, lengkap dengan header & periode.  
- 🔒 **Tidak Menyimpan Data** — semua aktivitas dilakukan di sisi browser (local).  

---

## ⚠️ Disclaimer

Aplikasi ini **tidak mengunggah, menyimpan, atau mentransfer foto atau data apapun ke server eksternal**.  
Semua proses dilakukan **di browser pengguna (client-side)**, dan hasil akhir hanya berupa tampilan cetak atau PDF yang bisa diunduh manual.

Form ini dibuat **khusus untuk penggunaan internal Telkom Indonesia** sebagai alat bantu dokumentasi dan validasi visual kegiatan operasional.

> 💡 Pengguna bertanggung jawab penuh terhadap data yang diunggah ke form ini.  
> Tidak ada sistem logging, database, maupun server-side API yang aktif.

---

## 🧭 Cara Penggunaan

1. Buka `index.html` melalui browser (atau GitHub Pages).
2. Pilih **kelas aktivitas** (1–6).
3. Isi **ID Gedung**, **Nama Gedung**, dan **Periode**.
4. Upload foto kegiatan sesuai tabel aktivitas.
5. Cetak atau simpan hasilnya sebagai PDF.

---

## 🧰 Teknologi yang Digunakan

- **HTML5 + CSS3 (Pure)** — tanpa framework eksternal.  
- **JavaScript Vanilla (ES6)** — ringan dan modular.  
- **Client-side Canvas API** — untuk cropping & deteksi duplikat.  

---

## 👨‍💻 Pengembang

Dikembangkan oleh **Expecto Patronum (2025)**  
Bagian dari internal tools “DIGISLAM Tools Assistance”  

---

## 📄 Lisensi

Proyek ini bersifat **internal-use only**  
Tidak untuk distribusi publik, komersial, atau penyimpanan data eksternal.
