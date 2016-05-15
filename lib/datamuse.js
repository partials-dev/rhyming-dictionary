'use babel'

import httpGet from 'get-promise'
const rhymeTypeIds = {
  perfect: 'rhy',
  near: 'nry'
}

export default {
  url (q) {
    return `https://api.datamuse.com/words?${q}`
  },

  get (text, rhymeTypes = ['perfect']) {
    if (rhymeTypes && !Array.isArray(rhymeTypes)) {
      rhymeTypes = [rhymeTypes]
    }
    text = encodeURIComponent(text)

    const promises = rhymeTypes.map(type => {
      const id = rhymeTypeIds[type]
      const url = this.url(`rel_${id}=${text}`)
      return httpGet(url).then(result => JSON.parse(result.data))
    })

    return Promise.all(promises).then(wordLists => {
      // flatten wordLists; originally it's an array of arrays
      return [].concat.apply([], wordLists)
    })
  }
}
