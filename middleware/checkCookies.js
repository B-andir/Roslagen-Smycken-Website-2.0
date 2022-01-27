const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

require('dotenv').config();

const userModel = require('../models/user');
mongoose.connect(process.env.MONGODB_URL, { useUnifiedTopology: true });

router.use(async (req, res, next) => {
    let cookie = req.cookies.LOGIN_COOKIE;

    if (cookie != null) {
        const decoded = await jwt.verify(cookie, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.warn("WARNING: User attempted verification with invalid cookie");
                res.cookie('LOGIN_COOKIE', '', {maxAge: 0});
                throw err;
            }

            const user = await userModel.findById(decoded.mongoID, (err, user) => {
                if (err) throw err;

                if (user.privateKey == decoded.privateKey) {
                    res.locals.user = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        avatarURL: user.avatarURL,
                        isAdmin: user.isAdmin
                    };

                    next();
                } else {
                    res.cookie('LOGIN_COOKIE', '', {maxAge: 0});
                }
            }).clone().catch((err) => { console.log(err)});
        });
    } else {
        res.locals.user = null;

        next();
    }
});

module.exports = router;