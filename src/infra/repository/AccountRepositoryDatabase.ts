import Account from "~/domain/entity/Account"
import AccountRepository from "~/application/repository/AccountRepository"
import DatabaseConnection from "~/infra/database/DatabaseConnection"
import { createSQLInsertFields } from "~/utils"

export default class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async getAccountByEmail(email: string) {
    const [accountData] = await this.connection.query(
      "select * from cccat17.account where email = $1",
      [email],
    )
    if (!accountData) return
    return new Account({
      accountId: accountData.account_id,
      name: accountData.name,
      email: accountData.email,
      cpf: accountData.cpf,
      isPassenger: accountData.is_passenger,
      isDriver: accountData.is_driver,
      carPlate: accountData.car_plate,
    })
  }

  async getAccountById(accountId: string) {
    const [accountData] = await this.connection.query(
      "select * from cccat17.account where account_id = $1",
      [accountId],
    )
    if (!accountData) throw new Error("Account not found")
    return new Account({
      accountId: accountData.account_id,
      name: accountData.name,
      email: accountData.email,
      cpf: accountData.cpf,
      isPassenger: accountData.is_passenger,
      isDriver: accountData.is_driver,
      carPlate: accountData.car_plate,
    })
  }

  async saveAccount(account: Account) {
    const fields = createSQLInsertFields([
      "account_id",
      "name",
      "email",
      "cpf",
      "is_passenger",
      "is_driver",
      "car_plate",
    ])
    await this.connection.query(
      `insert into cccat17.account (${fields.names}) values (${fields.values})`,
      [
        account.accountId,
        account.getName(),
        account.getEmail(),
        account.getCpf(),
        account.isPassenger,
        account.isDriver,
        account.getCarPlate(),
      ],
    )
  }
}
