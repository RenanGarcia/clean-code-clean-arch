import crypto from "crypto"
import { validateCpf } from "./validateCpf"
import AccountDAO from "./resource"

export default interface AccountService {
  signup(input: any): Promise<any>
  getAccount(accountId: any): Promise<any>
}
export class AccountServiceProduction implements AccountService {
  accountDAO: AccountDAO

  constructor(accountDAO: AccountDAO) {
    this.accountDAO = accountDAO
  }

  async signup(input: any): Promise<any> {
    const account = {
      account_id: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      car_plate: input.carPlate,
      is_passenger: !!input.isPassenger,
      is_driver: !!input.isDriver,
    }
    const existingAccount = await this.accountDAO.getAccountByEmail(
      account.email,
    )
    if (existingAccount) throw new Error("Account already exists")
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name")
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email")
    if (!validateCpf(input.cpf)) throw new Error("Invalid CPF")
    if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error("Invalid car plate")
    await this.accountDAO.saveAccount(account)
    return { accountId: account.account_id }
  }

  async getAccount(accountId: any): Promise<any> {
    const account = await this.accountDAO.getAccountById(accountId)
    return {
      accountId: account.account_id,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      isPassenger: account.is_passenger,
      isDriver: account.is_driver,
      carPlate: account.car_plate,
    }
  }
}
