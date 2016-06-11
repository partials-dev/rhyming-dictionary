var express = require('express')
var app = express()
var passport = require('passport')
var SpotifyStrategy = require('passport-spotify').Strategy

app.use(passport.initialize())
var port = 8888

/*
 * Configure Spotify authentication
 */

var spotifyOptions = {
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: `http://localhost:${port}/auth/spotify/callback`
}

var spotifyStrategy = new SpotifyStrategy(spotifyOptions,
  function (accessToken, refreshToken, profile, done) {
    var wrapper = JSON.stringify({
      type: 'spotify',
      accessToken,
      refreshToken
    })
    console.log(wrapper)
    done(null, {})
  }
)

passport.use(spotifyStrategy)

/*
 * Routes
 */

app.get('/', function (req, res) {
  var message = `This is a server that atom-rhyming-dictionary uses to talk with
  the Spotify music API. It only runs when you're
  using atom, and only talks to those services when you ask the app to get
  data from them.`
  res.send(message)
})

app.get('/auth/spotify', passport.authenticate('spotify', { session: false }))

app.get('/auth/spotify/error', function (req, res) {
  console.error('Spotify authentication error')
  res.send('Ran into a problem getting permission from the Spotify API')
})
app.get('/auth/spotify/callback', passport.authenticate('spotify', {
  successRedirect: '/auth/spotify/complete', failureRedirect: '/', session: false
}))
app.get('/auth/spotify/complete',
  function (req, res) {
    res.send('Hey! Glad to see you got the Spotify stuff working. You can go back to Atom now.')
  }
)

app.listen(8888, function () {
  // console.log('Spotify OAuth server listening on port 3000')
})
