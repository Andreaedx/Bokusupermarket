const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//create a user
exports.createUser = async (req, res) => {
    try {
        const { name, email, gender, phone } = req.body;

        //check all required fields are provided
        if(!name || !email || !req.body.password || !gender || !phone){
            return res.status(400).json({
                success: false, 
                message: "Please provide all required fields" 
            });
        }

        //check email
        const existingUser = await User.findOne({ email: email });
        if (existingUser){
            return res.status(400).json({
                success: false, 
                message: "Email already exists" 
            });
        }

        //check phone number
        const existingPhone = await User.findOne({ phone: phone });
        if (existingPhone) {
            return res.status(400).json({
                success: false, 
                message: "Phone number already exists" 
            });
        }

        //encrypt password
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user      
        const user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            gender, 
            phone
        });

        await user.save();//save the user to the database

        res.status(201).json({
            success: true,
            message: "User created sucessfully", 
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: "Error creating user", 
            error: error.message 
        });
    }
};

//login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if all fields are provided
        if (!email || !password){
            return res.status(400).json({
                success: false, 
                message: "Please provide all required fields" 
            });
        }

        //check if user exist
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false, 
                message: "invalid username and password" 
            });
        }

        //check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: "invalid username and password" 
            });
        }

        //generate a token(you can use jwt or any other method)
        //const token = generateToken(user); implement your token generation logic here
        //generate jwt token
        const token = await jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(200).json({ 
            success: true,
            message: "Login Successful", 
            token
        });

    }catch (error) {
        
        res.status(500).json({ 
            success: false,
            message: "Error Logging", 
            error: error.message 
        });
    }
}