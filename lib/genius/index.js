'use babel'

import lyrics from './lyrics'
import highlight from '../highlight'

export default {
  activate (state) {
    if (!state) state = {}
    lyrics.activate(state.lyrics)
  },
  lyrics (artistOrSongs, title) {
    if (Array.isArray(artistOrSongs)) {
      const songs = artistOrSongs
      return lyrics.getAll(songs)
    } else {
      const artist = artistOrSongs
      return lyrics.get(artist, title)
    }
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
      lyrics: lyrics.serialize()
    }
  },
  deauthenticate () {
    lyrics.deauthenticate()
  },
  deactivate () {
  }
}
