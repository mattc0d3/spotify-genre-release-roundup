const express = require("express");
const app = express()
const axios = require("axios")
const queryString = require("node:querystring")

const exampleUrl = "https://accounts.spotify.com/authorize?client_id=xxx&response_type=code&redirect_uri=xxx&scope=user-top-read"

const clientId = "edfa486ea0f54d70b6ea529eb691ba57"
const clientSecret = "92c2ffda5c5a40178f1cd79aa13deb12"
const combinedIdandSecret = "edfa486ea0f54d70b6ea529eb691ba57:92c2ffda5c5a40178f1cd79aa13deb12"
const encodedRedirectUri = "http%3A%2F%2Flocalhost%3A9090%2Faccount"
const base64EncodedClientSecret = "OTJjMmZmZGE1YzVhNDAxNzhmMWNkNzlhYTEzZGViMTI="
const base64EncodedIdAndSecret = "ZWRmYTQ4NmVhMGY1NGQ3MGI2ZWE1MjllYjY5MWJhNTc6OTJjMmZmZGE1YzVhNDAxNzhmMWNkNzlhYTEzZGViMTI="

app.listen(9090, () => {
    console.log("App is listening on port 9090!\n")
})

app.get("/", (req, res) => {
    // res.send("Hello")
    res.send(
        "<a href='https://accounts.spotify.com/authorize?client_id=" +
        clientId +
        "&response_type=code&redirect_uri=" +
        encodedRedirectUri +
        "&scope=user-top-read'>Sign in</a>"
    )
})

app.get("/account", async (req, res) => {
    // console.log("spotify response code is " + req.query.code)
    const spotifyResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        queryString.stringify({
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: "http://localhost:9090/account",
        }),
        {
            headers: {
                Authorization: "Basic " + base64EncodedIdAndSecret,
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

const query = {
    client_id: clientId,
    redirect_uri: "https://localhost:9090"
}

// const spotifyResponse = {
//     access_token: 'BQDAc2lWU2Sm0iA3kiWmrEji9aqv3Q7QcrNDdo7o9uFxpQllPVMzLPmPR9cgJF705cl0CZXrQls_x6QwJFOV7CAHSxql7i3dqZB_ehoeX_oI0qW0_nCQQxAzRHq3X_Vxcns0p701IBt3o_hA8URYkcP9etgIgYqqMheQW3woqc_LpgKIfQAy2dV52Q',
//     token_type: 'Bearer',
//     expires_in: 3600,
//     refresh_token: 'AQC414hnJjSKoncsOkHV-Sfse812aN8UZZMTRDOeA0y6NQoRTaPD6XGMZice_NfHuJWFTJCZ-ZrcuBUDgCI-QZBEI8Oj1-ft16gQTtkWDpwSdeSsbHUvQgl_5BfCKY0dq1U',
//     scope: 'user-top-read'
//   }

//   const data = await axios.get(
//     "https://api.spotify.com/v1/me/top/tracks?limit=50",
//     {
//       headers: {
//         Authorization: "Bearer " + spotifyResponse.access_token,
//       },
//     }
//   )

//   console.log(data, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< DATA")