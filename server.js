const fs = require('fs');
const path = require('path');
const express = require('express');
const {animals} = require('./data/animals');

//tell heroku to run port 'process.env.PORT(this runs port 80)' if it has been set, if not default to port 3001
const PORT = process.env.PORT || 3001;
const app = express();

//this will help server read or make the files that come with HTML 'public' such as CSS or frontend JS so this 
// way it can be read by server.
app.use(express.static('public'));

//parse incoming string or array data
app.use(express.urlencoded({extended: true}));
//parse incoming json data
app.use(express.json());

function filterByQuery(query, animalsArray) {

    let personalityTraitsArray = [];

    //Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        //if personalityTraits is a string, place it into a new array & save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }

        //loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {

            // check the trait against each animal in the filteredResults array.
            // remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // for each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.diet);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;

}

//this function takes in the id and array of animals and returns a single animal object.
function findById(id, animalsArray) {

    const result = animalsArray.filter(animal => animal.id === id)[0];

    return result;
}

function createNewAnimal(body, animalsArray) {
    
    const animal = body;
    animalsArray.push(animal);

    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({animals: animalsArray}, null, 2)
    );

    return animal;

}

//here we are validating data making sure everthing exits & it is the correct type of data
function validateAnimal(animal) {
    if ( !animal.name || typeof animal.anme !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray (animal.personalityTraits)) {
        return false;
    };

    return true;
}

app.get('/api/animals', (req, res) => {

    let results = animals;
    
    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {

    const result = findById(req.params.id, animals);

    //if there is response found go to it. if there is no response send 404 error
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }

});

app.post('/api/animals', (req, res) => {

    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    //if any data in req.body is incorrect, send a400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.')
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal)
    }

});

//this get route will respond with an HTML page to display in browser. *important*
app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, './public/index.html'));

});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`)
});