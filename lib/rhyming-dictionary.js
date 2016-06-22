'use babel'

import rhymes from './rhymes'
import parseRhymeTypes from './parse-rhyme-types'

export default class RhymingDictionary {
  static fetchRhymes (target) {
    return rhymes.getRhymes(target).then(rhymeDescriptionsByType => {
      return new RhymingDictionary(target, rhymeDescriptionsByType)
    })
  }

  constructor (target, rhymeDescriptionsByType) {
    this.target = target
    this.rhymeDescriptionsByType = rhymeDescriptionsByType
  }

  getRhymeDescriptions (rhymeTypes) {
    rhymeTypes = parseRhymeTypes(rhymeTypes)
    let data = []
    rhymeTypes.forEach(type => {
      data = data.concat(this.rhymeDescriptionsByType[type])
    })
    return data
  }

  getSyllableGroups (rhymeTypes) {
    const groups = []
    const putIntoCorrectGroup = (rhymeDescription) => {
      const n = rhymeDescription.numSyllables
      if (!groups[n]) {
        groups[n] = []
      }
      groups[n].push(rhymeDescription.word)
    }
    this.getRhymeDescriptions(rhymeTypes).forEach(putIntoCorrectGroup)
    return groups
  }
}
