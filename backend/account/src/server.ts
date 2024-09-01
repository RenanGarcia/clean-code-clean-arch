import Signup from "~/application/usecase/Signup"
import GetAccount from "~/application/usecase/GetAccount"
import Registry from "~/infra/di/Registry"
import AccountController from "~/infra/controller/AccountController"
import ExpressServerAdapter from "~/infra/http/ExpressServerAdapter"
import PgPromiseAdapter from "~/infra/database/PgPromiseAdapter"
import AccountRepositoryDatabase from "~/infra/repository/AccountRepositoryDatabase"

export const databaseConnection = new PgPromiseAdapter()
export const httpServer = new ExpressServerAdapter()

const accountRepository = new AccountRepositoryDatabase(databaseConnection)
const signup = new Signup(accountRepository)
const getAccount = new GetAccount(accountRepository)

Registry.getInstance().provide("httpServer", httpServer)
Registry.getInstance().provide("signup", signup)
Registry.getInstance().provide("getAccount", getAccount)
new AccountController()
