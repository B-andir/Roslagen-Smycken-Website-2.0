const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const validator = require('email-validator');
const bcrypt = require('bcrypt');
const { v4 : uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const upload = multer({dest: "uploads/"});
const { url } = require('inspector');

const productModel = require('../models/product');
const userModel = require('../models/user');

require('dotenv').config();

const saltRounds = 16;

mongoose.connect(process.env.MONGODB_URL, { useUnifiedTopology: true });

function GenerateLoginCookie(user) {

}

router.post('/register', async (req, res) => {
    
    if (validator.validate(req.body.email)) {

    } else {
        res.json({error: 'Invalid Email address.'});
        return;
    }

    res.json('Error! Function not complete');  // Error message displayed without reloading page
});

router.post('/login', (req, res) => {
    console.log(req);
    // res.locals.test = true;
    // res
    //     .redirect(req.body.sourceURL);
    // res.json('Error! Funtion not complete')  // Error message displayed without reloading page
    // res.json({error: 'Error! Function not complete'})
    res.cookie('testing', true);
    res.send();
});

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

router.post('/build/upload', upload.array('image', 8), (req, res) => {
    let imageURLs = [];

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

                if (i == length - 1) {
                    const product = await productModel.create({ 
                        kind: req.body.kind.toLowerCase(), 
                        pattern: req.body.pattern.toLowerCase(), 
                        title: req.body.title,
                        description: req.body.description, 
                        estimatedPriceKr: req.body.estimatedPriceKr, 
                        images: imageURLs
                    }, (err, product) => {
                        if (err) throw err;
            
                        console.log("Created new product!");
            
                        res.redirect(('/products/?id=' + product._id));
                    });
                }
            }
            
        } else if (err) {
            throw err;
        }
    }).clone().catch((err) => { console.log(err)});
});

module.exports = router;