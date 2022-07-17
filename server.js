const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const fs = require('fs');
const path = require('path');
const express = require('express');
const {animals} = require('./data/animals');


//tell heroku to run port 'process.env.PORT (this runs port 80)' if it has been set, if not default to port 3001
const PORT = process.env.PORT || 3001;
const app = express();

//this will help server read or make the files that come with HTML 'public' such as CSS or frontend JS so this 
// way it can be read by server.
app.use(express.static('public'));

//parse incoming string or array data
app.use(express.urlencoded({extended: true}));
//parse incoming json data
app.use(express.json());

// we we are telling the server that any time a client navagiates to '/api' the app will use the router
// we set up in the 'apiRoutes' 
// similarly if the '/' is an endpoint, then the router will serve back our HTML routes.
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);




app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`)
});