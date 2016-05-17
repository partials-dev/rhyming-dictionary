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

  getRhymes (text) {
    text = encodeURIComponent(text)
    const rhymesByType = {}
    const promises = this.rhymeTypes.map(type => {
      const id = rhymeTypeIds[type]
      const url = getDatamuseUrl(`rel_${id}=${text}`)
      return get.default(url).then(result => {
        rhymesByType[type] = JSON.parse(result.data)
      }).catch((err) => { throw err })
    })

    return Promise.all(promises).then(() => rhymesByType)
  }
}

const __testonly__ = {
  get,
  rhymeTypeIds
}

if (atom.inSpecMode()) {
  api.__testonly__ = __testonly__
}

export default api
