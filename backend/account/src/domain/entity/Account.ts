import crypto from "crypto"

import Cpf from "~/domain/vo/Cpf"
import Name from "~/domain/vo/Name"
import Email from "~/domain/vo/Email"
import CarPlate from "~/domain/vo/CarPlate"
import Password, { PasswordFactory } from "~/domain/vo/Password"

export type AccountProps = {
  accountId?: string
  name: string
  email: string
  cpf: string
  carPlate?: string
  isPassenger?: boolean
  isDriver?: boolean
  password?: string
  passwordType?: string
}

export type MandatoryAccountProps = AccountProps & {
  isPassenger: boolean
  isDriver: boolean
  accountId: string
  password: string
  passwordType: string
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
  private password: Password
  readonly passwordType: string

  constructor({
    accountId,
    name,
    email,
    cpf,
    isPassenger,
    isDriver,
    carPlate,
    password,
    passwordType,
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
    this.password = PasswordFactory.create(password, passwordType)
    this.passwordType = passwordType
  }

  // Pattern: Static Fabric Method
  static create(props: AccountProps) {
    return new Account({
      ...props,
      accountId: crypto.randomUUID(),
      isPassenger: !!props.isPassenger,
      isDriver: !!props.isDriver,
      password: props.password || "to_be_reseted",
      passwordType: props.passwordType || "plain",
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

  getPassword() {
    return this.password.value
  }

  verifyPassword(password: string) {
    return this.password.verify(password)
  }
}
