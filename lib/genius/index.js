'use babel'

import auth from './auth'
import api from './api'
import view from './view'

export default {
  activate (state) {
    if (!state) state = {}
    auth.activate(state.auth)
    api.activate(state.api)
  },
  artistLyrics (name) {
    return api.artistLyrics(name).then((lyrics) => {
      console.log(lyrics.length)
    })
  },
  authenticate () {
    return auth.authenticate()
  },
  clearCache () {
    api.clearCache()
  },
  highlight () {
    view.highlight(['the', 'a'])
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
