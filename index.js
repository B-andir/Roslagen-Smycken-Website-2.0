const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv').config();

const PORT = process.env.PORT != null ? process.env.PORT : 5100;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(morgan('dev'));


// route to requested page
app.use('/', require('./routes/routing.js'));


app.listen(PORT, () => {
    console.log(`\nServer running on port ${PORT}...\n`);
});