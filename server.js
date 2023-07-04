'use strict'

// requierd packages

const cors = require('cors');
const experss = require('express');
const client = require('./client');
const {PORT} = require('./config');
//routes
const mainRoutes = require('./routes/mainRoutes');
const apiRoutes = require('./routes/api/apiRoutes');
const movieRoutes = require('./routes/movieRoutes');


const app = experss();
app.use(cors());
app.use(experss.static(__dirname + '/public'));
app.use(experss.json());


// routes
app.use(mainRoutes);
app.use(apiRoutes);
app.use(movieRoutes);




app.use((req, res, next) => {
    res.status(404).send({
        code: 404,
        message: "Not Found",
        extra: "Try \/trending",
    });
});

client.connect().then(() => {
    app.listen(PORT, () => { console.log(`started at PORT ${PORT}`) })
})
