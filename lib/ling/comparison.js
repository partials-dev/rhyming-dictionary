'use babel'

import corpus from './corpus'
import nlp from 'nlp_compromise'
nlp.plugin(corpus)

class Comparison {
  constructor (foreground, background) {
    if (!(foreground.constructor.name === 'Text')) {
      foreground = nlp.text(foreground)
    }
    if (!(background.constructor.name === 'Corpus')) {
      background = nlp.corpus(background)
    }
    this.foreground = foreground
    this.background = background
  }

  term (word) {
    const tf = this.foreground.count(word)
    const df = this.background.countDocuments(word)
    return tf / (1 + df)
  }

  terms () {
    const termComparisons = {}
    this.foreground.terms().forEach((term) => {
      const word = term.normal
      const tfidf = this.term(word)
      termComparisons[word] = tfidf
    })
    return termComparisons
  }
}

export default {
  Text: {
    compare (corpus) {
      return new Comparison(this, corpus)
    }
  }
}
