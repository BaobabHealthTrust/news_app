var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/process_authentication', function (request, response) {
    /* Do SOMETHING HERE*/
    response.redirect('/');

});

router.get('/sign_out', function (request, response) {
    /* Do SOMETHING HERE*/
    response.redirect('/sign_in');
});

module.exports = router;
