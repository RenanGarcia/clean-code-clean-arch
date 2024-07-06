import express from "express"
import AccountService from "./application"

export default class API {
  app: any
  accountService: AccountService

  constructor(accountService: AccountService) {
    this.app = express()
    this.app.use(express.json())
    this.accountService = accountService
  }

  build() {
    this.app.post("/signup", async (req: any, res: any) => {
      try {
        const createdAccount = await this.accountService.signup(req.body)
        return res.json(createdAccount)
      } catch (err: any) {
        return res.status(422).json({ message: err.message })
      }
    })

    this.app.get("/accounts/:accountId", async (req: any, res: any) => {
      try {
        const account = await this.accountService.getAccount(
          req.params.accountId,
        )
        return res.json(account)
      } catch (err: any) {
        return res.status(500).json({ message: err.message })
      }
    })
  }

  start() {
    this.app.listen(3000)
  }
}
