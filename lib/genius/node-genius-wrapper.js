'use babel'

import NodeGenius from 'node-genius'
import scrape from 'scrape-url'
import auth from './auth'

export default {
  get client () {
    if (!this._clientPromise) {
      this._clientPromise = auth.authenticate().then((authCode) => {
        return new NodeGenius(authCode)
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

  wrap (func) {
    return this.client.then((client) => {
      return new Promise((resolve, reject) => {
        func(client, resolve, reject)
      })
    })
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

  getLyrics (songPath) {
    return new Promise((resolve, reject) => {
      scrape(`http://genius.com${songPath}`, '.lyrics', (err, lyricsElements) => {
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
              return this.getLyrics(song.path).then((lyrics) => {
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
  }
}
