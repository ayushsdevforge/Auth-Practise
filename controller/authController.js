const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });      
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const loginUser = async(req, res) => {
    try {
       const {email, password} = req.body;

       // Input validation
       if (!email || !password) {
           return res.status(400).json({ message: 'Email and password are required' });
       }

       const user = await User.findOne({ email});

       if(!user){
        return res.status(400).json({ message: 'Invalid credentials' });
       }

       const isMatch = await bcrypt.compare(password, user.password);

       if(!isMatch){
        return res.status(400).json({ message: 'Invalid credentials' });
       }

       const token = jwt.sign({
        id : user._id,
        name: user.name, 
        email: user.email
       }, process.env.JWT_SECRET, { expiresIn: '1h' });
       
       res.status(200).json({ token })

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { registerUser, loginUser };