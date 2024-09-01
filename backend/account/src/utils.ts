export function reduceArrayToCsv<T>(values: Array<T>, useQuotes?: boolean) {
  if (useQuotes) {
    return values.reduce((acc, value, index) => {
      return `${acc}${index > 0 ? ", " : ""}'${value}'`
    }, "")
  } else {
    return values.reduce((acc, value, index) => {
      return `${acc}${index > 0 ? ", " : ""}${value}`
    }, "")
  }
}

export function createSQLInsertFields(fieldsNames: Array<string>) {
  return {
    names: reduceArrayToCsv(fieldsNames),
    values: reduceArrayToCsv(fieldsNames.map((_, index) => `$${index + 1}`)),
  }
}
