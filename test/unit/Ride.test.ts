import Account from "~/domain/Account"
import Ride from "~/domain/Ride"

test("Deve criar corrida", () => {
  const rideInput = {
    passengerId: "",
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const ride = Ride.create(
    rideInput.passengerId,
    rideInput.fromLat,
    rideInput.fromLong,
    rideInput.toLat,
    rideInput.toLong,
  )
  expect(ride).toBeDefined()
  expect(ride.getFrom().getLat()).toBe(rideInput.fromLat)
  expect(ride.getFrom().getLong()).toBe(rideInput.fromLong)
  expect(ride.getTo().getLat()).toBe(rideInput.toLat)
  expect(ride.getTo().getLong()).toBe(rideInput.toLong)
})

test("Não deve criar corrida com coordenada inválida", () => {
  expect(() => Ride.create("", -180, 180, -180, 180)).toThrow(
    new Error("Invalid latitude"),
  )
})

test("Deve aceitar uma corrida", () => {
  const driverAccount = Account.create(
    "Ganga Zumba",
    `test${Math.random()}@test.com.br`,
    "385.672.430-33",
    false,
    true,
    "MVD2030",
  )
  const ride = Ride.create("", -27.58, -48.54, -27.49, -48.52)
  ride.accept(driverAccount)
  expect(ride.status).toBe("accepted")
  expect(ride.driverId).toBe(driverAccount.accountId)
})

test("Não pode aceitar uma corrida para uma account que não seja motorista", () => {
  const invalidDriver = Account.create(
    "Ganga Zumba",
    `test${Math.random()}@test.com.br`,
    "385.672.430-33",
    true,
  )
  const ride = Ride.create("", -27.58, -48.54, -27.49, -48.52)
  expect(() => ride.accept(invalidDriver)).toThrow(
    new Error("This account is not a driver"),
  )
})

test("Não pode aceitar uma corrida cujo status não seja requested", () => {
  const driverAccount = Account.create(
    "Ganga Zumba",
    `test${Math.random()}@test.com.br`,
    "385.672.430-33",
    false,
    true,
    "MVD2030",
  )
  const otherDriverAccount = Account.create(
    "Dandara Zumbi",
    `test${Math.random()}@test.com.br`,
    "385.672.430-33",
    false,
    true,
    "MVD2030",
  )
  const ride = Ride.create("", -27.58, -48.54, -27.49, -48.52)
  expect(ride.status).toBe("requested")

  ride.accept(driverAccount)
  expect(() => ride.accept(otherDriverAccount)).toThrow(
    new Error("Ivalid ride status"),
  )
})
