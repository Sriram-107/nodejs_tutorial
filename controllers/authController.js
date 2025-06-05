const usersDB = {
    user: require('../model/users.json'),
    setUser: function (data) {
        this.user = data;
    }
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');

const authenticateUser = async (req, res) => {
    const { user, pwd } = req.body;
    // Check user or password empty
    if (!user || !pwd) {
        return res.status(400).json({ "message": "UserName and Password is required" }) // Bad request
    }
    const userPresent = usersDB.user.find((person) => person.username === user);
    if (!userPresent) {
        return res.sendStatus(401); // Unauthorised
    }
    const isMatch = await bcrypt.compare(pwd, userPresent.password);
    console.log(isMatch);

    if (!isMatch) {
        return res.sendStatus(401);
    }
    else {
        const roles = Object.values(userPresent.roles)
        // JWT token generation here
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
        const refreshToken = jwt.sign(
            { "username": userPresent.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        const otherUsers = usersDB.user.filter((person) => person.username !== userPresent.username);
        const currentUser = { ...userPresent, refreshToken };
        usersDB.setUser([...otherUsers, currentUser]);
        await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.user));
        // Send refresh token as http only cookie which is not accessible by javascript. Non vulnurable.
        res.cookie("jwt", refreshToken, { sameSite: 'None', secure: true, httpOnly: true, maxAge: 24 * 60 * 60 });
        // Send accesstoken directly 
        res.status(200).json({ accessToken })
    }

}

module.exports = { authenticateUser };