import API from "./driver"
import { AccountServiceProduction } from "./application"
import { AccountDAODatabase } from "./resource"

const accountDAO = new AccountDAODatabase()
const accountService = new AccountServiceProduction(accountDAO)
const api = new API(accountService)
api.build()
api.start()
