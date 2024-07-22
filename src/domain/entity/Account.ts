import crypto from "crypto"

import Cpf from "~/domain/vo/Cpf"
import Name from "~/domain/vo/Name"
import Email from "~/domain/vo/Email"
import CarPlate from "~/domain/vo/CarPlate"

export type AccountProps = {
  accountId?: string
  name: string
  email: string
  cpf: string
  carPlate?: string
  isPassenger?: boolean
  isDriver?: boolean
}

export type MandatoryAccountProps = AccountProps & {
  isPassenger: boolean
  isDriver: boolean
  accountId: string
}

/**
 * Entity Account
 * Aggregate root Account that contains:
 *   - Name
 *   - Cpf
 *   - Email
 *   - CarPlate
 */
export default class Account {
  readonly accountId: string
  private name: Name
  private cpf: Cpf
  private email: Email
  private carPlate?: CarPlate
  readonly isPassenger: boolean
  readonly isDriver: boolean

  constructor({
    accountId,
    name,
    email,
    cpf,
    isPassenger,
    isDriver,
    carPlate,
  }: MandatoryAccountProps) {
    if ((!isPassenger && !isDriver) || (isPassenger && isDriver))
      throw new Error("Account type is not defined")
    this.name = new Name(name)
    this.cpf = new Cpf(cpf)
    this.email = new Email(email)
    if (isDriver) {
      this.carPlate = new CarPlate(carPlate)
    }
    this.accountId = accountId
    this.isPassenger = !!isPassenger
    this.isDriver = !!isDriver
  }

  // Pattern: Static Fabric Method
  static create(props: AccountProps) {
    return new Account({
      ...props,
      accountId: crypto.randomUUID(),
      isPassenger: !!props.isPassenger,
      isDriver: !!props.isDriver,
    })
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
    return this.carPlate?.getValue()
  }
}
