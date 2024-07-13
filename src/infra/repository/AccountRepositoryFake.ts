import Account from "~/domain/Account"
import AccountRepository from "~/application/repository/AccountRepository"

export default class AccountRepositoryFake implements AccountRepository {
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
