import Account from "~/domain/Account"
import AccountRepository from "~/application/repository/AccountRepository"
import DatabaseConnection from "~/infra/database/DatabaseConnection"

export class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async getAccountByEmail(email: string) {
    const [accountData] = await this.connection.query(
      "select * from cccat17.account where email = $1",
      [email],
    )
    if (!accountData) return
    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.is_passenger,
      accountData.is_driver,
      accountData.car_plate,
    )
  }

  async getAccountById(accountId: string) {
    const [accountData] = await this.connection.query(
      "select * from cccat17.account where account_id = $1",
      [accountId],
    )
    if (!accountData) throw new Error("Account not found")
    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.is_passenger,
      accountData.is_driver,
      accountData.car_plate,
    )
  }

  async saveAccount(account: Account) {
    await this.connection.query(
      "insert into cccat17.account (account_id, name, email, cpf, is_passenger, is_driver, car_plate) values ($1, $2, $3, $4, $5, $6, $7)",
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

export class AccountRepositoryMemory implements AccountRepository {
  accounts: Account[]

  constructor() {
    this.accounts = []
  }

  async getAccountByEmail(email: string) {
    return this.accounts.find((a) => a.getEmail() === email)
  }

  async getAccountById(accountId: string) {
    const account = this.accounts.find((a) => a.accountId === accountId)
    if (!account) throw new Error("Account not found")
    return account
  }

  async saveAccount(account: Account) {
    this.accounts.push(account)
  }
}