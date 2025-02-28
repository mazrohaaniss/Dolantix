const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const olahragaRoutes = require('./routes/olahragaRoutes');
const festivalRoutes = require('./routes/festivalRoutes');
const konserRoutes = require('./routes/konserRoutes');
const seminarRoutes = require('./routes/seminarRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const orderRoutes = require('./routes/orderRoutes'); 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Server Dolantix berjalan'));
app.use('/api/auth', authRoutes);
app.use('/api', olahragaRoutes);
app.use('/api', festivalRoutes);
app.use('/api', konserRoutes);
app.use('/api', seminarRoutes);
app.use('/api', ticketRoutes);
app.use('/api', orderRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));