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

  async execute(input: Input): Promise<Output> {
    const existingAccount = await this.accountRepository.getAccountByEmail(
      input.email,
    )
    if (existingAccount) throw new Error("Account already exists")
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.isPassenger,
      input.isDriver,
      input.carPlate,
    )
    await this.accountRepository.saveAccount(account)
    await this.mailerGateway.send(account.email, "Bem-vindo!", "")
    return { accountId: account.accountId }
  }
}

type Input = {
  name: string
  email: string
  cpf: string
  isPassenger?: boolean
  isDriver?: boolean
  carPlate?: string
}
type Output = {
  accountId: string
}
