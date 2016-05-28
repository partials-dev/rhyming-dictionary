'use babel'

import genius from './node-genius-wrapper'
import SongCache from './song-cache'
import combine from './combine-song-and-artist'

export default {
  activate (state) {
    if (!state) state = {}
    this.cache = new SongCache(state.cache)
  },

  deauthenticate () {
    genius.deauthenticate()
  },

  serialize () {
    return {
      cache: this.cache.serialize()
    }
  },

  artistLyrics (artistName) {
    return genius.search(artistName).then((hits) => {
      return hits[0].result.primary_artist.id
    }).then((artistId) => {
      return genius.getArtistSongs(artistId)
    }).then((songs) => {
      this.cache.set(artistName, songs)
      return songs
    })
  },

  songLyrics (artistName, songTitle) {
    const query = combine(artistName, songTitle)
    return genius.search(query).then((hits) => {
      return hits[0].result
    }).then((song) => {
      return genius.getLyrics(song.path).then((lyrics) => {
        song.lyrics = lyrics
        return song
      })
    }).then((song) => {
      this.cache.set(artistName, songTitle, song)
      return song
    })
  },

  get (artistName, songTitle) {
    const cached = this.cache.get(artistName, songTitle)
    if (cached) {
      return Promise.resolve(cached)
    }

    if (!songTitle) {
      return this.artistLyrics(artistName)
    }

    return this.songLyrics(artistName, songTitle)
  },

  clearCache () {
    this.cache = new SongCache()
  }
}
