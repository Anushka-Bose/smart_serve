const dotenv = require('dotenv');
dotenv.config({ path: './last-try-backend/.env' });

const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.MONGODB_URL;

const PORT = process.env.PORT || 4000;

mongoose.connect(DB)
  .then(()=> console.log('DB connection successful'))
  .catch((err)=> { console.error('DB connection error:', err.message); process.exit(1); });

app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));