const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

require('dotenv').config();

const PORT = process.env.PORT != null ? process.env.PORT : 5100;

const app = express();

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

app.use(morgan('dev'));

// API Calls
app.use('/api', (require('./middleware/api.js')));

app.use('/', (require('./middleware/checkCookies.js')));

// route to requested page
app.use('/', require('./routes/routing.js'));


app.listen(PORT, () => {
    console.log(`\nServer running on port ${PORT}...`);
});
