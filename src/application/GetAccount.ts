import UseCase from "~/application/UseCase"
import AccountRepository from "~/infra/AccountRepository"

export default class GetAccount implements UseCase {
  accountRepository: AccountRepository

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository
  }

  async execute(accountId: any): Promise<Output> {
    const account = await this.accountRepository.getAccountById(accountId)
    return {
      accountId: account.accountId,
      name: account.name,
      email: account.email,
      cpf: account.getCpf(),
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
      carPlate: account.carPlate,
    }
  }
}

type Output = {
  accountId: string
  name: string
  email: string
  cpf: string
  isPassenger: boolean
  isDriver: boolean
  carPlate?: string
}
