const path = require("path");
const express = require("express");
const app = express();
const { logger } = require("./middleware/logEvents");
const cors = require('cors');
const { errorLog } = require('./middleware/errLog');
const { corsOptions } = require('./config/corsOptions')
const verifyJwt = require('./middleware/verifyJwt');
// PORT number
const PORT = process.env.PORT || 3500;

// Log every request first.
// custom middleware logger.
app.use(logger);


app.use(cors(corsOptions));

// To handle form data url encoded data when form data is submitted.
// 'content-type:application/x-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built in middleware for json data submitted.
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));
// app.use('/subdir', express.static(path.join(__dirname, '/public')));

// Routes when the path is requested, routed to its appropriate handler.
app.use('/', require('./routes/root'));
// app.use('/subdir', require('./routes/subdir'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
// After register and auth only we need to verify JWT. This works as waterfall model.
app.use(verifyJwt);
app.use('/employees', require('./routes/api/employees'));

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

// Listen to this port number.
app.listen(PORT, () => {
    console.log(`Listening to Port: ${PORT}`);
});
