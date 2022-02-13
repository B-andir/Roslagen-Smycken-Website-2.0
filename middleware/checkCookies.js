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
    const cookie = await req.cookies.LOGIN_COOKIE;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    res.locals.user = null;

    if (cookie != null) {
        const decoded = await jwt.verify(cookie, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.warn("WARNING: User attempted verification with invalid cookie");
                res.cookie('LOGIN_COOKIE', '', {maxAge: 0});
                throw err;
            }

            if (decoded.ip != ip) {
                console.warn("WARNIND: User attempted verification with missmatchin IP");
                res.cookie('LOGIN_COOKIE', '', {maxAge: 0});
                next();
            } else {
                const user = await userModel.findById(decoded.mongoID, (err, user) => {
                    if (err) {
                        throw err;
                    }

                    if (user.privateKey == decoded.privateKey) {
                        res.locals.user = {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            avatarURL: user.avatarURL,
                            isAdmin: user.isAdmin
                        };

                        if (user.isAdmin) {
                            let cookiePayload = jwt.sign({ADMIN_SECRET: process.env.ADMIN_PAYLOAD}, process.env.ADMIN_JWT_SECRET)
                            res.cookie('ADMIN_COOKIE', cookiePayload, {httpOnly: false, maxAge: 120000});
                            next();
                        } else {
                            next();
                        }

                    } else {
                        res.cookie('LOGIN_COOKIE', '', {maxAge: 0});
    
                        next();
                    }
                }).clone().catch((err) => { console.log(err)});
            }
        });
    } else {
        res.locals.user = null;
    
        next();
    }
});

module.exports = router;