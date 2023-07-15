const express = require("express");
const app = express()
const axios = require("axios")
const queryString = require("node:querystring")
require('dotenv').config()

const encodedRedirectUri = "http%3A%2F%2Flocalhost%3A9090%2Faccount"

app.listen(9090, () => {
    console.log("App is listening on port 9090!\n")
})

app.get("/", (req, res) => {
    res.send(
        "<a href='https://accounts.spotify.com/authorize?client_id=" +
        process.env.CLIENT_ID +
        "&response_type=code&redirect_uri=" +
        encodedRedirectUri +
        "&scope=user-top-read'>Sign in</a>"
    )
})

app.get("/account", async (req, res) => {
    const spotifyResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        queryString.stringify({
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: "http://localhost:9090/account",
        }),
        {
            headers: {
                Authorization: "Basic " + process.env.BASE64_ID_AND_SECRET,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    // console.log(spotifyResponse.data)
    // const data = await axios.get(
    //     "https://api.spotify.com/v1/me/top/tracks?limit=50",
    //     {
    //         headers: {
    //             Authorization: "Bearer " + spotifyResponse.data.access_token,
    //         },
    //     }
    // )

    // data.data.items.forEach(item => {
    //     console.log(item.album.artists[0].name, item.album.name, "<<<<<<<< artist, album")
    // // })
    // const availableGenres = await axios.get(
    //     "https://api.spotify.com/v1/recommendations/available-genre-seeds",
    //     {
    //         headers: {
    //             Authorization: "Bearer " + spotifyResponse.data.access_token,
    //         },
    //     }
    // )
    // console.log(availableGenres.data.genres, "<<<<<<<<<<<<<<<<< genres")
    const newReleases = await axios.get(
        "https://api.spotify.com/v1/browse/new-releases?limit=50",
        {
            headers: {
                Authorization: "Bearer " + spotifyResponse.data.access_token,
            },
        }
    )
    // console.log(newReleases.data.albums.items, "<<<<<<< new releases")
    newReleases.data.albums.items.forEach(item => {
        console.log(item.artists[0].name, item.name, item.release_date)
    })
    console.log(newReleases.data.albums.items.length, "<<<<< total results")
})

//   const data = await axios.get(
//     "https://api.spotify.com/v1/me/top/tracks?limit=50",
//     {
//       headers: {
//         Authorization: "Bearer " + spotifyResponse.access_token,
//       },
//     }
//   )

//   console.log(data, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< DATA")