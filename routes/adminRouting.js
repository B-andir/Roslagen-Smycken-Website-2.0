const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

require('dotenv').config();

router.get('*', (req, res, next) => {
    
    let cookie = req.cookies.ADMIN_COOKIE;
    let isAdmin = false;

    if (cookie != null) {
        const decoded = jwt.verify(cookie, process.env.ADMIN_JWT_SECRET)

        if (decoded.ADMIN_SECRET == process.env.ADMIN_PAYLOAD) {
            isAdmin = true
        }
    }

    if (!isAdmin) {
        return res.status(401).render('401', {title: '401'});
    } else {
        next();
    }
});

router.get('/order/build', (req, res) => {
    res.render('order_builder', {title: 'ADMIN | Order Builder'});
});

module.exports = router;