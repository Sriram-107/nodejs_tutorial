const express = require('express');
const router = express.Router();
const path = require('path');

// Route when req comes in
router.get(/^\/$|^\/index(\.html)?$/, (req, res) => {
    // res.send('Hello World');
    // res.sendFile('./view/index.html', { root: __dirname });
    // console.log(path.join(__dirname, 'view', 'index.html'));

    res.sendFile(path.join(__dirname, '..', 'view', 'index.html'));
});

router.get(/^\/new-page(\.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'view', 'newpage.html'))
});

// Redirect to different page.
router.get(/^\/old-page(\.html)?$/, (req, res) => {
    res.redirect(301, '/new-page.html');
})

module.exports = router;