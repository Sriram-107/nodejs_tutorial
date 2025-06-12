const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const { format } = require("date-fns");
const { v7: uuid } = require("uuid");

const logEvent = async (data, fileName) => {
    const dateTime = format(new Date(), 'yyyyyyyy');
    const message = `${uuid()}\t${dateTime}\t${data}\n`
    // if directory doesn't exist. Create new directory.
    if (!fs.existsSync(path.join(__dirname, '..', "logs"))) {
        await fsPromises.mkdir("logs");
    }
    // append file is used to create a file and write data asynchronously.
    await fsPromises.appendFile(path.join(__dirname, '..', "logs", fileName), message);
}

const logger = (req, res, next) => {
    // send log message and filename.
    logEvent(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
    console.log(req.method, req.path);
    next();
}
module.exports = { logEvent, logger };
