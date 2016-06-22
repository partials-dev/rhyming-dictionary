'use babel'

import * as get from 'get-promise'

const rhymeTypeIds = {
  perfect: 'rhy',
  near: 'nry'
}

function getDatamuseUrl (q) {
  return `https://api.datamuse.com/words?${q}`
}

const api = {
  rhymeTypes: Object.keys(rhymeTypeIds),

  getRhymes (word) {
    return this.getRhymesByType(word).then(rhymesByType => {
      var rhymes = []
      Object.keys(rhymesByType).forEach(key => {
        rhymes = rhymes.concat(rhymesByType[key])
      })
      return rhymes
    })
  },
  getRhymesByType (word) {
    word = encodeURIComponent(word)
    const rhymesByType = {}
    const promises = this.rhymeTypes.map(type => {
      const id = rhymeTypeIds[type]
      const url = getDatamuseUrl(`rel_${id}=${word}`)
      return get.default(url).then(result => {
        rhymesByType[type] = JSON.parse(result.data)
      }).catch((err) => { throw err })
    })

    return Promise.all(promises).then(() => rhymesByType)
  }
}

if (atom.inSpecMode()) {
  const __testonly__ = {
    get,
    rhymeTypeIds
  }

  api.__testonly__ = __testonly__
}

export default api
