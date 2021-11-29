const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mysql = require('mysql');

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

var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD
});

con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL Database Connected")
    con.destroy();
})

// route to requested page
app.use('/', require('./routes/routing.js'));


app.listen(PORT, () => {
    console.log(`\nServer running on port ${PORT}...`);
});
