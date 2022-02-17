const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

require('dotenv').config();

router.get('*', (req, res, next) => {
    if (res.locals.user.isAdmin == true) {
        next()
    } else {
        return res.render('401', {title: '401'});
    }
})

router.get('/order/build', (req, res) => {
    res.render('order_builder', {title: 'ADMIN | Order Builder'});
});

module.exports = router;