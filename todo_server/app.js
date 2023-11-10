const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const db = require('./src/models/User'); // Import Sequelize models
const path = require('path');
const multer = require('multer');
dotenv.config();

const app = express();
const upload = multer({
  dest: '/tmp/assets',
});
// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/public', express.static(path.join('public')));
app.use(upload.any());

// Routes
const normalRoute = require('./src/routes/userRoutes');
app.use('/', normalRoute);
const authRoutes = require('./src/protectedRoute/userRoute');
app.use('/auth', authRoutes);
// token check route
const tokenRoutes = require('./src/tokenVerifyRoute/tokenVerify');

app.use('/validateToken', tokenRoutes);

// Database sync (you might want to handle this differently in production)
db.sequelize.sync().then(() => {
  console.log('Database synced');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
