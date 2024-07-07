const MAX_LENGTH = 11
const FACTOR_FIRST_DIGIT = 10
const FACTOR_SECOND_DIGIT = 11

export function validateCpf(cpf: string) {
  if (!cpf) return false
  const cleanedCpf = cleanCharacters(cpf)
  if (!isValidLength(cleanedCpf)) return false
  if (isAllDigitsEquals(cleanedCpf)) return false
  const digit1 = calculateDigit(cleanedCpf, FACTOR_FIRST_DIGIT)
  const digit2 = calculateDigit(cleanedCpf, FACTOR_SECOND_DIGIT)
  return extractDigit(cleanedCpf) == `${digit1}${digit2}`
}

function cleanCharacters(cpf: string) {
  return cpf.replace(/\D/g, "")
}

function isValidLength(cpf: string) {
  return cpf.length === MAX_LENGTH
}

function isAllDigitsEquals(cpf: string) {
  const [firstDigit] = cpf
  return cpf.split("").every((digit) => digit === firstDigit)
}

function calculateDigit(cpf: string, factor: number) {
  let total = 0
  for (const digit of cpf) {
    if (factor > 1) total += parseInt(digit, 10) * factor--
  }
  const remainder = total % 11
  return remainder < 2 ? 0 : 11 - remainder
}

function extractDigit(cpf: string) {
  return cpf.slice(-2)
}
