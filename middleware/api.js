const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const upload = multer({ dest: "uploads/" });

const productModel = require("../models/product");
const userModel = require("../models/user");

require("dotenv").config();

const saltRounds = 12;

cloudinary.config({ secure: true });

function GetRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function GenerateLoginCookie(req, user) {
    user.privateKey = uuidv4();
    user.save();

    var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    return jwt.sign(
        { mongoID: user._id, privateKey: user.privateKey, ip: ip },
        process.env.JWT_SECRET
    );
}

router.use("/order", require("./orderhandling.js"));

router.post("/register", async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email });
        if (user) return res.json({ error: "This email is already in use." });

        const hash = await bcrypt.hash(req.body.password, saltRounds);

        user = await userModel.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            avatarURL:
                "/images/avatars/avatar-placeholder-0" +
                GetRandomInt(1, 5) +
                ".png",
        });

        return res
            .cookie("LOGIN_COOKIE", GenerateLoginCookie(req, user), {
                httpOnly: false,
            })
            .send({});
    } catch (error) {
        res.json({ error: "There was an error. Please try again" });
        throw error;
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user)
            return res.status(403).json({ error: "Wrong email or password" });

        const passwordMatches = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!passwordMatches)
            return res.status(403).json({ error: "Wrong email or password" });

        const cookieSettings = { httpOnly: false };
        if (req.body.keepSignedIn === "true")
            cookieSettings["maxAge"] = 1000 * 60 * 60 * 24 * 7; // maxAge = One week | Nodejs uses milliseconds

        return res
            .cookie(
                "LOGIN_COOKIE",
                GenerateLoginCookie(req, user),
                cookieSettings
            )
            .send({});
    } catch (error) {
        res.json({ error: "There was an error. Please try again" });
        throw error;
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("LOGIN_COOKIE");
    res.send();
});

const allowedMimetypes = ["image/png", "image/jpeg"];

router.post("/build/upload", upload.array("image", 8), async (req, res) => {
    const imageURLs = [];

    let product = await productModel.findOne({ title: req.body.title });
    if (!product) {
        console.log(`Error: Item [Title: ${req.body.title}] already exists`);

        return res.redirect("/admin/order/build?error:Item-already-exists");
    }

    for (let i = 0, len = req.files.length; i < len; i++) {
        const file = req.files[i];
        const tempPath = file.path;

        try {
            if (!allowedMimetypes.includes(file.mimetype)) {
                fs.unlinkSync(tempPath);
                console.log(`Error: Only .png and .jpg allowed! [Image ${i}]`);

                return res.redirect(
                    "/admin/order/build?error:Unsupported-file-format"
                );
            }

            const { kind, pattern, title } = req.body;

            const response = await cloudinary.uploader.upload(tempPath, {
                resource_type: "image",
                public_id: `roslagenSmycken/${kind}/${pattern}/${title}_${i}`,
            });

            fs.unlinkSync(tempPath);
            imageURLs.push(response.secure_url);

            product = await productModel.create({
                kind: req.body.kind,
                pattern: req.body.pattern,
                title: req.body.title,
                description: req.body.body,
                estimatedPriceKr: req.body.estimatedPriceKr,
                images: imageURLs,
            });

            return res.redirect(`/products/?id=${product._id.toString()}`);
        } catch (error) {
            res.status(500)
                .contentType("text/plain")
                .end("Oops! Something went wrong!");
        }
    }
});

module.exports = router;
