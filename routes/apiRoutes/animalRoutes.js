// THESE ARE THE ANIMAL ROUTES !!!!!

const router = require('express').Router();
const {filterByQuery, findById, createNewAnimal, validateAnimal} = require('../../lib/animals');
const {animals} = require('../../data/animals');


// We have changed 'app' in these animal routes to 'router' this was we can stay linked to the same 
// app, because we are moving the routes from server.js to other files to stay organized.
// if we did not changed 'app' to 'router' then moving the routes to another file would start a completely
// new app and nothing from our server we wanted would show up.
router.get('/animals', (req, res) => {

    let results = animals;
    
    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    res.json(results);
});

router.get('/animals/:id', (req, res) => {

    const result = findById(req.params.id, animals);

    //if there is response found go to it. if there is no response send 404 error
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }

});

router.post('/animals', (req, res) => {

    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    //if any data in req.body is incorrect, send a 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }

});

module.exports = router;