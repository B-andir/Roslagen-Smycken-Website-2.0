const mongoose = require('mongoose');
const { stringify } = require('uuid');

const adressSchema = new mongoose.Schema({
    country: String,
    region: String,
    address: String,
    postalCode: String,
    city: String
});

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    avatarURL: String,
    phoneNumber: String,
    billingAddress: adressSchema,

    loginCookie: String,
    isAdmin: { type: Boolean, default: false }
});

const userModel = mongoose.model('User', userSchema, 'users');

module.exports = userModel;