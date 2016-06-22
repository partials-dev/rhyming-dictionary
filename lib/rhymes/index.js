'use babel'

import datamuse from './datamuse'
import bRhymes from './b-rhymes'
import _ from 'lodash'

const api = {
  getRhymes (word) {
    // each promise will resolve to a rhyme list from its source
    const rhymeListPromises = [datamuse, bRhymes].map(source => source.getRhymes(word))
    // wait on all the promises
    return Promise.all(rhymeListPromises).then(rhymeLists => {
      // concatenate all lists into a single array
      const rhymeDescriptions = rhymeLists.reduce((allRhymes, rhymeList) => allRhymes.concat(rhymeList))
      // remove duplicates
      const uniqueRhymeDescriptions = _.uniqBy(rhymeDescriptions, 'word')
      return uniqueRhymeDescriptions
    })
  }
}

export default api
