'use babel'

import auth from './auth'
import api from './api'
import highlight from '../highlight'

export default {
  activate (state) {
    if (!state) state = {}
    auth.activate(state.auth)
    api.activate(state.api)
  },
  lyrics (artistName, songTitle) {
    return api.lyrics(artistName, songTitle).then((lyrics) => {
      console.log(JSON.stringify(lyrics))
    })
  },
  authenticate () {
    return auth.authenticate()
  },
  clearCache () {
    api.clearCache()
  },
  highlight () {
    highlight([
      {
        token: 'in',
        similarity: 'hi'
      },
      {
        token: 'the',
        similarity: 'med'
      },
      {
        token: 'morning',
        similarity: 'lo'
      }
    ])
  },
  serialize () {
    return {
      api: api.serialize(),
      auth: auth.serialize()
    }
  },
  deauthenticate () {
    auth.deauthenticate()
    api.deauthenticate()
  },
  deactivate () {
    auth.deactivate()
  }
}
