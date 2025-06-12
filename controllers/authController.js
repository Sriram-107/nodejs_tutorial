const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');

const authenticateUser = async (req, res) => {
    const { user, pwd } = req.body;
    // If no request and password is sent then it is a bad request(400).
    if (!user || !pwd) {
        return res.status(400).json({ "message": "UserName and Password is required" }) // Bad request
    }
    // If user is not present in the database then unauthorised request(401).
    const userPresent = await User.findOne({ "username": user }).exec();
    if (!userPresent) {
        return res.sendStatus(401); // Unauthorised
    }
    // compare hashed password using bcrypt 
    const isMatch = await bcrypt.compare(pwd, userPresent.password);
    console.log(isMatch);
    // If password is not matched then unauthorised(401)
    if (!isMatch) {
        return res.sendStatus(401);
    }
    else {
        // Get all the roles from database.
        const roles = Object.values(userPresent.roles)
        // JWT token generation here
        // Generate access token based on role.
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": userPresent.username,
                    // We are just sending the codes of roles in access token.
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '180s' }
        )
        // Generate refresh token.
        const refreshToken = jwt.sign(
            { "username": userPresent.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        // Find and update in mongodb
        const loggedIn = await User.findOneAndUpdate(
            { username: userPresent.username }, // Filter: Find user named Bob
            { $set: { refreshToken: refreshToken } }, // Update: Set new age and isActive
            { new: true, runValidators: true } // Options: Return the new document, run schema validators
        );
        console.log('Updated DB:', loggedIn);
        // // Get other users
        // const otherUsers = usersDB.user.filter((person) => person.username !== userPresent.username);
        // // Set currentUser refresh token
        // const currentUser = { ...userPresent, refreshToken };
        // // update the db cause refresh token is updated.
        // usersDB.setUser([...otherUsers, currentUser]);
        // await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.user));
        // Send refresh token as http only cookie which is not accessible by javascript.
        // To prevent cross site scripting(XSS attack - Hackers target refresh token to generate new access token) 
        // Non vulnurable(Expiry - days,weeks,months).
        res.cookie("jwt", refreshToken, { sameSite: 'None', secure: true, httpOnly: true, maxAge: 24 * 60 * 60 });
        // Send accesstoken directly HTTTPS secure.
        // Expiry - 5 to 30 mins.
        // On client side store access token in memory.
        res.status(200).json({ accessToken })
    }

}

module.exports = { authenticateUser };