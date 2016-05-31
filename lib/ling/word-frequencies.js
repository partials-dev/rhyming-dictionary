'use babel'

import escape from '../escape'

export default {
  Text: {
    contains (word) {
      return this.count(word) > 0
    },

    count (word) {
      const text = this.normalized()
      word = escape(word)
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      return (text.match(regex) || []).length
    },

    frequencies () {
      const freqs = {}
      this.terms().forEach((term) => {
        const word = term.normal
        const freq = this.count(word, document)
        freqs[word] = freq
      })
      return freqs
    }
  }
}
