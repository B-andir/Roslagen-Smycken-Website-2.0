const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const validator = require('email-validator');
const bcrypt = require('bcrypt');
const { v4 : uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
const path = require('path');

const upload = multer({dest: "uploads/"});
const { url } = require('inspector');

const productModel = require('../models/product');
const userModel = require('../models/user');
const { env } = require('process');

require('dotenv').config();

const saltRounds = 16;

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true });

cloudinary.config( { secure: true } )

function GetRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function GenerateLoginCookie(req, user) {
    user.privateKey = uuidv4();
    user.save()

    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    return jwt.sign({ mongoID: user._id, privateKey: user.privateKey, ip: ip }, process.env.JWT_SECRET);
}

router.post('/register', async (req, res) => { 
    
    if (validator.validate(req.body.email)) {

        userModel.findOne({ email: req.body.email }, async (err, user) => {
            if (err) {
                res.json({error: 'There was an error. Please try again'});
                throw err;
            } else if (user != null) {
                return res.json({error: 'This email is already in use.'});
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

                        return res
                            .cookie('LOGIN_COOKIE', GenerateLoginCookie(req, user), {httpOnly: false})
                            .send({});
                    });
                });
            }
        })
    } else {
        return res.json({error: 'Invalid Email address.'});
    }
});

router.post('/login', (req, res) => {
    if (validator.validate(req.body.email)) {
        userModel.findOne({ email: req.body.email }, async (err, user) => {
            if (err) {
                res.send({error: 'There was an error. Please try again'});
                throw err;
            } else if (user == null) {
                return res.send({error: 'Wrong email or password'});
            } else {
                const result = await bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        res.send({error: 'There was an error. Please try again'});
                        throw err;
                    } else if (!result) {
                        return res.send({error: 'Wrong email or password'});
                    } else {
                        let cookieSettings = {httpOnly: false};
                        if (req.body.keepSignedIn === "true") {
                            cookieSettings["maxAge"] = (1000 * 60 * 60 * 24 * 7);  // maxAge = One week | Nodejs uses milliseconds
                        }

                        // Delete already existent cookies
                        res.cookie('LOGIN_COOKIE', '', {maxAge: 0})  

                        return res
                            .cookie('LOGIN_COOKIE', GenerateLoginCookie(req, user), cookieSettings)
                            .send({});
                    }
                });
            }
        });

    } else {
        return res.json({error: 'Invalid Email address.'});
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

                let pathExtname = path.extname(file.originalname).toLowerCase();
                if (pathExtname === ".png" || pathExtname === ".jpg") {
                    await cloudinary.uploader.upload(tempPath, {
                        resource_type: "image",
                        public_id: "roslagenSmycken/" + req.body.kind + "/" + req.body.pattern + "/" + req.body.title + "_" + (i + 0),
                    }, (err, result) => {
                        if (err) {
                            console.warn(err)
                        }

                        if (result) {
                            fs.unlinkSync(tempPath, err => {
                                if (err) return handleError(err, res);
                            });

                            imageURLs.push(result.secure_url);
                        }

                    });
                } else {
                    fs.unlinkSync(tempPath, err => {
                        if (err) return handleError(err, res);
                        console.log(`Error: Only .png and .jpg allowed! [Image ${i}]`);
                        res.redirect('/admin/order/build?error:Unsupported-file-format');
                    });
                }

                if (i == length - 1) {
                    const product = await productModel.create({ 
                        kind: req.body.kind,
                        pattern: req.body.pattern,
                        title: req.body.title,
                        description: req.body.body, 
                        estimatedPriceKr: req.body.estimatedPriceKr, 
                        images: imageURLs
                    }, (err, product) => {
                        if (err) throw err;
            
                        res.redirect(('/products/?id=' + product._id));
                    });
                }
            }
            
        } else if (err) {
            throw err;
        } else {
            console.log(`Error: Item [Title: ${req.body.title}] already exists`);
            res.redirect('/admin/order/build?error:Item-already-exists');
        }
    }).clone().catch((err) => { console.log(err)});
});

module.exports = router;