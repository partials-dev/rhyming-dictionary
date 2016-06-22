'use babel'

import scrape from 'scrape-url'
import wordnik from './wordnik'
import nlp from 'nlp_compromise'
import nlpSyllables from 'nlp-syllables'
nlp.plugin(nlpSyllables)

const api = {
  getRhymes (word) {
    return new Promise((resolve, reject) => {
      scrape(`http://www.b-rhymes.com/rhyme/word/${word}`, '.rhyme-table .word', (err, elts) => {
        if (err) {
          reject(err)
        } else {
          const words = elts.map((elt) => elt.text().trim())
          this.enrich(words).then(rhymeDescriptions => {
            resolve(rhymeDescriptions)
          })
        }
      })
    })
  },

  enrich (words) {
    const syllablePromises = words.map(word => {
      return wordnik.getSyllables(word).then(result => {
        const syllables = JSON.parse(result.data)
        var numSyllables = syllables.length
        if (numSyllables === 0) {
          // if wordnik doesn't know, take a guess
          numSyllables = nlp.term(word).syllables().length
        }
        return {
          word,
          numSyllables
        }
      })
    })
    return Promise.all(syllablePromises)
  }
}

export default api
