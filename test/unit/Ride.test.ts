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
