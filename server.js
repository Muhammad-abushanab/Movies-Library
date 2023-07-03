'use strict'

// requierd packages

const cors = require('cors');
const experss = require('express');
const movies = require('./Movie data/data.json');
const axios = require('axios');
const pg = require('pg');

const app = experss();
require("dotenv").config();
app.use(cors());
app.use(experss.static(__dirname + '/public'));
app.use(experss.json());

const client = new pg.Client(process.env.DATABASE_URL + process.env.DATABASE_NAME);
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

// DataBase

app.get('/getmovies', (req, res) => {
    const sql = `SELECT * from movie`;
    client.query(sql).then((data) => {
        res.status(200).send(data.rows);
    })
})

app.get('/searchmovies', (req, res) => {
    const { query } = req;
    if (Object.keys(query).length === 0 && query.constructor === Object) {
        res.status(400).send(`You should provide some query strings`);
    } else {
        const sql = `SELECT * from movie where title = '${query.title}'`;
        client.query(sql).then((data) => {
            data.rowCount > 0 ? res.status(200).send(data.rows) : res.status(200).send(`No such Movie like ${query.title}`);
        }).catch((err) => {
            res.status(500).send(`An Error Occurd while trying to search`)
            console.log(`Error in search`, err);
        })
    }
})

app.post('/addmovies', (req, res) => {
    const { title, lang, type } = req.body;
    const sql = `INSERT INTO movie (title, lang, type) VALUES ($1, $2, $3) ON CONFLICT (title) DO NOTHING`;
    client.query(sql, [title, lang, type]).then((data) => {
        if (data.rowCount > 0) {
            res.status(201).send(`Movie ${title} has been successfully Added`);
        } else {
            res.status(409).send(`Movie ${title} already exists`);
        }
    }).catch((err) => {
        res.status(500).send('An error occurd while adding the movie');
        console.log('Error Adding movie', err);
    })
})

app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { newTitle, newLang, newType } = req.body;
    const sql = `UPDATE movie set title = $1 , lang =$2 , type = $3 where id = ${id}`;
    client.query(sql, [newTitle, newLang, newType]).then((data) => {
        if (data.rowCount > 0) {
            res.status(200).send(`Movie ${newTitle} has been successfully Updated`);
        } else {
            res.status(409).send(`Movie ${newTitle} already exists`);
        }
    }).catch((err) => {
        res.status(500).send('An error occurd while updateing the movie');
        console.log('Error updaing the movie', err);
    })
})

app.delete('/delete/:id',async (req,res)=>{
    try {
        const {id} = req.params;
        const sql = `delete from movie where id = ${id}`;
        let data = await client.query(sql);
        res.status(204).end();
    } catch (error) {
        next("deleteCar " + e);
    }
})

app.get('/getMovie/:id',(req,res)=>{
    
    const {id} = req.params;
    const sql = `select * from movie where id = ${id}`;
    client.query(sql).then((data)=>{
        if (data.rowCount > 0) {
            res.status(200).send(data.rows);
        } else {
            res.status(409).send(`Movie is Not in the dataBase :)`);
        }
    }).catch((err)=>{
        res.status(500).send('An error occurd while fetching the movie');
        console.log('Error finding the movie', err);
    })
})


// third party API

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
client.connect().then(() => {
    app.listen(process.env.PORT, () => { console.log("started on port 3000") })
})
