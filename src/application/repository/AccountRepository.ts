import Account from "~/domain/Account"

export default interface AccountRepository {
  getAccountByEmail(email: string): Promise<Account | undefined>
  getAccountById(accountId: string): Promise<Account>
  saveAccount(account: Account): Promise<void>
}
