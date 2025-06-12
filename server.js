require('dotenv').config();
const path = require("path");
const express = require("express");
const app = express();
const { logger } = require("./middleware/logEvents");
const cors = require('cors');
const { errorLog } = require('./middleware/errLog');
const { corsOptions } = require('./config/corsOptions')
const verifyJwt = require('./middleware/verifyJwt');
const cookieParser = require('cookie-parser');
const { credentials } = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn')
// PORT number
const PORT = process.env.PORT || 3500;
// Connect to mongodb database.
connectDB();
// Log every request first.
// custom middleware logger.
app.use(logger);

app.use(credentials)
app.use(cors(corsOptions));

// To handle form data url encoded data when form data is submitted.
// 'content-type:application/x-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built in middleware for json data submitted.
// parse the incoming json string to javascript object.
app.use(express.json());

// In order to access cookies from request we use cookieParser.
app.use(cookieParser());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));
// app.use('/subdir', express.static(path.join(__dirname, '/public')));

// Routes when the path is requested, routed to its appropriate handler.
app.use('/', require('./routes/root'));
// app.use('/subdir', require('./routes/subdir'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
// First issue refresh token.
app.use('/refresh', require('./routes/refresh'));
// After register and auth only we need to verify JWT. This works as waterfall model.
app.use(verifyJwt);
app.use('/employees', require('./routes/api/employees'));
app.use('/logout', require('./routes/logout'));

// Route handlers
app.get('/hello.html', (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
}, (req, res) => {
    res.send("Hello World");
})

// chaing route handlers
const one = (req, res, next) => {
    console.log("one");
    next();
}
const two = (req, res, next) => {
    console.log("two");
    next();
}
const three = (req, res, next) => {
    console.log("three");
    res.send("Finished chained routes")
    next();
}
app.get('/chain.html', [one, two, three]);

// app.all('*', (req, res) => {
//     res.status(404)
//     if (req.accepts('html')) {
//         res.sendFile(path.join(__dirname, 'view', '404.html'));
//     } else if (req.accepts('json')) {
//         res.json({ error: "404 Not Found" })
//     } else {
//         res.type('txt').send('404 Not Found');
//     }
// })
app.get(/^\/.*$/, (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'view', '404.html'));
})

app.use(errorLog);

mongoose.connection.once("open", () => {
    console.log('Connected to MongoDB');
    // Listen to this port number.
    app.listen(PORT, () => {
        console.log(`Listening to Port: ${PORT}`);
    });

})
