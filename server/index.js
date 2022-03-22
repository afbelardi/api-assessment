const { default: axios } = require("axios");
const express = require("express");
const app = express();
const PORT = 8000;


app.use(express.json());

const middleware = async (req, res, next) => {
    const sortBy = req.query.sortBy ? req.query.sortBy : "id"
    const directions = req.query.direction ? req.query.direction: "asc"

    const sortValues = ["id", "likes", "popularity", "reads"];
    const directionValues = ["desc", "asc"];

    const sortResults = await sortValues.includes(sortBy)
    const directionResults = await directionValues.includes(directions)

    if (sortResults === true && directionResults === true) {
        next();
    }

   if (sortResults === false && directionResults === false) {
        res
            .json({
                "error": "both sortBy and direction parameters are invalid"
            })
    } 
    
    if (sortResults === false) {
        res
            .json({
                "error": "sortBy parameter is invalid"
            })
    } 
    
    if (directionResults === false) {
        res
            .json({
                "error": "direction parameter is invalid"
            })
    }   
    }
 

app.get('/', (req, res) => {
    res.send('API Working')
});

app.get('/api/ping', (req, res) => {
    res
        .status(200)
        .json({
            "success": true
        })
});


app.get('/api/posts', middleware,async (req, res) => {
    if (!req.query.tags) {
        res
            .status(400)
            .json({
                "error": "tag query required"
            })
    } else {
        const tags = req.query.tags.split(',');
        const sortBy = req.query.sortBy ? req.query.sortBy : "id"
        const direction = req.query.direction ? req.query.direction: "asc"
           const map = tags.map(async (element) => {
               const resp = await axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${element}`)
                return resp.data.posts
            })
            const final = await Promise.all(map)
          
        const sort = final.flat(1).sort((a, b) => {
            if (direction === "asc") {
                return a[sortBy] - b[sortBy]
            } else {
                return b[sortBy] - a[sortBy]
            }
        })
        res
            .json(sort.flat(1))
       
    }
})


app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})

module.exports = app;