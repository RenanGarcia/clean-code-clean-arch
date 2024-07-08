import Signup from "~/application/Signup"
import GetAccount from "~/application/GetAccount"
import AccountController from "~/application/AccountController"
import { ExpressServerAdpter } from "~/infra/HttpServer"
import { PgPromiseAdapter } from "~/infra/DatabaseConnection"
import { AccountRepositoryDatabase } from "~/infra/AccountRepository"

const connection = new PgPromiseAdapter()
const accountRepository = new AccountRepositoryDatabase(connection)
const signup = new Signup(accountRepository)
const getAccount = new GetAccount(accountRepository)
const httpServer = new ExpressServerAdpter()
new AccountController(httpServer, signup, getAccount)

httpServer.listen(3000)
