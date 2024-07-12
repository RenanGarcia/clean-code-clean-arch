import UseCase from "~/application/usecase/UseCase"
import AccountRepository from "~/application/repository/AccountRepository"

export default class GetAccount implements UseCase {
  accountRepository: AccountRepository

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository
  }

  async execute(accountId: any): Promise<Output> {
    const account = await this.accountRepository.getAccountById(accountId)
    return {
      accountId: account.accountId,
      name: account.getName(),
      email: account.getEmail(),
      cpf: account.getCpf(),
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
      carPlate: account.getCarPlate(),
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
