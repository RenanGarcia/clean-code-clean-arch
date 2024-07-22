import Signup from "~/application/usecase/Signup"
import GetRide from "~/application/usecase/GetRide"
import RequestRide from "~/application/usecase/RequestRide"
import AcceptRide from "~/application/usecase/AcceptRide"
import StartRide from "~/application/usecase/StartRide"
import UpdatePosition from "~/application/usecase/UpdatePosition"
import DatabaseConnection from "~/infra/database/DatabaseConnection"
import PgPromiseAdapter from "~/infra/database/PgPromiseAdapter"
import AccountRepositoryDatabase from "~/infra/repository/AccountRepositoryDatabase"
import RideRepositoryDatabase from "~/infra/repository/RideRepositoryDatabase"
import PositionRepositoryDatabase from "~/infra/repository/PositionRepositoryDatabase"

let signup: Signup
let requestRide: RequestRide
let acceptRide: AcceptRide
let getRide: GetRide
let startRide: StartRide
let updatePosition: UpdatePosition
let connection: DatabaseConnection

beforeEach(() => {
  connection = new PgPromiseAdapter()
  const accountRepository = new AccountRepositoryDatabase(connection)
  const rideRepository = new RideRepositoryDatabase(connection)
  const positionRepository = new PositionRepositoryDatabase(connection)

  signup = new Signup(accountRepository)
  requestRide = new RequestRide(accountRepository, rideRepository)
  acceptRide = new AcceptRide(accountRepository, rideRepository)
  getRide = new GetRide(accountRepository, rideRepository, positionRepository)
  startRide = new StartRide(rideRepository)
  updatePosition = new UpdatePosition(rideRepository, positionRepository)
})

afterEach(() => {
  connection.close()
})

test("Deve atualizar a posição de uma corrida", async () => {
  const userInput = {
    name: "Renan Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "264.500.550-06",
    isPassenger: true,
  }
  const driverInput = {
    name: "Mike Tyson",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    carPlate: "MVD2030",
    isDriver: true,
  }
  const userSingupOutput = await signup.execute(userInput)
  const { accountId: driverId } = await signup.execute(driverInput)

  const initialPosition = {
    lat: -27.584905257808835,
    long: -48.545022195325124,
  }
  const finalPosition = {
    lat: -27.496887588317275,
    long: -48.522234807851476,
  }
  const requestRideInput = {
    passengerId: userSingupOutput.accountId,
    fromLat: initialPosition.lat,
    fromLong: initialPosition.long,
    toLat: finalPosition.lat,
    toLong: finalPosition.long,
  }
  const { rideId } = await requestRide.execute(requestRideInput)
  await acceptRide.execute({ rideId, driverId })
  await startRide.execute(rideId)
  await updatePosition.execute({ rideId, ...initialPosition })
  await updatePosition.execute({ rideId, ...finalPosition })
  const getRideOutput = await getRide.execute(rideId)
  expect(getRideOutput.currentLat).toBe(finalPosition.lat)
  expect(getRideOutput.currentLong).toBe(finalPosition.long)
})
