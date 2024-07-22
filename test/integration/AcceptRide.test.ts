import Signup from "~/application/usecase/Signup"
import GetRide from "~/application/usecase/GetRide"
import RequestRide from "~/application/usecase/RequestRide"
import AcceptRide from "~/application/usecase/AcceptRide"
import DatabaseConnection from "~/infra/database/DatabaseConnection"
import PgPromiseAdapter from "~/infra/database/PgPromiseAdapter"
import AccountRepositoryDatabase from "~/infra/repository/AccountRepositoryDatabase"
import RideRepositoryDatabase from "~/infra/repository/RideRepositoryDatabase"
import PositionRepositoryDatabase from "~/infra/repository/PositionRepositoryDatabase"

let signup: Signup
let requestRide: RequestRide
let acceptRide: AcceptRide
let getRide: GetRide
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
})

afterEach(() => {
  connection.close()
})

test("Deve aceitar uma corrida", async () => {
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

  const requestRideInput = {
    passengerId: userSingupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const { rideId } = await requestRide.execute(requestRideInput)
  await acceptRide.execute({ rideId, driverId })
  const getRideOutput = await getRide.execute(rideId)
  expect(getRideOutput.driverId).toBeDefined()
  expect(getRideOutput.status).toBe("accepted")
})

test("Não deve aceitar uma corrida cujo status seja accepted ou in_progress", async () => {
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

  const requestRideInput = {
    passengerId: userSingupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const { rideId } = await requestRide.execute(requestRideInput)
  await acceptRide.execute({ rideId, driverId })
  await expect(acceptRide.execute({ rideId, driverId })).rejects.toThrow(
    new Error("Already exists a ride for this driver"),
  )
})
