import Account from "~/domain/entity/Account"
import Ride from "~/domain/entity/Ride"
import Position from "~/domain/entity/Position"

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
  expect(() => ride.start()).toThrow(new Error("Ivalid ride status"))
})

test("Deve calcular a posição de uma corrida no horário noturno", () => {
  const initialPosition = {
    lat: -27.584905257808835,
    long: -48.545022195325124,
    date: new Date("2023-03-01T23:00:00"),
  }
  const finalPosition = {
    lat: -27.496887588317275,
    long: -48.522234807851476,
    date: new Date("2023-03-01T23:10:00"),
  }
  const ride = Ride.create({
    passengerId: "",
    fromLat: initialPosition.lat,
    fromLong: initialPosition.long,
    toLat: finalPosition.lat,
    toLong: finalPosition.long,
  })
  const driverAccount = Account.create({
    name: "Ganga Zumba",
    email: `test${Math.random()}@test.com.br`,
    cpf: "385.672.430-33",
    isDriver: true,
    carPlate: "MVD2030",
  })
  ride.accept(driverAccount)
  ride.start()
  const lastPosition = Position.create({
    rideId: ride.rideId,
    ...initialPosition,
  })
  const currentPosition = Position.create({
    rideId: ride.rideId,
    ...finalPosition,
  })
  ride.updatePosition(lastPosition, currentPosition)
  expect(ride.distance).toBe(10)
  expect(ride.fare).toBe(39)
})
