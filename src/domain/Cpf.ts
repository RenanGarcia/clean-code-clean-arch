export default class Cpf {
  private value: string
  private MAX_LENGTH = 11
  private FACTOR_SECOND_DIGIT = 11
  private FACTOR_FIRST_DIGIT = 10

  constructor(cpf: string) {
    if (!this.validate(cpf)) throw new Error("Invalid CPF")
    this.value = cpf
  }

  private validate(cpf: string) {
    if (!cpf) return false
    const cleanedCpf = this.cleanCharacters(cpf)
    if (!this.isValidLength(cleanedCpf)) return false
    if (this.isAllDigitsEquals(cleanedCpf)) return false
    const digit1 = this.calculateDigit(cleanedCpf, this.FACTOR_FIRST_DIGIT)
    const digit2 = this.calculateDigit(cleanedCpf, this.FACTOR_SECOND_DIGIT)
    return this.extractDigit(cleanedCpf) == `${digit1}${digit2}`
  }

  private cleanCharacters(cpf: string) {
    return cpf.replace(/\D/g, "")
  }

  private isValidLength(cpf: string) {
    return cpf.length === this.MAX_LENGTH
  }

  private isAllDigitsEquals(cpf: string) {
    const [firstDigit] = cpf
    return cpf.split("").every((digit) => digit === firstDigit)
  }

  private calculateDigit(cpf: string, factor: number) {
    let total = 0
    for (const digit of cpf) {
      if (factor > 1) total += parseInt(digit, 10) * factor--
    }
    const remainder = total % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  private extractDigit(cpf: string) {
    return cpf.slice(-2)
  }

  getValue() {
    return this.value
  }
}
