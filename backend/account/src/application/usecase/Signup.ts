import Account from "~/domain/entity/Account"
import UseCase from "~/application/usecase/UseCase"
import AccountRepository from "~/application/repository/AccountRepository"
import MailerGateway from "~/application/gateway/MailerGateway"
import MailerGatewayFake from "~/infra/gateway/MailerGatewayFake"

export default class Signup implements UseCase {
  accountRepository: AccountRepository
  mailerGateway: MailerGateway

  constructor(
    accountRepository: AccountRepository,
    mailerGateway: MailerGateway = new MailerGatewayFake(),
  ) {
    this.accountRepository = accountRepository
    this.mailerGateway = mailerGateway
  }

  async execute(input: Input): Promise<Output> {
    const existingAccount = await this.accountRepository.getAccountByEmail(
      input.email,
    )
    if (existingAccount) throw new Error("Account already exists")
    const account = Account.create(input)
    await this.accountRepository.saveAccount(account)
    await this.mailerGateway.send(account.getEmail(), "Bem-vindo!", "")
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
