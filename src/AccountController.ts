import express from "express"
import Signup from "./Signup"
import GetAccount from "./GetAccount"

export default class API {
  app: any

  constructor(
    readonly signup: Signup,
    readonly getAccount: GetAccount,
  ) {
    this.app = express()
    this.app.use(express.json())
  }

  build() {
    this.app.post("/signup", async (req: any, res: any) => {
      try {
        const createdAccount = await this.signup.execute(req.body)
        return res.json(createdAccount)
      } catch (err: any) {
        return res.status(422).json({ message: err.message })
      }
    })

    this.app.get("/accounts/:accountId", async (req: any, res: any) => {
      try {
        const account = await this.getAccount.execute(req.params.accountId)
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
