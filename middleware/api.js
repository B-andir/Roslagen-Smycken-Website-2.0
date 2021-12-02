const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const upload = multer({dest: "uploads/"});

const productModel = require('../models/product');
const { url } = require('inspector');

mongoose.connect(process.env.MONGODB_URL, { useUnifiedTopology: true });

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

router.post('/build/upload', upload.array('image', 8), (req, res) => {
    let imageURLs = [];

    console.log(req.files);
    productModel.findOne({ title: req.body.title }, async (err, product) => {
        if (!err && !product) {
            let length = req.files.length;
            for (i = 0; i < length; i++) {
                let file = req.files[i];
                const tempPath = file.path;
                const targetPath = path.join(__dirname, '../public/images/productImages/', file.originalname);
                // console.log(req.body);  // req.body is a dictionary of the form submit.

                let pathExtname = path.extname(file.originalname).toLowerCase();

                if (pathExtname === ".png" || pathExtname === ".jpg") {
                    fs.renameSync(tempPath, targetPath);
                    if (err) handleError(err, res);
                    imageURLs.push('/public/images/productImages/' + file.originalname);
                } else {
                    fs.unlinkSync(tempPath, err => {
                        if (err) return handleError(err, res);

                        console.log(`Error: Only .png and .jpg allowed! [Image ${i}]`);
                    });
                }

                if (i == length - 1){
                    let kind = req.body.kind.toLowerCase(), pattern = req.body.pattern.toLowerCase(), title = req.body.title;
                    const product = await productModel.create({ 
                        kind: kind, 
                        pattern: pattern, 
                        title: title, 
                        url: (`${kind}/${pattern}/${title}/`), 
                        description: req.body.description, 
                        estimatedPriceKr: req.body.estimatedPriceKr, 
                        images: imageURLs
                    }, (err, product) => {
                        if (err) throw err;
            
                        console.log("Created new product!");
            
                        res.redirect(('/products/' + product.url));
                    });
                }
            }
            
        } else if (err) {
            throw err;
        }
    }).clone().catch((err) => { console.log(err)});
});

module.exports = router;