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
        word: 'in',
        strength: 'high'
      },
      {
        word: 'the',
        strength: 'medium'
      },
      {
        word: 'morning',
        strength: 'low'
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
