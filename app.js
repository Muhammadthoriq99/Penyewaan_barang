const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // Untuk mengatur path
const Barang = require('./models/barang');
const Peminjam = require('./models/peminjam');
const Peminjaman = require('./models/peminjaman');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Mengatur folder views
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Untuk file statis seperti CSS

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/penyewaan_barang')
    .then(() => console.log('MongoDB Connected to database: penyewaan_barang'))
    .catch(err => console.error('MongoDB connection error:', err));

// Route untuk halaman utama (Read)
app.get('/', async (req, res) => {
    try {
        const peminjaman = await Peminjaman.find()
            .populate('id_barang') // Mengambil data barang
            .populate('id_peminjam'); // Mengambil data peminjam
        const barang = await Barang.find();
        const peminjam = await Peminjam.find()
        console.log(peminjaman); // log 
        res.render('index', { peminjaman, peminjam, barang });
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
});

// Route untuk menambah peminjaman (Create)
app.post('/add', async (req, res) => {
    const { id_barang, id_peminjam, tanggal_peminjaman, tanggal_pengembalian, status, jumlah } = req.body;
    const peminjaman = new Peminjaman({ id_barang, id_peminjam, tanggal_peminjaman, tanggal_pengembalian, status, jumlah });
    try {
        await peminjaman.save();
        res.redirect('/'); // Redirect ke halaman utama setelah berhasil
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
});
app.get('/add', async (req, res) => {
    try {
        const barang = await Barang.find();
        const peminjam = await Peminjam.find();
        res.render('add', { barang, peminjam }); // Render halaman add.ejs
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
});

app.post('/add', async (req, res) => {
    const { id_barang, id_peminjam, tanggal_peminjaman, tanggal_pengembalian, status, jumlah } = req.body;
    const peminjaman = new Peminjaman({ id_barang, id_peminjam, tanggal_peminjaman, tanggal_pengembalian, status, jumlah});
    try {
        await peminjaman.save();
        res.redirect('/'); // Redirect ke halaman utama setelah berhasil
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
});

// Route untuk mengedit peminjaman (Update)
app.get('/edit/:id', async (req, res) => {
    try {
        const peminjaman = await Peminjaman.findById(req.params.id)
            .populate('id_barang')
            .populate('id_peminjam');
        const barang = await Barang.find();
        const peminjam = await Peminjam.find();
        res.render('edit', { peminjaman, barang, peminjam });
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
});

app.post('/edit/:id', async (req, res) => {
    const { id_barang, id_peminjam, tanggal_peminjaman, tanggal_pengembalian, status, jumlah } = req.body;
    try {
        await Peminjaman.findByIdAndUpdate(req.params.id, {
            id_barang,
            id_peminjam,
            tanggal_peminjaman,
            tanggal_pengembalian,
            status,
            jumlah
        });
        res.redirect('/'); // Redirect ke halaman utama setelah berhasil
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Error updating data');
    }
});

// Route untuk menghapus peminjaman (Delete)
app.post('/delete/:id', async (req, res) => {
    try {
        await Peminjaman.findByIdAndDelete(req.params.id);
        res.redirect('/'); // Redirect ke halaman utama setelah berhasil
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).send('Error deleting data');
    }
});

// Route untuk menghapus barang (Delete)
app.post('/delete/:id', async (req, res) => {
    try {
        await Barang.findByIdAndDelete(req.params.id);
        res.redirect('/'); // Redirect ke halaman utama setelah berhasil
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).send('Error deleting data');
    }
});
// Route untuk menampilkan form tambah barang
app.get('/add-barang', (req, res) => {
    res.render('add-barang'); // Render halaman add-barang.ejs
});

// Route untuk menyimpan barang (Create)
app.post('/add-barang', async (req, res) => {
    const { nama_barang, kategori, jumlah, kondisi, deskripsi } = req.body;
    const barang = new Barang({ nama_barang, kategori, jumlah, kondisi, deskripsi });
    try {
        await barang.save();
        res.redirect('/'); // Redirect ke halaman utama setelah berhasil
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
});

app.get('/edit-barang/:id', async (req, res) => {
    try {
        const barang = await Barang.findById(req.params.id);
        if (!barang) {
            return res.status(404).send('Barang tidak ditemukan');
        }
        res.render('edit-barang', { barang });
    } catch (error) {
        console.error('Error fetching barang:', error);
        res.status(500).send('Error fetching barang');
    }
});

app.post('/edit-barang/:id', async (req, res) => {
    try {
        const updatedBarang = await Barang.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBarang) {
            return res.status(404).send('Barang tidak ditemukan');
        }
        res.redirect('/'); // Redirect ke halaman utama setelah berhasil
    } catch (error) {
        console.error('Error updating barang:', error);
        res.status(500).send('Error updating barang');
    }
});


// Rute untuk menghapus barang
app.post('/delete/barang/:id', async (req, res) => {
    try {
        const result = await Barang.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send('Barang tidak ditemukan');
        }
        res.redirect('/'); // Redirect ke halaman utama setelah berhasil
    } catch (error) {
        console.error('Error deleting barang:', error);
        res.status(500).send('Error deleting barang');
    }
});

// Route untuk menampilkan form tambah peminjam
app.get('/add-peminjam', (req, res) => {
    res.render('add-peminjam'); // Render halaman add-peminjam.ejs
});

// Route untuk menyimpan peminjam (Create)
app.post('/add-peminjam', async (req, res) => {
    const { nama, email, telepon, alamat } = req.body;
    const peminjam = new Peminjam({ nama, email, telepon, alamat });
    try {
        await peminjam.save();
        res.redirect('/'); // Redirect ke halaman utama setelah berhasil
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
});

// Rute untuk menghapus peminjam
app.post('/delete/peminjam/:id', async (req, res) => {
    try {
        const result = await Peminjam.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send('Peminjam tidak ditemukan');
        }
        res.redirect('/'); // Redirect ke halaman utama setelah berhasil
    } catch (error) {
        console.error('Error deleting barang:', error);
        res.status(500).send('Error deleting peminjam');
    }
});

// untuk edit peminjam

// Rute untuk menampilkan halaman edit peminjam
app.get('/edit-peminjam/:id', async (req, res) => {
    try {
        const peminjam = await Peminjam.findById(req.params.id);
        if (!peminjam) {
            return res.status(404).send('Peminjam tidak ditemukan');
        }
        res.render('edit-peminjam', { peminjam }); // Render halaman edit-peminjam.ejs
    } catch (error) {
        console.error('Error fetching peminjam:', error); // Log kesalahan
        res.status(500).send('Error fetching peminjam');
    }
});

// Rute untuk memperbarui peminjam
app.post('/edit-peminjam/:id', async (req, res) => {
    const { nama, email, telepon, alamat } = req.body;
    try {
        const updatedPeminjam = await Peminjam.findByIdAndUpdate(req.params.id, { nama, email, telepon, alamat }, { new: true });
        if (!updatedPeminjam) {
            return res.status(404).send('Peminjam tidak ditemukan');
        }
        res.redirect('/'); // Redirect ke halaman utama setelah berhasil
    } catch (error) {
        console.error('Error updating peminjam:', error);
        res.status(500).send('Error updating peminjam');
    }
});


// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});