import pgp from "pg-promise"
import Account from "./Account"

export default interface AccountRepository {
  getAccountByEmail(email: string): Promise<Account | undefined>
  getAccountById(accountId: string): Promise<Account>
  saveAccount(account: Account): Promise<void>
}

export class AccountRepositoryDatabase implements AccountRepository {
  async getAccountByEmail(email: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app")
    const [accountData] = await connection.query(
      "select * from cccat17.account where email = $1",
      [email],
    )
    await connection.$pool.end()
    if (!accountData) return
    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.car_plate,
      accountData.is_passenger,
      accountData.is_driver,
    )
  }

  async getAccountById(accountId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app")
    const [accountData] = await connection.query(
      "select * from cccat17.account where account_id = $1",
      [accountId],
    )
    await connection.$pool.end()
    if (!accountData) throw new Error("Account not found")
    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.car_plate,
      accountData.is_passenger,
      accountData.is_driver,
    )
  }

  async saveAccount(account: Account) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app")
    await connection.query(
      "insert into cccat17.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        account.accountId,
        account.name,
        account.email,
        account.getCpf(),
        account.carPlate,
        account.isPassenger,
        account.isDriver,
      ],
    )
    await connection.$pool.end()
  }
}

export class AccountRepositoryMemory implements AccountRepository {
  accounts: Account[]

  constructor() {
    this.accounts = []
  }

  async getAccountByEmail(email: string) {
    return this.accounts.find((a) => a.email === email)
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
