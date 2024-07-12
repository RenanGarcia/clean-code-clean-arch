import crypto from "crypto"

import Cpf from "~/domain/Cpf"
import Name from "~/domain/Name"
import Email from "~/domain/Email"
import CarPlate from "~/domain/CarPlate"

export default class Account {
  private name: Name
  private cpf: Cpf
  private email: Email
  private carPlate: CarPlate

  constructor(
    readonly accountId: string,
    name: string,
    email: string,
    cpf: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    carPlate?: string,
  ) {
    if ((!isPassenger && !isDriver) || (isPassenger && isDriver))
      throw new Error("Account type is not defined")
    this.name = new Name(name)
    this.cpf = new Cpf(cpf)
    this.email = new Email(email)
    this.carPlate = new CarPlate(carPlate)
    if (isDriver && !this.carPlate.isValid()) {
      throw new Error("Driver must have a valid car plate")
    }
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

  getName() {
    return this.name.getValue()
  }

  getCpf() {
    return this.cpf.getValue()
  }

  getEmail() {
    return this.email.getValue()
  }

  getCarPlate() {
    return this.carPlate.getValue()
  }
}
