'use strict'

// requierd packages

const cors = require('cors');
const experss = require('express');
const movies = require('./Movie data/data.json');

const app = experss();
const port = 3000;
app.use(cors());
app.use(experss.static(__dirname + '/public'));


// routes

app.get('/', (req, res) => {
    // console.log("Hello From /");
    let moviesArr = [];
    movies.forEach(movie => {
        moviesArr.push(new Movie(movie.title, movie.poster_path, movie.overview));
    })
    res.send(moviesArr);
})

app.get('/favorite', (req, res) => {
    res.sendFile(__dirname + '/faviroute.html');
})

app.get('/favorite/:id', (req, res) => {
    let id = req.params.id;
    id = Number(id);
    // console.log(id);
    if (isNaN(id)) {
        res.send({
            status: '500',
            responseText: "Something went wrong"
        })
    } else res.send(`ID is ${id}`);
})

app.get('*', (req, res) => {
    res.send({
        statues: '404',
        responseText: "PageNotfound"
    })
})



// constructor
function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

app.listen(port, () => { console.log("started on port 3000") })