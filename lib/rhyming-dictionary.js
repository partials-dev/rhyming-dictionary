'use babel'

import nlp from 'nlp_compromise'
import rhymes from 'nlp-rhymes-async'
nlp.plugin(rhymes)

export default class RhymingDictionary {
  static fetchRhymes (target) {
    return nlp.term(target).getRhymesAsync().then(rhymeDescriptions => {
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
