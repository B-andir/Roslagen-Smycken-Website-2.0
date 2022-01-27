const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

require('dotenv').config();

router.get('/order/build', (req, res) => {

    // console.log(req);

    let cookie = req.cookies.LOGIN_COOKIE;
    let unautharized = true;

    if (cookie != null) {

        jwt.verify(cookie, process.env.JWT_SECRET, (err, decoded) => {
            if (err) throw err;

            console.log(decoded);

            if (decoded.isAdmin) {
                unautharized = false;
                res.render('order_builder', {title: 'ADMIN | Order Builder'});
            }
        });
    }

    if (unautharized) res.render('401', {title: '401'});
});

module.exports = router;