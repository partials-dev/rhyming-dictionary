'use babel'

export default function conjoin (words) {
  var conjuncts
  if (words.length === 1) {
    conjuncts = words[0]
  } else if (words.length === 2) {
    conjuncts = `${words[0]} and ${words[1]}`
  } else {
    words.forEach((word, i) => {
      if (i === words.length - 1) {
        conjuncts += `, and ${word}`
      } else {
        conjuncts += `, ${word}`
      }
    })
  }
  return conjuncts
}
