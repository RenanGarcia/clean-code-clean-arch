import express from "express"
import AccountService from "./application"
import { AccountDAODatabase } from "./resource"

const app = express()
app.use(express.json())

const accountDAO = new AccountDAODatabase()
const accountService = new AccountService(accountDAO)

app.post("/signup", async function (req, res) {
  try {
    const createdAccount = await accountService.signup(req.body)
    return res.json(createdAccount)
  } catch (err) {
    return res.status(422).json({ message: err.message })
  }
})

app.get("/accounts/:accountId", async function (req, res) {
  try {
    const account = await accountService.getAccount(req.params.accountId)
    return res.json(account)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

app.listen(3000)
