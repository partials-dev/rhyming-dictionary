'use babel'

import Genius from 'node-genius'
import auth from './auth'
import scrape from 'scrape-url'
import PersistentCache from './persistent-cache'

export default {
  activate (state) {
    if (!state) state = {}
    this.cache = new PersistentCache(state.cache)
  },
  get client () {
    if (!this._clientPromise) {
      this._clientPromise = auth.authenticate().then((authCode) => {
        return new Genius(authCode)
      })
    }
    return this._clientPromise
  },
  set client (newClient) {
    this._client = newClient
  },
  deauthenticate () {
    this.client = null
  },
  serialize () {
    return {
      cache: this.cache.serialize()
    }
  },
  search (query) {
    return this.client.then((client) => {
      return new Promise((resolve, reject) => {
        client.search(query, (err, results) => {
          if (err) {
            reject(err)
          } else {
            results = JSON.parse(results)
            resolve(results.response.hits)
          }
        })
      })
    })
  },
  getLyrics (songApiPath) {
    return new Promise((resolve, reject) => {
      scrape(`http://genius.com${songApiPath}`, '.lyrics', (err, lyricsElements) => {
        if (err) {
          reject(err)
        } else {
          const elt = lyricsElements[0]
          resolve(elt.text())
        }
      })
    })
  },
  getArtistSongs (artistId, page = 1, songPromisesSoFar = []) {
    return this.client.then((client) => {
      return new Promise((resolve, reject) => {
        client.getArtistSongs(artistId, { page: page }, (err, data) => {
          if (err) {
            reject(err)
          } else {
            const parsed = JSON.parse(data)
            const response = parsed.response
            const promises = response.songs.map((song) => {
              return this.getLyrics(song.api_path).then((lyrics) => {
                song.lyrics = lyrics
                return song
              })
            })
            songPromisesSoFar = songPromisesSoFar.concat(promises)
            if (parsed.response.next_page) {
              resolve(this.getArtistSongs(artistId, response.next_page, songPromisesSoFar))
            } else {
              resolve(Promise.all(songPromisesSoFar))
            }
          }
        })
      })
    })
  },
  artistLyrics (name) {
    if (this.cache.get(name)) {
      return Promise.resolve(this.cache.get(name))
    }

    return this.search(name).then((hits) => {
      return hits[0].result.primary_artist.id
    }).then((artistId) => {
      return this.getArtistSongs(artistId)
    }).then((songs) => {
      this.cache.set(name, songs)
      return songs
    })
  },
  clearCache () {
    this.cache = new PersistentCache()
  }
}
