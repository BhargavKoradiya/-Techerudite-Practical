const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

module.exports = (db) => {

    let module = {}

    // Helper function for sending verification email
    const sendVerificationEmail = (email, token) => {
        // Set up nodemailer transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const url = `http://localhost:3000/verify/${token}`;
        transporter.sendMail({
            to: email,
            subject: 'Email Verification',
            html: `Click <a href="${url}">here</a> to verify your email.`,
        }).then((res) => {
            console.log("MAIL SEND SUCCESSFULLY.....");
        })
    };


    module.registerCustomer = async (req, res) => {
        try {

            const { first_name, last_name, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            db.query('INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [first_name, last_name, email, hashedPassword, 'customer'], (err, result) => {
                    if (err) return res.status(400).json({ error: err.message });
                    sendVerificationEmail(email, token);
                    res.status(201).json({ message: 'Customer registered. Check your email for verification link.' });
                });

        } catch (error) {
            console.log("CUSTOMER REGISTRATION ERROR : ", error);
        }
    }

    module.registerAdmin = async (req, res) => {
        const { first_name, last_name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, 'admin'], (err, result) => {
                if (err) return res.status(400).json({ error: err.message });
                res.status(201).json({ message: 'Admin registered successfully.' });
            });
    };

    module.loginAdmin = async (req, res) => {
        const { email, password } = req.body;

        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err || results.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

            const user = results[0];

            if (user.role !== 'admin') {
                return res.status(403).json({ error: 'You are not allowed to login from here' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

            // Generate JWT token
            const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET);
            res.json({ token, msg: "Admin Login Successfully...." });
        });
    };

    return module

}