'use babel'

import datamuse from './rhymes/datamuse'
export const validRhymeTypes = datamuse.rhymeTypes

function ensureIsArray (rhymeTypes) {
  if (rhymeTypes && !Array.isArray(rhymeTypes)) {
    rhymeTypes = [rhymeTypes]
  }
  return rhymeTypes
}

function downcase (rhymeTypes) {
  return rhymeTypes.map(type => type.toLowerCase())
}

function parseKeywordAll (rhymeTypes) {
  if (rhymeTypes[0] === 'all') {
    rhymeTypes = datamuse.rhymeTypes
  }
  return rhymeTypes
}

function throwIfUnknown (rhymeTypes) {
  rhymeTypes.forEach(type => {
    if (validRhymeTypes.indexOf(type) < 0) {
      throw new Error(`Unknown rhyme type ${type}`)
    }
  })
  return rhymeTypes
}

export default function parseRhymeTypes (rhymeTypes = ['perfect']) {
  rhymeTypes = ensureIsArray(rhymeTypes)
  rhymeTypes = downcase(rhymeTypes)
  rhymeTypes = parseKeywordAll(rhymeTypes)
  rhymeTypes = throwIfUnknown(rhymeTypes)
  return rhymeTypes
}
