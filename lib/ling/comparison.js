'use babel'

import corpus from './corpus'
import nlp from 'nlp_compromise'
nlp.plugin(corpus)

class Terms extends Array {
  regularDistribution (options) {
    const samples = options.samples
    const min = options.min
    const max = options.max
    var inclusive = options.inclusive
    if (inclusive == null) {
      inclusive = true
    }

    const width = max - min
    const addValue = (i) => {
      return Math.round(min + (width * (i / samples)))
    }

    var range = []
    if (inclusive) {
      for (var j = 0; j <= samples; j++) { range.push(j) }
    } else {
      for (var k = 0; k < samples; k++) { range.push(k) }
    }

    return range.map(addValue)
  }

  sortByWeight () {
    const compareWeight = (termA, termB) => {
      if (termA.weight < termB.weight) {
        return -1
      } else if (termA.weight > termB.weight) {
        return 1
      }
      return 0
    }

    this.sort(compareWeight)
  }

  clusters () {
    const clusters = this.slice()
    const isInRange = (min, max) => {
      return ({weight}) => {
        return weight >= min && weight < max
      }
    }
    clusters.filter(isInRange(0.75, Infinity)).forEach((term) => {
      term.weightCategory = 'high'
    })
    clusters.filter(isInRange(0.5, 0.75)).forEach((term) => {
      term.weightCategory = 'medium'
    })
    clusters.filter(isInRange(0.25, 0.5)).forEach((term) => {
      term.weightCategory = 'low'
    })
    clusters.filter(isInRange(0, 0.25)).forEach((term) => {
      term.weightCategory = 'lowest'
    })
    return clusters
  }
}

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

  weight (word) {
    const tf = this.foreground.count(word)
    const df = this.background.countDocuments(word)
    return tf / (1 + df)
  }

  term (word) {
    return this.weight(word)
  }

  terms () {
    const terms = new Terms()
    this.foreground.terms().forEach((term) => {
      const word = term.normal
      const weight = this.weight(word)
      terms.push({word, weight})
    })
    return terms
  }
}

export default {
  Text: {
    compare (corpus) {
      return new Comparison(this, corpus)
    }
  }
}
