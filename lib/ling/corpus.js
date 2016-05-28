'use babel'

import frequencies from './word-frequencies'

class Corpus {
  constructor (documents, nlp) {
    this.nlp = nlp
    this.texts = documents.map((doc) => nlp.text(doc))
  }

  countDocuments (word) {
    return this.texts.reduce((n, text) => {
      if (text.contains(word)) {
        return n + 1
      } else {
        return n
      }
    }, 0)
  }

  terms () {
    return this.texts.map((text) => text.terms())
  }
}

export default function (nlp) {
  nlp.plugin(frequencies)
  nlp.corpus = (documents) => {
    return new Corpus(documents, nlp)
  }
  return {}
}
