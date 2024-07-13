import Sinon from "sinon"
import Account from "~/domain/Account"
import Signup from "~/application/usecase/Signup"
import GetAccount from "~/application/usecase/GetAccount"
import MailerGatewayFake from "~/infra/gateway/MailerGatewayFake"
import AccountRepositoryFake from "~/infra/repository/AccountRepositoryFake"
import DatabaseConnection from "~/infra/database/DatabaseConnection"
import PgPromiseAdapter from "~/infra/database/PgPromiseAdapter"
import AccountRepositoryDatabase from "~/infra/repository/AccountRepositoryDatabase"

let signup: Signup
let getAccount: GetAccount
let connection: DatabaseConnection

beforeEach(() => {
  connection = new PgPromiseAdapter()
  const accountRepository = new AccountRepositoryDatabase(connection)
  signup = new Signup(accountRepository)
  getAccount = new GetAccount(accountRepository)
})

afterEach(() => {
  connection.close()
})

test("Deve criar uma conta", async () => {
  const input = {
    name: "Renan Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "264.500.550-06",
    isPassenger: true,
  }
  const output = await signup.execute(input)
  expect(output.accountId).toBeDefined()

  const account = await getAccount.execute(output.accountId)
  expect(account.accountId).toBe(output.accountId)
  expect(account.name).toBe(input.name)
  expect(account.email).toBe(input.email)
  expect(account.cpf).toBe(input.cpf)
  expect(account.isPassenger).toBe(input.isPassenger)
})

/**
 * O Fake substitui a implementação da classe utilizando a inversão de dependências
 */
test("Deve criar uma conta (fake accountRepository)", async () => {
  const input = {
    name: "João Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    carPlate: "MVD2030",
    isDriver: true,
  }
  const accountRepository = new AccountRepositoryFake()
  const signup = new Signup(accountRepository)
  const getAccount = new GetAccount(accountRepository)

  const output = await signup.execute(input)
  expect(output.accountId).toBeDefined()

  const account = await getAccount.execute(output.accountId)
  expect(account.accountId).toBe(output.accountId)
  expect(account.name).toBe(input.name)
  expect(account.email).toBe(input.email)
  expect(account.cpf).toBe(input.cpf)
  expect(account.carPlate).toBe(input.carPlate)
  expect(account.isDriver).toBe(input.isDriver)
})

/**
 * O Stub sobreescreve a implementação do método e fornece um retorno
 */
test("Deve criar uma conta para o motorista (stub accountRepository)", async () => {
  const input = {
    name: "João Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    carPlate: "MVD2030",
    isPassenger: false,
    isDriver: true,
  }
  const expectedAccount = Account.create(
    input.name,
    input.email,
    input.cpf,
    input.isPassenger,
    input.isDriver,
    input.carPlate,
  )

  const stubByEmail = Sinon.stub(
    AccountRepositoryDatabase.prototype,
    "getAccountByEmail",
  ).resolves(undefined)
  const stubSaveAccount = Sinon.stub(
    AccountRepositoryDatabase.prototype,
    "saveAccount",
  ).resolves()
  const stubGetAccountById = Sinon.stub(
    AccountRepositoryDatabase.prototype,
    "getAccountById",
  ).resolves(expectedAccount)
  const stubSendMail = Sinon.stub(MailerGatewayFake.prototype, "send")

  const output = await signup.execute(input)
  expect(output.accountId).toBeDefined()
  const account = await getAccount.execute(output.accountId)
  expect(account.name).toBe(input.name)
  expect(account.email).toBe(input.email)
  expect(account.cpf).toBe(input.cpf)
  expect(account.carPlate).toBe(input.carPlate)
  expect(account.isDriver).toBe(input.isDriver)

  stubByEmail.restore()
  stubSaveAccount.restore()
  stubGetAccountById.restore()
  stubSendMail.restore()
})

/**
 * O Spy monitora o método e fornece uma maneira de testar a sua invocação
 * sem sobreescrevê-lo
 */
test("Deve enviar email ao criar a conta (spy MailerGateway)", async () => {
  const input = {
    name: "João Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    carPlate: "MVD2030",
    isDriver: true,
  }

  const spySendMailer = Sinon.spy(MailerGatewayFake.prototype, "send")
  await signup.execute(input)

  expect(spySendMailer.calledOnce).toBe(true)
  expect(spySendMailer.calledWith(input.email, "Bem-vindo!", "")).toBe(true)
  spySendMailer.restore()
})

/**
 * O Mock monitora o método e fornece uma maneira de testar a sua invocação
 * com a possibilidade de sobreescrevê-lo
 */
test("Deve enviar email ao criar a conta (mock MailerGateway)", async () => {
  const input = {
    name: "João Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    carPlate: "MVD2030",
    isDriver: true,
  }

  const mockSendMail = Sinon.mock(MailerGatewayFake.prototype)
  mockSendMail
    .expects("send")
    .once()
    .withArgs(input.email, "Bem-vindo!", "")
    .callsFake(() => {
      // console.log("Sobreescrevendo o método com uma função")
    })

  await signup.execute(input)
  mockSendMail.verify()
  mockSendMail.restore()
})

test("Não deve criar uma conta duplicada", async () => {
  const input = {
    name: "Renan Garcia",
    email: `test${Math.random()}@test.com.br`,
    cpf: "264.500.550-06",
    isPassenger: true,
  }
  await signup.execute(input)
  await expect(signup.execute(input)).rejects.toThrow(
    new Error("Account already exists"),
  )
})

test("Não deve criar uma conta com o nome inválido", async () => {
  const input = {
    name: "",
    email: `test${Math.random()}@test.com.br`,
    cpf: "264.500.550-06",
    isPassenger: true,
  }

  await expect(signup.execute(input)).rejects.toThrow(new Error("Invalid name"))
})
