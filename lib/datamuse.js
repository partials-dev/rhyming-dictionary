'use babel'

import httpGet from 'get-promise'
const rhymeTypeIds = {
  perfect: 'rhy',
  near: 'nry'
}

export default {
  rhymeTypes: Object.keys(rhymeTypeIds),

  url (q) {
    return `https://api.datamuse.com/words?${q}`
  },

  get (text) {
    text = encodeURIComponent(text)
    const rhymesByType = {}
    const promises = this.rhymeTypes.map(type => {
      const id = rhymeTypeIds[type]
      const url = this.url(`rel_${id}=${text}`)
      return httpGet(url).then(result => {
        rhymesByType[type] = JSON.parse(result.data)
      })
    })

    return Promise.all(promises).then(() => rhymesByType)
  }
}
