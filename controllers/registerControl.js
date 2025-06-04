const usersDB = {
    user: require('../model/users.json'),
    setUser: function (data) {
        this.user = data;
    }
}
const fsPromise = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleUser = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) {
        res.status(400).json({ "message": "UserName or Password is required" })
    }
    // Check duplicate user present or not.
    const duplicate = usersDB.user.find((person) =>
        person.username === user)
    if (duplicate) {
        return res.status(309).json({ "message": "User already exists" });
    }
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10); // hash the password so even if db is hacked no problem after 10 rounds of salting.
        const newUser = {
            "username": user,
            "password": hashedPwd
        }
        console.log(newUser);
        usersDB.setUser([...usersDB.user, newUser]);
        await fsPromise.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.user)
        )
        res.status(201).json({ "success": "User registered successfully" })
    } catch (error) {
        res.status(500).json({ "message": "Internal server error" });
    }

}

module.exports = { handleUser };