'use babel'

function conjunction (isLastWord) {
  if (isLastWord) {
    return ' and '
  } else {
    return ', '
  }
}

export default function conjoin (...words) {
  var conjuncts = words[0]
  for (var i = 1; i < words.length; i++) {
    const isLastWord = i === words.length - 1
    conjuncts += conjunction(isLastWord)
    conjuncts += `${words[i]}`
  }
  return conjuncts
}
