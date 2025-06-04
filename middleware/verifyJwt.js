const usersDB = {
    user: require('../model/users.json'),
    setUser: function (data) {
        this.user = data;
    }
}

const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyJwt = (req, res, next) => {

    const headerToken = req.headers["authorization"]; // headerToken must be present to authorize the user.
    if (!headerToken) {
        return res.sendStatus(401)
    }
    const jwtToken = headerToken.split(" ")[1]; // We get Bearer "token_number" so we split and seperate Bearer.

    console.log(jwtToken);
    console.log(process.env.ACCESS_TOKEN_SECRET);

    jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);

            return res.sendStatus(403)
        } // Invalid token not authorised.
        req.user = decoded.user;
        next();
    })

}

module.exports = verifyJwt;