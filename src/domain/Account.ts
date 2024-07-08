import crypto from "crypto"
import Cpf from "./Cpf"

export default class Account {
  private cpf: Cpf

  constructor(
    readonly accountId: string,
    readonly name: string,
    readonly email: string,
    cpf: string,
    readonly carPlate: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
  ) {
    if (!name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name")
    if (!email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email")
    if (isDriver && !carPlate.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error("Invalid car plate")
    this.cpf = new Cpf(cpf)
  }

  // Pattern: Static Fabric Method
  static create(
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
  ) {
    return new Account(
      crypto.randomUUID(),
      name,
      email,
      cpf,
      carPlate,
      !!isPassenger,
      !!isDriver,
    )
  }

  getCpf() {
    return this.cpf.getValue()
  }
}
