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
      return client.getPlaylist(...args).catch((err) => {
        if (err.message === 'The access token expired') {
          return this.refreshAccessToken()
        } else {
          throw err
        }
      }).then(() => {
        return client.getPlaylist(...args)
      })
    })
  },

  refreshAccessToken () {
    return this.client.then((client) => {
      return client.refreshAccessToken().then((data) => {
        const credentials = client.getCredentials()
        credentials.accessToken = data.body.access_token
        client.setCredentials(credentials)
      })
    })
  }
}
