import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import usersRoute from './routes/users.js';
import hotelsRoute from './routes/hotels.js';
import roomsRoute from './routes/rooms.js';
import cookieParser from 'cookie-parser';

//нам нужно импортировать файлы auth.js так как мы используем модульлный импорт
//set type to module on package json for import like this

const app = express();
dotenv.config();
//access process env

const connect = async () => {
    try {
        await mongoose
            .connect(process.env.MONGO_URL)
            .then(() => {
                console.log('connect to the mongodb');
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (err) {
        throw Error(err);
    }
};

mongoose.connection.on('disconnected', () => {
    console.log('mongoDb disconnected');
});

mongoose.connection.on('connected', () => {
    console.log('mongoDb connected');
});

//middlewares
app.use(cookieParser());
app.use(express.json());
//middleware json handler to db

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/hotels', hotelsRoute);
app.use('/api/rooms', roomsRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'something went wrong!';
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.listen(8000, (err) => {
    if (err) console.log(err);
    connect();
    console.log('connected to the bd.');
});
