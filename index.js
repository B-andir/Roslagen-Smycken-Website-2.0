const express = require('express');
const session = require('express-session');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const https = require('https');
const morgan = require('morgan');
const { v4 : uuidv4 } = require('uuid');

require('dotenv').config();

const PORT = process.env.PORT != null ? process.env.PORT : 5100;

const app = express();

const options = process.env.NODE_ENV != 'development' ? {
    cert: fs.readFileSync('/etc/letsencrypt/live/roslagensmycken.com/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/roslagensmycken.com/privkey.pem')
} : null

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    // genid: req => {
    //     return uuidv4()
    // },
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: false,
    // cookie: { secure: process.env.NODE_ENV != 'development'}
}));

app.enable('trust proxy')

app.set('view engine', 'ejs');

app.use(morgan('dev'));

// Redirect http to https
app.use(function(req, res, next) {
    if (process.env.NODE_ENV != 'development' && !req.secure) {
       return res.redirect("https://" + req.headers.host + req.url);
    }
    next();
})

// API Calls
app.use('/api', (require('./middleware/api.js')));

app.use('/', (require('./middleware/checkCookies.js')));

// route to admin pages
app.use('/admin', require('./routes/adminRouting.js'));

// route to requested page
app.use('/', require('./routes/routing.js'));


app.listen(PORT, () => {
    console.log(`\nServer running on port ${PORT}...`);
});

if (process.env.NODE_ENV != 'development') {
    https.createServer(options, app).listen(8443, () => {
        console.log('Secure server running on port 8443');
    })
}
