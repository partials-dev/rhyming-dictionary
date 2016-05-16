'use babel'

export default function conjoin (...words) {
  var conjuncts = words[0]
  for (var i = 1; i < words.length; i++) {
    if (i === words.length - 1) {
      conjuncts += ' and '
    } else {
      conjuncts += ', '
    }
    conjuncts += `${words[i]}`
  }
  return conjuncts
}
