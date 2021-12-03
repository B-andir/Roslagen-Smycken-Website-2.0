const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

router.use('/', (req, res, next) => {
    console.log("userHandling.js")
    res.locals.user = {
        'username': ''
    };

    next();
});

module.exports = router;