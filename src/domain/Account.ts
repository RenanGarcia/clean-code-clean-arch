import crypto from "crypto"
import Cpf from "./Cpf"

export default class Account {
  private cpf: Cpf

  constructor(
    readonly accountId: string,
    readonly name: string,
    readonly email: string,
    cpf: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    readonly carPlate?: string,
  ) {
    if ((!isPassenger && !isDriver) || (isPassenger && isDriver))
      throw new Error("Account type is not defined")
    if (!name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name")
    if (!email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email")
    if (isDriver && !carPlate?.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error("Invalid car plate")
    this.cpf = new Cpf(cpf)
  }

  // Pattern: Static Fabric Method
  static create(
    name: string,
    email: string,
    cpf: string,
    isPassenger?: boolean,
    isDriver?: boolean,
    carPlate?: string,
  ) {
    return new Account(
      crypto.randomUUID(),
      name,
      email,
      cpf,
      !!isPassenger,
      !!isDriver,
      carPlate,
    )
  }

  getCpf() {
    return this.cpf.getValue()
  }
}
