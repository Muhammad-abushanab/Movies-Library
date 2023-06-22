'use strict'

// requierd packages

const cors = require('cors');
const experss = require('express');
const movies = require('./Movie data/data.json');
const axios = require('axios');

const app = experss();
const port = 3000;
require("dotenv").config();
app.use(cors());
app.use(experss.static(__dirname + '/public'));

// routes

app.get('/', (req, res) => {
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
        res.status(500).send({
            status: '500',
            responseText: "Something went wrong"
        })
    } else res.send(`ID is ${id}`);
})

app.get('/trending', async (req, res) => {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.API_KEY}&language=en-US`
    const axiosRes = await axios.get(`${url}`);
    res.send(axiosRes.data)
})
app.get('/search', async (req, res) => {
    const movieName = req.query.query;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${movieName}`;
    const axiosRes = await axios.get(`${url}`);
    res.send(axiosRes.data)
})
app.get('/top-rated', async (req, res) => {
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.API_KEY}&language=en-US&page=1`
    const axiosRes = await axios.get(`${url}`);
    res.send(axiosRes.data)
})
app.get('/tv', async (req, res) => {
    const url = `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.API_KEY}&language=en-US`;
    const axiosRes = await axios.get(`${url}`);
    res.send(axiosRes.data)
})
app.get('/tv/top-rated', async (req, res) => {
    const url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.API_KEY}`;
    const axiosRes = await axios.get(`${url}`);
    res.send(axiosRes.data)
})
app.get('/search/actor', async (req, res) => {
    const actor = req.query.name;
    const url = `
https://api.themoviedb.org/3/search/person?api_key=${process.env.API_KEY}&query=${actor}`
    const axiosRes = await axios.get(`${url}`);
    res.send(axiosRes.data)
})

app.use((req, res, next) => {
    res.status(404).send({
        code: 404,
        message: "Not Found",
        extra: "Try \/trending",
    });
});



// constructor
function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}
app.listen(port, () => { console.log("started on port 3000") })