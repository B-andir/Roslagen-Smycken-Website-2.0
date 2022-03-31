const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

require("dotenv").config();

const userModel = require("../models/user");

// Check login cookie
router.use(async (req, res, next) => {
    const cookie = await req.cookies.LOGIN_COOKIE;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    res.locals.user = {};

    if (cookie != null) {
        const decoded = await jwt.verify(
            cookie,
            process.env.JWT_SECRET,
            async (err, decoded) => {
                if (err) {
                    console.warn(
                        "WARNING: User attempted verification with invalid cookie"
                    );
                    res.cookie("LOGIN_COOKIE", "", { maxAge: 0 });
                    throw err;
                }

                if (decoded.ip != ip) {
                    console.warn(
                        "WARNIND: User attempted verification with missmatchin IP"
                    );
                    res.cookie("LOGIN_COOKIE", "", { maxAge: 0 });
                    res.locals.user = null;
                    next();
                } else {
                    const user = await userModel
                        .findById(decoded.mongoID, (err, user) => {
                            if (err) {
                                throw err;
                            }

                            if (user.privateKey == decoded.privateKey) {
                                res.locals.user = {
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    avatarURL: user.avatarURL,
                                    isAdmin: user.isAdmin,
                                };

                                next();
                            } else {
                                res.cookie("LOGIN_COOKIE", "", { maxAge: 0 });

                                res.locals.user = null;
                                next();
                            }
                        })
                        .clone()
                        .catch((err) => {
                            console.log(err);
                        });
                }
            }
        );
    } else {
        res.locals.user = null;
        next();
    }
});

// Check darkMode cookie
router.use((req, res, next) => {
    const cookie = req.cookies.darkMode;
    if (cookie == "true") {
        res.locals.darkMode = true;
        next();
    } else {
        res.locals.darkMode = false;
        next();
    }
});

module.exports = router;
