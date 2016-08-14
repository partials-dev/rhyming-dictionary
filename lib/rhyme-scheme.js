'use babel'

import nlp from 'nlp_compromise'
import rhymes from 'nlp-rhymes-async'
nlp.plugin(rhymes)

function enrich (term) {
  return term.getRhymesAsync().then(rhymes => {
    term.rhymes = rhymes
    return term
  })
}

function last (array) {
  const lastIndex = array.length - 1
  return array[lastIndex]
}

function terms (string) {
  nlp.text(string).terms()
}

function getLineEndings (lines) {
  return Promise.all(
    lines.map(line => enrich(last(terms(line))))
  )
}

function findMatches (lineEnding, allEndings) {

}

export default function analyzeRhymes (lines) {
  getLineEndings(lines).then(lineEndings => {
    lineEndings = lineEndings.map(lineEnding => findMatches(lineEnding, lineEndings))
  })

  return Promise.resolve([{
    lines: [0, 1, 2, 3, 4],
    colorClass: 'rhyme-scheme-green'
  }])
}
