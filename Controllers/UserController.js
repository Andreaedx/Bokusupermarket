const User = require("../Models/User");

//create a user
exports.createUser = async (req, res) => {
    try {
        //request body
        const { name, email, password, gender, phone, role, HasAdminAcess } = req.body;

        //check all required fields are provided
        if(!req.body.name || !req.body.email || !req.body.password || !req.body.gender || !req.body.phone) {
            return res.status(400).json({ message: "Please provide all required fields"});
        }

        //email check
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser){
            return res.status(400).json({ message: "Email already exists" });
        }

        //check phone number
        const existingPhone = await User.findOne({ phone: req.body.phone });
        if (existingPhone) {
            return res.status(400).json({ message: "Phone number already exists" });
        }


        //encrypt password
        const salt = await bcrypt.genSalt(30);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user      
        const user = new User({ 
            name: req.body.name, 
            email: req.body.email, 
            password: hashedPassword, 
            gender: req.body.gender, 
            phone: req.body.phone, 
            role: req.body.role || "user", //Default role is "user" if not provided
            HasAdminAcess: req.body.HasAdminAcess || false //Default is false if not provided
        });

        await user.save();
        res.status(201).json({ message: "User created sucessfully", user});
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};