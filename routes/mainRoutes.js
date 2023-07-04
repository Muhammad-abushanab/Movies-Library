const express = require('express');
const router = express.Router();
const movies = require('../Movie data/data.json');

router.get('/', (req, res,next) => {
    try {
        let moviesArr = [];
        movies.forEach(movie => {
            moviesArr.push(new Movie(movie.title, movie.poster_path, movie.overview));
        })
        res.send(moviesArr);
    } catch (error) {
        next(`Home handler : ${error}`)
    }
})

router.get('/favorite', (req, res,next) => {
    try {
        res.send('favorite home page');
    } catch (error) {
        next(`faviroute handler : ${error}`)
    }
})

router.get('/favorite/:id', (req, res) => {
    try {
        let id = req.params.id;
        id = Number(id);
        // console.log(id);
        if (isNaN(id)) {
            res.status(500).send({
                status: '500',
                responseText: "Something went wrong"
            })
        } else res.send(`ID is ${id}`);
        
    } catch (error) {
        next(`faviroute/:id handler : ${error}`)
    }
})

// constructor
function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

module.exports = router;