import RequestRide from "~/application/usecase/RequestRide"
import GetRide from "~/application/usecase/GetRide"
import Registry from "~/infra/di/Registry"
import RideController from "~/infra/controller/RideController"
import ExpressServerAdapter from "~/infra/http/ExpressServerAdapter"
import PgPromiseAdapter from "~/infra/database/PgPromiseAdapter"
import RideRepositoryDatabase from "~/infra/repository/RideRepositoryDatabase"
import PositionRepositoryDatabase from "~/infra/repository/PositionRepositoryDatabase"

export const databaseConnection = new PgPromiseAdapter()
export const httpServer = new ExpressServerAdapter()

const positionRepository = new PositionRepositoryDatabase(databaseConnection)
const rideRepository = new RideRepositoryDatabase(databaseConnection)
const requestRide = new RequestRide(accountRepository, rideRepository)
const getRide = new GetRide(
  accountRepository,
  rideRepository,
  positionRepository,
)

Registry.getInstance().provide("httpServer", httpServer)
Registry.getInstance().provide("requestRide", requestRide)
Registry.getInstance().provide("getRide", getRide)
new RideController()
