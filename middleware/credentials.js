const { whitelistedDomains } = require('../config/corsOptions');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (whitelistedDomains.includes(origin)) {
        res.headers('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = { credentials };