
const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleUser = async (req, res) => {
    // Get username, password from request body
    const { user, pwd } = req.body;
    // If username or password doesn't exist bad request(400)
    if (!user || !pwd) {
        res.status(400).json({ "message": "UserName or Password is required" })
    }
    // Check duplicate user present or not.
    const duplicate = await User.findOne({ "username": user }).exec();
    console.log(duplicate);
    // If duplicate user present then send user already exists(309)
    if (duplicate) {
        return res.status(309).json({ "message": "User already exists" });
    }
    // If no duplicate is present then hash password.
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10); // hash the password so even if db is hacked no problem after 10 rounds of salting.
        const newUser = await User.create({
            "username": user,
            "password": hashedPwd
        });
        console.log(newUser);
        // If user created then send 201 success request.
        res.status(201).json({ "success": "User registered successfully" })
    } catch (error) {
        // If any error or backend server down then send 500 response.
        res.status(500).json({ "message": "Internal server error" });
    }

}

module.exports = { handleUser };