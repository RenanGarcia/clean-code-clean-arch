import pgp from "pg-promise"

export default interface AccountDAO {
  getAccountByEmail(email: string): Promise<any>
  getAccountById(accountId: string): Promise<any>
  saveAccount(account: any): Promise<any>
}

export class AccountDAODatabase implements AccountDAO {
  async getAccountByEmail(email: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app")
    const [account] = await connection.query(
      "select * from cccat17.account where email = $1",
      [email],
    )
    await connection.$pool.end()
    return account
  }

  async getAccountById(accountId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app")
    const [account] = await connection.query(
      "select * from cccat17.account where account_id = $1",
      [accountId],
    )
    await connection.$pool.end()
    return account
  }

  async saveAccount(account: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app")
    await connection.query(
      "insert into cccat17.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        account.account_id,
        account.name,
        account.email,
        account.cpf,
        account.car_plate,
        account.is_passenger,
        account.is_driver,
      ],
    )
    await connection.$pool.end()
  }
}

export class AccountDAOMemory implements AccountDAO {
  accounts: any[]

  constructor() {
    this.accounts = []
  }

  async getAccountByEmail(email: string) {
    return this.accounts.find((a) => a.email === email)
  }

  async getAccountById(accountId: string) {
    return this.accounts.find((a) => a.account_id === accountId)
  }

  async saveAccount(account: any) {
    this.accounts.push(account)
  }
}
