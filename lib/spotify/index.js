'use babel'

import spotify from './spotify-api-wrapper'

export default {
  playlist (userId, playlistId) {
    const extractArtistAndSongTitles = (data) => {
      return data.body.tracks.items.map((item) => {
        const track = item.track
        return {
          artist: track.artists[0].name,
          title: track.name
        }
      })
    }

    return spotify.getPlaylist(userId, playlistId).then(extractArtistAndSongTitles)
  }
}
