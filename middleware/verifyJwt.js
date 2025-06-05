const usersDB = {
    user: require('../model/users.json'),
    setUser: function (data) {
        this.user = data;
    }
}

const jwt = require("jsonwebtoken");


const verifyJwt = (req, res, next) => {

    const headerToken = req.headers.authorization || req.headers.Authorization; // headerToken must be present to authorize the user.
    if (!headerToken?.startsWith("Bearer ")) {
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
        req.user = decoded.UserInfo.username;
        req.roles = decoded.UserInfo.roles;
        next();
    })

}

module.exports = verifyJwt;