const usersDB = {
    user: require('../model/users.json'),
    setUser: function (data) {
        this.user = data;
    }
}

const fsPromises = require('fs').promises;
const path = require('path');

const logoutUser = async (req, res) => {
    const cookies = req.cookies;
    // Check user or password empty
    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }
    const userPresent = usersDB.user.find((person) => person.refreshToken === cookies.jwt);
    if (!userPresent) {
        res.clearCookie("jwt");
        return res.sendStatus(204); // Unauthorised
    }
    const otherUsers = usersDB.user.filter((person) => person.refreshToken !== cookies.jwt);
    userPresent.refreshToken = ""
    usersDB.setUser([...otherUsers, userPresent]);

    // Send refresh token as http only cookie which is not accessible by javascript. Non vulnurable.
    res.cookie("jwt", "", { sameSite: 'None', secure: true, httpOnly: true });
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.user));
    // Send accesstoken directly 
    res.status(200).json({ "message": "User logged out successfully" })
}



module.exports = { logoutUser };