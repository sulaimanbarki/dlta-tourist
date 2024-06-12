const { default: mongoose } = require("mongoose");
const userModel = require("../models/userModel");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'danitechsol2@gmail.com',
        pass: 'pkwhigejooylzixm',
    },
});

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
        return res.status(403).json({ msgErr: "Password is required" });
    }

    try {
        const user = await userModel.findOne({ email: email });
        if (user) {
            return res.status(500).json({ msgErr: `${email} is already in use` });
        }

        const verificationToken = jwt.sign({ email: email }, 'secret', { expiresIn: '1h' });
        const mailOptions = {
            from: 'danitechsol2@gmail.com',
            to: email,
            subject: 'Email verification',
            html: `<h1>Click on the link below to verify your email</h1>
                   <p>http://localhost:3001/auth/verify-email?token=${verificationToken}</p>`,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(info);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msgErr: "Failed to send verification email" });
        }

        const result = await userModel.collection.insertOne({
            first_name,
            last_name,
            email,
            password,
            isVerified: false,
            verificationToken: verificationToken,
        });

        res.status(200).json({
            msg: "User account created successfully. Please check your email to verify your account.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msgErr: "An error occurred while creating the account" });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.query;
    
    try {
        const decoded = jwt.verify(token, 'secret');
        const email = decoded.email;

        const user = await userModel.findOneAndUpdate(
            { email: email, verificationToken: token },
            { isVerified: true, verificationToken: null }
        );

        if (!user) {
            return res.status(400).json({ msgErr: "Invalid or expired token" });
        }

        res.status(200).json({ msg: "Email verified successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msgErr: "An error occurred during email verification" });
    }
};

const verifyOtpCode = async (req, res) => { };

module.exports = {
    siginUser,
    signUpUser,
    verifyOtpCode,
    verifyEmail,
};
