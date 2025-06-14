import express from 'express';
import mongoose from 'mongoose';

const app = express();

const PORT = process.env.PORT;
const mongoUrl = process.env.MONGOURL;

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, () => {
        console.log(`Server running on 'http://localhost:${PORT}`)
    });
}).catch(err => console.error('MongoDB connection error:', err));
