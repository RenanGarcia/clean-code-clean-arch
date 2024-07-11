import Signup from "~/application/Signup"
import GetAccount from "~/application/GetAccount"
import RequestRide from "~/application/RequestRide"
import GetRide from "~/application/GetRide"
import AccountController from "~/application/AccountController"
import RideController from "~/application/RideController"
import { ExpressServerAdpter } from "~/infra/HttpServer"
import { PgPromiseAdapter } from "~/infra/DatabaseConnection"
import { AccountRepositoryDatabase } from "~/infra/AccountRepository"
import { RideRepositoryDatabase } from "./infra/RideRepository"

const connection = new PgPromiseAdapter()
const httpServer = new ExpressServerAdpter()

const accountRepository = new AccountRepositoryDatabase(connection)
const signup = new Signup(accountRepository)
const getAccount = new GetAccount(accountRepository)

const rideRepository = new RideRepositoryDatabase(connection)
const requestRide = new RequestRide(accountRepository, rideRepository)
const getRide = new GetRide(accountRepository, rideRepository)

new AccountController(httpServer, signup, getAccount)
new RideController(httpServer, requestRide, getRide)

httpServer.listen(3000)
