import Account from "~/domain/entity/Account"

test("Deve criar uma Account para um passageiro", () => {
  const accountInput = {
    name: "Malcon X",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isPassenger: true,
  }
  const account = Account.create(accountInput)
  expect(account).toBeDefined()
  expect(account.getName()).toBe(accountInput.name)
  expect(account.getEmail()).toBe(accountInput.email)
  expect(account.getCpf()).toBe(accountInput.cpf)
  expect(account.isPassenger).toBe(accountInput.isPassenger)
  expect(account.isDriver).toBeFalsy()
})

test("Deve criar uma Account para um motorista", () => {
  const accountInput = {
    name: "Malcon X",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isDriver: true,
    carPlate: "MVD2030",
  }
  const account = Account.create(accountInput)
  expect(account).toBeDefined()
  expect(account.getName()).toBe(accountInput.name)
  expect(account.getEmail()).toBe(accountInput.email)
  expect(account.getCpf()).toBe(accountInput.cpf)
  expect(account.isDriver).toBe(accountInput.isDriver)
  expect(account.getCarPlate()).toBe(accountInput.carPlate)
  expect(account.isPassenger).toBeFalsy()
})

test("Não deve criar uma Account com conflitos de tipo", () => {
  const accountInput = {
    name: "Malcon X",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isPassenger: true,
    isDriver: true,
    carPlate: "MVD2030",
  }
  expect(() => Account.create(accountInput)).toThrow(
    new Error("Account type is not defined"),
  )
})

test("Não deve criar uma Account de motorista sem uma placa válida", () => {
  const accountInput = {
    name: "Malcon X",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isDriver: true,
  }
  expect(() => Account.create(accountInput)).toThrow(
    new Error("Invalid car plate"),
  )
})

test("deve criar uma Account com passwword em plain text", () => {
  const accountInput = {
    name: "Malcon X",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isPassenger: true,
    password: "plaintextpassword",
    passwordType: "plain",
  }
  const account = Account.create(accountInput)
  expect(account).toBeDefined()
  expect(account.verifyPassword(accountInput.password)).toBe(true)
})

test("deve criar uma Account com passwword em md5", () => {
  const accountInput = {
    name: "Malcon X",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isPassenger: true,
    password: "plaintextpassword",
    passwordType: "md5",
  }
  const account = Account.create(accountInput)
  expect(account).toBeDefined()
  expect(account.verifyPassword(accountInput.password)).toBe(true)
})

test("deve criar uma Account com passwword em sha1", () => {
  const accountInput = {
    name: "Malcon X",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isPassenger: true,
    password: "plaintextpassword",
    passwordType: "sha1",
  }
  const account = Account.create(accountInput)
  expect(account).toBeDefined()
  expect(account.verifyPassword(accountInput.password)).toBe(true)
})
