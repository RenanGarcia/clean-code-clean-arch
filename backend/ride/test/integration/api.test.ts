import request from "supertest"
import crypto from "crypto"
import { httpServer, databaseConnection } from "~/server"

const agent = request(httpServer.server)

afterAll(() => {
  databaseConnection.close()
})

test("Deve criar uma conta para o passageiro", async function () {
  const inputSignup = {
    name: "João Pedro",
    email: `test${Math.random()}@test.com.br`,
    cpf: "264.500.550-06",
    isPassenger: true,
  }

  const responseSignup = await agent.post(`/signup`).send(inputSignup)
  const outputSignup = responseSignup.body
  expect(outputSignup.accountId).toBeDefined()
  const responseGetAccount = await agent
    .get(`/accounts/${outputSignup.accountId}`)
    .send(inputSignup)
  const outputGetAccount = responseGetAccount.body
  expect(outputGetAccount.accountId).toBe(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf)
  expect(outputGetAccount.isPassenger).toBe(inputSignup.isPassenger)
})

test("Não deve criar uma conta com cpf inválido", async function () {
  const inputSignup = {
    name: "João Pedro",
    email: `test${Math.random()}@test.com.br`,
    cpf: "26450111006123",
    isPassenger: true,
  }

  const responseSignup = await agent.post(`/signup`).send(inputSignup)
  const outputSignup = responseSignup.body
  expect(responseSignup.status).toBe(422)
  expect(outputSignup.message).toBe("Invalid CPF")
})

test("Deve solicitar uma corrida", async function () {
  const inputSignup = {
    name: "João Pedro",
    email: `test${Math.random()}@test.com.br`,
    cpf: "264.500.550-06",
    isPassenger: true,
  }
  const responseSignup = await agent.post(`/signup`).send(inputSignup)
  const outputSignup = responseSignup.body
  expect(outputSignup.accountId).toBeDefined()

  const inputRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const responseCreateRide = await agent.post(`/ride`).send(inputRide)
  const outputPostRide = responseCreateRide.body
  expect(outputPostRide.rideId).toBeDefined()

  const responseGetRide = await agent.get(`/rides/${outputPostRide.rideId}`)
  const outputGetRide = responseGetRide.body
  expect(outputGetRide.status).toBe("requested")
  expect(outputGetRide.passengerName).toBe(inputSignup.name)
  expect(outputGetRide.passengerEmail).toBe(inputSignup.email)
})

test("Não deve solicitar uma corrida sem um Passenger válido", async function () {
  const inputRide = {
    passengerId: crypto.randomUUID(),
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const responseCreateRide = await agent.post(`/ride`).send(inputRide)
  const outputPostRide = responseCreateRide.body
  expect(responseCreateRide.status).toBe(422)
  expect(outputPostRide.message).toBe("Account not found")
})
