import Signup from "./Signup"
import GetAccount from "./GetAccount"
import AccountController from "./AccountController"
import { ExpressServerAdpter, HapiServerAdpter } from "./HttpServer"
import { PgPromiseAdapter } from "./DatabaseConnection"
import { AccountRepositoryDatabase } from "./AccountRepository"

const connection = new PgPromiseAdapter()
const accountRepository = new AccountRepositoryDatabase(connection)
const signup = new Signup(accountRepository)
const getAccount = new GetAccount(accountRepository)
const httpServer = new ExpressServerAdpter()
// const httpServer = new HapiServerAdpter()
new AccountController(httpServer, signup, getAccount)

httpServer.listen(3000)
