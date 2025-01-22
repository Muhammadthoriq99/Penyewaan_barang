const mongoose = require('mongoose');

const peminjamanSchema = new mongoose.Schema({
  id_barang: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barang', // Mengacu ke model Barang
    required: true,
  },
  id_peminjam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Peminjam', // Mengacu ke model User
    required: true,
  },
  tanggal_peminjaman: {
    type: Date,
    required: true,
  },
  tanggal_pengembalian: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Dipinjam', 'Tersedia'],
    default: 'Dipinjam',
  },
  jumlah: {
    type: Number,
    require: true, 
  },
});

const Peminjaman = mongoose.model('Peminjaman', peminjamanSchema);

module.exports = Peminjaman;
