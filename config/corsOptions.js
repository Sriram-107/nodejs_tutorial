// Handle cors;
const whitelistedDomains = ['https://www.google.com'];
const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        if (whitelistedDomains.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = { corsOptions };