'use babel'

import escape from './escape'

export default function highlight (words) {
  const editor = atom.workspace.getActiveTextEditor()
  words.forEach((word) => {
    const strength = word.strength
    const regex = new RegExp(`\\b${escape(word.word)}\\b`, 'gi')
    editor.scan(regex, (hit) => {
      console.log('got a hit')
      const marker = editor.markBufferRange(hit.range)
      editor.decorateMarker(marker, { type: 'highlight', class: `${strength}-strength` })
    })
  })
}
