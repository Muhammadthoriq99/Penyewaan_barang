const mongoose = require('mongoose');

const barangSchema = new mongoose.Schema({
  nama_barang: {
    type: String,
    required: true,
  },
  kategori: {
    type: String,
    required: true,
  },
  jumlah: {
    type: Number,
    default: 0,
  },
  kondisi: {
    type: String,
    enum: ['Baik', 'Rusak', 'Perlu Perbaikan'], // Opsional, untuk membatasi nilai
  },
  deskripsi: String,
});

const Barang = mongoose.model('Barang', barangSchema);

module.exports = Barang;