import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './Routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import ejsMate from 'ejs-mate';


const app = express();

const PORT = process.env.PORT;
const mongoUrl = process.env.MONGOURL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.engine('ejs', ejsMate);

// 🔹 Set view engine to EJS
app.set('view engine', 'ejs');

// 🔹 Point to the templates directory
app.set('views', path.join(__dirname, '../frontend/templates'));

// 🔹 Serve static files (e.g., CSS, JS, images)
app.use(express.static(path.join(__dirname, '../Frontend')));

app.use(express.urlencoded({ extended: true }));
// 🔹 Middleware to parse JSON
app.use(express.json());

// 🔹 Routes
app.use('/', authRoutes);

// 🔹 MongoDB Connection and Server Start
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => console.error('MongoDB connection error:', err));
