import Account from "~/domain/Account"

test("Deve criar uma Account para um passageiro", () => {
  const accountInput = {
    name: "Malcon X",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isPassenger: true,
    isDriver: undefined,
    carPlate: "",
  }
  const account = Account.create(
    accountInput.name,
    accountInput.email,
    accountInput.cpf,
    accountInput.isPassenger,
    accountInput.isDriver,
    accountInput.carPlate,
  )
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
    isPassenger: undefined,
    isDriver: true,
    carPlate: "MVD2030",
  }
  const account = Account.create(
    accountInput.name,
    accountInput.email,
    accountInput.cpf,
    accountInput.isPassenger,
    accountInput.isDriver,
    accountInput.carPlate,
  )
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
  expect(() =>
    Account.create(
      accountInput.name,
      accountInput.email,
      accountInput.cpf,
      accountInput.isPassenger,
      accountInput.isDriver,
      accountInput.carPlate,
    ),
  ).toThrow(new Error("Account type is not defined"))
})

test("Não deve criar uma Account de motorista sem uma placa válida", () => {
  const accountInput = {
    name: "Malcon X",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isPassenger: undefined,
    isDriver: true,
    carPlate: "",
  }
  expect(() =>
    Account.create(
      accountInput.name,
      accountInput.email,
      accountInput.cpf,
      accountInput.isPassenger,
      accountInput.isDriver,
      accountInput.carPlate,
    ),
  ).toThrow(new Error("Invalid car plate"))
})