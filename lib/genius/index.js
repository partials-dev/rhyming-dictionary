'use babel'

import auth from './auth'

export default {
  activate (geniusAuthCode) {
    if (geniusAuthCode) process.env.GENIUS_AUTH_CODE = geniusAuthCode
    auth.activate()
  },
  authenticate () {
    return auth.authenticate()
  },
  deauthenticate () {
    auth.deauthenticate()
  },
  artist (name) {

  },
  deactivate () {
    auth.deactivate()
  }
}
