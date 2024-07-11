import axios from "axios"
import crypto from "crypto"

axios.defaults.validateStatus = function () {
  return true
}

const BASE_URL = "http://localhost:3000"

test("Deve criar uma conta para o passageiro", async function () {
  const inputSignup = {
    name: "João Pedro",
    email: `test${Math.random()}@test.com.br`,
    cpf: "264.500.550-06",
    isPassenger: true,
  }

  const responseSignup = await axios.post(`${BASE_URL}/signup`, inputSignup)
  const outputSignup = responseSignup.data
  expect(outputSignup.accountId).toBeDefined()
  const responseGetAccount = await axios.get(
    `${BASE_URL}/accounts/${outputSignup.accountId}`,
  )
  const outputGetAccount = responseGetAccount.data
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

  const responseSignup = await axios.post(`${BASE_URL}/signup`, inputSignup)
  const outputSignup = responseSignup.data
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
  const responseSignup = await axios.post(`${BASE_URL}/signup`, inputSignup)
  const outputSignup = responseSignup.data
  expect(outputSignup.accountId).toBeDefined()

  const inputRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const responseCreateRide = await axios.post(`${BASE_URL}/ride`, inputRide)
  const outputPostRide = responseCreateRide.data
  expect(outputPostRide.rideId).toBeDefined()

  const responseGetRide = await axios.get(
    `${BASE_URL}/rides/${outputPostRide.rideId}`,
  )
  const outputGetRide = responseGetRide.data
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
  const responseCreateRide = await axios.post(`${BASE_URL}/ride`, inputRide)
  const outputPostRide = responseCreateRide.data
  expect(responseCreateRide.status).toBe(422)
  expect(outputPostRide.message).toBe("Account not found")
})
