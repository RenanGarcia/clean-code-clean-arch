import AccountDAO from "./resource"
import UseCase from "./UseCase"

export default class GetAccount implements UseCase {
  accountDAO: AccountDAO

  constructor(accountDAO: AccountDAO) {
    this.accountDAO = accountDAO
  }

  async execute(accountId: any): Promise<any> {
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
