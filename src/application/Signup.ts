import Account from "~/domain/Account"
import UseCase from "~/application/UseCase"
import MailerGateway from "~/infra/MailerGateway"
import AccountRepository from "~/infra/AccountRepository"

export default class Signup implements UseCase {
  accountRepository: AccountRepository
  mailerGateway: MailerGateway

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository
    this.mailerGateway = new MailerGateway()
  }

  async execute(input: any): Promise<any> {
    const existingAccount = await this.accountRepository.getAccountByEmail(
      input.email,
    )
    if (existingAccount) throw new Error("Account already exists")
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.carPlate,
      input.isPassenger,
      input.isDriver,
    )
    await this.accountRepository.saveAccount(account)
    await this.mailerGateway.send(account.email, "Bem-vindo!", "")
    return { accountId: account.accountId }
  }
}