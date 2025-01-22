const mongoose = require('mongoose');

const peminjamSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Pastikan email unik
  },
  telepon: {
    type: String,
  },
  alamat: {
    type: String,
  },
});

const Peminjam = mongoose.model('Peminjam', peminjamSchema);
module.exports = Peminjam;