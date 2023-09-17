const { default: mongoose } = require("mongoose");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const siginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(403).json({
            msgErr: "Email is required",
        });
    }

    if (!password) {
        return res.status(403).json({
            msgErr: "Password is required",
        });
    }

    try {
        const user = await userModel.findOne({
            email: email,
            password: password,
        });
        if (!user) {
            return res
                .status(500)
                .json({ msgErr: "Either email or password is wrong" });
        }
        const { _id, ...rest } = user;
        console.log(rest);
        const token = jwt.sign(rest, "secret");

        res.status(200).json({ token: token, user: user });
    } catch (error) {
        console.log(error);
    }
};

const signUpUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    console.log(first_name, last_name, email, password);
    if (!first_name) {
        return res.status(403).json({ msgErr: "First name is required" });
    }
    if (!last_name) {
        return res.status(403).json({ msgErr: "Last name is required" });
    }
    if (!email) {
        return res.status(403).json({ msgErr: "Email is required" });
    }
    if (!password) {
        return res.status(403).json({ msgErr: "Passowrd is required" });
    }

    try {
        const user = await userModel.findOne({ email: email });
        if (user) {
            return res.status(500).json({ msgErr: `${email} is already in use` });
        }
        const result = userModel.collection.insertOne({
            first_name,
            last_name,
            email,
            password,
        });
        res.status(200).json({
            msg: "User account created successfully",
        });
    } catch (error) {
        console.log(error);
    }
};

const verifyOtpCode = async (req, res) => { };

module.exports = {
    siginUser,
    signUpUser,
    verifyOtpCode,
};
