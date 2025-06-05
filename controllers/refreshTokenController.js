const usersDB = {
    user: require('../model/users.json'),
    setUser: function (data) {
        this.user = data;
    }
}

const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies?.jwt) {
        return res.sendStatus(401) // Bad request
    }
    const refreshToken = cookies.jwt;
    const userPresent = usersDB.user.find((person) => person.refreshToken === refreshToken);
    if (!userPresent) {
        return res.sendStatus(403); // Forbidden
    }
    console.log(userPresent);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            console.log(decoded);

            if (err || userPresent.username !== decoded.username) {
                return res.sendStatus(403);
            }
            const roles = Object.values(userPresent.roles)
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        // We are just sending the codes of roles in access token.
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken })
        }
    )

}

module.exports = { handleRefreshToken };