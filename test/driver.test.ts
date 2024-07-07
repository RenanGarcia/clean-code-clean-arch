import axios from "axios"

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
