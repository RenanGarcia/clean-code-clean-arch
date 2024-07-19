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
  const ride = Ride.create(rideInput)
  expect(ride).toBeDefined()
  expect(ride.getFrom().getLat()).toBe(rideInput.fromLat)
  expect(ride.getFrom().getLong()).toBe(rideInput.fromLong)
  expect(ride.getTo().getLat()).toBe(rideInput.toLat)
  expect(ride.getTo().getLong()).toBe(rideInput.toLong)
})

test("Não deve criar corrida com coordenada inválida", () => {
  const input = {
    passengerId: "",
    fromLat: -180,
    fromLong: 180,
    toLat: -180,
    toLong: 180,
  }
  expect(() => Ride.create(input)).toThrow(new Error("Invalid latitude"))
})

test("Deve aceitar uma corrida", () => {
  const driverAccount = Account.create({
    name: "Ganga Zumba",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isDriver: true,
    carPlate: "MVD2030",
  })
  const ride = Ride.create({
    passengerId: "",
    fromLat: -27.58,
    fromLong: -48.54,
    toLat: -27.49,
    toLong: -48.52,
  })
  ride.accept(driverAccount)
  expect(ride.status).toBe("accepted")
  expect(ride.driverId).toBe(driverAccount.accountId)
})

test("Não pode aceitar uma corrida para uma account que não seja motorista", () => {
  const invalidDriver = Account.create({
    name: "Ganga Zumba",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isPassenger: true,
  })
  const ride = Ride.create({
    passengerId: "",
    fromLat: -27.58,
    fromLong: -48.54,
    toLat: -27.49,
    toLong: -48.52,
  })
  expect(() => ride.accept(invalidDriver)).toThrow(
    new Error("This account is not a driver"),
  )
})

test("Não pode aceitar uma corrida cujo status não seja requested", () => {
  const driverAccount = Account.create({
    name: "Ganga Zumba",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isDriver: true,
    carPlate: "MVD2030",
  })
  const otherDriverAccount = Account.create({
    name: "Dandara Zumbi",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isDriver: true,
    carPlate: "MVD2030",
  })
  const ride = Ride.create({
    passengerId: "",
    fromLat: -27.58,
    fromLong: -48.54,
    toLat: -27.49,
    toLong: -48.52,
  })
  expect(ride.status).toBe("requested")

  ride.accept(driverAccount)
  expect(() => ride.accept(otherDriverAccount)).toThrow(
    new Error("Ivalid ride status"),
  )
})

test("Deve iniciar uma corrida", () => {
  const driverAccount = Account.create({
    name: "Ganga Zumba",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isDriver: true,
    carPlate: "MVD2030",
  })
  const ride = Ride.create({
    passengerId: "",
    fromLat: -27.58,
    fromLong: -48.54,
    toLat: -27.49,
    toLong: -48.52,
  })
  ride.accept(driverAccount)
  ride.start()
})

test("Não deve iniciar uma corrida que ainda não foi aceita", () => {
  const ride = Ride.create({
    passengerId: "",
    fromLat: -27.58,
    fromLong: -48.54,
    toLat: -27.49,
    toLong: -48.52,
  })
  expect(() => ride.start()).toThrow(new Error("This ride cannot be started"))
})
