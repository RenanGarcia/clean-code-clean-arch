import Signup from "~/application/usecase/Signup"
import GetAccount from "~/application/usecase/GetAccount"
import RequestRide from "~/application/usecase/RequestRide"
import GetRide from "~/application/usecase/GetRide"
import AccountController from "~/infra/controller/AccountController"
import RideController from "~/infra/controller/RideController"
import ExpressServerAdapter from "~/infra/http/ExpressServerAdapter"
import PgPromiseAdapter from "~/infra/database/PgPromiseAdapter"
import AccountRepositoryDatabase from "~/infra/repository/AccountRepositoryDatabase"
import RideRepositoryDatabase from "~/infra/repository/RideRepositoryDatabase"
import PositionRepositoryDatabase from "~/infra/repository/PositionRepositoryDatabase"

export const databaseConnection = new PgPromiseAdapter()
export const httpServer = new ExpressServerAdapter()

const accountRepository = new AccountRepositoryDatabase(databaseConnection)
const signup = new Signup(accountRepository)
const getAccount = new GetAccount(accountRepository)

const positionRepository = new PositionRepositoryDatabase(databaseConnection)
const rideRepository = new RideRepositoryDatabase(databaseConnection)
const requestRide = new RequestRide(accountRepository, rideRepository)
const getRide = new GetRide(
  accountRepository,
  rideRepository,
  positionRepository,
)

new AccountController(httpServer, signup, getAccount)
new RideController(httpServer, requestRide, getRide)
