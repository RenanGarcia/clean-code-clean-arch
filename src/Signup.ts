import crypto from "crypto"
import { validateCpf } from "./validateCpf"
import AccountDAO from "./resource"
import UseCase from "./UseCase"
import MailerGateway from "./MailerGateway"

export default class Signup implements UseCase {
  accountDAO: AccountDAO
  mailerGateway: MailerGateway

  constructor(accountDAO: AccountDAO) {
    this.accountDAO = accountDAO
    this.mailerGateway = new MailerGateway()
  }

  async execute(input: any): Promise<any> {
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
    await this.mailerGateway.send(account.email, "Bem-vindo!", "")
    return { accountId: account.account_id }
  }
}
