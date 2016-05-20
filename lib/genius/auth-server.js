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
  callbackURL: 'http://localhost:3000/auth/genius-redirect'
}

passport.use(new OAuth2Strategy(oauthOptions,
  function (accessToken, refreshToken, profile, cb) {
    cb(null, {})
  }
))

app.get('/auth/genius', passport.authenticate('oauth2'))

app.get('/auth/genius-redirect',
  function (req, res) {
    res.send('Hey! Glad to see you again. You can go back to Atom now.')
    var wrapper = JSON.stringify({
      geniusAuthCode: req.query.code
    })
    // transmit code back to the Atom plugin via stdout
    console.log(wrapper)
  }
)

app.listen(3000, function () {
  // console.log('Genius OAuth server listening on port 3000')
})
