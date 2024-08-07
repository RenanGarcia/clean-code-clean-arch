import Signup from "~/application/usecase/Signup"
import GetRide from "~/application/usecase/GetRide"
import RequestRide from "~/application/usecase/RequestRide"
import DatabaseConnection from "~/infra/database/DatabaseConnection"
import PgPromiseAdapter from "~/infra/database/PgPromiseAdapter"
import AccountRepositoryDatabase from "~/infra/repository/AccountRepositoryDatabase"
import RideRepositoryDatabase from "~/infra/repository/RideRepositoryDatabase"
import PositionRepositoryDatabase from "~/infra/repository/PositionRepositoryDatabase"
import AccountRepositoryFake from "~/infra/repository/AccountRepositoryFake"
import RideRepositoryFake from "~/infra/repository/RideRepositoryFake"
import PositionRepositoryFake from "~/infra/repository/PositionRepositoryFake"

let signup: Signup
let requestRide: RequestRide
let getRide: GetRide
let connection: DatabaseConnection

beforeEach(() => {
  connection = new PgPromiseAdapter()
  const accountRepository = new AccountRepositoryDatabase(connection)
  const rideRepository = new RideRepositoryDatabase(connection)
  const positionRepository = new PositionRepositoryDatabase(connection)

  signup = new Signup(accountRepository)
  requestRide = new RequestRide(accountRepository, rideRepository)
  getRide = new GetRide(accountRepository, rideRepository, positionRepository)
})

afterEach(() => {
  connection.close()
})

test("Deve solicitar uma corrida", async () => {
  const userInput = {
    name: "Renan Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "264.500.550-06",
    isPassenger: true,
  }
  const singupOutput = await signup.execute(userInput)

  const requestRideInput = {
    passengerId: singupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const requestRideOutput = await requestRide.execute(requestRideInput)
  expect(requestRideOutput.rideId).toBeDefined()
  const getRideOutput = await getRide.execute(requestRideOutput.rideId)
  expect(getRideOutput.status).toBe("requested")
  expect(getRideOutput.passengerName).toBe(userInput.name)
  expect(getRideOutput.passengerEmail).toBe(userInput.email)
})

test("Deve solicitar uma corrida (fake repositories)", async () => {
  const userInput = {
    name: "Renan Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "264.500.550-06",
    isPassenger: true,
  }
  const accountRepository = new AccountRepositoryFake()
  const rideRepository = new RideRepositoryFake()
  const positionRepository = new PositionRepositoryFake()
  const signup = new Signup(accountRepository)
  const requestRide = new RequestRide(accountRepository, rideRepository)
  const getRide = new GetRide(
    accountRepository,
    rideRepository,
    positionRepository,
  )

  const singupOutput = await signup.execute(userInput)
  const requestRideInput = {
    passengerId: singupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const requestRideOutput = await requestRide.execute(requestRideInput)
  expect(requestRideOutput.rideId).toBeDefined()
  const getRideOutput = await getRide.execute(requestRideOutput.rideId)
  expect(getRideOutput.status).toBe("requested")
  expect(getRideOutput.passengerName).toBe(userInput.name)
  expect(getRideOutput.passengerEmail).toBe(userInput.email)
})

test("Não deve solicitar uma corrida se não for um passageiro", async () => {
  const userInput = {
    name: "Renan Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "264.500.550-06",
    carPlate: "MVD2030",
    isDriver: true,
  }
  const singupOutput = await signup.execute(userInput)

  const requestRideInput = {
    passengerId: singupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  await expect(requestRide.execute(requestRideInput)).rejects.toThrow(
    new Error("Account is not from a passenger"),
  )
})

test("Não deve solicitar uma corrida caso já exista outra em andamento", async () => {
  const userInput = {
    name: "Renan Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "264.500.550-06",
    isPassenger: true,
  }
  const singupOutput = await signup.execute(userInput)

  const requestRideInput = {
    passengerId: singupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  await requestRide.execute(requestRideInput)
  await expect(requestRide.execute(requestRideInput)).rejects.toThrow(
    new Error("Already exists a ride for this passenger"),
  )
})
