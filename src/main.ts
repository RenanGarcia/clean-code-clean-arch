import { AccountRepositoryDatabase } from "./AccountRepository"
import Signup from "./Signup"
import GetAccount from "./GetAccount"
import { PgPromiseAdapter } from "./DatabaseConnection"
import API from "./API"

const connection = new PgPromiseAdapter()
const accountRepository = new AccountRepositoryDatabase(connection)
const signup = new Signup(accountRepository)
const getAccount = new GetAccount(accountRepository)
const api = new API(signup, getAccount)

api.build()
api.start()
