'use babel'

import escape from './regex-escape'

function highlightWord (word) {
  const editor = atom.workspace.getActiveTextEditor()
  const strength = word.strength
  const regex = new RegExp(`\\b${escape(word.word)}\\b`, 'gi')
  editor.scan(regex, (hit) => {
    console.log('got a hit')
    const marker = editor.markBufferRange(hit.range)
    editor.decorateMarker(marker, { type: 'highlight', class: `${strength}-strength` })
  })
}

export default function highlight (words) {
  words.forEach(highlightWord)
}
