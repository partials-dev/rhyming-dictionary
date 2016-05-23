var express = require('express')
var app = express()
var OAuth2Strategy = require('passport-oauth2')
var passport = require('passport')

app.use(passport.initialize())

var oauthOptions = {
  authorizationURL: 'https://api.genius.com/oauth/authorize',
  tokenURL: 'https://api.genius.com/oauth/token',
  clientID: process.env.GENIUS_CLIENT_ID,
  clientSecret: process.env.GENIUS_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/genius/callback'
}

passport.use(new OAuth2Strategy(oauthOptions,
  function (accessToken, refreshToken, profile, cb) {
    var wrapper = JSON.stringify({
      geniusAuthToken: accessToken
    })
    // transmit code back to the Atom plugin via stdout
    console.log(wrapper)
    cb(null, {})
  }
))

app.get('/', function (req, res) {
  res.send("This is a server that atom-rhyming-dictionary uses to talk with the Genius lyrics API. It only runs when you're using atom.")
})

app.get('/auth/genius', passport.authenticate('oauth2', { session: false }))

app.get('/auth/genius/callback', passport.authenticate('oauth2', {
  successRedirect: '/auth/genius/complete', failureRedirect: '/', session: false
}))

app.get('/auth/genius/complete',
  function (req, res) {
    res.send('Hey! Glad to see you again. You can go back to Atom now.')
  }
)

app.listen(3000, function () {
  // console.log('Genius OAuth server listening on port 3000')
})
