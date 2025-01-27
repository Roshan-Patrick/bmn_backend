const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const nurseRoutes = require('./routes/nursing.routes')
const registrationRoutes  = require('./routes/registration.routes');
const path = require('path');
const cors = require('cors');
const setupSwagger = require('./swagger');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/nursing', nurseRoutes);
// Use the registration routes
app.use('/api/register', registrationRoutes);

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


setupSwagger(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
