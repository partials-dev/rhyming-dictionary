'use babel'

import SpotifyClient from 'spotify-web-api-node'
import auth from '../auth'

export default {
  get client () {
    if (!this._clientPromise) {
      this._clientPromise = auth.services.spotify.authenticate().then((credentials) => {
        const client = new SpotifyClient()
        client.setCredentials(credentials)
        return client
      })
    }
    return this._clientPromise
  },

  set client (newClient) {
    this._spotifyClient = newClient
  },

  getPlaylist (...args) {
    return this.client.then((client) => {
      return client.getPlaylist(...args)
    })
  }
}
