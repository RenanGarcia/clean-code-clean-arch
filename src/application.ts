import crypto from "crypto"
import { validateCpf } from "./validateCpf"
import { getAccountByEmail, getAccountById, saveAccount } from "./resource"

export async function signup(input: any): Promise<any> {
  const account = {
    account_id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    cpf: input.cpf,
    car_plate: input.carPlate,
    is_passenger: !!input.isPassenger,
    is_driver: !!input.isDriver,
  }
  const existingAccount = await getAccountByEmail(account.email)
  if (existingAccount) throw new Error("Account already exists")
  if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name")
  if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email")
  if (!validateCpf(input.cpf)) throw new Error("Invalid CPF")
  if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/))
    throw new Error("Invalid car plate")
  await saveAccount(account)
  return { accountId: account.account_id }
}

export async function getAccount(accountId: any): Promise<any> {
  const account = await getAccountById(accountId)
  return {
    accountId: account.account_id,
    name: account.name,
    email: account.email,
    cpf: account.cpf,
    isPassenger: account.is_passenger,
    isDriver: account.is_driver,
    carPlate: account.car_plate,
  }
}
