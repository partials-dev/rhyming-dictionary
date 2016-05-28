'use babel'

import auth from './auth'
import lyrics from './lyrics'
import highlight from '../highlight'

export default {
  activate (state) {
    if (!state) state = {}
    auth.activate(state.auth)
    lyrics.activate(state.lyrics)
  },
  lyrics (artistName, songTitle) {
    return lyrics.get(artistName, songTitle).then((lyrics) => {
      console.log(JSON.stringify(lyrics))
    })
  },
  authenticate () {
    return auth.authenticate()
  },
  clearCache () {
    lyrics.clearCache()
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
      lyrics: lyrics.serialize(),
      auth: auth.serialize()
    }
  },
  deauthenticate () {
    auth.deauthenticate()
    lyrics.deauthenticate()
  },
  deactivate () {
    auth.deactivate()
  }
}
