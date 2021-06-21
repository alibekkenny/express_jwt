const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const authRouter = require('./authRouter');
const app = express();
app.use(express.json());
app.use('/auth',authRouter);
const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/test',{ useNewUrlParser: true, useUnifiedTopology: true })
        app.listen(PORT, () => console.log('server start'))
    } catch (e) {
        console.log(e);
    }
}

start()