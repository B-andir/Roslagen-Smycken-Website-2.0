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

    if (!cookie) return next();

    res.locals.user = null;

    try {
        const decoded = jwt.verify(cookie, process.env.JWT_SECRET);

        if (decoded.ip !== ip) {
            console.warn(
                "WARNIND: User attempted verification with mismatching IP"
            );

            res.clearCookie("LOGIN_COOKIE");
            return next();
        }

        const user = await userModel.findById(decoded.mongoID);
        if (!user) return next();

        if (user.privateKey == decoded.privateKey) {
            res.locals.user = {
                firstName: user.firstName,
                lastName: user.lastName,
                avatarURL: user.avatarURL,
                isAdmin: user.isAdmin,
            };

            return next();
        }
    } catch (error) {
        throw error;
    }

    return next();
});

// Check darkMode cookie
router.use((req, res, next) => {
    const cookie = req.cookies.darkMode;
    res.locals.darkMode = cookie == "true";
    next();
});

module.exports = router;
