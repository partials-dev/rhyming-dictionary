'use babel'

import scrape from 'scrape-url'

const api = {
  rhymes (word) {
    return new Promise((resolve, reject) => {
      scrape(`http://www.b-rhymes.com/rhyme/word/${word}`, '.rhyme-table .word', (err, elts) => {
        if (err) {
          reject(err)
        } else {
          const words = elts.map((elt) => elt.text().trim())
          resolve(words)
        }
      })
    })
  }
}

export default api
