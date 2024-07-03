import API from "./driver"
import { AccountDAODatabase } from "./resource"
import Signup from "./Signup"
import GetAccount from "./GetAccount"

const accountDAO = new AccountDAODatabase()
const signup = new Signup(accountDAO)
const getAccount = new GetAccount(accountDAO)
const api = new API(signup, getAccount)

api.build()
api.start()
