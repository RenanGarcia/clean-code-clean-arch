import express from "express"
import { getAccount, signup } from "./application"

const app = express()
app.use(express.json())

app.post("/signup", async function (req, res) {
  try {
    const createdAccount = await signup(req.body)
    return res.json(createdAccount)
  } catch (err) {
    return res.status(422).json({ message: err.message })
  }
})

app.get("/accounts/:accountId", async function (req, res) {
  try {
    const account = await getAccount(req.params.accountId)
    return res.json(account)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

app.listen(3000)
