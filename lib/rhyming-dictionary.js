'use babel'

import rhymes from './rhymes'
// import parseRhymeTypes from './parse-rhyme-types'

export default class RhymingDictionary {
  static fetchRhymes (target) {
    return rhymes.getRhymes(target).then(rhymeDescriptions => {
      return new RhymingDictionary(target, rhymeDescriptions)
    })
  }

  constructor (target, rhymeDescriptions) {
    this.target = target
    this.rhymeDescriptions = rhymeDescriptions
  }
  // getRhymeDescriptions (rhymeTypes) {
  //   rhymeTypes = parseRhymeTypes(rhymeTypes)
  //   let data = []
  //   rhymeTypes.forEach(type => {
  //     data = data.concat(this.rhymeDescriptions[type])
  //   })
  //   return data
  // }

  getSyllableGroups (rhymeTypes) {
    const groups = []
    const putIntoCorrectGroup = (rhymeDescription) => {
      const n = rhymeDescription.numSyllables
      if (!groups[n]) {
        groups[n] = []
      }
      groups[n].push(rhymeDescription.word)
    }
    this.rhymeDescriptions.forEach(putIntoCorrectGroup)
    return groups
  }
}
