const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/emailService');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

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

// Request password reset (send OTP)
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Input validation
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Set OTP expiry to 10 minutes from now
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Save OTP to database
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpiry = otpExpiry;
        await user.save();

        // Send OTP via email
        const emailResult = await sendOTPEmail(email, otp);
        
        if (!emailResult.success) {
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        res.status(200).json({ message: 'OTP sent to your email successfully' });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Verify OTP and reset password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Input validation
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP exists
        if (!user.resetPasswordOTP) {
            return res.status(400).json({ message: 'No OTP request found. Please request a new OTP' });
        }

        // Check if OTP is expired
        if (new Date() > user.resetPasswordOTPExpiry) {
            user.resetPasswordOTP = null;
            user.resetPasswordOTPExpiry = null;
            await user.save();
            return res.status(400).json({ message: 'OTP has expired. Please request a new one' });
        }

        // Verify OTP
        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear OTP fields
        user.password = hashedPassword;
        user.resetPasswordOTP = null;
        user.resetPasswordOTPExpiry = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };