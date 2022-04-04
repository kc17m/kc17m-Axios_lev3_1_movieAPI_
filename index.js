const axios = require("axios")
const { promiseImpl } = require("ejs")
const express = require("express")
const res = require("express/lib/response")

const PORT = 9006
const key = "e4703f464b2ee4cd2f4842c792dc8542"
const baseURL = "https://api.themoviedb.org/3/discover/movie?api_key=e4703f464b2ee4cd2f4842c792dc8542&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate"

const app = express()

app.set("view engine", "ejs")

app.use((req, _, next) => {
    console.log("new request", req.method, req.url)
    next()
})

app.use(express.static("public"))

const imageBaseURL = "https://image.tmdb.org/t/p/w500"

const moviePage01 = "https://api.themoviedb.org/3/discover/movie?api_key=e4703f464b2ee4cd2f4842c792dc8542&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page="
const moviePage02 = "&with_watch_monetization_types=flatrate"
let page = 1


app.get("/", (req, res) => {
    axios.get(baseURL)
        .then(movieResponse => {
            res.render("pages/home", { movieList: movieResponse.data.results })
            // console.log(movieResponse.data.results)
        })
})

app.get("/:pageNumber", (req, res) => {
    const pageNumber = req.params.pageNumber
    axios.get(moviePage01 + pageNumber + moviePage02)
        .then((pageResponse) => {
            const pageNumber = pageResponse.data
            console.log(pageResponse)
            res.render("pages/page", { pages: pageResponse.data.page, movieList: pageResponse.data.results })
        })
})



const movieDetail01 = "https://api.themoviedb.org/3/movie/"
const movieDetail02 = "?api_key=e4703f464b2ee4cd2f4842c792dc8542&language=en-US"



app.get("/movie/:id", (req, res) => {
    const movieId = req.params.id
    axios.get(movieDetail01 + movieId + movieDetail02)
        .then(detailResponse => {
            res.render("pages/detail", { detail: detailResponse.data })
            //console.log(detailResponse.data)
        })

})

app.use((_, res) => {
    res.status(404)
    res.sendFile(__dirname + "/public/error.html")
})



app.listen(PORT, () => console.log("Server listening on PORT", PORT))

