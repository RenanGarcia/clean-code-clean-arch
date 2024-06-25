import { getAccount, signup } from "~/signup"

test("Deve criar uma conta para o passageiro", async () => {
  const input = {
    name: "Renan Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "264.500.550-06",
    isPassenger: true,
  }
  const output = await signup(input)
  expect(output.accountId).toBeDefined()

  const account = await getAccount(output.accountId)
  expect(account.accountId).toBe(output.accountId)
  expect(account.name).toBe(input.name)
  expect(account.email).toBe(input.email)
  expect(account.cpf).toBe(input.cpf)
  expect(account.isPassenger).toBe(input.isPassenger)
  expect(account.isDriver).toBe(false)
})

test("Deve criar uma conta para o motorista", async () => {
  const input = {
    name: "João Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    carPlate: "MVD2030",
    isDriver: true,
  }
  const output = await signup(input)
  expect(output.accountId).toBeDefined()

  const account = await getAccount(output.accountId)
  expect(account.accountId).toBe(output.accountId)
  expect(account.name).toBe(input.name)
  expect(account.email).toBe(input.email)
  expect(account.cpf).toBe(input.cpf)
  expect(account.carPlate).toBe(input.carPlate)
  expect(account.isPassenger).toBe(false)
  expect(account.isDriver).toBe(input.isDriver)
})

test("Não deve criar uma conta com o nome inválido", async () => {
  const input = {
    name: "",
    email: `test${Math.random()}@test.com.br`,
    cpf: "264.500.550-06",
    isPassenger: true,
  }

  const output = await signup(input)
  expect(output).toBe(-3)
})

test("Não deve criar uma conta com o email inválido", async () => {
  const input = {
    name: "Renan Garcia",
    email: "",
    cpf: "264.500.550-06",
    isPassenger: true,
  }

  const output = await signup(input)
  expect(output).toBe(-2)
})

test("Não deve criar uma conta com a placa inválida", async () => {
  const input = {
    name: "João Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    carPlate: "",
    isDriver: true,
  }

  const output = await signup(input)
  expect(output).toBe(-5)
})
