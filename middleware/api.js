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

function GetRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function GenerateLoginCookie(user) {
    user.privateKey = uuidv4();
    user.save()

    return jwt.sign({ mongoID: user._id, privateKey: user.privateKey }, process.env.JWT_SECRET);
}

router.post('/register', async (req, res) => { 
    
    if (validator.validate(req.body.email)) {

        userModel.findOne({ email: req.body.email }, async (err, user) => {
            if (err) {
                res.json({error: 'There was an error. Please try again'});
                throw err;
            } else if (user != null) {
                res.json({error: 'This email is already in use.'});
                return;
            } else {
                const hash = await bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
                    if (err) {
                        res.json({error: 'There was an error. Please try again'});
                        throw err;
                    }

                    const user = await userModel.create({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hash,
                        avatarURL: "/images/avatars/avatar-placeholder-0" + GetRandomInt(1, 5) + ".png",
                        isAdmin: false
                    }, (err, user) => {
                        if (err) {
                            res.json({error: 'There was an error. Please try again'});
                            throw err;
                        }

                        console.log("Registered a new user");

                        res
                            .cookie('LOGIN_TOKEN', GenerateLoginCookie(user), {httpOnly: false})
                            .send();
                    });

                });
            }
        })
    } else {
        res.json({error: 'Invalid Email address.'});
        return;
    }
});

router.post('/login', (req, res) => {
    if (validator.validate(req.body.email)) {

        userModel.findOne({ email: req.body.email }, async (err, user) => {
            if (err) {
                res.json({error: 'There was an error. Please try again'});
                throw err;
            } else if (user == null) {
                res.json({error: 'Wrong email or password'});
                return;
            } else {
                const result = await bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        res.json({error: 'There was an error. Please try again'});
                        throw err;
                    } else if (!result) {
                        res.json({error: 'Wrong email or password'});
                        return;
                    } else {
                        let cookieSettings = {httpOnly: false};
                        if (req.body.keepSignedIn === "true") {
                            cookieSettings["maxAge"] = (1000 * 60 * 60 * 24 * 7);  // maxAge = One week | Nodejs uses milliseconds
                        }

                        res.cookie('LOGIN_COOKIE', '', {maxAge: 0})  // Delete already existent cookie

                        res
                            .cookie('LOGIN_COOKIE', GenerateLoginCookie(user), cookieSettings)
                            .send();
                    }
                });
            }
        });

    } else {
        res.json({error: 'Invalid Email address.'});
        return;
    }
});

router.post('/logout', (req, res) => {
    res.cookie('LOGIN_COOKIE', '', {maxAge: 0});
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

                let pathExtname = path.extname(file.originalname).toLowerCase();

                if (pathExtname === ".png" || pathExtname === ".jpg") {
                    fs.renameSync(tempPath, targetPath);
                    if (err) handleError(err, res);
                    imageURLs.push('/images/productImages/' + file.originalname);
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