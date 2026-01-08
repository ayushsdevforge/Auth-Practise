const userSchema = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {

    try{

        const { name, email, password } = req.body;


        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userSchema({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });      
    }
     catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

const loginUser = async(req, res) => {
    try{

       const {email, password} = req.body;

       const user = await userSchema.findOne({ email});

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
         res.status(200).json({ token})

    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { registerUser, loginUser };