import request from "supertest"
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
