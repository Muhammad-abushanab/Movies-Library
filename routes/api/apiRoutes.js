const experss = require('express');
const axios = require('axios');
const router = experss.Router()
// third party API

router.get('/trending', async (req, res) => {
    try {
        const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.API_KEY}&language=en-US`
        const axiosRes = await axios.get(`${url}`);
        res.send(axiosRes.data)
    } catch (error) {
        next(`trending handler : ${error}`)
    }
})
router.get('/search', async (req, res) => {
    try {
        const movieName = req.query.query;
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${movieName}`;
        const axiosRes = await axios.get(`${url}`);
        res.send(axiosRes.data)
        
    } catch (error) {
        next(`search handler : ${error}`)
    }
})
router.get('/top-rated', async (req, res) => {
    try {
        const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.API_KEY}&language=en-US&page=1`
        const axiosRes = await axios.get(`${url}`);
        res.send(axiosRes.data)
        
    } catch (error) {
        next(`top-rated handler : ${error}`)
    }
})
router.get('/tv', async (req, res) => {
    try {
        const url = `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.API_KEY}&language=en-US`;
        const axiosRes = await axios.get(`${url}`);
        res.send(axiosRes.data)
        
    } catch (error) {
        next(`tv handler : ${error}`)
    }
})
router.get('/tv/top-rated', async (req, res) => {
    try {
        const url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.API_KEY}`;
        const axiosRes = await axios.get(`${url}`);
        res.send(axiosRes.data)
    } catch (error) {
        next(`tv/top-rated handler : ${error}`)
    }
})
router.get('/search/actor', async (req, res) => {
    try {
        const actor = req.query.name;
        const url = `
    https://api.themoviedb.org/3/search/person?api_key=${process.env.API_KEY}&query=${actor}`
        const axiosRes = await axios.get(`${url}`);
        res.send(axiosRes.data) 
    } catch (error) {
        next(`/search/actor handler : ${error}`)
    }
})


module.exports = router;

