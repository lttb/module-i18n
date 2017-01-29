const nPluralRegexp = new RegExp('[?:]\\s*(\\d)+', 'g')


export default ({ arity, plural, pluralArr }) => {
  if (arity === 1) {
    return pluralArr[0]
  } else if (arity === 2) {
    return plural.concat(`? '${pluralArr[1]}' : '${pluralArr[0]}' `)
  }

  return `(${plural.replace(nPluralRegexp, (ternary, val) =>
    ternary.replace(val, `'${pluralArr[val]}'`))})`
}
