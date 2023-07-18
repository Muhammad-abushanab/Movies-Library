const express = require('express');
const client = require('../client')
const router = express.Router();
// DataBase

router.get('/getmovies', (req, res, next) => {
    try {
        const sql = `SELECT * from movie`;
        client.query(sql).then((data) => {
            res.status(200).send(data.rows);
        })
    } catch (error) {
        next(`getmovies handler : ${error}`)
    }
})

router.get('/searchmovies', (req, res) => {
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

router.post('/addmovies', (req, res) => {
    const { title, lang, type, comment, image } = req.body;
    const sql = `INSERT INTO movie (title, lang, type , comment,image) VALUES ($1, $2, $3 , $4, $5) ON CONFLICT (title) DO NOTHING`;
    client.query(sql, [title, lang, type, comment,image]).then((data) => {
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

router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { newComment } = req.body;
    const sql = `UPDATE movie set comment = $1 where id = ${id}`;
    client.query(sql, [newComment]).then((data) => {
        if (data.rowCount > 0) {
            res.status(200).send(`Movie has been successfully Updated`);
        } else {
            res.status(409).send(`Movie already exists`);
        }
    }).catch((err) => {
        res.status(500).send('An error occurd while updateing the movie');
        console.log('Error updaing the movie', err);
    })
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `delete from movie where id = ${id}`;
        let data = await client.query(sql);
        res.status(204).end();
    } catch (error) {
        next("deleteMovie " + e);
    }
})

router.get('/getMovie/:id', (req, res) => {

    const { id } = req.params;
    const sql = `select * from movie where id = ${id}`;
    client.query(sql).then((data) => {
        if (data.rowCount > 0) {
            res.status(200).send(data.rows);
        } else {
            res.status(409).send(`Movie is Not in the dataBase :)`);
        }
    }).catch((err) => {
        res.status(500).send('An error occurd while fetching the movie');
        console.log('Error finding the movie', err);
    })
})


module.exports = router;