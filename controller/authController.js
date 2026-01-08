import userSchema from '../models/userModel.js';

export const registerUser = async (req, res) => {

    try{

        const { name, email, password } = req.body;


        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const neewUser = new userSchema({
            name,
            email,
            password
        });
        await neewUser.save();
        res.status(201).json({ message: 'User registered successfully' });      
    }
     catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}