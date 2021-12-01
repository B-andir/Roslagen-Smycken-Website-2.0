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

// TODO: Fix this shit. Query already executed: Product.findOne({title: string})
//       Also, creating new model executes before parsing through the images stuff, which fucks up the image URLs.
router.post('/build/upload', upload.array('image', 8), async (req, res) => {
    let imageURLs = [];

    let test = await productModel.findOne({ title: req.body.title }, () => {
        for (i = 0; i < req.files.length; i++) {
            let file = req.files[i];
            const tempPath = file.path;
            const targetPath = path.join(__dirname, '../public/images/productImages/', file.originalname);
            // console.log(req.body);  // req.body is a dictionary of the form submit.

            let pathExtname = path.extname(file.originalname).toLowerCase();

            if (pathExtname === ".png" || pathExtname === ".jpg") {
                fs.rename(tempPath, targetPath, err => {
                    if (err) handleError(err, res);
                    imageURLs.push('/public/images/productImages/' + file.originalname);
                    console.log(imageURLs)
                });
            } else {
                fs.unlink(tempPath, err => {
                    if (err) return handleError(err, res);

                    console.log(`Error: Only .png and .jpg allowed! [Image ${i}]`);
                });
            }
        }
    });
    // if (err) throw err;
    // else if (product != null) {
    //     console.log("Product already exists!")
    //     res.redirect('/order/admin/build');
    // }

    let kind = req.body.kind.toLowerCase(), pattern = req.body.pattern.toLowerCase(), title = req.body.title;

    console.log(imageURLs + "iosdjf");
    productModel.create({ 
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
        
});

module.exports = router;