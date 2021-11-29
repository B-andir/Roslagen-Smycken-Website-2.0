const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const upload = multer({dest: "uploads/"});

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

router.post('/build/upload', upload.single('image'), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, '../public/images/productImages/', req.file.originalname);
    // console.log(req.body);  // req.body is a dictionary of the form submit.

    var pathExtname = path.extname(req.file.originalname).toLowerCase();
    if (pathExtname === ".png" || pathExtname === ".jpg") {
        fs.rename(tempPath, targetPath, err => {
            if (err) handleError(err, res);

            res.redirect('/order/admin/build');
        });
    } else {
        fs.unlink(tempPath, err => {
            if (err) return handleError(err, res);

            res 
                .status(403)
                .contentType("text/plain")
                .end("Only .png and .jpg files allowed!");
        });
    }
});

module.exports = router;