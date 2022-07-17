// THESE ROUTES WILL SERVE THE HTML OF THE PAGE !!!!! 
const path = require('path');
const router = require('express').Router();

//this get route will respond with an HTML page to display in browser. *important*
router.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '../../public/index.html'));

});

//this get route links us to the animals.html
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

//this get route links us to the zookeepers html
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// wild card route, this is incase users tries to make a request that doesn't exist.
// the '*' acts as a wildcard, meaning any route that wasnt previouly defined 
// will fall under this request and will recieve the homepage as a response.
// wild card routes, or '*' routes, come last.
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

module.exports = router;